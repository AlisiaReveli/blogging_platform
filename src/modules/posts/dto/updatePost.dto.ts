import { IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {ContentDto} from "./post.dto";
import {ApiProperty} from "@nestjs/swagger";

export class UpdatePostDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    title?: string;

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
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContentDto)
    content?: ContentDto[];

}
