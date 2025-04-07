import { getDevelopmentMode } from './api';

const fakeStats = {
  totalPosts: 120,
  totalUsers: 450,
  totalCategories: 10,
  trends: [
    { date: "Ene", posts: 10, users: 40 },
    { date: "Feb", posts: 15, users: 45 },
    { date: "Mar", posts: 20, users: 50 },
    { date: "Abr", posts: 25, users: 55 },
    { date: "May", posts: 30, users: 60 },
  ],
};

const fakePosts = [
  { id: 1, title: "Nuevo lanzamiento de producto", date: "2024-06-01" },
  { id: 2, title: "Actualización de la plataforma", date: "2024-05-20" },
  { id: 3, title: "Nuevas funciones agregadas", date: "2024-05-15" },
];

const fakeUsers = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com" },
  { id: 2, name: "María López", email: "maria@example.com" },
  { id: 3, name: "Carlos Gómez", email: "carlos@example.com" },
];

export const fetchDashboardStats = async (websiteId) => {
  // Usamos la función getDevelopmentMode() para determinar el modo
  if (getDevelopmentMode()) {
    // En modo desarrollo, filtrar datos de ejemplo si hay websiteId
    if (websiteId) {
      // Aquí podríamos filtrar los datos de ejemplo si fuera necesario
      // Por ahora, simplemente devolvemos los mismos datos
    }
    return Promise.resolve(fakeStats);
  }

  const response = await fetch("https://dev.agencia.dimap.es/api/cms/stats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener estadísticas del dashboard");
  }

  return response.json();
};

export const fetchLatestPosts = async (websiteId) => {
  // Usamos la función getDevelopmentMode() para determinar el modo
  if (getDevelopmentMode()) {
    // En modo desarrollo, filtrar datos de ejemplo si hay websiteId
    if (websiteId) {
      // Aquí podríamos filtrar los datos de ejemplo si fuera necesario
      // Por ahora, simplemente devolvemos los mismos datos
    }
    return Promise.resolve(fakePosts);
  }

  const response = await fetch("https://dev.agencia.dimap.es/api/cms/posts/latest", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener últimos posts");
  }

  return response.json();
};

export const fetchLatestUsers = async (websiteId) => {
  // Usamos la función getDevelopmentMode() para determinar el modo
  if (getDevelopmentMode()) {
    // En modo desarrollo, filtrar datos de ejemplo si hay websiteId
    if (websiteId) {
      // Aquí podríamos filtrar los datos de ejemplo si fuera necesario
      // Por ahora, simplemente devolvemos los mismos datos
    }
    return Promise.resolve(fakeUsers);
  }

  const response = await fetch("https://dev.agencia.dimap.es/api/cms/users/latest", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener últimos usuarios");
  }

  return response.json();
};
