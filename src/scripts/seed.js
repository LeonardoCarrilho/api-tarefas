import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import Task from "../models/Task.js";

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const tasks = [
  {
    title: "Revisar portfólio",
    description: "Ajustar textos, links e projetos em destaque.",
    status: "em_andamento",
    priority: "alta",
    dueDate: daysFromNow(-1),
  },
  {
    title: "Estudar autenticação JWT",
    description: "Implementar login e rotas protegidas em um projeto de testes.",
    status: "pendente",
    priority: "alta",
    dueDate: daysFromNow(5),
  },
  {
    title: "Publicar dashboard no GitHub",
    description: "Subir o projeto dashboard-vendas e configurar o deploy na Vercel.",
    status: "pendente",
    priority: "media",
    dueDate: daysFromNow(3),
  },
  {
    title: "Atualizar o LinkedIn",
    description: "Adicionar os novos projetos e a descrição de tecnologias.",
    status: "concluida",
    priority: "media",
    dueDate: daysFromNow(-2),
    completedAt: daysFromNow(-1),
  },
  {
    title: "Escrever README da API",
    description: "Documentar endpoints, exemplos de requisição e variáveis de ambiente.",
    status: "concluida",
    priority: "alta",
    dueDate: daysFromNow(-1),
    completedAt: daysFromNow(-1),
  },
  {
    title: "Organizar estudos da semana",
    description: "Separar dois blocos de estudo para React e um para banco de dados.",
    status: "pendente",
    priority: "baixa",
    dueDate: daysFromNow(7),
  },
  {
    title: "Revisar pull request",
    description: "Dar feedback no PR de componentização do time.",
    status: "em_andamento",
    priority: "media",
    dueDate: daysFromNow(1),
  },
  {
    title: "Configurar MongoDB Atlas",
    description: "Criar cluster gratuito e conectar a API de tarefas.",
    status: "pendente",
    priority: "media",
    dueDate: daysFromNow(4),
  },
];

async function seed() {
  try {
    await connectDatabase();
    await Task.deleteMany({});
    const created = await Task.insertMany(tasks);
    console.log(`${created.length} tarefas inseridas com sucesso.`);
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Erro ao popular o banco:", error.message);
    await disconnectDatabase();
    process.exit(1);
  }
}

seed();
