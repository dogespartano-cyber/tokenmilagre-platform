import { PrismaClient } from '../lib/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Criar usuário ADMIN
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tokenmilagre.xyz' },
    update: {},
    create: {
      email: 'admin@tokenmilagre.xyz',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin criado:', admin.email);

  // Criar usuário EDITOR
  const editorPassword = await bcrypt.hash('editor123', 10);

  const editor = await prisma.user.upsert({
    where: { email: 'editor@tokenmilagre.xyz' },
    update: {},
    create: {
      email: 'editor@tokenmilagre.xyz',
      password: editorPassword,
      name: 'Editor',
      role: 'EDITOR'
    }
  });

  console.log('✅ Editor criado:', editor.email);

  console.log('\n📝 Credenciais de acesso:');
  console.log('Admin:');
  console.log('  Email: admin@tokenmilagre.xyz');
  console.log('  Senha: admin123');
  console.log('\nEditor:');
  console.log('  Email: editor@tokenmilagre.xyz');
  console.log('  Senha: editor123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
