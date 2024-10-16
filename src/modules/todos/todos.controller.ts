import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from '../../core/database/entities/todos.entity';
import { TodosDto } from './dto/todos.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../core/decorators/currentUser.decorator';
import { User } from '../../core/database/entities/user.entity';
import { ListType } from '../../../constants';
import { Public } from '../../core/decorators/isPublic.decorator';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return await this.todoService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Returns a single todo' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async findOne(@Param('id') id: number): Promise<Todo> {
    // find the post with this id
    const post = await this.todoService.findOne(id);

    if (!post) {
      throw new NotFoundException("This Post doesn't exist");
    }

    // if post exist, return the post
    return post;
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    type: TodosDto,
  })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  async create(
    @Body() todo: TodosDto,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    // create a new post and return the newly created post
    return await this.todoService.create(todo, user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: TodosDto })
  async update(
    @Param('id') id: number,
    @Body() todo: Partial<TodosDto>,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    const todoItem = await this.todoService.findOne(id);

    if (!todoItem) {
      throw new NotFoundException("This Todo doesn't exist");
    }
    const { updatedPost } = await this.todoService.update(id, todo, user.id);

    return updatedPost;
  }

  @Get('public-todos/:listType')
  @Public()
  @ApiParam({
    name: 'listType',
    type:
      ListType.Personal ||
      ListType.Work ||
      ListType.Shopping ||
      ListType.Custom,
  })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async getPublicTodoList(
    @Param('listType') listType: typeof ListType,
  ): Promise<Todo[]> {
    //even if user doesn't have account can see the public todos for the specific list
    return await this.todoService.getPublicTodoList(listType);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async delete(@Param('id') id: number, @CurrentUser() user: User) {
    try {
      await this.todoService.delete(id, user);
      return { success: true, message: 'Todo deleted successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to delete todo' };
    }
  }
}
