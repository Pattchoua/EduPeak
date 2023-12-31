import { getAnalytics } from "@/actions/getAnalytics";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import DataCard from "./_components/DataCard";
import Chart from "./_components/Chart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | EduPeak",
}

const AnalyticsPage = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="grid groid-cols-1 md:grid-cols-2 gap-4 mb-4">

      <DataCard
        label="Total Revenues"
        value={totalRevenue}
        shouldFormat
         />

        <DataCard
        label="Total Sales"
        value={totalSales}
         />
      </div>
      <Chart
      data={data}/>
    </div>
  );
};

export default AnalyticsPage;
