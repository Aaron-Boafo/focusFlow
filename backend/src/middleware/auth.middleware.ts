import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { JWTConfig } from "../config/jwt.config";

config({ quiet: true });
const jwtConfig = new JWTConfig();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["access_token"];

  if (!token) {
    res.status(401).json({ status: "error", message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwtConfig.verifyAccessToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ status: "error", message: "Unauthorized: Invalid or expired token" });
  }
};
