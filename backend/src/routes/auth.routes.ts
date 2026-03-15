import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router: Router = Router();
const authController = new AuthController();

router.get("/me", authenticate, authController.getMe);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/sync-profile", authenticate, authController.syncProfile);

export default router;
