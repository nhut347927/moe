import React from "react";

const PlaylistInfo: React.FC = () => (
  <div className="space-y-3">
    <span className="text-xs uppercase tracking-wider text-zinc-300">
      Public Playlist
    </span>
    <h1 className="text-4xl font-bold leading-tight">Summer Vibes 2023</h1>
    <p className="text-sm text-zinc-300 leading-relaxed max-w-md">
      The perfect playlist for those sunny days and warm nights. Featuring the
      hottest tracks that will keep your summer vibes going all season long.
    </p>
  </div>
);

export default PlaylistInfo;