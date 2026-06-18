import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USER_EMAIL = "demo@birthdayboard.local";
const DEMO_USER_PASSWORD = "DemoPass123!";

const today = new Date();
const todayBirthday = new Date(
  today.getFullYear() - 29,
  today.getMonth(),
  today.getDate()
);

const seedBirthdays = [
  {
    firstName: "Maya",
    lastName: "Goldberg",
    birthDate: todayBirthday,
  },
  {
    firstName: "Noa",
    lastName: "Cohen",
    birthDate: new Date(1994, 5, 12),
  },
  {
    firstName: "Ariel",
    lastName: "Levi",
    birthDate: new Date(1990, 8, 7),
  },
  {
    firstName: "David",
    lastName: "Ben-Ami",
    birthDate: new Date(1988, 11, 23),
  },
  {
    firstName: "Daniel",
    lastName: "Rosen",
    birthDate: new Date(1996, 1, 3),
  },
  {
    firstName: "Sarah",
    lastName: "Katz",
    birthDate: new Date(1992, 3, 18),
  },
  {
    firstName: "Michael",
    lastName: "Weiss",
    birthDate: new Date(1985, 6, 29),
  },
  {
    firstName: "Emily",
    lastName: "Stone",
    birthDate: new Date(1998, 9, 4),
  },
  {
    firstName: "Jonathan",
    lastName: "Miller",
    birthDate: new Date(1991, 2, 15),
  },
  {
    firstName: "Rachel",
    lastName: "Green",
    birthDate: new Date(1997, 7, 21),
  },
  {
    firstName: "Benjamin",
    lastName: "Adler",
    birthDate: new Date(1989, 10, 30),
  },
  {
    firstName: "Anna",
    lastName: "Brooks",
    birthDate: new Date(1995, 0, 8),
  },
  {
    firstName: "Ethan",
    lastName: "Silver",
    birthDate: new Date(1993, 4, 26),
  },
  {
    firstName: "Olivia",
    lastName: "Brown",
    birthDate: new Date(2000, 8, 11),
  },
  {
    firstName: "Adam",
    lastName: "Friedman",
    birthDate: new Date(1987, 5, 2),
  },
  {
    firstName: "Tamar",
    lastName: "Shalev",
    birthDate: new Date(1999, 11, 19),
  },
  {
    firstName: "Lior",
    lastName: "Barak",
    birthDate: new Date(1994, 10, 6),
  },
  {
    firstName: "Yael",
    lastName: "Dayan",
    birthDate: new Date(1996, 6, 13),
  },
  {
    firstName: "Oren",
    lastName: "Kaplan",
    birthDate: new Date(1990, 1, 27),
  },
  {
    firstName: "Shira",
    lastName: "Avraham",
    birthDate: new Date(1998, 3, 9),
  },
  {
    firstName: "Nathan",
    lastName: "Bloom",
    birthDate: new Date(1986, 7, 16),
  },
  {
    firstName: "Ella",
    lastName: "Reed",
    birthDate: new Date(2001, 9, 25),
  },
  {
    firstName: "Tom",
    lastName: "Harel",
    birthDate: new Date(1992, 2, 31),
  },
  {
    firstName: "Rina",
    lastName: "Mor",
    birthDate: new Date(1997, 4, 10),
  },
  {
    firstName: "Samuel",
    lastName: "King",
    birthDate: new Date(1984, 12 - 1, 1),
  },
];

async function main() {
  console.log("Running seed script...");

  const existingUser = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
  });

  if (existingUser) {
    await prisma.birthdayPerson.deleteMany({
      where: { createdById: existingUser.id },
    });
    await prisma.user.delete({
      where: { id: existingUser.id },
    });
  }

  const passwordHash = await bcrypt.hash(DEMO_USER_PASSWORD, 12);

  const user = await prisma.user.create({
    data: {
      email: DEMO_USER_EMAIL,
      passwordHash,
    },
  });

  await prisma.birthdayPerson.createMany({
    data: seedBirthdays.map((birthday) => ({
      firstName: birthday.firstName,
      lastName: birthday.lastName,
      birthDate: birthday.birthDate,
      createdById: user.id,
      updatedById: user.id,
    })),
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
