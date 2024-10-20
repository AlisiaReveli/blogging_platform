import { Module } from '@nestjs/common';
import {PostService} from "./posts.service";
import {postProviders} from "./posts.provider";
import {PostController} from "./post.controller";

@Module({
    providers: [PostService, ...postProviders],
    controllers: [ PostController],
})
export class PostsModule {}
