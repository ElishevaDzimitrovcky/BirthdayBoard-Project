import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoUserEmail = "demo@birthdayboard.local";
const demoUserPassword = "DemoPass123!";

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDay = today.getDate();

const demoBirthdays = [
  {
    firstName: "Alex",
    lastName: "Garcia",
    birthDate: new Date(currentYear - 28, currentMonth, currentDay),
  },
  {
    firstName: "Bella",
    lastName: "Nguyen",
    birthDate: new Date(currentYear - 34, currentMonth, currentDay + 2),
  },
  {
    firstName: "Connor",
    lastName: "Smith",
    birthDate: new Date(currentYear - 22, currentMonth + 1, 15),
  },
  {
    firstName: "Diana",
    lastName: "Patel",
    birthDate: new Date(currentYear - 40, currentMonth - 1, 5),
  },
  {
    firstName: "Evan",
    lastName: "Kim",
    birthDate: new Date(currentYear - 31, currentMonth + 2, 19),
  },
];

async function main() {
  console.log("Running seed script...");

  await prisma.birthdayPerson.deleteMany({});
  await prisma.user.deleteMany({ where: { email: demoUserEmail } });

  const passwordHash = await bcrypt.hash(demoUserPassword, 10);

  const demoUser = await prisma.user.create({
    data: {
      email: demoUserEmail,
      passwordHash,
    },
  });

  await Promise.all(
    demoBirthdays.map((birthday) =>
      prisma.birthdayPerson.create({
        data: {
          firstName: birthday.firstName,
          lastName: birthday.lastName,
          birthDate: birthday.birthDate,
          createdById: demoUser.id,
          updatedById: demoUser.id,
        },
      })
    )
  );

  console.log("Seed complete.");
  console.log(`Demo user: ${demoUserEmail}`);
  console.log(`Demo password: ${demoUserPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
