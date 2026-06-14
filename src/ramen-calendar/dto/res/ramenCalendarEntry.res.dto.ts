import { ApiProperty } from '@nestjs/swagger';

export class RamenCalendarEntryResDTO {
  @ApiProperty({ description: '기록 ID', example: '665f1c2a09134d50cfcdd3d7' })
  _id: unknown;

  @ApiProperty({ description: '방문 날짜 (YYYY-MM-DD)', example: '2026-06-14' })
  visitDate: string;

  @ApiProperty({ description: '매장 이름' })
  ramenyaName: string;

  @ApiProperty({ description: '매장 ID (직접 입력이면 null)', required: false, nullable: true })
  ramenyaId?: unknown;

  @ApiProperty({ description: '먹은 메뉴 목록', type: [String] })
  menus: string[];

  @ApiProperty({ description: '생성일', required: false })
  createdAt?: string;

  @ApiProperty({ description: '수정일', required: false })
  updatedAt?: string;
}
