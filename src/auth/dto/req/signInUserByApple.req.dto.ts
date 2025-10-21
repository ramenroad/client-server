import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class signInUserByAppleReqDTO {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	state: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	code: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	id_token: string;
}