export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "API de Tarefas",
    version: "1.0.0",
    description:
      "API REST para gerenciamento de tarefas com Node.js, Express e MongoDB. " +
      "Inclui CRUD, validação, filtros, busca, paginação e estatísticas.",
    contact: {
      name: "Leonardo Carrilho",
      url: "https://leonardocarrilho.github.io/",
    },
  },
  servers: [
    {
      url: "/",
      description: "Servidor atual",
    },
  ],
  tags: [
    { name: "Tarefas", description: "Operações de tarefas" },
    { name: "Sistema", description: "Saúde e documentação" },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Sistema"],
        summary: "Verifica a saúde da API",
        responses: {
          200: {
            description: "API disponível",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Health" },
              },
            },
          },
        },
      },
    },
    "/api/tasks": {
      get: {
        tags: ["Tarefas"],
        summary: "Lista tarefas com filtros e paginação",
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { $ref: "#/components/schemas/TaskStatus" },
          },
          {
            name: "priority",
            in: "query",
            schema: { $ref: "#/components/schemas/TaskPriority" },
          },
          {
            name: "search",
            in: "query",
            description: "Busca por título ou descrição",
            schema: { type: "string", maxLength: 80 },
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["recent", "oldest", "due"],
              default: "recent",
            },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: "Lista paginada de tarefas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TaskList" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
      post: {
        tags: ["Tarefas"],
        summary: "Cria uma tarefa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Tarefa criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TaskResponse" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/tasks/stats": {
      get: {
        tags: ["Tarefas"],
        summary: "Retorna estatísticas das tarefas",
        responses: {
          200: {
            description: "Estatísticas gerais",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StatsResponse" },
              },
            },
          },
        },
      },
    },
    "/api/tasks/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID da tarefa",
        },
      ],
      get: {
        tags: ["Tarefas"],
        summary: "Busca uma tarefa por ID",
        responses: {
          200: {
            description: "Tarefa encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TaskResponse" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Tarefas"],
        summary: "Substitui os campos enviados de uma tarefa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskUpdate" },
            },
          },
        },
        responses: {
          200: {
            description: "Tarefa atualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TaskResponse" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      patch: {
        tags: ["Tarefas"],
        summary: "Atualiza parcialmente uma tarefa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskUpdate" },
            },
          },
        },
        responses: {
          200: {
            description: "Tarefa atualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TaskResponse" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Tarefas"],
        summary: "Remove uma tarefa",
        responses: {
          204: { description: "Tarefa removida" },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
  components: {
    schemas: {
      TaskStatus: {
        type: "string",
        enum: ["pendente", "em_andamento", "concluida"],
      },
      TaskPriority: {
        type: "string",
        enum: ["baixa", "media", "alta"],
      },
      TaskInput: {
        type: "object",
        required: ["title"],
        properties: {
          title: {
            type: "string",
            minLength: 3,
            maxLength: 120,
            example: "Estudar testes automatizados",
          },
          description: {
            type: "string",
            maxLength: 500,
            example: "Cobrir os endpoints principais com Supertest.",
          },
          status: { $ref: "#/components/schemas/TaskStatus" },
          priority: { $ref: "#/components/schemas/TaskPriority" },
          dueDate: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: "2026-11-05T18:00:00.000Z",
          },
        },
      },
      TaskUpdate: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 3, maxLength: 120 },
          description: { type: "string", maxLength: 500 },
          status: { $ref: "#/components/schemas/TaskStatus" },
          priority: { $ref: "#/components/schemas/TaskPriority" },
          dueDate: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
        },
      },
      Task: {
        allOf: [
          { $ref: "#/components/schemas/TaskInput" },
          {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "6712a8f5c9d4b2a1e3f45678",
              },
              completedAt: {
                type: "string",
                format: "date-time",
                nullable: true,
                example: null,
              },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2026-10-22T18:00:00.000Z",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                example: "2026-10-22T18:00:00.000Z",
              },
            },
          },
        ],
      },
      TaskResponse: {
        type: "object",
        properties: {
          data: { $ref: "#/components/schemas/Task" },
        },
      },
      TaskList: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Task" },
          },
          meta: {
            type: "object",
            properties: {
              total: { type: "integer", example: 12 },
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 10 },
              pages: { type: "integer", example: 2 },
            },
          },
        },
      },
      StatsResponse: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              total: { type: "integer", example: 12 },
              overdue: { type: "integer", example: 2 },
              completed: { type: "integer", example: 7 },
              completionRate: { type: "integer", example: 58 },
              byStatus: {
                type: "object",
                properties: {
                  pendente: { type: "integer", example: 3 },
                  em_andamento: { type: "integer", example: 2 },
                  concluida: { type: "integer", example: 7 },
                },
              },
              byPriority: {
                type: "object",
                properties: {
                  baixa: { type: "integer", example: 2 },
                  media: { type: "integer", example: 6 },
                  alta: { type: "integer", example: 4 },
                },
              },
            },
          },
        },
      },
      Health: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
          database: { type: "string", example: "conectado" },
          uptime: { type: "integer", example: 128 },
          timestamp: {
            type: "string",
            format: "date-time",
            example: "2026-10-22T18:00:00.000Z",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Tarefa não encontrada." },
          details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "title" },
                message: {
                  type: "string",
                  example: "O título deve ter pelo menos 3 caracteres.",
                },
              },
            },
          },
        },
      },
    },
    responses: {
      BadRequest: {
        description: "Requisição inválida",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      NotFound: {
        description: "Recurso não encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
    },
  },
};
