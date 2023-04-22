import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';
import { CreateMailsBodyDto } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createMails(
    @Body() data: CreateMailsBodyDto,
    @Res() response: Response,
  ): Promise<void> {
    const buffer = await this.appService.createMails(data);

    response
      .header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      .header('Content-Disposition', 'attachment; filename="test.xlsx"')
      .send(buffer);
  }
}
