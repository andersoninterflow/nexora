import { PrismaClient, Role } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@nexora.local'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'admin123'

  const passwordHash = await argon2.hash(password)

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: Role.ADMIN },
    create: { email, name: 'Admin', passwordHash, role: Role.ADMIN }
  })

  console.log(`✅ Seed OK: ${email} / ${password}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
