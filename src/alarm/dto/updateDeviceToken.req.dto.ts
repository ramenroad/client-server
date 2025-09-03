import { ApiProperty } from "@nestjs/swagger";

export class updateDeviceTokenReqDTO {

    @ApiProperty({
        description: '디바이스 토큰',
    })
    deviceToken: string;
}