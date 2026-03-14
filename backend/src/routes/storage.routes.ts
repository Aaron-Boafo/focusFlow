import { Router } from "express";
import { StorageController } from "../controllers/storage.controller";
import { authenticate } from "../middleware/auth.middleware";

const router: Router = Router();

// All storage routes require authentication
router.use(authenticate);

router.get("/:key", (req, res) => StorageController.getData(req, res));
router.post("/:key", (req, res) => StorageController.saveData(req, res));
router.delete("/:key", (req, res) => StorageController.deleteData(req, res));

export default router;
