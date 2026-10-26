import { Router } from "express";
import {
  createTask,
  deleteTask,
  getStats,
  getTask,
  listTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = Router();

router.get("/stats", getStats);

router.route("/").get(listTasks).post(createTask);

router.patch("/:id/status", updateTaskStatus);

router
  .route("/:id")
  .get(getTask)
  .put(updateTask)
  .patch(updateTask)
  .delete(deleteTask);

export default router;
