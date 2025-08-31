import { ApiProperty } from '@nestjs/swagger';

export class signInUser403ResDTO {
  @ApiProperty({
    description: '에러 메시지',
    example: '탈퇴한 회원입니다.',
  })
  message: string;

  @ApiProperty({
    description: '에러 코드',
    example: 'WITHDRAWN_USER',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP 상태 코드',
    example: 403,
  })
  statusCode: number;
}