"use client";

import * as React from "react";
import {
  Play,
  Pause,
  Search,
  Check,
  Volume2,
  ZoomIn,
  ZoomOut,
  GripVertical,
  RotateCcw,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const audioFiles = [
  { id: 1, name: "Upbeat Corporate", duration: "2:30", selected: false },
  { id: 2, name: "Calm Piano", duration: "3:45", selected: false },
  { id: 3, name: "Electronic Beat", duration: "2:15", selected: true },
  { id: 4, name: "Acoustic Guitar", duration: "4:20", selected: false },
  { id: 5, name: "Ambient Sounds", duration: "5:00", selected: false },
  { id: 6, name: "Jazz Saxophone", duration: "3:30", selected: false },
];

interface TrackSegment {
  id: string;
  start: number;
  end: number;
  type: "video" | "audio";
  name: string;
  children?: React.ReactNode;
}

interface VideoAudioEditDialogProps {
  children?: React.ReactNode;
}

export default function VideoAudioEditDialog({
  children,
}: VideoAudioEditDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [totalTime] = React.useState(93); // 1:33 in seconds
  const [originalVolume, setOriginalVolume] = React.useState([75]);
  const [backgroundVolume, setBackgroundVolume] = React.useState([50]);
  const [selectedAudio, setSelectedAudio] = React.useState(3);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [timelineZoom, setTimelineZoom] = React.useState(1);
  const [timelineScroll, setTimelineScroll] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState<string | null>(null);
  const [dragType, setDragType] = React.useState<
    "move" | "resize-left" | "resize-right" | "playhead" | null
  >(null);

  const [videoSegments, setVideoSegments] = React.useState<TrackSegment[]>([
    { id: "video-1", start: 0, end: 93, type: "video", name: "Main Video" },
  ]);

  const [audioSegments, setAudioSegments] = React.useState<TrackSegment[]>([
    {
      id: "audio-1",
      start: 10,
      end: 70,
      type: "audio",
      name: "Electronic Beat",
    },
  ]);

  const timelineRef = React.useRef<HTMLDivElement>(null);
  const timelineContainerRef = React.useRef<HTMLDivElement>(null);

  const filteredAudio = audioFiles.filter((audio) =>
    audio.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAudioSelect = (audioId: number) => {
    setSelectedAudio(audioId);
  };

  const selectedAudioFile = audioFiles.find(
    (audio) => audio.id === selectedAudio
  );

  const getTimeFromPosition = (clientX: number) => {
    if (!timelineRef.current) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left + timelineScroll;
    const percentage = relativeX / (rect.width * timelineZoom);
    return Math.max(0, Math.min(totalTime, percentage * totalTime));
  };

  const getPositionFromTime = (time: number) => {
    return (time / totalTime) * 100;
  };

  // Zoom functionality with Ctrl + Mouse Wheel
  React.useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const container = timelineContainerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseTimePosition =
          (mouseX + timelineScroll) / (rect.width * timelineZoom);

        const zoomDelta = e.deltaY > 0 ? -0.2 : 0.2;
        const newZoom = Math.max(0.5, Math.min(10, timelineZoom + zoomDelta));

        if (newZoom !== timelineZoom) {
          setTimelineZoom(newZoom);

          // Adjust scroll to keep mouse position centered
          const newScrollPosition =
            mouseTimePosition * rect.width * newZoom - mouseX;
          setTimelineScroll(Math.max(0, newScrollPosition));
        }
      }
    };

    const container = timelineContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [timelineZoom, timelineScroll]);

  // Handle horizontal scrolling when zoomed
  const handleTimelineScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setTimelineScroll(e.currentTarget.scrollLeft);
  };

  const handlePlayheadDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging("playhead");
    setDragType("playhead");

    const handleMouseMove = (e: MouseEvent) => {
      const newTime = getTimeFromPosition(e.clientX);
      setCurrentTime(newTime);
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      setDragType(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleSegmentDrag =
    (
      segmentId: string,
      type: "video" | "audio",
      dragType: "move" | "resize-left" | "resize-right"
    ) =>
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(segmentId);
      setDragType(dragType);

      const segments = type === "video" ? videoSegments : audioSegments;
      const setSegments =
        type === "video" ? setVideoSegments : setAudioSegments;
      const segment = segments.find((s) => s.id === segmentId);
      if (!segment) return;

      const startTime = getTimeFromPosition(e.clientX);
      const initialStart = segment.start;
      const initialEnd = segment.end;

      const handleMouseMove = (e: MouseEvent) => {
        const currentTimePos = getTimeFromPosition(e.clientX);
        const deltaTime = currentTimePos - startTime;

        setSegments((prev) =>
          prev.map((s) => {
            if (s.id !== segmentId) return s;

            if (dragType === "move") {
              const duration = initialEnd - initialStart;
              const newStart = Math.max(
                0,
                Math.min(totalTime - duration, initialStart + deltaTime)
              );
              return { ...s, start: newStart, end: newStart + duration };
            } else if (dragType === "resize-left") {
              const newStart = Math.max(
                0,
                Math.min(initialEnd - 1, initialStart + deltaTime)
              );
              return { ...s, start: newStart };
            } else if (dragType === "resize-right") {
              const newEnd = Math.max(
                initialStart + 1,
                Math.min(totalTime, initialEnd + deltaTime)
              );
              return { ...s, end: newEnd };
            }
            return s;
          })
        );
      };

      const handleMouseUp = () => {
        setIsDragging(null);
        setDragType(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    const newTime = getTimeFromPosition(e.clientX);
    setCurrentTime(newTime);
  };

  const resetZoom = () => {
    setTimelineZoom(1);
    setTimelineScroll(0);
  };

  const zoomIn = () => {
    setTimelineZoom(Math.min(10, timelineZoom + 0.5));
  };

  const zoomOut = () => {
    setTimelineZoom(Math.max(0.5, timelineZoom - 0.5));
  };

  // Auto-scroll to keep playhead visible
  React.useEffect(() => {
    if (!timelineContainerRef.current) return;

    const container = timelineContainerRef.current;
    const rect = container.getBoundingClientRect();
    const playheadPosition =
      (getPositionFromTime(currentTime) * rect.width * timelineZoom) / 100;

    if (playheadPosition < timelineScroll) {
      setTimelineScroll(Math.max(0, playheadPosition - 50));
    } else if (playheadPosition > timelineScroll + rect.width) {
      setTimelineScroll(playheadPosition - rect.width + 50);
    }
  }, [currentTime, timelineZoom]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < totalTime) {
      interval = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 1, totalTime));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalTime]);

  // Generate time markers based on zoom level
  const getTimeMarkerInterval = () => {
    if (timelineZoom >= 5) return 1; // Every second
    if (timelineZoom >= 2) return 5; // Every 5 seconds
    return 10; // Every 10 seconds
  };

  const timeMarkerInterval = getTimeMarkerInterval();
  const timeMarkers = Array.from(
    { length: Math.ceil(totalTime / timeMarkerInterval) + 1 },
    (_, i) => i * timeMarkerInterval
  ).filter((time) => time <= totalTime);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full bg-zinc-900 hover:bg-zinc-700">
            Chỉnh sửa video
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0 bg-background">
          <DialogTitle className="text-xl font-semibold">
            Edit Video
          </DialogTitle>
        </DialogHeader>

        {/* Top Section - Video Preview and Audio Controls */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left Column - Audio Control Panel */}
          <div className="w-[30%] border-r bg-slate-50/50 dark:bg-slate-900/50 p-4 flex flex-col gap-4">
            {/* Audio Search */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                Audio Library
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search audio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 rounded-lg"
                />
              </div>
            </div>

            {/* Audio List */}
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {filteredAudio.map((audio) => (
                  <div
                    key={audio.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border bg-background hover:bg-muted/50 transition-colors shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {audio.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {audio.duration}
                      </div>
                    </div>
                    {selectedAudio === audio.id ? (
                      <Badge variant="default" className="gap-1 rounded-lg">
                        <Check className="w-3 h-3" />
                        Selected
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAudioSelect(audio.id)}
                        className="rounded-lg"
                      >
                        Use
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Volume Controls - Horizontal Layout */}
            <div className="space-y-3 pt-2 border-t">
              {/* Original Video Volume */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Video Volume
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {originalVolume[0]}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Slider
                    value={originalVolume}
                    onValueChange={setOriginalVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Background Audio Volume */}
              {selectedAudioFile && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Audio Volume
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {backgroundVolume[0]}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <Slider
                      value={backgroundVolume}
                      onValueChange={setBackgroundVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Video Preview */}
          <div className="w-[70%] p-6 flex flex-col">
            {/* Video Preview */}
            <div className="flex-1 flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-lg">
              <div className="relative w-full max-w-5xl aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  poster="/placeholder.svg?height=360&width=640"
                >
                  <source src="/placeholder-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-16 h-16 rounded-full shadow-lg hover:scale-105 transition-transform"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Timeline */}
        <div
          className="border-t bg-slate-50/50 dark:bg-slate-900/50 p-4 flex-shrink-0"
          style={{ height: "200px" }}
        >
          <div className="h-full flex flex-col gap-3">
            {/* Timeline Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">
                Timeline
              </h3>
              <div className="flex items-center gap-4">
                {/* Playback Controls - More Compact */}
                <div className="flex items-center gap-2 bg-background rounded-lg px-2.5 py-1 shadow-sm border">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handlePlayPause}
                    className="h-7 w-7 p-0 rounded-md"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                  </Button>
                  <div className="text-xs font-mono text-slate-600 dark:text-slate-400 px-1">
                    {formatTime(Math.round(currentTime))} /{" "}
                    {formatTime(totalTime)}
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-background rounded-lg px-2 py-1 shadow-sm border">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={zoomOut}
                    className="h-7 w-7 p-0 rounded-md"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={resetZoom}
                    className="h-7 w-7 p-0 rounded-md"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-xs text-muted-foreground min-w-[35px] text-center px-1">
                    {Math.round(timelineZoom * 100)}%
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={zoomIn}
                    className="h-7 w-7 p-0 rounded-md"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Zoom Hint */}
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                  💡 Ctrl + Wheel
                </span>
              </div>
            </div>

            {/* Timeline Container - Hidden Scrollbar */}
            <div className="flex-1">
              <div
                ref={timelineContainerRef}
                className="relative h-full bg-background rounded-xl overflow-x-auto overflow-y-hidden shadow-sm border scrollbar-hide"
                onScroll={handleTimelineScroll}
                style={{
                  cursor: isDragging ? "grabbing" : "default",
                  scrollbarWidth: "none" /* Firefox */,
                  msOverflowStyle: "none" /* IE and Edge */,
                }}
              >
                <style>{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div
                  ref={timelineRef}
                  className="relative h-full p-3 select-none"
                  style={{
                    width: `${100 * timelineZoom}%`,
                    minWidth: "100%",
                  }}
                  onClick={handleTimelineClick}
                >
                  {/* Time markers */}
                  <div className="absolute top-0 left-0 right-0 h-5 pointer-events-none px-3">
                    {timeMarkers.map((time) => (
                      <div
                        key={time}
                        className="absolute text-xs text-muted-foreground border-l border-muted-foreground/20 pl-1.5 whitespace-nowrap"
                        style={{ left: `${getPositionFromTime(time)}%` }}
                      >
                        {formatTime(time)}
                      </div>
                    ))}
                  </div>

                  {/* Track Labels */}
                  <div className="absolute left-0 top-5 w-16 pointer-events-none">
                    <div className="h-10 flex items-center mb-2">
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                        Video
                      </span>
                    </div>
                    <div className="h-10 flex items-center">
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                        Audio
                      </span>
                    </div>
                  </div>

                  {/* Video track */}
                  <div className="absolute top-5 left-16 right-0 h-10">
                    {videoSegments.map((segment) => (
                      <div
                        key={segment.id}
                        className={`absolute h-full bg-blue-500/20 border-2 border-blue-500/60 rounded-lg group cursor-move transition-all ${
                          isDragging === segment.id
                            ? "ring-2 ring-blue-400 shadow-lg scale-105"
                            : "hover:bg-blue-500/30 hover:border-blue-500"
                        }`}
                        style={{
                          left: `${getPositionFromTime(segment.start)}%`,
                          width: `${getPositionFromTime(
                            segment.end - segment.start
                          )}%`,
                        }}
                        onMouseDown={handleSegmentDrag(
                          segment.id,
                          "video",
                          "move"
                        )}
                      >
                        {/* Left resize handle */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600 cursor-w-resize opacity-0 group-hover:opacity-100 transition-opacity rounded-l-lg"
                          onMouseDown={handleSegmentDrag(
                            segment.id,
                            "video",
                            "resize-left"
                          )}
                        />

                        {/* Content */}
                        <div className="flex items-center justify-center h-full px-2">
                          <GripVertical className="w-3 h-3 text-blue-700 dark:text-blue-300 mr-1" />
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300 truncate">
                            {segment.name}
                          </span>
                        </div>

                        {/* Right resize handle */}
                        <div
                          className="absolute right-0 top-0 bottom-0 w-2 bg-blue-600 cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity rounded-r-lg"
                          onMouseDown={handleSegmentDrag(
                            segment.id,
                            "video",
                            "resize-right"
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Audio track */}
                  <div
                    className="absolute left-16 right-0 h-10"
                    style={{ top: "68px" }}
                  >
                    {audioSegments.map((segment) => (
                      <div
                        key={segment.id}
                        className={`absolute h-full bg-green-500/20 border-2 border-green-500/60 rounded-lg group cursor-move transition-all ${
                          isDragging === segment.id
                            ? "ring-2 ring-green-400 shadow-lg scale-105"
                            : "hover:bg-green-500/30 hover:border-green-500"
                        }`}
                        style={{
                          left: `${getPositionFromTime(segment.start)}%`,
                          width: `${getPositionFromTime(
                            segment.end - segment.start
                          )}%`,
                        }}
                        onMouseDown={handleSegmentDrag(
                          segment.id,
                          "audio",
                          "move"
                        )}
                      >
                        {/* Left resize handle */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-2 bg-green-600 cursor-w-resize opacity-0 group-hover:opacity-100 transition-opacity rounded-l-lg"
                          onMouseDown={handleSegmentDrag(
                            segment.id,
                            "audio",
                            "resize-left"
                          )}
                        />

                        {/* Content */}
                        <div className="flex items-center justify-center h-full px-2">
                          <GripVertical className="w-3 h-3 text-green-700 dark:text-green-300 mr-1" />
                          <span className="text-xs font-medium text-green-700 dark:text-green-300 truncate">
                            {segment.name}
                          </span>
                        </div>

                        {/* Right resize handle */}
                        <div
                          className="absolute right-0 top-0 bottom-0 w-2 bg-green-600 cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity rounded-r-lg"
                          onMouseDown={handleSegmentDrag(
                            segment.id,
                            "audio",
                            "resize-right"
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Playhead */}
                  <div
                    className={`absolute top-5 bottom-0 w-0.5 bg-red-500 z-20 cursor-grab ${
                      isDragging === "playhead" ? "cursor-grabbing" : ""
                    }`}
                    style={{
                      left: `calc(64px + ${getPositionFromTime(currentTime)}%)`,
                    }}
                    onMouseDown={handlePlayheadDrag}
                  >
                    <div className="absolute -top-0.5 -left-2 w-5 h-4 bg-red-500 rounded-md cursor-grab flex items-center justify-center shadow-sm">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex justify-end gap-3 p-4 border-t bg-background flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} className="rounded-lg">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
