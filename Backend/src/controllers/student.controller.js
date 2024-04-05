import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/student.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await Student.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
const registerStudent = asyncHandler(async (req, res) => {
  const { fullName, email, username, password, studentId, instituteName } =
    req.body;

  if (
    [fullName, email, username, password, studentId].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedStudent = await Student.findOne({
    $or: [{ username }, { email }, { studentId }],
  });
  if (existedStudent) {
    throw new ApiError(409, "Student with email,username or ID already exists");
  }

  // const studentAvatarLocalPath = req.files?.avatar[0]?.path;

  // if (!studentAvatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required");
  // }
  // const studentAvatar = await uploadOnCloudinary(studentAvatarLocalPath);

  // if (!studentAvatar) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  


  const studentUser = await Student.create({
    fullName,
    // studentAvatar: studentAvatar.url,
    email,
    password,
    username: username,
    studentId,
    instituteName,
  });

  const createdStudentUser = await Student.findById(studentUser._id).select(
    "-password -refreshToken"
  );
  if (!createdStudentUser) {
    throw new ApiError(400, "Error while registering Student in database");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, studentUser, "Student registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log(req.body);
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await Student.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "Student does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid student credentials");
  }
  console.log(user._id);
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await Student.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
    })
    .cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
    })
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Student logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await Student.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Student logged out successfully"));
});
const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await Student.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user, "User found successfully"));
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
  }
};
export { registerStudent, loginUser, logoutUser,findUser };
