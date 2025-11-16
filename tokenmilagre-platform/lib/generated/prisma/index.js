// Stub Prisma Client - Build workaround
// Real client will be generated in production environment

const { PrismaClient: BasePrismaClient } = require('@prisma/client');

class PrismaClient extends BasePrismaClient {
  constructor(options) {
    super(options);
  }
}

module.exports = {
  PrismaClient,
  Prisma: {}
};
module.exports.PrismaClient = PrismaClient;
