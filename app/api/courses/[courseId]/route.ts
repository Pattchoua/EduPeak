import Mux from "@mux/mux-node";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

// Function to handle DELETE request to delete a course
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
    };
  }
) {
  try {
    // Authenticate user
    const { userId } = auth();
    if (!userId || isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Verify user is the owner of the course
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course to be deleted
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 401 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    // Delete the course from the database
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    // Return the deleted chapter data as JSON
    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Function to handle PATCH request to update  a course
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId || isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const uptdatedcourse = await db.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(uptdatedcourse);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
