import { Module } from '@nestjs/common';
import { RamenyaModule } from './ramenya/ramenya.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RamenyaModule,
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_DB_NAME,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
