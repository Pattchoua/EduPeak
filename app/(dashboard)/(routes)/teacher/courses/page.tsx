import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/columns";

const CoursePage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }


  const courses = await db.course.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursePage;
