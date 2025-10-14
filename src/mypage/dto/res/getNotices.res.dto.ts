import { ApiProperty } from "@nestjs/swagger";
import { Schema } from "mongoose";

export class getNoticesResDTO {
    @ApiProperty({
        type: String,
    })
    _id: Schema.Types.ObjectId;

    @ApiProperty({
        type: String,
    })
    type: string;

    @ApiProperty({
        type: String,
    })
    title: string;

    @ApiProperty({
        type: String,
    })
    url: string;

    @ApiProperty({
        type: Date,
    })
    createdAt: Date;
}