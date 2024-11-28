import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ramenya } from 'schema/ramenya.schema';
import { createRamenyaReqDTO } from './dto/req/createRamenya.req.dto';
import { getRamenyasResDTO } from './dto/res/getRamenyas.res.dto';
import { getRamenyaByIdResDTO } from './dto/res/getRamenyaById.res.dto';
import axios from 'axios';

@Injectable()
export class RamenyaService {
  constructor(
    @InjectModel('ramenya') private readonly ramenyaModel: Model<ramenya>,
  ) {}

  async getRamenyas(region?: string): Promise<getRamenyasResDTO[]> {
    const query = region ? { region: region } : {};
    const ramenyas = await this.ramenyaModel.find(query);

    return ramenyas;
  }

  async getRamenyaById(id: string): Promise<getRamenyaByIdResDTO> {
    const ramenya = await this.ramenyaModel.findById(id);

    if (!ramenya) {
      throw new HttpException('Ramenya not found', HttpStatus.NOT_FOUND);
    }

    return ramenya;
  }
}
