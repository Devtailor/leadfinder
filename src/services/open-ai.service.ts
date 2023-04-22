import { Inject, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { EmailGenerationFailedException } from 'src/exceptions';
import { configFactory } from '../config.factory';
import { Config, GeneratedEmailsJson } from '../interfaces';

@Injectable()
export class OpenAiService {
  private readonly MAX_RECURSION = 10;
  private readonly openAi: OpenAIApi;

  constructor(@Inject(configFactory.KEY) readonly config: Config) {
    const configuration = new Configuration({ apiKey: config.openAiApiKey });
    this.openAi = new OpenAIApi(configuration);
  }

  async getEmails(
    prompts: Map<number, string>,
    dna: string,
    recursion?: number,
  ): Promise<Map<number, GeneratedEmailsJson>> {
    if (!recursion) recursion = 1;
    if (recursion > this.MAX_RECURSION)
      throw new EmailGenerationFailedException();

    const emails = new Map<number, GeneratedEmailsJson>();
    for (const prompt of prompts) {
      try {
        const { data } = await this.openAi.createCompletion({
          model: 'text-davinci-003',
          prompt: prompt[1],
          max_tokens: 2500,
        });

        const json = JSON.parse(data.choices[0].text!);
        emails.set(prompt[0], json);
      } catch (error) {
        recursion++;
        this.getEmails(prompts, dna, recursion);
      }
    }
    return emails;
  }
}
