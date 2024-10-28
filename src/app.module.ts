import { Module } from '@nestjs/common';
import { RamenyaModule } from './ramenya/ramenya.module';

@Module({
  imports: [RamenyaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
