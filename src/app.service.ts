import { Injectable } from '@nestjs/common';
import { CreateMailsBodyDto } from './dtos';

@Injectable()
export class AppService {
  async createMails(data: CreateMailsBodyDto): Promise<void> {
    const prompt = this.createPrompt(data);
    console.log(prompt);
  }

  private createPrompt(data: CreateMailsBodyDto): string {
    return data.prompt
      .replace('{recipient_firstname}', 'LinkedIn')
      .replace('{jobs}', ['LinkedIn'].join(', '))
      .replace('{recipient_company}', 'LinkedIn')
      .replace(/{product_description}/g, 'LinkedIn')
      .replace('{sender_firstname}', 'DNA')
      .replace('{sender_company}', 'DNA')
      .replace('{dna}', data.dna)
      .replace('{recipient_LI_about}', 'LinkedIn')
      .replace('{recipient_LI_experience}', 'LinkedIn');
  }
}
