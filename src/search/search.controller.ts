import { Body, Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { OptionalAtGuard } from 'src/common/guards/optional-at.guard';
import SearchParams from './interfaces/searchParam.interface';
import { SearchResDto } from './dto/res/search.res.dto';
import { GetRecentSearchKeywordsResDto } from './dto/res/getRecentSearchKeywords.res.dto';
import { DeleteRecentSearchKeywordsReqDTO } from './dto/req/deleteRecentSearchKeywords.req.dto';
import { GetAutocompleteResDto } from './dto/res/getAutocomplete.res.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({
    summary: '검색',
    description:
      '토큰은 비필수값입니다. 토큰을 함께 보낸 경우에만 검색어 저장이 됩니다.',
  })
  @ApiBearerAuth('accessToken')
  @UseGuards(OptionalAtGuard)
  @Public()
  @ApiQuery({
    name: 'query',
    description: '검색어',
    required: true,
  })
  @ApiQuery({
    name: 'latitude',
    description: '위도',
    required: false,
  })
  @ApiQuery({
    name: 'longitude',
    description: '경도',
    required: false,
  })
  @ApiQuery({
    name: 'radius',
    description: '검색할 반경(미터)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '검색 성공',
    type: SearchResDto,
    isArray: true,
  })
  @Get('')
  search(
    @Query('query') query: string,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: number,
    @User() user?: JwtPayload,
  ) {
    const userId = user ? user.id : null;
    const searchParams: SearchParams = {
      query,
      userId,
      latitude,
      longitude,
      radius,
    };
    return this.searchService.search(searchParams);
  }

  @ApiOperation({
    summary: '최근 검색어 조회',
    description:
      '최근 검색어를 조회합니다. 최근 순으로 각각 최대 10개까지 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '최근 검색어 조회 성공',
    type: GetRecentSearchKeywordsResDto,
  })
  @ApiBearerAuth('accessToken')
  @Get('recent')
  getRecentSearchKeywords(@User() user: JwtPayload): Promise<GetRecentSearchKeywordsResDto> {
    return this.searchService.getRecentSearchKeywords(user);
  }

  @ApiOperation({
    summary: '최근 검색 키워드 삭제',
    description: '최근 검색 키워드를 삭제합니다. (최근 검색어/검색한 매장 모두 삭제 가능)',
  })
  @ApiResponse({
    status: 200,
    description: '최근 검색 키워드 삭제 성공',
  })
  @ApiBearerAuth('accessToken')
  @Delete('recent')
  deleteRecentSearchKeywords(@User() user: JwtPayload, @Body() body: DeleteRecentSearchKeywordsReqDTO): Promise<void>  {
    return this.searchService.deleteRecentSearchKeywords(user, body);
  }

  @ApiOperation({
    summary: '검색 자동완성',
    description: '검색어 입력 시 자동완성 제안을 제공합니다. 라멘 매장 이름에 대한 검색 결과와 관련있는 매장 정보를 포함합니다. 검색 결과는 검색 키워드가 앞에 있는 순으로 정렬됩니다.',
  })
  @ApiQuery({
    name: 'query',
    description: '검색어 (최소 1글자 이상)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '자동완성 조회 성공',
    type: GetAutocompleteResDto,
  })
  @Public()
  @Get('autocomplete')
  getAutocomplete(
    @Query('query') query: string,
  ): Promise<GetAutocompleteResDto> {
    return this.searchService.getAutocomplete(query);
  }
}
