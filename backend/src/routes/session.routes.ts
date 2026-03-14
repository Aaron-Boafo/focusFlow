import { Router } from "express";
import { SessionController } from "../controllers/session.controller";
import { authenticate } from "../middleware/auth.middleware";

const router: Router = Router();

// All session routes require authentication
router.use(authenticate);

router.get("/", (req, res) => SessionController.getSessions(req, res));
router.post("/", (req, res) => SessionController.createSession(req, res));
router.put("/:id", (req, res) => SessionController.updateSession(req, res));
router.delete("/:id", (req, res) => SessionController.deleteSession(req, res));
router.post("/sync", (req, res) => SessionController.syncSessions(req, res));

export default router;
