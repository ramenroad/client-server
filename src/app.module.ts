import { Module } from '@nestjs/common';
import { RamenyaModule } from './ramenya/ramenya.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [RamenyaModule, MongooseModule.forRoot(process.env.MONGODB_URL)],
  controllers: [],
  providers: [],
})
export class AppModule {}
