"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
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
import { Chapter, Course } from "@prisma/client";
import { Editor } from "@/components/shared/editor";
import { Preview } from "@/components/shared/preview";

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

const ChapterDescriptionForm = ({ initialData, courseId, chapterId }: ChapterDescriptionFormProps) => {
  const editorRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  //Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter Updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="mt-8 border bg-slate-100 rounded-lg p-6 shadow-md transition duration-300 ease-in-out transform hover:scale-105">
      <div className="font-semibold flex justify-between item-center">
        <span className="text-xl text-gray-800">Description</span>
        <Button
          onClick={toggleEdit}
          className=" bg-sky-500 placeholder:transition duration-300"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-5 w-5 mr-2 inline-block" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {!initialData.description && "No description"}
          {initialData.description && (
            <Preview
            value={initialData.description} />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
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

export default ChapterDescriptionForm;
