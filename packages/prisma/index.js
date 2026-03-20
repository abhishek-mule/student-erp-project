const prismaClient = require('@prisma/client');
const { PrismaClient } = prismaClient;

let prismaInstance;

module.exports = { 
  ...prismaClient,
  get prisma() {
    if (!prismaInstance) {
      prismaInstance = new PrismaClient();
    }
    return prismaInstance;
  }
};
