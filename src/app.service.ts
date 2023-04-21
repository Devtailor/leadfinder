import { Injectable } from '@nestjs/common';
import { CreateMailsBodyDto, LinkedInProfileDto } from './dtos';
import * as XLSX from 'xlsx';

@Injectable()
export class AppService {
  async createMails(data: CreateMailsBodyDto): Promise<void> {
    const linkedInUrls = this.getLinkedInUrls();
    const prompts = await this.createPrompts(data, linkedInUrls);
  }

  private async createPrompts(
    data: CreateMailsBodyDto,
    linkedInUrls: Map<number, string>,
  ): Promise<Map<number, string>> {
    const prompts = new Map<number, string>();
    for (const [i, url] of linkedInUrls) {
      const profile = await this.getLinkedInProfile(url);
      prompts.set(i, this.createPrompt(data, profile));
    }
    return prompts;
  }

  private async getLinkedInProfile(url: string): Promise<LinkedInProfileDto> {
    return {
      firstName: 'John',
      jobs: ['Job1', 'Job2'],
      company: 'Unknown OÜ',
      productDescription: 'Awsome product',
      about: 'This is my about',
      experience: 'This is my experience',
    };
  }

  private createPrompt(
    data: CreateMailsBodyDto,
    linkedInProfile: LinkedInProfileDto,
  ): string {
    return data.prompt
      .replace('{recipient_firstname}', linkedInProfile.firstName)
      .replace('{jobs}', linkedInProfile.jobs.join(', '))
      .replace('{recipient_company}', linkedInProfile.company)
      .replace(/{product_description}/g, linkedInProfile.productDescription)
      .replace('{sender_firstname}', 'DNA')
      .replace('{sender_company}', 'DNA')
      .replace('{dna}', data.dna)
      .replace('{recipient_LI_about}', linkedInProfile.about)
      .replace('{recipient_LI_experience}', linkedInProfile.experience);
  }

  private getLinkedInUrls(): Map<number, string> {
    const workbook = XLSX.readFile('src/data/sample-list.xlsx');
    const [sheetName] = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const linkedinUrls = new Map<number, string>();
    data
      .slice(0, 10)
      .forEach((row, i) =>
        linkedinUrls.set(i, <string>(<Record<string, unknown>>row)['linkedin']),
      );
    return linkedinUrls;
  }
}
