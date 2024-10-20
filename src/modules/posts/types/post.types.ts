
export interface ContentResponseDto {
    type: string;
    content: string;
    caption?: string;
}

export interface PostResponseDto {
    title: string;
    content: ContentResponseDto[];
    author: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePostResponse {
    message: string;
    post: PostResponseDto;
}

export interface SearchResponse {
    message: string;
    posts: PostResponseDto[];
}

export interface PaginatedPostsResponse {
    message: string;
    posts: PostResponseDto[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}
