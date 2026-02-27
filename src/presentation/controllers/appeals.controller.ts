import { Controller, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TransferChildCommand } from '@application/commands/transfer-child/transfer-child.command';
import { TransferChildResult } from '@application/commands/transfer-child/transfer-child.result';

@Controller('api/appeals')
export class AppealsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':id/transfer')
  @HttpCode(HttpStatus.OK)
  async transfer(@Param('id') id: string): Promise<TransferChildResult> {
    return this.commandBus.execute<TransferChildCommand, TransferChildResult>(
      new TransferChildCommand(id),
    );
  }
}
