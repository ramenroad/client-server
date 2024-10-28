import { Controller, Get } from '@nestjs/common';
import { RamenyaService } from './ramenya.service';

@Controller('ramenya')
export class RamenyaController {
    constructor(private readonly ramenyaService: RamenyaService){}

    @Get('')
    getRamenyas(){
        
    }
}
