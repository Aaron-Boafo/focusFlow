import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { db } from "../config/firebase.config";
import { JWTConfig } from "../config/jwt.config";
import { signupSchema, loginSchema } from "../utils/auth.validation";

config({ quiet: true });

export class AuthController {
  private jwtConfig: JWTConfig;

  constructor(jwtConfig: JWTConfig = new JWTConfig()) {
    this.jwtConfig = jwtConfig;
  }

  /**
   * Handles user signup.
   */
  public signup = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validate request
      const { error, value } = signupSchema.validate(req.body);
      if (error) {
        res.status(400).json({ status: "error", message: error.details[0].message });
        return;
      }

      const { email, password, displayName } = value;

      // 2. Check if user already exists
      const userRef = db.collection("users").doc(email);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        res.status(409).json({ status: "error", message: "User already exists" });
        return;
      }

      // 3. Encrypt password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. Save user to Firestore
      await userRef.set({
        email,
        password: hashedPassword,
        displayName,
        totalExp: 0,
        xpLevel: 1,
        xpTitle: "Novice Focuser",
        xpProgress: 0,
        xpToNext: 100,
        streak: 0,
        status: "Idle",
        createdAt: new Date().toISOString(),
      });

      res.status(201).json({ status: "success", message: "User registered successfully" });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };

  /**
   * Handles user login.
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validate request
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        res.status(400).json({ status: "error", message: error.details[0].message });
        return;
      }

      const { email, password } = value;

      // 2. Find user in Firestore
      const userRef = db.collection("users").doc(email);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        res.status(401).json({ status: "error", message: "Invalid email or password" });
        return;
      }

      const userData = userDoc.data();

      // 3. Verify password
      const isMatch = await bcrypt.compare(password, userData?.password);
      if (!isMatch) {
        res.status(401).json({ status: "error", message: "Invalid email or password" });
        return;
      }

      // 4. Generate Tokens
      const payload = { email: userData?.email, uid: email };
      const accessToken = this.jwtConfig.signAccessToken(payload);
      const refreshToken = this.jwtConfig.signRefreshToken(payload);

      // 5. Set Cookies
      this.setTokenCookies(res, accessToken, refreshToken);

      res.status(200).json({
        status: "success",
        message: "Login successful",
        user: {
          email: userData?.email,
          displayName: userData?.displayName,
          totalExp: userData?.totalExp || 0,
          streak: userData?.streak || 0,
          xpLevel: userData?.xpLevel || 1,
          xpTitle: userData?.xpTitle || "Novice Focuser",
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };

  /**
   * Handles token refresh.
   */
  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies["refresh_token"];

      if (!refreshToken) {
        res.status(401).json({ status: "error", message: "Refresh token missing" });
        return;
      }

      // Verify Refresh Token
      let decoded: any;
      try {
        decoded = this.jwtConfig.verifyRefreshToken(refreshToken);
      } catch (error) {
        res.status(401).json({ status: "error", message: "Invalid or expired refresh token" });
        return;
      }

      // Issue new Access Token
      const payload = { email: decoded.email, uid: decoded.uid };
      const newAccessToken = this.jwtConfig.signAccessToken(payload);

      // Set Cookie
      this.setTokenCookies(res, newAccessToken);

      res.status(200).json({
        status: "success",
        message: "Token refreshed successfully",
      });
    } catch (error) {
      console.error("Refresh error:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };

  /**
   * Fetches current user data.
   */
  public getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const userDoc = await db.collection("users").doc(user.email).get();
      if (!userDoc.exists) {
        res.status(404).json({ status: "error", message: "User not found" });
        return;
      }

      const userData = userDoc.data();
      res.status(200).json({
        status: "success",
        user: {
          email: userData?.email,
          displayName: userData?.displayName,
          createdAt: userData?.createdAt,
        },
      });
    } catch (error) {
      console.error("GetMe error:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };
  
  /**
   * Syncs user profile stats (totalExp, streak, etc.)
   */
  public syncProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const { totalExp, streak, xpLevel, xpTitle, xpProgress, xpToNext, status } = req.body;

      await db.collection("users").doc(user.email).update({
        totalExp: totalExp ?? 0,
        streak: streak ?? 0,
        xpLevel: xpLevel ?? 1,
        xpTitle: xpTitle ?? "Novice Focuser",
        xpProgress: xpProgress ?? 0,
        xpToNext: xpToNext ?? 100,
        status: status ?? "Idle",
        updatedAt: new Date().toISOString()
      });

      res.status(200).json({ status: "success", message: "Profile synced successfully" });
    } catch (error) {
      console.error("SyncProfile error:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };

  /**
   * Handles user logout.
   */
  public logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ status: "success", message: "Logged out successfully" });
  };

  /**
   * Helper to set secure HttpOnly cookies for tokens.
   */
  private setTokenCookies(res: Response, accessToken: string, refreshToken?: string): void {
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Required for sameSite: "none"
      sameSite: "none" as const,
    };

    res.cookie("access_token", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    if (refreshToken) {
      res.cookie("refresh_token", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
  }
}
