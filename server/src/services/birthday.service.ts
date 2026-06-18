import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import {
  CreateBirthdayInput,
  UpdateBirthdayInput,
} from "../validators/birthday.validator";

export const getTodayBirthdays = async () => {
  const people = await prisma.birthdayPerson.findMany({
    orderBy: [
      { lastName: "asc" },
      { firstName: "asc" },
    ],
  });

  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  return people.filter((person) => {
    const birthDate = new Date(person.birthDate);

    return (
      birthDate.getMonth() === todayMonth &&
      birthDate.getDate() === todayDay
    );
  });
};

export const getBirthdays = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [people, total] = await Promise.all([
    prisma.birthdayPerson.findMany({
      skip,
      take: limit,
      orderBy: [
        { lastName: "asc" },
        { firstName: "asc" },
      ],
    }),
    prisma.birthdayPerson.count(),
  ]);

  return {
    people,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createBirthday = async (
  data: CreateBirthdayInput,
  userId: number
) => {
  return prisma.birthdayPerson.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: new Date(data.birthDate),
      createdById: userId,
      updatedById: userId,
    },
  });
};

export const updateBirthday = async (
  id: number,
  data: UpdateBirthdayInput,
  userId: number
) => {
  const existingPerson = await prisma.birthdayPerson.findUnique({
    where: { id },
  });

  if (!existingPerson) {
    throw new AppError("Birthday person not found", 404);
  }

  return prisma.birthdayPerson.update({
    where: { id },
    data: {
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastName !== undefined && { lastName: data.lastName }),
      ...(data.birthDate !== undefined && {
        birthDate: new Date(data.birthDate),
      }),
      updatedById: userId,
    },
  });
};

export const deleteBirthday = async (id: number) => {
  const existingPerson = await prisma.birthdayPerson.findUnique({
    where: { id },
  });

  if (!existingPerson) {
    throw new AppError("Birthday person not found", 404);
  }

  await prisma.birthdayPerson.delete({
    where: { id },
  });

  return {
    message: "Birthday person deleted successfully",
  };
};