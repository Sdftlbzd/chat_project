import { Router } from "express";
import { authRoutes } from "../Core/api/Auth/auth.route"; 

export const v1Routes = Router();

v1Routes.use("/auth", authRoutes);
