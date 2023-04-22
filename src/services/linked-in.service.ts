import { Inject, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LinkedinClient = require('linkedin-client');

import { LinkedInProfileDto } from '../dtos';
import { Config, LinkedInProfile } from '../interfaces';
import { configFactory } from '../config.factory';

@Injectable()
export class LinkedInService {
  private readonly linkedInClient: typeof LinkedinClient;

  constructor(@Inject(configFactory.KEY) readonly config: Config) {
    this.linkedInClient = new LinkedinClient(config.linkedInLiAtCookie);
  }

  async getProfile(url: string): Promise<LinkedInProfileDto> {
    // TODO: Possibly create own scraper
    const profile: LinkedInProfile = await this.linkedInClient.fetch(url);
    return {
      firstName: profile.firstName,
      jobs: ['Job1', 'Job2'],
      company: 'Unknown OÜ',
      productDescription: 'Awsome product',
      about: profile.headline,
      experience: 'This is my experience',
    };
  }
}
