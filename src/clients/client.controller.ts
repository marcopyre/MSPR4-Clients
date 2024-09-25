import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDto } from './client.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createClient(@Body() dto: ClientDto) {
    return this.clientService.createClient(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateClient(@Body() dto: ClientDto, @Param('id') id: number) {
    return this.clientService.updateClient(dto, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteClient(@Param('id') id: number) {
    return this.clientService.deleteClient(id);
  }

  @Get()
  getAllClients() {
    return this.clientService.getAllPolls();
  }
}
