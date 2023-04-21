import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LinkedinClient = require('linkedin-client');

import { LinkedInProfileDto } from '../dtos';
import { LinkedInProfile } from '../interfaces';

@Injectable()
export class LinkedInService {
  private readonly linkedInClient = new LinkedinClient(
    'AQEDAShZj6oB3h87AAABh6IZoigAAAGHxiYmKE0AUJjDggkrgCTzkSKDSUB0X8GHLDvoZ_4ceX9lpP7yUTndrglKNp5tKsSbYOnAPuFeUQSBWlUDabZAwSoBMFquW11E89F2XWXwv-XD9xKQQ7HwuFnv',
  );

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
