import {Injectable, Inject, NotFoundException} from '@nestjs/common';
import {POST_REPOSITORY} from '../../../constants';
import { SortOrder } from 'mongoose';
import {BlogPostModel} from "../../core/database/entities/post.entity";
import {CreatePostDto} from "./dto/post.dto";
import {User} from "../users/types/user.types";
import {CreatePostResponse, PaginatedPostsResponse, SearchResponse} from "./types/post.types";
import {UpdatePostDto} from "./dto/updatePost.dto";
@Injectable()
export class PostService {
    constructor(
        @Inject(POST_REPOSITORY) private readonly postRepository: typeof BlogPostModel
        ,
    ) {}

    async create(createPostDto: CreatePostDto, user: User) : Promise<CreatePostResponse> {
        const newPost = new BlogPostModel({...createPostDto, author: user.email});
        await newPost.save();
        return { message: 'Post created successfully', post: newPost };
    }

    async findOne(id: string): Promise<CreatePostResponse> {
        const foundPost = await this.postRepository.findOne({ _id: id });

        if (!foundPost) {
            throw new NotFoundException('Post not found');
        }

        return { message: 'Post retrieved successfully', post: foundPost };
    }

    async findAll(page: number, limit: number,sort: 'date' | 'title' = 'date') : Promise<PaginatedPostsResponse>{
        const query = {};
        const skip = (page - 1) * limit;
        const sortOptions: { [key: string]: SortOrder } = sort === 'date' ? { createdAt: -1 } : { title: 1 };

        const [posts, totalPosts] = await Promise.all([
            this.postRepository.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.postRepository.countDocuments(query).exec(),
        ]);

        return {
            message: 'Posts retrieved successfully',
            posts,
            total: totalPosts,
            page,
            limit,
            totalPages: Math.ceil(totalPosts / limit),
        };
    }

    async search(query: string): Promise<SearchResponse> {
        const regex = new RegExp(query, 'i'); // 'i' for case-insensitive search
        const posts = await this.postRepository.find({
            $or: [
                { title: { $regex: regex } },
                { 'content.content': { $regex: regex } }
            ]
        });

        return {
            message: 'Posts retrieved successfully',
            posts,
        };
    }

    async update(id: string, updatePostDto: UpdatePostDto): Promise<CreatePostResponse> {
        const updatedPost = await this.postRepository.findByIdAndUpdate(id, updatePostDto, {
            new: true, // Return the updated document
            runValidators: true, // Validate the update against the schema
        });

        if (!updatedPost) {
            throw new NotFoundException("This Post doesn't exist");
        }

        return {
            message: 'Post updated successfully',
            post: updatedPost,
        };
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.postRepository.findByIdAndDelete(id);
        return result !== null;
    }
}
