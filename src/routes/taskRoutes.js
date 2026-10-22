import { Router } from "express";
import {
  createTask,
  deleteTask,
  getStats,
  getTask,
  listTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = Router();

router.get("/stats", getStats);

router.route("/").get(listTasks).post(createTask);

router
  .route("/:id")
  .get(getTask)
  .put(updateTask)
  .patch(updateTask)
  .delete(deleteTask);

export default router;
