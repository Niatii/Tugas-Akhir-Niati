import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class Handler implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    /**
     * Prevent double response
     */
    if (response.headersSent) {
      return;
    }

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    httpAdapter.reply(
      response,
      exception,
      httpStatus,
    );
  }
}