import { ApiProperty } from '@nestjs/swagger';
import {Types} from "mongoose";

export class TokenDto {
    @ApiProperty({ description: 'The email address of the user' })
    email: string;

    @ApiProperty({ description: 'The user _idr' })
    _id: Types.ObjectId;
}
