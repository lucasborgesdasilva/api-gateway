import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

/**
 * Estou criando um filtro de exceções
 * sempre que ocorrer uma exceção, eu vou interceptá-la,
 * verificar se o status e a mensagem, são instâncias do HTTPException
 * e retornar um objeto, mostrando a data que aconteceu a exceção,
 * o caminho, e a mensagem, para ficar claro pro cliente, o que aconteceu com
 * a requisição que ele fez.
 */

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    this.logger.error(
      `HTTP Status ${status} Error Message: ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
