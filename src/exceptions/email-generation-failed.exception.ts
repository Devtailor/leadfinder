import { ConflictException } from '@nestjs/common';

export class EmailGenerationFailedException extends ConflictException {
  constructor() {
    super('Failed to generate emails.');
  }
}
