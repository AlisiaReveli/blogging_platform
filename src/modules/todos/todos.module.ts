import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { todosProviders } from './todos.providers';

@Module({
  providers: [TodosService, ...todosProviders],
  controllers: [TodosController],
})
export class TodosModule {}
