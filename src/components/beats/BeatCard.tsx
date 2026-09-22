"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCents } from "@/lib/money";

export type BeatCardData = {
  slug: string;
  title: string;
  bpm: number;
  genre: string;
  coverArtUrl: string;
  previewAudioUrl: string;
  fromPriceCents: number;
};

export function BeatCard({ beat }: { beat: BeatCardData }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

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

  return (
    <div className="group rounded-lg border border-border bg-surface p-3 transition-colors hover:border-foreground/30">
      <div className="relative aspect-square overflow-hidden rounded-md">
        <Image
          src={beat.coverArtUrl}
          alt={beat.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform hover:scale-105"
        >
          {playing ? "❚❚" : "►"}
        </button>
        <audio
          ref={audioRef}
          src={beat.previewAudioUrl}
          onEnded={() => setPlaying(false)}
        />
      </div>

      <Link href={`/beats/${beat.slug}`} className="mt-3 block">
        <p className="font-display truncate text-base font-semibold uppercase">
          {beat.title}
        </p>
        <p className="text-xs text-muted">
          {beat.genre} · {beat.bpm} BPM
        </p>
        <p className="mt-2 text-sm font-medium text-brand">
          From {formatCents(beat.fromPriceCents)}
        </p>
      </Link>
    </div>
  );
}
