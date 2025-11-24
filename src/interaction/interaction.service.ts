import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ViewHistory } from 'schema/viewHistory.schema';

@Injectable()
export class InteractionService {
    constructor(
        @InjectModel('viewHistory') private viewHistoryModel: Model<ViewHistory>,
    ) { }


    async logRamenyaViewHistory(userId: string, ramenyaId: string): Promise<void> {
        const userObjectId = new Types.ObjectId(userId);
        const ramenyaObjectId = new Types.ObjectId(ramenyaId);

        await this.viewHistoryModel.findOneAndUpdate(
            { user: userObjectId, ramenya: ramenyaObjectId }, 
            { $set: { lastViewedAt: new Date() } }, 
            { upsert: true, new: true } 
        ).exec();
    }
}
