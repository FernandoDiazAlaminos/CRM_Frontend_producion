export default {
  apps: [
    {
      name: "client",
      script: "npm",
      args: "run start",
      instances: "max",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
