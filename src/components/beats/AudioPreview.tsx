"use client";

import { useRef, useState } from "react";

export function AudioPreview({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }

  function onTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  }

  return (
    <div className="flex items-center gap-4 rounded-md border border-border bg-surface p-4">
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause preview" : "Play preview"}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white"
      >
        {playing ? "❚❚" : "►"}
      </button>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full bg-brand transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
