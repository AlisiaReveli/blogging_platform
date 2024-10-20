import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CreatePostResponse, PaginatedPostsResponse, SearchResponse } from './types/post.types';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/types/user.types';
import { PostController } from './post.controller';
import { PostService } from './posts.service';
import {Gender} from "../../../constants";
import {Types} from "mongoose";
import ObjectId = Types.ObjectId;

const mockPostService = (): Partial<PostService> => ({
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    search: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});

describe('PostController', () => {
    let postController: PostController;
    let postService: Partial<PostService>; // Change here

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostController],
            providers: [
                {
                    provide: PostService,
                    useFactory: mockPostService,
                },
            ],
        }).compile();

        postController = module.get<PostController>(PostController);
        postService = module.get<Partial<PostService>>(PostService);
    });

    it('should be defined', () => {
        expect(postController).toBeDefined();
    });

    describe('create', () => {
        it('should create a post successfully', async () => {
            const createPostDto: CreatePostDto = {
                title: 'Test Post',
                content: [
                    {
                        type: 'text',
                        content: 'Test Content',
                        caption: 'Test Caption',
                    },
                ],
            };
            const user: User = {
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
                gender: Gender.FEMALE,
                _id: new ObjectId(),
            };
            const result: CreatePostResponse = {
                message: 'Post created successfully',
                post: {
                    ...createPostDto,
                    author: user.email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            };

            jest.spyOn(postService, 'create').mockResolvedValue(result);

            expect(await postController.create(createPostDto, user)).toBe(result);
            expect(postService.create).toHaveBeenCalledWith(createPostDto, user);
        });
    });

    describe('findOne', () => {
        it('should return a post', async () => {
            const postId = '1';
            const result: CreatePostResponse = {
                message: 'Post retrieved successfully',
                post: {
                    title: 'Test Post',
                    content: [
                        {
                            type: "text",
                            content: "test",
                            caption: "caption test",
                        },
                    ],
                    author: 'test@example.com',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            };

            jest.spyOn(postService, 'findOne').mockResolvedValue(result);

            expect(await postController.findOne(postId)).toEqual(result);
            expect(postService.findOne).toHaveBeenCalledWith(postId);

        });

        it('should throw NotFoundException if post not found', async () => {
            const postId = '1';
            jest.spyOn(postService, 'findOne').mockRejectedValue(new NotFoundException('Post not found'));

            await expect(postController.findOne(postId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return paginated posts', async () => {
            const result: PaginatedPostsResponse = {
                message: 'Posts retrieved successfully',
                posts: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
            };

            jest.spyOn(postService, 'findAll').mockResolvedValue(result);

            expect(await postController.findAll()).toEqual(result);
            expect(postService.findAll).toHaveBeenCalledWith(1, 10, 'date');
        });
    });

    describe('search', () => {
        it('should return matching posts', async () => {
            const query = 'Test';
            const result: SearchResponse = { message: 'Posts retrieved successfully', posts: [] };

            jest.spyOn(postService, 'search').mockResolvedValue(result);

            expect(await postController.search(query)).toEqual(result);
            expect(postService.search).toHaveBeenCalledWith(query);
        });
    });

    describe('update', () => {
        it('should update a post successfully', async () => {
            const postId = '1';
            const updatePostDto = { title: 'Updated Post' };
            const result: CreatePostResponse = {
                message: 'Post updated successfully',
                post: {
                    title: 'Updated Post',
                    content: [
                        {
                            type: 'text',
                            content: 'Updated Content',
                            caption: 'Updated Caption',
                        },
                    ],
                    author: 'test@example.com',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            };

            jest.spyOn(postService, 'update').mockResolvedValue(result);

            expect(await postController.update(postId, updatePostDto)).toEqual(result);
            expect(postService.update).toHaveBeenCalledWith(postId, updatePostDto);
        });

        it('should throw NotFoundException if post not found', async () => {
            const postId = '1';
            const updatePostDto: UpdatePostDto = { title: 'Updated Post' };
            jest.spyOn(postService, 'update').mockRejectedValue(new NotFoundException("This Post doesn't exist"));

            await expect(postController.update(postId, updatePostDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete a post successfully', async () => {
            const postId = '1';
            jest.spyOn(postService, 'delete').mockResolvedValue(true);

            expect(await postController.delete(postId)).toEqual({ message: 'Post deleted successfully' });
            expect(postService.delete).toHaveBeenCalledWith(postId);
        });

        it('should throw NotFoundException if post not found', async () => {
            const postId = '1';
            jest.spyOn(postService, 'delete').mockResolvedValue(false);

            await expect(postController.delete(postId)).rejects.toThrow(NotFoundException);
        });
    });
});
