"use client";

import { useState} from "react";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import FileUpload from "@/components/shared/FileUpload";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success(" Video Added");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="mt-8 border bg-slate-100 rounded-lg p-6 shadow-md transition duration-300 ease-in-out transform hover:scale-105">
     <div className="font-semibold flex justify-between item-center">
        <span className="text-xl text-gray-800">Video</span>
        <Button
          onClick={toggleEdit}
          className=" bg-sky-500 placeholder:transition duration-300"
        >
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-5 w-5 mr-2 inline-block" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-3">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
          <MuxPlayer 
          playbackId ={initialData?.muxData?.playbackId || ""}
          />
            </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos may take a few minutes to process. If the video does not appear, please refresh the page.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
