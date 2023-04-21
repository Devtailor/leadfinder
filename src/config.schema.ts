import * as Joi from 'joi';

const schema = {
  LINKED_IN_LI_AT_COOKIE: Joi.string().required(),
  OPEN_AI_API_KEY: Joi.string().required(),
};

export const configSchema = Joi.object<typeof schema>(schema);
