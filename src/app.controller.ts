import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  /**
   * Implementar um guia
   * Vamos receber uma req(mensagem) e encaminhar para o broker(RabbitMQ) de forma assíncrona.
   **/
  private clientAdminBackend: ClientProxy;

  constructor() {
    /**
     * Criamos uma instância do nosso ClientProxy
     * Passamos os nossos parâmetros para conseguirmos conectar com o nosso broker
     * e dessa forma publicamos a nossa mensagem criar-categoria para o RabbitMQ
     **/
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:DToEBKfu0A1@@54.224.136.230:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    return this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);
  }
}
