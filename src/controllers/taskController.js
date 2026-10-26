import Task, { TASK_PRIORITIES, TASK_STATUS } from "../models/Task.js";

const ALLOWED_FIELDS = ["title", "description", "status", "priority", "dueDate"];

const SORTS = {
  recent: { createdAt: -1 },
  oldest: { createdAt: 1 },
  due: { dueDate: 1, createdAt: -1 },
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const pickFields = (body = {}) =>
  Object.fromEntries(
    Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key))
  );

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

const mapCounts = (rows, keys) =>
  Object.fromEntries(
    keys.map((key) => [key, rows.find((row) => row._id === key)?.count ?? 0])
  );

export async function listTasks(req, res, next) {
  try {
    const { status, priority, search, sort = "recent" } = req.query;

    if (status && !TASK_STATUS.includes(status)) {
      return res.status(400).json({
        error: "Status inválido.",
        allowed: TASK_STATUS,
      });
    }

    if (priority && !TASK_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        error: "Prioridade inválida.",
        allowed: TASK_PRIORITIES,
      });
    }

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    if (search && String(search).trim()) {
      const term = escapeRegex(String(search).trim().slice(0, 80));
      filters.$or = [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
      ];
    }

    const page = parsePositiveInt(req.query.page, 1);
    const limit = Math.min(100, parsePositiveInt(req.query.limit, 10));
    const sortOption = SORTS[sort] ?? SORTS.recent;

    const [tasks, total] = await Promise.all([
      Task.find(filters)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit),
      Task.countDocuments(filters),
    ]);

    res.json({
      data: tasks,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }
    res.json({ data: task });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const task = await Task.create(pickFields(req.body));
    res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const updates = pickFields(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "Nenhum campo válido para atualizar.",
        allowed: ALLOWED_FIELDS,
      });
    }

    if ("status" in updates) {
      updates.completedAt = updates.status === "concluida" ? new Date() : null;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    res.json({ data: task });
  } catch (error) {
    next(error);
  }
}

export async function updateTaskStatus(req, res, next) {
  try {
    const { status } = req.body ?? {};

    if (!status) {
      return res.status(400).json({
        error: "Informe o status desejado.",
        allowed: TASK_STATUS,
      });
    }

    if (typeof status !== "string" || !TASK_STATUS.includes(status)) {
      return res.status(400).json({
        error: "Status inválido.",
        allowed: TASK_STATUS,
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    // O hook pre("save") do model ajusta o completedAt conforme o status.
    task.status = status;
    await task.save();

    res.json({ data: task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getStats(_req, res, next) {
  try {
    const now = new Date();

    const [total, byStatusRows, byPriorityRows, overdue, completed] = await Promise.all([
      Task.countDocuments(),
      Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
      Task.countDocuments({
        status: { $ne: "concluida" },
        dueDate: { $ne: null, $lt: now },
      }),
      Task.countDocuments({ status: "concluida" }),
    ]);

    res.json({
      data: {
        total,
        overdue,
        completed,
        completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
        byStatus: mapCounts(byStatusRows, TASK_STATUS),
        byPriority: mapCounts(byPriorityRows, TASK_PRIORITIES),
      },
    });
  } catch (error) {
    next(error);
  }
}
