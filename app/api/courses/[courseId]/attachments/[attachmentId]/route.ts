import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId || isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deleteAttachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    return NextResponse.json(deleteAttachment);
  } catch (error) {
    console.log("[ATTACHMENTS_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
