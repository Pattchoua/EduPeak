"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

const CategoryForm = ({ initialData, courseId, options }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  //Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course Updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const selectedOption = options.find((option) => option.value === initialData.categoryId)

  return (
    <div className="mt-8 border bg-slate-100 rounded-lg p-6 shadow-md transition duration-300 ease-in-out transform hover:scale-105">
      <div className="font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <span className="text-xl text-gray-800">Course Category</span>
        <Button
          onClick={toggleEdit}
          className=" bg-sky-500 placeholder:transition duration-300"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-5 w-5 mr-2 inline-block" />
              Edit Category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || "No category"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox 
                    options={...options}
                    {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CategoryForm;
