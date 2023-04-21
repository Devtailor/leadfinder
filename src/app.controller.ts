import { Body, Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { CreateMailsBodyDto } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createMails(@Body() data: CreateMailsBodyDto): Promise<void> {
    return await this.appService.createMails(data);
  }
}
