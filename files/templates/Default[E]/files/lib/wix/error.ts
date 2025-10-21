import { Data } from 'effect';

export class ClientError extends Data.TaggedError('ErrorParserError') {}
