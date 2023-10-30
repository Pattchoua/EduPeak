"use client";

import { Category } from "@prisma/client";
import {
  FcBusinessman,
  FcGraduationCap,
  FcElectronics,
  FcSportsMode,
  FcPositiveDynamic,
  FcGlobe,
  FcLibrary,
  FcLike,
  FcGallery,
} from "react-icons/fc";

import { IconType } from "react-icons";
import CategoryItem from "./CategoryItem";


interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Professional Development": FcBusinessman,
  "Academic Subjects": FcGraduationCap,
  "Technology and Computer Science": FcElectronics,
  "Creative Arts": FcGallery,
  "Health and Wellness": FcLike,
  "Hobbies and Lifestyle": FcSportsMode,
  "Certification Preparation": FcLibrary,
  "Personal Development": FcPositiveDynamic,
  "Language Learning": FcGlobe,
};

const Categories = ({ items }: CategoriesProps) => {
  

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
