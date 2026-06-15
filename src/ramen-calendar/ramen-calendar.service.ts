import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ramenCalendar } from 'schema/ramen-calendar.schema';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { createRamenCalendarReqDTO } from './dto/req/createRamenCalendar.req.dto';
import { updateRamenCalendarReqDTO } from './dto/req/updateRamenCalendar.req.dto';
import { RamenCalendarEntryResDTO } from './dto/res/ramenCalendarEntry.res.dto';

@Injectable()
export class RamenCalendarService {
  constructor(
    @InjectModel('ramenCalendar')
    private readonly ramenCalendarModel: Model<ramenCalendar>,
  ) {}

  // 유저의 특정 년/월 기록 조회. visitDate가 'YYYY-MM-DD' 문자열이라 사전순=날짜순으로 범위 비교 가능.
  async getEntries(user: JwtPayload, year: number, month: number): Promise<RamenCalendarEntryResDTO[]> {
    if (!year || !month) {
      throw new BadRequestException('year, month는 필수입니다.');
    }

    const mm = String(month).padStart(2, '0');
    const start = `${year}-${mm}-01`;
    const end = `${year}-${mm}-31`;

    const entries = await this.ramenCalendarModel
      .find({ userId: user.id, visitDate: { $gte: start, $lte: end } })
      .select('_id visitDate ramenyaName ramenyaId menus price createdAt updatedAt')
      .sort({ visitDate: -1, createdAt: -1 })
      .lean();

    return entries as unknown as RamenCalendarEntryResDTO[];
  }

  async createEntry(user: JwtPayload, dto: createRamenCalendarReqDTO): Promise<RamenCalendarEntryResDTO> {
    const entry = await this.ramenCalendarModel.create({
      userId: user.id,
      visitDate: dto.visitDate,
      ramenyaName: dto.ramenyaName,
      ramenyaId: dto.ramenyaId ?? null,
      menus: dto.menus ?? [],
      price: dto.price ?? null,
    });

    return entry as unknown as RamenCalendarEntryResDTO;
  }

  async updateEntry(
    user: JwtPayload,
    id: string,
    dto: updateRamenCalendarReqDTO,
  ): Promise<RamenCalendarEntryResDTO> {
    const entry = await this.ramenCalendarModel.findById(id);

    if (!entry) {
      throw new NotFoundException('캘린더 기록 조회 실패');
    }

    if (String(entry.userId) != user.id) {
      throw new ForbiddenException('캘린더 기록 수정 권한 없음');
    }

    entry.set({
      ...(dto.visitDate !== undefined ? { visitDate: dto.visitDate } : {}),
      ...(dto.ramenyaName !== undefined ? { ramenyaName: dto.ramenyaName } : {}),
      ...(dto.ramenyaId !== undefined ? { ramenyaId: dto.ramenyaId ?? null } : {}),
      ...(dto.menus !== undefined ? { menus: dto.menus } : {}),
      ...(dto.price !== undefined ? { price: dto.price ?? null } : {}),
    });

    const updatedEntry = await entry.save();

    return updatedEntry as unknown as RamenCalendarEntryResDTO;
  }

  async deleteEntry(user: JwtPayload, id: string): Promise<void> {
    const entry = await this.ramenCalendarModel.findById(id);

    if (!entry) {
      throw new NotFoundException('캘린더 기록 조회 실패');
    }

    if (String(entry.userId) != user.id) {
      throw new ForbiddenException('캘린더 기록 삭제 권한 없음');
    }

    await this.ramenCalendarModel.findByIdAndDelete(id);
  }
}
