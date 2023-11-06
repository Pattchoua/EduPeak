import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCourses } from "@/actions/getCourses";


import Categories from "./_components/Categories";
import SearchInput from "@/components/shared/SearchInput";
import CoursesList from "@/components/shared/CoursesList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses | EduPeak",
}


interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
}

const SearchPage = async ({searchParams}: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

const courses = await getCourses({
  userId,
  ...searchParams
})


  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-6">
        <Categories items={categories} />
        <CoursesList items={courses}/>
      </div>
    </>
  );
};

export default SearchPage;
