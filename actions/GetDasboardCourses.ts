import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./getProgress";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DasboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

// Function to get courses based on user ID, title, and category ID.
export const getDasboardCourses = async (
  userId: string
): Promise<DasboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map(
      (purchase) => purchase.course
    ) as CourseWithProgressWithCategory[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }
    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0 ) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
