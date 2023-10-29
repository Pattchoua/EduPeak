"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  //Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
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

  return (
    <div className="mt-8 border bg-slate-100 rounded-lg p-6 shadow-md transition duration-300 ease-in-out transform hover:scale-105">
      <div className="font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <span className="text-xl text-gray-800">Course Title</span>
        <Button
          onClick={toggleEdit}
          className=" bg-sky-500 placeholder:transition duration-300"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-5 w-5 mr-2 inline-block" />
              Edit Title
            </>
          )}
        </Button>
      </div>
     
        {!isEditing && (
          <p className="text-sm text-gray-600 mt-3">{initialData.title}</p>
        )}
        {isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="border rounded-md p-2 w-full transition duration-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                        disabled={isSubmitting}
                        placeholder="Add title.."
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

export default TitleForm;
