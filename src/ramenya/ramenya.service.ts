import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getRamenyasResDTO } from './dto/res/getRamenyas.res.dto';
import { getRamenyaByIdResDTO } from './dto/res/getRamenyaById.res.dto';
import { ramenya } from 'schema/ramenya.schema';

@Injectable()
export class RamenyaService {
  constructor(
    @InjectModel('ramenya') private readonly ramenyaModel: Model<ramenya>,
  ) {}

  async getRamenyas(region?: string): Promise<getRamenyasResDTO[]> {
    const query = region ? { region: region } : {};
    const ramenyas = await this.ramenyaModel
      .find(query)
      .select('name genre region address businessHours');

    console.log(ramenyas);
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
