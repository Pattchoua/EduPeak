"use client";

import { useState } from "react";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import FileUpload from "@/components/shared/FileUpload";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { classNames } from "uploadthing/client";

interface AttachmentsFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const AttachmentsForm = ({ initialData, courseId }: AttachmentsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingAttachment, setDeletingAttachment] = useState<string | null>(
    null
  );

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course Updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const onDelete = async (id: string) => {
    try {
        setDeletingAttachment(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setDeletingAttachment(null);
    }
  };

  return (
    <div className="mt-8 border bg-slate-100 rounded-lg p-6 shadow-md transition duration-300 ease-in-out transform hover:scale-105">
      <div className="font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <span className="text-xl text-gray-800">Course attachments</span>
        <Button
          onClick={toggleEdit}
          className=" bg-sky-500 placeholder:transition duration-300"
        >
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}

          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100
             border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingAttachment === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingAttachment !== attachment.id && (
                    <button 
                    onClick={() => onDelete(attachment.id)}
                    className="ml-auto hover:opacity-75 transition">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentsForm;
