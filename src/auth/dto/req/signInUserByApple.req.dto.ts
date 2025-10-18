import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class signInUserByAppleReqDTO {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	code: string;
}