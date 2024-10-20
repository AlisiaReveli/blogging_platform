import {BlogPostModel} from "../../core/database/entities/post.entity";
import {POST_REPOSITORY} from "../../../constants";

export const postProviders = [
    {
        provide: POST_REPOSITORY,
        useValue: BlogPostModel,
    },
];