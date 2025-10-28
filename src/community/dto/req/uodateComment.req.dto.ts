import { IsNotEmpty, IsString } from "class-validator";

export class updateCommentReqDTO {
    @IsNotEmpty()
    @IsString()
    body: string;
}