import { Inject, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { configFactory } from '../config.factory';
import { Config } from '../interfaces';

@Injectable()
export class OpenAiService {
  private readonly openAi: OpenAIApi;

  constructor(@Inject(configFactory.KEY) readonly config: Config) {
    const configuration = new Configuration({ apiKey: config.openAiApiKey });
    this.openAi = new OpenAIApi(configuration);
  }

  async getEmails(
    prompts: Map<number, string>,
    dna: string,
  ): Promise<Map<number, string>> {
    const emails = new Map<number, string>();
    for (const prompt of prompts) {
      try {
        const { data } = await this.openAi.createCompletion({
          model: 'text-davinci-003',
          prompt,
        });
        console.log(data.choices[0].text);
      } catch (error) {
        // TODO: Sth is wrong with prompt
        Object.entries(error).forEach(([key, value]) =>
          console.log(key, value),
        );
        throw error;
      }
    }
    return emails;
  }
}
