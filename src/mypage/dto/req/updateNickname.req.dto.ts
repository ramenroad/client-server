import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class updateNicknameReqDTO {
  @ApiProperty({
    description: '변경할 닉네임',
  })
  @IsNotEmpty()
  nickname: string;
}
