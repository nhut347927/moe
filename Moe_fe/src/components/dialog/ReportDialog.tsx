import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import type React from "react";
import axiosInstance from "@/services/axios/AxiosInstance";
import { useToast } from "@/common/hooks/use-toast";

interface ReportDialogProps {
  postCode: string;
  trigger?: React.ReactNode;
}

export default function ReportDialog({ postCode, trigger }: ReportDialogProps) {
  const [report, setReport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const submitReport = async () => {
    try {
      const response = await axiosInstance.post("reports", {
        code: postCode,
        content: report,
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to submit report");
    }
  };

  const handleSubmit = async () => {
    if (!report.trim()) {
      setError("Please enter the report content");
      return;
    }

    if (report.length > 500) {
      setError("Report content cannot exceed 500 characters");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await submitReport();
      setReport("");
      setOpen(false);

      toast({
        title: "Success",
        description: "Your report has been sent successfully!",
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (err) {
      setError("An error occurred while sending the report. Please try again.");
      toast({
        title: "Error",
        description: "Unable to send report. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-600 hover:bg-red-700 transition-colors"
          >
            Report
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-w-[90vw] !rounded-3xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Report Post
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            Please describe in detail the reason for reporting. We will review
            your report as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="relative">
            <Textarea
              placeholder="Describe the reason for reporting..."
              className="min-h-[120px] resize-none border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              maxLength={500}
            />
            <span className="absolute bottom-2 right-2 text-xs text-zinc-500 dark:text-zinc-400">
              {report.length}/500
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-2 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-zinc-900 hover:bg-zinc-700 text-white dark:bg-zinc-100 dark:hover:bg-zinc-300 dark:text-zinc-900 transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              "Send Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
