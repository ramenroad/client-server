import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RamenyaService } from './ramenya.service';
import { getRamenyasResDTO } from './dto/res/getRamenyas.res.dto';
import { getRamenyaByIdResDTO } from './dto/res/getRamenyaById.res.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { getRamenyaGroupsResDTO } from './dto/res/getRamenyaGroups.res.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { getNearByRamenyaResDTO } from './dto/res/getNearByRamenya.res.dto';

@Controller({ path: 'ramenya', version: '1' })
export class RamenyaController {
  constructor(private readonly ramenyaService: RamenyaService) {}

  @Public()
  @ApiOperation({
    summary: '주변 라멘 매장 조회',
    description:
      'radius 값에 따라 주변 라멘야 리스트를 반환합니다. 라멘매장 리스트는 평점 순으로 정렬됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '주변 라멘매장 조회 성공',
    type: getNearByRamenyaResDTO,
  })
  @ApiQuery({
    name: 'latitude',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'longitude',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'radius',
    required: true,
    type: Number,
    description: '반경 거리(단위: 미터)',
  })
  @Get('/nearby')
  getNearByRamenya(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number,
  ): Promise<getNearByRamenyaResDTO> {
    return this.ramenyaService.getNearByRamenya(latitude, longitude, radius);
  }

  @Public()
  @ApiOperation({
    summary: '라멘야 전체 정보 조회',
    description:
      '저장된 모든 라멘야 리스트를 조회합니다. 지역별/장르별 기준을 쿼리로 선택할 수 있습니다',
  })
  @ApiQuery({
    name: 'region',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    type: String,
    description: '라멘 장르(ex. 돈코츠, 시오)',
    examples: {
      active: {
        summary: '검색하고자 하는 장르가 1가지',
        description: '검색하고자 하는 장르가 1가지일 경우 단어 하나',
        value: '시오',
      },
      inactive: {
        summary: '검색하고자 하는 장르가 2가지 이상',
        description: '장르가 2가지 이상일 경우 쉼표(,)로 구분',
        value: '시오,쇼유',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '라멘야 전체 정보 조회 성공',
    type: getRamenyasResDTO,
    isArray: true,
  })
  @Get('/all')
  getRamenyas(
    @Query('region') region?: string,
    @Query('genre') genre?: string,
  ): Promise<getRamenyasResDTO[]> {
    return this.ramenyaService.getRamenyas(region, genre);
  }

  @Public()
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

  @Public()
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

  @Public()
  @ApiOperation({
    summary: '라멘야 그룹 별 보기 조회',
    description: '라멘야 그룹의 isShown 필드가 true인 documents만 조회됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '라멘야 그룹 별 보기 조회 성공',
    type: getRamenyaGroupsResDTO,
    isArray: true,
  })
  @Get('/group/all')
  getRamenyaGroups(): Promise<getRamenyaGroupsResDTO[]> {
    return this.ramenyaService.getRamenyaGroups();
  }
}
