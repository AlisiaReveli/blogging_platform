import {Types} from "mongoose";


export interface User {
    name: string;
    email: string;
    password: string;
    gender: 'male' | 'female';
    _id: Types.ObjectId;
}



