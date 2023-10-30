import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { getProgress } from "./getProgress";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId: string;
};

// Function to get courses based on user ID, title, and category ID.
export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculating progress for each course.
    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }
          const progressPercentage = await getProgress(userId, course.id);
          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
