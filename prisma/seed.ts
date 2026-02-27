import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const centerId1 = uuidv4();
  const centerId2 = uuidv4();

  await prisma.sportsCenter.createMany({
    data: [
      { id: centerId1, name: 'Центр Олимп' },
      { id: centerId2, name: 'Центр Динамо' },
    ],
  });

  const program1 = await prisma.sportsCenterProgram.create({
    data: { id: uuidv4(), sportsCenterId: centerId1, sportType: 'Футбол', capacity: 20 },
  });

  const program2 = await prisma.sportsCenterProgram.create({
    data: { id: uuidv4(), sportsCenterId: centerId2, sportType: 'Баскетбол', capacity: 20 },
  });

  const athlete1 = await prisma.athleteProfile.create({
    data: { id: uuidv4(), iin: '010101000001' },
  });

  const athlete2 = await prisma.athleteProfile.create({
    data: { id: uuidv4(), iin: '020202000002' },
  });

  await prisma.enrollment.createMany({
    data: [
      { id: uuidv4(), athleteProfileId: athlete1.id, sportsCenterId: centerId1, programId: program1.id, status: 'APPROVED' },
      { id: uuidv4(), athleteProfileId: athlete2.id, sportsCenterId: centerId1, programId: program1.id, status: 'APPROVED' },
    ],
  });

  const appeal = await prisma.appeal.create({
    data: {
      id: uuidv4(),
      category: 'CHANGE_PROVIDER',
      status: 'OPEN',
      message: `Email ваучера: parent@example.com
ID текущего поставщика: ${centerId1}
ID желаемого поставщика: ${centerId2}
Текущий вид спорта: Футбол
Желаемый вид спорта: Баскетбол`,
      children: {
        create: [
          { id: uuidv4(), childIin: athlete1.iin, childName: 'Алибек Сейткали' },
          { id: uuidv4(), childIin: athlete2.iin, childName: 'Дана Ахметова' },
        ],
      },
    },
  });

  console.log('✅ Seed complete!');
  console.log('Appeal ID:', appeal.id);
  console.log('Current center ID:', centerId1);
  console.log('Target center ID:', centerId2);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
