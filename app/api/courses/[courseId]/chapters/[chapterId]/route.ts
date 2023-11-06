import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_SECRET_KEY!
);

// Function to handle DELETE request to remove a chapter from a course
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      chapterId: string;
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

    // Find the chapter to be deleted
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 401 });
    }
    // If chapter has a video, delete the video asset and its reference in the database
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: { id: existingMuxData.id },
        });
      }
    }
// Delete the chapter from the database
    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });
// Check if there are no more published chapters in the course, 
//if so, update course status to unpublished
    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
// Return the deleted chapter data as JSON
    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}



// Function to handle PATCH request to update a chapter in a course
export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      chapterId: string;
    };
  }
) {
  try {
    // Authenticate user
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
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

    // Update chapter data in the database
    const updatedchapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });
 // If a new video URL is provided, 
 //delete the old video asset, create a new asset, and update its reference in the database
    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: { id: existingMuxData.id },
        });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }
// Return the updated chapter data as JSON
    return NextResponse.json(updatedchapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
