"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";

import { Trash } from "lucide-react";
import toast from "react-hot-toast";

// Defining prop types for ChapterAction component
interface ChapterActionProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterAction = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Handler function for publish/unpublish button click
  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success("Chapter unpublished");
        router.refresh();
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success("Chapter published");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler function for delete button click
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success("Chapter deleted");
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={onClick} disabled={disabled} variant="outline" size="sm">
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={disabled || isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterAction;
