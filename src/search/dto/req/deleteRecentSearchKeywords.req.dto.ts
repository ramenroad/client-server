import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class DeleteRecentSearchKeywordsReqDTO {
    @ApiProperty({
        description: '삭제할 검색어 ID',
        example: ['686f0f7a1c7fe700b769bb47', '686f0f7a1c7fe700b769bb48'],
        type: [String],
        isArray: true,
        required: true,
    })
    @IsNotEmpty()
    @IsArray()
    keywordId: Array<string>;
}