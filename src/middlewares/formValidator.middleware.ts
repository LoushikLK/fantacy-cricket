import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export async function InputValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Check for validation errors
    const errors = validationResult(req).formatWith(({ msg }) => `${msg}`);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ msg: errors.array().join(" and "), success: false });
    }
    next();
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Validation Failed Server Error", success: false });
  }
}
