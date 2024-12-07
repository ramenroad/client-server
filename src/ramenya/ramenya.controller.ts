import { Controller, Get, Param, Query } from '@nestjs/common';
import { RamenyaService } from './ramenya.service';
import { getRamenyasResDTO } from './dto/res/getRamenyas.res.dto';
import { getRamenyaByIdResDTO } from './dto/res/getRamenyaById.res.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller({ path: 'ramenya', version: '1' })
export class RamenyaController {
  constructor(private readonly ramenyaService: RamenyaService) {}

  @ApiOperation({
    summary: '라멘야 전체 정보 조회',
    description: '저장된 모든 라멘야 리스트를 조회합니다.',
  })
  @ApiQuery({
    name: 'region',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '라멘야 전체 정보 조회 성공',
    type: getRamenyasResDTO,
    isArray: true,
  })
  @Get('/all')
  getRamenyas(@Query('region') region?: string): Promise<getRamenyasResDTO[]> {
    return this.ramenyaService.getRamenyas(region);
  }

  @ApiOperation({
    summary: '라멘야 리전 정보 조회',
    description: '저장된 라멘야의 모든 리전을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '라멘야 리전 조회 성공',
    type: String,
    isArray: true,
  })
  @Get('/regions')
  getRamenyasRegion(): Promise<Array<string>> {
    return this.ramenyaService.getRamenyasRegion();
  }

  @ApiOperation({
    summary: '라멘야 상세 정보 조회',
    description: '라멘야 id로 상세 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '라멘야 상세 정보 조회 성공',
    type: getRamenyaByIdResDTO,
  })
  @Get('/:id')
  getRamenyaById(@Param('id') id: string): Promise<getRamenyaByIdResDTO> {
    return this.ramenyaService.getRamenyaById(id);
  }
}
