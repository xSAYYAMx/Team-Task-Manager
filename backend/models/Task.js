import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Completed", "Pending", "In Review", "Overdue"],
      default: "Pending"
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium"
    },
    dueDate: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
