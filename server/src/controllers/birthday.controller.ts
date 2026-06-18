import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { paginationSchema } from "../validators/birthday.validator";
import {
  createBirthday,
  deleteBirthday,
  getBirthdays,
  getTodayBirthdays,
  updateBirthday,
} from "../services/birthday.service";

export const getTodayBirthdaysController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const people = await getTodayBirthdays();

    res.json({
      people,
    });
  } catch (error) {
    next(error);
  }
};

export const getBirthdaysController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = paginationSchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid pagination parameters",
      });
    }

    const { page, limit } = parsed.data;

    const result = await getBirthdays(page, limit);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createBirthdayController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    const person = await createBirthday(req.body, userId);

    res.status(201).json({
      message: "Birthday person created successfully",
      person,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBirthdayController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid birthday person id",
      });
    }

    const person = await updateBirthday(id, req.body, userId);

    res.json({
      message: "Birthday person updated successfully",
      person,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBirthdayController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid birthday person id",
      });
    }

    const result = await deleteBirthday(id);

    res.json(result);
  } catch (error) {
    next(error);
  }
};