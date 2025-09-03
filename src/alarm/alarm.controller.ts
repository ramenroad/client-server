import { Body, Controller, Patch } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { User } from 'src/common/decorators/user.decorator';
import { updateDeviceTokenReqDTO } from './dto/updateDeviceToken.req.dto';

@Controller('alarm')
export class AlarmController {
    constructor(private readonly alarmService: AlarmService){}

    @ApiOperation({
        summary: '알람 디바이스 토큰 업데이트',
    })
    @ApiResponse({
        status: 200,
        description: '디바이스 토큰 업데이트 성공',
    })
    @ApiBearerAuth('accessToken')
    @Patch()
    async updateDeviceToken(@User() user: JwtPayload, @Body() body: updateDeviceTokenReqDTO): Promise<void> {
        return await this.alarmService.updateDeviceToken(user, body);
    }
}
