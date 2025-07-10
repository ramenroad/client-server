import { ApiProperty } from "@nestjs/swagger";

class SearchKeyword {

    @ApiProperty({
        description: '검색어 ID',
        example: '668e90909090909090909090',
        type: String,
    })
    _id: string | unknown;

    @ApiProperty({
        description: '검색어',
        type: String,
    })
    keyword: string;
}

class RamenyaName {

    @ApiProperty({
        description: '검색어 ID',
        example: '668e90909090909090909090',
        type: String,
    })
    _id: string | unknown;

    @ApiProperty({
        description: '검색어',
        type: String,
    })
    keyword: string;

    @ApiProperty({
        description: '라멘야 ID',
        type: String,
    })
    ramenyaId?: string | unknown;
}


export class GetRecentSearchKeywordsResDto {

    @ApiProperty({
        description: '검색어',
        type: SearchKeyword,
        isArray: true,
    })
    searchKeywords: SearchKeyword[];

    @ApiProperty({
        description: '검색한 라멘야 이름',
        type: RamenyaName,
        isArray: true,
    })
    ramenyaNames: RamenyaName[]; 
}