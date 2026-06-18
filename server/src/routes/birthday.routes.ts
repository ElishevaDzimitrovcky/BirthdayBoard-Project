import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import {
  createBirthdayController,
  deleteBirthdayController,
  getBirthdaysController,
  getTodayBirthdaysController,
  updateBirthdayController,
} from "../controllers/birthday.controller";
import {
  createBirthdaySchema,
  updateBirthdaySchema,
} from "../validators/birthday.validator";

const router = Router();

router.get("/today", requireAuth, getTodayBirthdaysController);

router.get("/", requireAuth, getBirthdaysController);

router.post(
  "/",
  requireAuth,
  validateBody(createBirthdaySchema),
  createBirthdayController
);

router.put(
  "/:id",
  requireAuth,
  validateBody(updateBirthdaySchema),
  updateBirthdayController
);

router.delete("/:id", requireAuth, deleteBirthdayController);

export default router;