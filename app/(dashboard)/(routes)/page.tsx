import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className=" flex justify-between w-full ">
      <h1 className="flex display-center items-center gap-5">
        Welcome to the Homepage
      </h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
