import { Todo } from '../../core/database/entities/todos.entity';
import { TODO_REPOSITORY } from '../../../constants';

export const todosProviders = [
  {
    provide: TODO_REPOSITORY,
    useValue: Todo,
  },
];
