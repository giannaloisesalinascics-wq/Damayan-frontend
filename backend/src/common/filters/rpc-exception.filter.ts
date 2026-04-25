import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Catches errors thrown by NestJS TCP microservice calls (via ClientProxy.send).
 * Microservice exceptions arrive as plain objects with statusCode/message fields.
 * Without this filter they would be treated as unhandled errors and return 500.
 */
@Catch()
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcToHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    console.error('[RpcToHttpExceptionFilter] Caught exception:', exception);
    console.error('[RpcToHttpExceptionFilter] Exception type:', typeof exception);
    console.error('[RpcToHttpExceptionFilter] Is HttpException:', exception instanceof HttpException);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Already a proper HTTP exception – let default behaviour handle it
    if (exception instanceof HttpException) {
      console.error('[RpcToHttpExceptionFilter] Handling as HttpException');
      const status = exception.getStatus();
      const body = exception.getResponse();
      return response.status(status).json(body);
    }

    // Microservice TCP errors come back as plain objects like:
    // { statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' }
    if (typeof exception === 'object' && exception !== null) {
      console.error('[RpcToHttpExceptionFilter] Handling as RPC error object');
      const err = exception as Record<string, unknown>;
      const statusCode =
        typeof err['statusCode'] === 'number' &&
        err['statusCode'] >= 100 &&
        err['statusCode'] < 600
          ? (err['statusCode'] as number)
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        typeof err['message'] === 'string'
          ? err['message']
          : 'An unexpected error occurred';

      console.error('[RpcToHttpExceptionFilter] Returning with statusCode:', statusCode);
      return response.status(statusCode).json({
        statusCode,
        message,
        error: err['error'] ?? HttpStatus[statusCode] ?? 'Error',
      });
    }

    console.error('[RpcToHttpExceptionFilter] Handling as unhandled exception');
    this.logger.error('Unhandled exception', exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
