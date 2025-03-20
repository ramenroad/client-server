import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from './decorators/public.decorator';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  /* @Public()
  @Post('check')
  @UseInterceptors(FileInterceptor('file'))
  check(@UploadedFile() file: Express.Multer.File): Promise<Buffer> {
    console.log(file);
    return this.commonService.convertToWebp(file.buffer);
  } */
}
