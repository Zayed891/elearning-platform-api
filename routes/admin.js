const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const z = require("zod");
const { adminModel, courseModel } = require("../db");
const adminAuth = require("../auth/admin");
const { JWT_ADMIN_SECRET } = require("../config.js");

const adminRouter = Router();

// const JWT_ADMIN_SECRET = "Zyzzrules";

adminRouter.post("/signup", async (req, res) => {
  const adminSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(15),
    firstname: z.string().min(1).max(20),
    lastname: z.string().min(1).max(20),
  });

  const parsedResult = adminSchema.safeParse(req.body);

  if (!parsedResult.success) {
    res.status(400).json({
      message: "Enter the correct credentials",
      errors: parsedResult.error.errors,
    });
    return;
  }

  const { email, password, firstname, lastname } = parsedResult.data;

  try {
    const alreadyExist = await adminModel.findOne({ email });

    if (alreadyExist) {
      res.status(409).json({
        message: "Email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await adminModel.create({
      email: email,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
    });

    res.status(201).json({
      message: "Admin Created Successfully",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

adminRouter.post("/signin", async (req, res) => {
  const requiredBody = z.object({
    email: z.email(),
    password: z.string().min(6).max(15),
  });

  const parsedResult = requiredBody.safeParse(req.body);

  if (!parsedResult.success) {
    res.status(400).json({
      message: "Enter the correct credentials",
      error: parsedResult.error.errors,
    });
    return;
  }

  const { email, password } = parsedResult.data;

  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      res.status(401).json({
        message: "Please sign Up",
      });
      return;
    }

    const result = await bcrypt.compare(password, admin.password);

    if (!result) {
      res.status(401).json({
        message: "Wrong credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_SECRET
    );

    // if you want to do cookie based authentication then do it here. for future references.

    res.json({
      token: token,
      message: "You have successfully signed in",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

adminRouter.post("/course", adminAuth, async (req, res) => {
  const courseSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    price: z.number().positive(),
    imageUrl: z.string(),
  });

  const parsedResult = courseSchema.safeParse(req.body);

  if (!parsedResult.success) {
    res.status(400).json({
      message: "Enter the correct content",
      error: parsedResult.error.errors,
    });
    return;
  }

  const adminId = req.adminId;

  const { title, description, price, imageUrl } = parsedResult.data;

  try {
    const newCourse = await courseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creatorId: adminId,
    });

    res.json({
      courseId: newCourse._id,
      message: "Course Created Successfully",
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

adminRouter.put("/course/:courseId", adminAuth, async (req, res) => {
  const courseId = req.params.courseId;
  const adminId = req.adminId;

  const courseSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    price: z.number().positive(),
    imageUrl: z.string(),
  });

  const parsedResult = courseSchema.safeParse(req.body);

  if (!parsedResult.success) {
    res.status(400).json({
      message: "Enter the correct content",
      error: parsedResult.error.errors,
    });
    return;
  }

  const { title, description, price, imageUrl } = parsedResult.data;

  try {
    const updatedCourse = await courseModel.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        message:
          "Course not found or you don't have permission to update this course",
      });
    }

    res.json({
      updatedCourse,
      message: "You course is successfully updated",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

adminRouter.get("/course/bulk", adminAuth, async (req, res) => {
  try {
    const adminId = req.adminId;

    const courses = await courseModel.find({
      creatorId: adminId,
    });

    res.json({
      courses,
      message: "These are the courses below",
    });
  } catch (e) {
    res.status(500).json({
      message : "Internal Server Error"
    })
  }
});

module.exports = {
  adminRouter: adminRouter,
};
