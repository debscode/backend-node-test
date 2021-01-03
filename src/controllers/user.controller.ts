import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { validate } from "class-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";

/**
 * Get all users
 * @param req Request
 * @param res Response
 */
export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  const data = await getRepository(User).find();
  if (data.length) {
    return res.json({
      status: "success",
      data
    });
  } else {
    return res.status(404).json({
      status: "error",
      message: "Users not found"
    });
  }
};

/**
 * Get user by id
 * @param req Request
 * @param res Response
 */
export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = await getRepository(User).findOne(req.params.id);
  if (data) {
    return res.json({
      status: "success",
      data,
    });
  } else {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }
};

/**
 * Create a user
 * @param req Request
 * @param res Response
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let user = new User();
  getRepository(User).merge(user, req.body);
  validate(user).then((errors) => {
    if (errors.length > 0) {
      console.log("validation failed. errors: ", errors);
      return res.status(400).json({
        status: "error",
        message: `${errors}`,
      });
    }
  });
  let data;
  try {
    const newProduct = getRepository(User).create(req.body);
    data = await getRepository(User).save(newProduct);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error,
    });
  }

  return res.status(201).json({
    status: "success",
    data,
  });
};

/**
 * Update a user
 * @param req Request
 * @param res Response
 */
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const user = await getRepository(User).findOne(req.params.id);
  if (user) {
    try {
      validate(user).then((errors) => {
        if (errors.length > 0) {
          return res.status(400).json({
            status: "error",
            message: `${errors}`,
          });
        }
      });
      getRepository(User).merge(user, req.body);
      const data = await getRepository(User).save(user);
      return res.json({
        status: "success",
        data,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: `${error}`,
      });
    }
  }
  return res.status(404).json({
    status: "error",
    message: "User not found",
  });
};

/**
 * Delete a user
 * @param req Request
 * @param res Response
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userRepository = getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail(req.params.id);
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }
  const data = userRepository.delete(req.params.id);
  return res.json({
    status: "success",
    data,
  });
};

/**
 * Login a user with token
 * @param req Request
 * @param res Response
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  const userRepository = getRepository(User);
  let user: User;
  let { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({
      status: "error",
      message: "Email and Pasword are required",
    });
  }

  try {
    user = await userRepository.findOneOrFail({ where: { email } });
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Incorrect email or password",
    });
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return res.status(401).json({
      status: "error",
      message: "Incorrect email or password",
    });
  }

  let token = jwt.sign(
    {
      user,
    },
    config.jwtSecret,
    { expiresIn: "3d" }
  );

  const data = {
    user,
    token,
  };
  return res.json({
    status: "success",
    data,
  });
};
