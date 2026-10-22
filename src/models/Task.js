import mongoose from "mongoose";

export const TASK_STATUS = ["pendente", "em_andamento", "concluida"];
export const TASK_PRIORITIES = ["baixa", "media", "alta"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "O título é obrigatório."],
      trim: true,
      minlength: [3, "O título deve ter pelo menos 3 caracteres."],
      maxlength: [120, "O título deve ter no máximo 120 caracteres."],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "A descrição deve ter no máximo 500 caracteres."],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: TASK_STATUS,
        message: "Status inválido. Use: pendente, em_andamento ou concluida.",
      },
      default: "pendente",
    },
    priority: {
      type: String,
      enum: {
        values: TASK_PRIORITIES,
        message: "Prioridade inválida. Use: baixa, media ou alta.",
      },
      default: "media",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

taskSchema.index({ status: 1, createdAt: -1 });

// Mantém completedAt coerente quando o status muda via .save()
taskSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.completedAt = this.status === "concluida" ? new Date() : null;
  }
  next();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
