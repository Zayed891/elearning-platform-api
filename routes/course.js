const { Router } = require("express");
const { userModel, courseModel, purchaseModel } = require("../db");
const userAuth = require("../auth/user");
const courseRouter = Router();

courseRouter.post("/purchase/:courseId", userAuth, async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.userId;

  if (!courseId) {
    return res.status(400).json({
      message: "Wrong courseId",
    });
  }
  try {
    const alreadyExist = await purchaseModel.findOne({ courseId, userId });

    if (alreadyExist) {
      return res.status(400).json({
        message: "You already bought the course",
      });
    }

    const purchasedCourse = await purchaseModel.create({
      courseId,
      userId,
    });

    const populatedPurchase = await purchaseModel
      .findById(purchasedCourse._id)
      .populate("courseId");

    res.json({
      populatedPurchase,
      message: "You have successfully purchased the course",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Error",
    });
  }
});

courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await courseModel.find({});

    res.json({
      courses,
      message: "Available courses",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Server error",
    });
  }
});

module.exports = {
  courseRouter: courseRouter,
};
