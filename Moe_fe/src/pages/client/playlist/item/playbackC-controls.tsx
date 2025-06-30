import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  Shuffle,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Volume1,
  Repeat1,
  Repeat,
} from "lucide-react";

// Hàm định dạng thời gian mm:ss
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};
type Props = {
  isPlaying: boolean;
  handlePlayPause: () => void;
  handleSkip: () => void;
  handleShuffle: () => void;
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  isRepeat: boolean; // Trạng thái lặp lại
  handleRepeat: () => void; // Hàm xử lý lặp lại
};

const PlaybackControls: React.FC<Props> = ({
  isPlaying,
  handlePlayPause,
  handleSkip,
  handleShuffle,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isRepeat,
  handleRepeat,
}) => {
  const [volumeVisible, setVolumeVisible] = useState(false);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 50) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  return (
    <div className="flex items-center gap-4 w-full mt-4">
      {/* Nút điều khiển phát nhạc */}
      <div className="flex items-center gap-4">
        <div
          className="h-12 w-12 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition cursor-pointer"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-zinc-800" />
          ) : (
            <Play className="h-6 w-6 text-zinc-800 ml-1" />
          )}
        </div>

        <SkipForward
          className="h-6 w-6 text-zinc-300 hover:text-white cursor-pointer transition"
          onClick={handleSkip}
        />

        {isRepeat ? (
          <Repeat1
            onClick={handleRepeat}
            className="h-6 w-6 text-zinc-300 hover:text-white cursor-pointer transition"
          />
        ) : (
          <Repeat
            onClick={handleRepeat}
            className="h-6 w-6 text-zinc-300 hover:text-white cursor-pointer transition"
          />
        )}

        <Shuffle
          className="h-6 w-6 text-zinc-300 hover:text-white cursor-pointer transition"
          onClick={handleShuffle}
        />

        <MoreHorizontal className="h-6 w-6 text-zinc-300 hover:text-white cursor-pointer transition" />
      </div>

      {/* Thanh tiến trình */}
      <div className="flex items-center gap-2 w-full">
        <span className="text-xs text-[#b3b3b3] w-10 text-right">
          {formatTime(currentTime)}
        </span>

        <div className="relative w-full group">
          <div className="h-1 bg-[#535353] rounded-full w-full">
            <div
              className="absolute h-1 bg-zinc-50 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
          />
        </div>

        <span className="text-xs text-[#b3b3b3] w-10">
          {formatTime(duration)}
        </span>
      </div>

      {/* Âm lượng */}
      <div className="relative flex items-center gap-2">
        <button
          onClick={() => setVolumeVisible(!volumeVisible)}
          className="text-zinc-300 hover:text-white transition"
        >
          {getVolumeIcon()}
        </button>
        {volumeVisible && (
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-[100px] h-1 bg-zinc-600 rounded-full cursor-pointer accent-zinc-50"
          />
        )}
      </div>
    </div>
  );
};

export default PlaybackControls;
