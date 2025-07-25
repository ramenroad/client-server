import { Module } from '@nestjs/common';
import { RamenyaModule } from './ramenya/ramenya.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BannerModule } from './banner/banner.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';
import { MypageModule } from './mypage/mypage.module';
import { ReviewModule } from './review/review.module';
import { CommonService } from './common/common.service';
import { CommonModule } from './common/common.module';
import { SearchModule } from './search/search.module';

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
    AuthModule,
    MypageModule,
    ReviewModule,
    CommonModule,
    SearchModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    CommonService,
  ],
})
export class AppModule {}
