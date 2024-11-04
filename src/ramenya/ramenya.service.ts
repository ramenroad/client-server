import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ramenya } from 'schema/ramenya.schema';
import { createRamenyaReqDTO } from './dto/req/createRamenya.req.dto';

@Injectable()
export class RamenyaService {
  constructor(
    @InjectModel('ramenya') private readonly ramenyaModel: Model<ramenya>,
  ) {}

  async getRamenyas() {}

  async createRamenya(dto: createRamenyaReqDTO): Promise<void> {
    const recommendedMenu = dto.recommendedMenu.split(',').map((item) => {
      return { name: item };
    });

    try {
      await this.ramenyaModel.create({
        name: dto.name,
        genre: dto.genre,
        region: dto.region,
        address: dto.address,
        contactNumber: dto.contactNumber,
        instagramProfile: dto.instagramProfile,
        businessHours: [
          {
            day: 'mon',
            operatingTime: dto.monOperatingTime,
            breakTime: dto.monBreakTime,
            isOpen: dto.monIsOpen,
          },
          {
            day: 'tue',
            operatingTime: dto.tueOperatingTime,
            breakTime: dto.tueBreakTime,
            isOpen: dto.tueIsOpen,
          },
          {
            day: 'wed',
            operatingTime: dto.wedOperatingTime,
            breakTime: dto.wedBreakTime,
            isOpen: dto.wedIsOpen,
          },
          {
            day: 'thu',
            operatingTime: dto.thuOperatingTime,
            breakTime: dto.thuBreakTime,
            isOpen: dto.thuIsOpen,
          },
          {
            day: 'fri',
            operatingTime: dto.friOperatingTime,
            breakTime: dto.friBreakTime,
            isOpen: dto.friIsOpen,
          },
          {
            day: 'sat',
            operatingTime: dto.satOperatingTime,
            breakTime: dto.satBreakTime,
            isOpen: dto.satIsOpen,
          },
          {
            day: 'sun',
            operatingTime: dto.sunOperatingTime,
            breakTime: dto.sunBreakTime,
            isOpen: dto.sunIsOpen,
          },
        ],
        recommendedMenu: recommendedMenu,
        isSelfmadeNoodle: dto.isSelfmadeNoodle,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to create ramenya',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return;
  }
}
