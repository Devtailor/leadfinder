import { registerAs } from '@nestjs/config';

import { Config } from './interfaces';
import { configSchema } from './config.schema';
import { ConfigUtil } from './utils';

export const configFactory = registerAs('config', (): Config => {
  const env = ConfigUtil.validate(configSchema);

  return {
    linkedInLiAtCookie: <string>env.LINKED_IN_LI_AT_COOKIE,
    openAiApiKey: <string>env.OPEN_AI_API_KEY,
  };
});
