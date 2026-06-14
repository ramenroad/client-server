import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class createRamenCalendarReqDTO {
  @ApiProperty({
    required: true,
    type: 'string',
    example: '2026-06-14',
    description: '방문 날짜 (YYYY-MM-DD)',
  })
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'visitDate는 YYYY-MM-DD 형식이어야 합니다.' })
  visitDate: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: '매장 이름 (스냅샷)',
  })
  @IsNotEmpty()
  @IsString()
  ramenyaName: string;

  @ApiProperty({
    required: false,
    type: 'string',
    description: '검색에서 선택한 매장 ID. 직접 입력이면 생략.',
  })
  @IsOptional()
  @IsMongoId()
  ramenyaId?: string;

  @ApiProperty({
    required: false,
    type: [String],
    example: ['돈코츠라멘', '츠케멘'],
    description: '먹은 메뉴 목록',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  menus?: string[];
}
