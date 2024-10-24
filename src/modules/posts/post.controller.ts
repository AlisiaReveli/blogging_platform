import {
    Body,
    Controller, Get, NotFoundException, Param,
    Post,
    UseGuards,
    Query, Patch, Delete
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {ApiResponse, ApiTags, ApiBody, ApiBearerAuth, ApiParam, ApiQuery} from '@nestjs/swagger'
import {PostService} from "./posts.service";
import {CreatePostDto} from "./dto/post.dto";
import {CurrentUser} from "../../core/decorators/currentUser.decorator";
import {User} from "../users/types/user.types";
import {CreatePostResponse, PaginatedPostsResponse, SearchResponse} from "./types/post.types";
import {UpdatePostDto} from "./dto/updatePost.dto";
import {Public} from "../../core/decorators/isPublic.decorator";
import {PublicGuard} from "../../core/guards/isPublic.guard";
@ApiTags('Post')
@Controller('post')
@ApiBearerAuth()
@UseGuards(PublicGuard)
export class PostController {
    constructor (private readonly postService: PostService) {}

    @Post()
    @ApiBody({
        type: CreatePostDto,
    })
    @ApiResponse({ status: 201, description: 'Post created successfully' })
    async create(
        @Body() post: CreatePostDto,
        @CurrentUser() user: User,
    ): Promise<CreatePostResponse>{
        return await this.postService.create(post, user);
    }

    @Get('search')
    @ApiQuery({ name: 'query', required: true, type: String, description: 'Search query' })
    @ApiResponse({ status: 200, description: 'Returns matching posts' })
    async search(@Query('query') query: string): Promise<SearchResponse> {
        const { message, posts } = await this.postService.search(query);
        return { message, posts};
    }

    @Get()
    // @Public()
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of posts per page' })
    @ApiQuery({ name: 'sort', required: false, type: String, enum: ['date', 'title'], description: 'Sort by creation date or title' })
    @ApiResponse({ status: 200, description: 'Returns all posts with pagination' })
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sort') sort: 'date' | 'title' = 'date'
    ): Promise<PaginatedPostsResponse> {
        const safeLimit = Math.max(limit, 1);
        const safePage = Math.max(page, 1);
        const { message, posts, total, totalPages } = await this.postService.findAll(safePage, safeLimit,sort);
        return { message, posts, total, totalPages, page: safePage, limit: safeLimit };
    }


    @Get(':id')
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Returns a single post' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async findOne(@Param('id') id: string): Promise<CreatePostResponse> {
        const { message, post } = await this.postService.findOne(id);

        if (!post) {
            throw new NotFoundException("This Post doesn't exist");
        }

        return { message, post };
    }

    @Patch(':id')
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ type: UpdatePostDto })
    @ApiResponse({ status: 200, description: 'Post updated successfully' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<CreatePostResponse> {
        const { message, post } = await this.postService.update(id, updatePostDto);

        if (!post) {
            throw new NotFoundException("This Post doesn't exist");
        }

        return { message, post };
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Post deleted successfully' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async delete(@Param('id') id: string): Promise<{ message: string }> {
        const result = await this.postService.delete(id);
        if (!result) {
            throw new NotFoundException("This Post doesn't exist");
        }
        return { message: 'Post deleted successfully' };
    }

}
