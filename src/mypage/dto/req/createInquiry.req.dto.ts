import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class createInquiryReqDTO {

    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    body: string;
}