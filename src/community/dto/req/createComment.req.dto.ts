import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class createCommentReqDTO {
    @ApiProperty({
        required: true,
        type: 'string',
    })
    @IsNotEmpty()
    body: string;

    @ApiProperty({
        required: false,
        type: 'string',
    })
    parentCommentId?: string;
}