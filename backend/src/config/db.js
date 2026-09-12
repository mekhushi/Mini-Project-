import { PrismaClient } from '@prisma/client';
import { fallbackDb } from './fallbackDb.js';

let isPrismaActive = false;
const prismaClient = new PrismaClient({
  log: ['error'],
});

// Test connection on boot
(async () => {
  try {
    await prismaClient.$connect();
    isPrismaActive = true;
    console.log("Connected to MongoDB via Prisma ORM");
  } catch (err) {
    console.warn("[Database Mode] Remote MongoDB unreachable (DNS/Offline). Operating on high-speed resilient local JSON engine.");
    isPrismaActive = false;
  }
})();

// Create dynamic proxy so every controller calling prisma.<model> works transparently
const dbProxy = new Proxy(prismaClient, {
  get(target, prop) {
    if (isPrismaActive) {
      return target[prop];
    }
    // If fallbackDb has this model repository, return it
    if (prop in fallbackDb) {
      return fallbackDb[prop];
    }
    return target[prop];
  }
});

export default dbProxy;

