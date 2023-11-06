import { getDasboardCourses } from "@/actions/GetDasboardCourses";
import CoursesList from "@/components/shared/CoursesList";
import { auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "./_components/InfoCard";


export default async function Dasboard() {

  const {userId} = auth()

  if(!userId) {
    return redirect("/")
  }

  const {completedCourses, coursesInProgress} = await getDasboardCourses(userId)
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InfoCard
      icon={Clock}
      label="In Progress"
      numberOfItems={coursesInProgress.length}
      />
       <InfoCard
      icon={CheckCircle}
      label="Completed"
      numberOfItems={completedCourses.length}
      variant="sucess"
      />
      </div>
   <CoursesList
   items={[...coursesInProgress, ...completedCourses]}
   />
    </div>
  );
}
