import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { updateDeviceTokenReqDTO } from './dto/updateDeviceToken.req.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from 'schema/user.schema';

@Injectable()
export class AlarmService {
    constructor(
        @InjectModel('user') private readonly userModel: Model<user>){}

        
    async updateDeviceToken(user: JwtPayload, body: updateDeviceTokenReqDTO): Promise<void> {

        const userInfo = await this.userModel.findById(user.id);

        /* 디바이스 토큰이 저장되어 있고 같은 경우 그냥 리턴
        디바이스 토큰이 없거나 저장되어 있는데 다른 경우 업데이트*/
        if (userInfo.notification.deviceToken == null || userInfo.notification.deviceToken != body.deviceToken) {
            await this.userModel.findByIdAndUpdate(user.id, {
                notification: {
                    deviceToken: body.deviceToken,
                    tokenUpdatedAt: new Date(),
                },
            });
        }

        return;
    }
}
