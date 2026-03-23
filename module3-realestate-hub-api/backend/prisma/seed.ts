import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import sqlite from 'better-sqlite3';
import path from 'path';

// 1. Usar una ruta absoluta ayuda a evitar problemas de resolución en Windows
const dbPath = path.resolve('prisma/dev.db');
const db = new sqlite(dbPath);
const adapter = new PrismaBetterSqlite3(db);

// 2. CAMBIO CLAVE: Pasamos el adaptador Y la URL explícitamente
// Esto evita que Prisma intente leer el .env y falle con el error .replace()
const prisma = new PrismaClient({ 
  adapter,
  datasources: {
    db: { url: 'file:./dev.db' }
  }
});

const sampleProperties = [
  // ... (tus datos aquí)
];

async function main(): Promise<void> {
  console.log('Iniciando seed de la base de datos...');
  try {
    await prisma.property.deleteMany();
    console.log('Datos anteriores eliminados');

    for (const property of sampleProperties) {
      await prisma.property.create({ data: property });
    }

    console.log(`Seed completado: ${sampleProperties.length} propiedades creadas.`);
  } catch (error) {
    console.error('Error durante la ejecución del seed:', error);
    process.exit(1);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });