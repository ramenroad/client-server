import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

export class updateRamenCalendarReqDTO {
  @ApiPropertyOptional({
    type: 'string',
    example: '2026-06-14',
    description: '방문 날짜 (YYYY-MM-DD)',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'visitDate는 YYYY-MM-DD 형식이어야 합니다.' })
  visitDate?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: '매장 이름 (스냅샷)',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  ramenyaName?: string;

  @ApiPropertyOptional({
    type: 'string',
    nullable: true,
    description: '검색에서 선택한 매장 ID. 직접 입력이면 null 또는 생략.',
  })
  @IsOptional()
  @IsMongoId()
  ramenyaId?: string | null;

  @ApiPropertyOptional({
    type: [String],
    example: ['돈코츠라멘', '츠케멘'],
    description: '먹은 메뉴 목록',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  menus?: string[];

  @ApiPropertyOptional({
    type: 'number',
    example: 12000,
    description: '지불 금액(원). 0 이상의 정수.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}
