// Stub Prisma Client - Build workaround for 403 Forbidden on Prisma binaries
// This stub allows TypeScript compilation without downloading Prisma engines
// In production, Vercel will generate the real Prisma Client with binaries

// Helper to create mock model with CRUD methods
function createMockModel() {
  return {
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    createMany: () => Promise.resolve({ count: 0 }),
    update: () => Promise.resolve({}),
    updateMany: () => Promise.resolve({ count: 0 }),
    upsert: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    deleteMany: () => Promise.resolve({ count: 0 }),
    count: () => Promise.resolve(0),
    aggregate: () => Promise.resolve({}),
    groupBy: () => Promise.resolve([]),
  };
}

class PrismaClient {
  constructor(options) {
    this.options = options;

    // Mock all models with CRUD methods (from schema.prisma)
    this.account = createMockModel();
    this.session = createMockModel();
    this.verificationToken = createMockModel();
    this.user = createMockModel();
    this.article = createMockModel();
    this.resource = createMockModel();
    this.cryptocurrency = createMockModel();
    this.copilotActivity = createMockModel();
    this.automationTask = createMockModel();
    this.copilotReport = createMockModel();
    this.communityStory = createMockModel();
    this.socialProject = createMockModel();
    this.projectMap = createMockModel();
    this.userProgress = createMockModel();

    // Mock methods
    this.$connect = () => Promise.resolve();
    this.$disconnect = () => Promise.resolve();
    this.$transaction = (fn) => fn(this);
    this.$executeRaw = () => Promise.resolve(0);
    this.$queryRaw = () => Promise.resolve([]);
  }
}

// Mock Prisma namespace
const Prisma = {
  PrismaClientKnownRequestError: class extends Error {},
  PrismaClientUnknownRequestError: class extends Error {},
  PrismaClientRustPanicError: class extends Error {},
  PrismaClientInitializationError: class extends Error {},
  PrismaClientValidationError: class extends Error {},
};

module.exports = {
  PrismaClient,
  Prisma
};
module.exports.PrismaClient = PrismaClient;
module.exports.Prisma = Prisma;
