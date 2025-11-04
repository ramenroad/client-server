import { Module } from '@nestjs/common';
import { RamenyaModule } from './ramenya/ramenya.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BannerModule } from './banner/banner.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';
import { MypageModule } from './mypage/mypage.module';
import { ReviewModule } from './review/review.module';
import { CommonService } from './common/common.service';
import { CommonModule } from './common/common.module';
import { SearchModule } from './search/search.module';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { CommunityModule } from './community/community.module';

@Module({
  imports: [
    SentryModule.forRoot(),
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
    CommunityModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    CommonService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
