import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get('')
  search(@Query('query') query: string) {
    return this.searchService.search(query);
  }
}
