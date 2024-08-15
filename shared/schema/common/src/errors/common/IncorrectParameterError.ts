import { RuntimeError } from '@ddd/errors';

export interface IncorrectParameterErrorParams {
  paramName: string;
  expected: string[];
}

@RuntimeError.RegisterError('IncorrectParameterError')
export class IncorrectParameterError extends RuntimeError<IncorrectParameterErrorParams> {
  constructor(paramName: string, expected: string[]) {
    super('IncorrectParameterError', { paramName, expected });
  }

  get message(): string {
    return `Parameter '${this.params.paramName}' passed with wrong type or empty. Expected: [${this.params.expected.join(', ')}]`;
  }
}
