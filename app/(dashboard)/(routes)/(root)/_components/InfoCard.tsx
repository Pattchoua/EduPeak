import { IconBadge } from "@/components/shared/IconBadges";
import { LucideIcon } from "lucide-react";



interface InfoCardProps{
   numberOfItems:number;
   variant?: "default" | "sucess";
   label: string;
   icon: LucideIcon; 
}

const InfoCard = ({variant, icon:Icon, label, numberOfItems}:InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
     <IconBadge
     variant ={variant}
     icon={Icon}
     />
     <div>
        <p className="font-medium">
            {label}
        </p>
        <p className="text-gray-500 text-sm">
            {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
     </div>
    </div>
  )
}

export default InfoCard
