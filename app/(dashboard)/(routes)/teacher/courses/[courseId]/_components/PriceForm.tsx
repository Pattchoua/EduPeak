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
import { Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const editorRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  //Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
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

  return (
    <div className="mt-8 border bg-slate-100 rounded-lg p-6 shadow-md transition duration-300 ease-in-out transform hover:scale-105">
      <div className="font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <span className="text-xl text-gray-800">Course Price</span>
        <Button
          onClick={toggleEdit}
          className=" bg-sky-500 placeholder:transition duration-300"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-5 w-5 mr-2 inline-block" />
              Edit Price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.price && "text-slate-500 italic"
          )}
        >
          {initialData.price
          ? formatPrice(initialData.price) : "No price"}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="border rounded-md p-2 w-full transition duration-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                      disabled={isSubmitting}
                      placeholder="Add a price for your course"
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

export default PriceForm;
