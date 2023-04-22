import { Injectable } from '@nestjs/common';

import { CreateMailsBodyDto, LinkedInProfileDto } from './dtos';
import { LinkedInService, OpenAiService, XlsxService } from './services';

@Injectable()
export class AppService {
  constructor(
    private readonly linkedInService: LinkedInService,
    private readonly openAiService: OpenAiService,
    private readonly xlsxService: XlsxService,
  ) {}

  async createMails(data: CreateMailsBodyDto): Promise<void> {
    const linkedInUrls = this.xlsxService.getLinkedInUrls(1);
    const prompts = await this.createPrompts(data, linkedInUrls);
    const emails = await this.openAiService.getEmails(prompts, data.dna);
  }

  private async createPrompts(
    data: CreateMailsBodyDto,
    linkedInUrls: Map<number, string>,
  ): Promise<Map<number, string>> {
    const prompts = new Map<number, string>();
    for (const [i, url] of linkedInUrls) {
      const profile = await this.linkedInService.getProfile(url);
      prompts.set(i, this.createPrompt(data, profile));
    }
    return prompts;
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
      .replace('{sender_firstname}', 'Rainer')
      .replace('{sender_company}', 'Leadfinder')
      .replace('{dna}', data.dna)
      .replace('{recipient_LI_about}', linkedInProfile.about)
      .replace('{recipient_LI_experience}', linkedInProfile.experience);
  }
}
