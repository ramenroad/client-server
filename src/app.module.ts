import { Module } from '@nestjs/common';
import { RamenyaModule } from './ramenya/ramenya.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BannerModule } from './banner/banner.module';

@Module({
  imports: [
    RamenyaModule,
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_NAME,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_DB_NAME,
    }),
    BannerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
