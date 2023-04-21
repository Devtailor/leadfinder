import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkedInService, OpenAiService, XlsxService } from './services';
import { configFactory } from './config.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../config/${process.env.NODE_ENV}.env`,
      expandVariables: true,
    }),
    ConfigModule.forFeature(configFactory),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true }),
    },
    AppService,
    LinkedInService,
    OpenAiService,
    XlsxService,
  ],
})
export class AppModule {}
