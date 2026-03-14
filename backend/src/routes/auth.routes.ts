import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/me", authenticate, AuthController.getMe);
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;
