import { Inject, Injectable } from '@nestjs/common';
import { Todo } from '../../core/database/entities/todos.entity';
import { TodosDto } from './dto/todos.dto';
import { User } from '../../core/database/entities/user.entity';
import { ListType, TODO_REPOSITORY } from '../../../constants';

@Injectable()
export class TodosService {
  constructor(
    @Inject(TODO_REPOSITORY) private readonly todoRepository: typeof Todo,
  ) {}
  async create(todo: TodosDto, userId: number): Promise<Todo> {
    return await this.todoRepository.create<Todo>({ ...todo, userId });
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoRepository.findAll<Todo>({
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async findOne(id: number): Promise<Todo> {
    return await this.todoRepository.findOne({
      where: { id },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async delete(id: number, user: User) {
    const userId = user.id;
    return await this.todoRepository.destroy({ where: { id, userId } });
  }

  async update(id: number, data: Partial<TodosDto>, userId: number) {
    const [numberOfAffectedRows, [updatedPost]] =
      await this.todoRepository.update(
        { ...data },
        { where: { id, userId }, returning: true },
      );

    return { numberOfAffectedRows, updatedPost };
  }
  async getPublicTodoList(listType: typeof ListType): Promise<Todo[]> {
    return await this.todoRepository.findAll<Todo>({
      where: { listType, public: true },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }
}
