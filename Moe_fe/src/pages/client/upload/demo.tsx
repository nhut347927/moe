import React, { useRef, useState, useEffect } from "react";

export default function ThumbnailPicker() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);         // Visible video
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);   // Hidden video for thumbnail generation
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // When a videoFile is selected => load metadata and reset
  useEffect(() => {
    if (!videoFile || !hiddenVideoRef.current || !videoRef.current) return;

    const hiddenVideo = hiddenVideoRef.current;
    const visibleVideo = videoRef.current;

    const hiddenSrc = URL.createObjectURL(videoFile);
    const visibleSrc = URL.createObjectURL(videoFile);

    hiddenVideo.src = hiddenSrc;
    visibleVideo.src = visibleSrc;

    const onMetadata = () => {
      setDuration(hiddenVideo.duration);
      const middle = Math.floor(hiddenVideo.duration / 2);
      setSelectedTime(middle);
    };

    hiddenVideo.addEventListener("loadedmetadata", onMetadata);

    return () => {
      hiddenVideo.removeEventListener("loadedmetadata", onMetadata);
      URL.revokeObjectURL(hiddenSrc);
      URL.revokeObjectURL(visibleSrc);
    };
  }, [videoFile]);

  // When selectedTime changes, generate a new thumbnail using the hidden video
  useEffect(() => {
    const video = hiddenVideoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !videoFile || duration === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const generate = async () => {
      await new Promise<void>((resolve, reject) => {
        const onSeeked = () => {
          try {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setThumbnailUrl(canvas.toDataURL("image/jpeg"));
            cleanup();
            resolve();
          } catch (err) {
            console.error("Thumbnail error:", err);
            cleanup();
            reject();
          }
        };

        const onError = () => {
          console.error("Seek error");
          cleanup();
          reject();
        };

        const cleanup = () => {
          video.removeEventListener("seeked", onSeeked);
          video.removeEventListener("error", onError);
        };

        video.addEventListener("seeked", onSeeked);
        video.addEventListener("error", onError);
        video.currentTime = selectedTime;
      });
    };

    generate();
  }, [selectedTime, videoFile, duration]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setThumbnailUrl(null);
      setSelectedTime(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
        Select thumbnail from video
      </h1>

      <input type="file" accept="video/*" onChange={handleFileChange} />

      {videoFile && (
        <div className="space-y-4">
          {/* Visible video for user preview */}
          <video
            ref={videoRef}
            controls
            className="w-full rounded border"
          />

          {/* Hidden video used for thumbnail generation */}
          <video
            ref={hiddenVideoRef}
            className="hidden"
            preload="metadata"
            muted
          />

          <canvas ref={canvasRef} className="hidden" />

          <label className="block text-sm text-zinc-600 dark:text-zinc-300">
            Drag to select thumbnail time:
          </label>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={selectedTime}
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            className="w-full"
          />

          <div className="text-sm text-zinc-600 dark:text-zinc-300">
            At second: {selectedTime.toFixed(1)} / {duration.toFixed(1)} seconds
          </div>

          {thumbnailUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Selected thumbnail:
              </p>
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="w-full border rounded shadow"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
