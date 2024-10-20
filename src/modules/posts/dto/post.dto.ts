import { IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class ContentDto {
    @ApiProperty({description:'Type can be a text, image, video etc',default: 'text'})
    @IsNotEmpty()
    @IsString()
    type: string; // e.g., 'text', 'image', 'video'

    @IsNotEmpty()
    content: any;

    @ApiProperty({description:'Optional caption for images/videos'})
    @IsOptional()
    @IsString()
    caption?: string;
}

export class CreatePostDto {
    @ApiProperty({
        description: 'The title of the post.',
        example: 'Understanding NestJS '
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'An array of content items for the post. Each item should adhere to the ContentDto structure.',
        example: ' [\n' +
            '        {\n' +
            '            "type": "text",\n' +
            '            "content": "Content body",\n' +
            '            "caption": "test caption"\n' +
            '        }\n' +
            '    ]',
        type: [ContentDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContentDto)
    content: ContentDto[];


    @ApiProperty()
    @IsOptional()
    createdAt?: Date;
}
