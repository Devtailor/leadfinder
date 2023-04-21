import { Injectable } from '@nestjs/common';
const LinkedinClient = require('linkedin-client');
import * as XLSX from 'xlsx';

import { CreateMailsBodyDto, LinkedInProfileDto } from './dtos';
import { LinkedInProfile } from './interfaces';

@Injectable()
export class AppService {
  private readonly linkedInClient = new LinkedinClient(
    'AQEDAShZj6oB3h87AAABh6IZoigAAAGHxiYmKE0AUJjDggkrgCTzkSKDSUB0X8GHLDvoZ_4ceX9lpP7yUTndrglKNp5tKsSbYOnAPuFeUQSBWlUDabZAwSoBMFquW11E89F2XWXwv-XD9xKQQ7HwuFnv',
  );

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
    // TODO: Possibly create own scraper
    const profile: LinkedInProfile = await this.linkedInClient.fetch(url);
    return {
      firstName: profile.firstName,
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

  private getLinkedInUrls(amount = 10): Map<number, string> {
    const workbook = XLSX.readFile('src/data/sample-list.xlsx');
    const [sheetName] = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const linkedinUrls = new Map<number, string>();
    data
      .slice(0, amount)
      .forEach((row, i) =>
        linkedinUrls.set(i, <string>(<Record<string, unknown>>row)['linkedin']),
      );
    return linkedinUrls;
  }
}
