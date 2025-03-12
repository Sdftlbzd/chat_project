import { Request } from "express";
import { ImageModel } from "../DAL/models/Image.model";
import { User } from "../DAL/models/User.model";

export interface IUser extends User {
  id: number;
  name: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
  img?: IImage;
  //    pagination
}
