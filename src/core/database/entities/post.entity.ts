import { Schema, model } from 'mongoose';

const blogPostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: Schema.Types.Mixed,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const BlogPostModel = model('BlogPost', blogPostSchema);
