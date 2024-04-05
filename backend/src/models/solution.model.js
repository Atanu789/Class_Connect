import mongoose, { Schema } from "mongoose";
const solutionSchema = new Schema(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
    },
    pptUrl: [{
      type: String,
    }],
    videoUrl:[ {
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const Solution = mongoose.model("Solution", solutionSchema);
