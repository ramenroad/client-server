import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { RamenCalendarService } from './ramen-calendar.service';
import { createRamenCalendarReqDTO } from './dto/req/createRamenCalendar.req.dto';
import { updateRamenCalendarReqDTO } from './dto/req/updateRamenCalendar.req.dto';
import { RamenCalendarEntryResDTO } from './dto/res/ramenCalendarEntry.res.dto';

@Controller('ramen-calendar')
export class RamenCalendarController {
  constructor(private readonly ramenCalendarService: RamenCalendarService) {}

  @ApiOperation({ summary: '라멘 캘린더 월별 기록 조회' })
  @ApiResponse({
    status: 200,
    description: '월별 기록 조회 성공',
    type: RamenCalendarEntryResDTO,
    isArray: true,
  })
  @ApiBearerAuth('accessToken')
  @Get()
  getEntries(
    @User() user: JwtPayload,
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<RamenCalendarEntryResDTO[]> {
    return this.ramenCalendarService.getEntries(user, year, month);
  }

  @ApiOperation({ summary: '라멘 캘린더 기록 추가' })
  @ApiResponse({ status: 201, description: '기록 추가 성공', type: RamenCalendarEntryResDTO })
  @ApiBearerAuth('accessToken')
  @Post()
  createEntry(
    @User() user: JwtPayload,
    @Body() dto: createRamenCalendarReqDTO,
  ): Promise<RamenCalendarEntryResDTO> {
    return this.ramenCalendarService.createEntry(user, dto);
  }

  @ApiOperation({ summary: '라멘 캘린더 기록 수정' })
  @ApiResponse({ status: 200, description: '기록 수정 성공', type: RamenCalendarEntryResDTO })
  @ApiResponse({ status: 403, description: '본인 기록이 아닌 경우' })
  @ApiResponse({ status: 404, description: '해당 id의 기록을 찾을 수 없는 경우' })
  @ApiBearerAuth('accessToken')
  @Patch(':id')
  updateEntry(
    @User() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: updateRamenCalendarReqDTO,
  ): Promise<RamenCalendarEntryResDTO> {
    return this.ramenCalendarService.updateEntry(user, id, dto);
  }

  @ApiOperation({ summary: '라멘 캘린더 기록 삭제' })
  @ApiResponse({ status: 200, description: '기록 삭제 성공' })
  @ApiResponse({ status: 403, description: '본인 기록이 아닌 경우' })
  @ApiResponse({ status: 404, description: '해당 id의 기록을 찾을 수 없는 경우' })
  @ApiBearerAuth('accessToken')
  @Delete(':id')
  deleteEntry(@User() user: JwtPayload, @Param('id') id: string): Promise<void> {
    return this.ramenCalendarService.deleteEntry(user, id);
  }
}
