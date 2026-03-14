import * as jwt from "jsonwebtoken";
import { config } from "dotenv";

config({ quiet: true });

export class JWTConfig {
  private ACCESS_SECRET: string;
  private REFRESH_SECRET: string;
  private ACCESS_EXPIRY: string;
  private REFRESH_EXPIRY: string;

  constructor() {
    this.ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
    this.REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
    this.ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY!;
    this.REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY!;
  }

  /**
   * Signs a new Access Token.
   */
  public signAccessToken(payload: object): string {
    return jwt.sign(payload, this.ACCESS_SECRET, {
      expiresIn: this.ACCESS_EXPIRY as any,
    });
  }

  /**
   * Signs a new Refresh Token.
   */
  public signRefreshToken(payload: object): string {
    return jwt.sign(payload, this.REFRESH_SECRET, {
      expiresIn: this.REFRESH_EXPIRY as any,
    });
  }

  /**
   * Verifies an Access Token.
   */
  public verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.ACCESS_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired access token");
    }
  }

  /**
   * Verifies a Refresh Token.
   */
  public verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.REFRESH_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }
}
