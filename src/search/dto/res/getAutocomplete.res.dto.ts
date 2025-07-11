import { ApiProperty } from "@nestjs/swagger";

class BusinessHours {
    @ApiProperty({
        description: '요일',
        type: String
    })
    day: string;

    @ApiProperty({
        description: '영업 시간',
        type: String
    })
    operatingTime?: string;

    @ApiProperty({
        description: '브레이크타임',
        type: String
    })
    breakTime?: string;

    @ApiProperty({
        description: '영업 여부',
        type: Boolean
    })
    isOpen: boolean;
}

class KeywordSearchResults {
    @ApiProperty({
        description: '키워드 ID',
        type: String
    })
    _id: string;

    @ApiProperty({
        description: '키워드 이름',
        type: String
    })
    name: string;

    @ApiProperty({
        description: '키워드 영업 시간',
        type: BusinessHours,
        isArray: true
    })
    businessHours: BusinessHours[];
}

class RamenyaSearchResults {
    @ApiProperty({
        description: '매장 ID',
        type: String
    })
    _id: string | unknown;

    @ApiProperty({
        description: '매장 이름',
        type: String
    })
    name: string;

    @ApiProperty({
        description: '매장 영업 시간',
        type: BusinessHours,
        isArray: true
    })
    businessHours: BusinessHours[];
}

export class GetAutocompleteResDto {
    @ApiProperty({
        description: '매장 검색 결과',
        type: RamenyaSearchResults,
        isArray: true
    })
    ramenyaSearchResults: RamenyaSearchResults[];

    @ApiProperty({
        description: '키워드 검색 결과',
        type: KeywordSearchResults,
        isArray: true
    })
    keywordSearchResults: KeywordSearchResults[];
}