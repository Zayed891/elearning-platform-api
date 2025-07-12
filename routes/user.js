const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const z = require("zod");
const { userModel, purchaseModel } = require("../db");
const userAuth = require("../auth/user");
const { JWT_USER_SECRET } = require("../config.js");

const userRouter = Router();

// const JWT_USER_SECRET = "cbumrulesss";

userRouter.post("/signup", async (req, res) => {
  const userSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(15),
    firstname: z.string().min(1).max(20),
    lastname: z.string().min(1).max(20),
  });

  const parsedResult = userSchema.safeParse(req.body);

  if (!parsedResult.success) {
    res.status(400).json({
      message: "Enter the correct credentials",
      errors: parsedResult.error.errors,
    });
    return;
  }

  const { email, password, firstname, lastname } = parsedResult.data;

  try {
    const alreadyExist = await userModel.findOne({ email });

    if (alreadyExist) {
      res.status(409).json({
        message: "Email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await userModel.create({
      email: email,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
    });

    res.status(201).json({
      message: "User signup Successfull",
    });
  } catch (e) {
    if (e.code === 11000) {
      console.error("Duplicate email error:", e);
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error("Unexpected error:", e);
    res.status(500).json({ message: "Internal Server error" });
  }
});

userRouter.post("/signin", async (req, res) => {
  const userSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(15),
  });

  const parsedResult = userSchema.safeParse(req.body);

  if (!parsedResult.success) {
    res.status(400).json({
      message: "Enter the correct credentials",
      error: parsedResult.error.errors,
    });
    return;
  }

  const { email, password } = parsedResult.data;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "Please sign Up",
      });
      return;
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      res.status(401).json({
        message: "Wrong credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_SECRET
    );

    res.json({
      token: token,
      message: "You have successfully signed in",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

userRouter.get("/purchases", userAuth, async (req, res) => {
  try {
    const userId = req.userId;

    const purchasedCourses = await purchaseModel
      .find({ userId: userId })
      .populate("courseId");

    res.json({
      purchasedCourses,
      message: "You bought the following courses",
    });
  } catch (e) {
    res.status(500).json({
        message : "Internal error"
    });
  }
});

module.exports = {
  userRouter: userRouter,
};
