import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { Todo } from '../../core/database/entities/todos.entity';
import { TODO_REPOSITORY } from '../../../constants';

const todoRepositoryMock = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
};

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: TODO_REPOSITORY, useValue: todoRepositoryMock },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const todoDto = {
        title: 'Test Todo',
        body: 'Test Todo Body',
        completed: false,
        public: false,
        listType: 'Personal',
      };
      const userId = 1;
      const expectedTodo = {
        id: 1,
        ...todoDto,
        userId,
      };
      todoRepositoryMock.create.mockResolvedValueOnce(expectedTodo);

      const result = await service.create(todoDto, userId);

      expect(result).toEqual(expectedTodo);
      expect(todoRepositoryMock.create).toHaveBeenCalledWith({
        ...todoDto,
        userId,
      });
    });
  });
  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const todos: Todo[] = []; // mock todos array
      todoRepositoryMock.findAll.mockResolvedValueOnce(todos);

      const result = await service.findAll();

      expect(result).toEqual(todos);
      expect(todoRepositoryMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a todo by ID', async () => {
      const todoId = 2;
      const todo = {
        id: 2,
        title: 'test',
        body: 'third',
        completed: true,
        userId: 3,
        listType: 'Gym',
        createdAt: '2024-03-22T19:20:34.990Z',
        updatedAt: '2024-03-22T22:04:49.137Z',
        public: true,
      };
      todoRepositoryMock.findOne.mockResolvedValueOnce(todo);

      const result = await service.findOne(todoId);

      expect(result).toEqual(todo);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const todoId = 1;
      const todoDto = { title: 'test' };
      const updatedTodo = [
        {
          id: 2,
          title: 'test',
          body: 'third',
          completed: true,
          userId: 3,
          listType: 'Gym',
          createdAt: '2024-03-22T19:20:34.990Z',
          updatedAt: '2024-03-22T22:04:49.137Z',
          public: true,
        },
      ];
      const numberOfAffectedRows = 1;
      const expectedResult = {
        numberOfAffectedRows,
        updatedPost: updatedTodo[0],
      };

      todoRepositoryMock.update.mockResolvedValueOnce([
        numberOfAffectedRows,
        updatedTodo,
      ]);

      const result = await service.update(todoId, todoDto, 1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a todo', async () => {
      const todoId = 1;
      const user = {
        id: 3,
        name: 'alisia',
        email: 'alisjareveli@gmail.com',
        gender: 'female',
        createdAt: '2024-03-21T20:23:00.555Z',
        updatedAt: '2024-03-21T20:23:00.555Z',
      };
      const userId = user.id;
      const numberOfAffectedRows = 1; // Assuming one row is affected after deletion

      todoRepositoryMock.destroy.mockResolvedValueOnce(numberOfAffectedRows); // Resolve with the number of affected rows

      await service.delete(todoId, user as any);

      expect(todoRepositoryMock.destroy).toHaveBeenCalledWith({
        where: { id: todoId, userId },
      });
    });
  });
});
