'use client';

import React, { useRef, useEffect } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

interface VideoPlayerProps {
  videoId: string | number;
  youtubeId: string;
  startPositionSeconds: number;
  onProgress: (currentTime: number) => void;
  onCompleted: () => void;
}

export default function VideoPlayer({
  videoId,
  youtubeId,
  startPositionSeconds,
  onProgress,
  onCompleted
}: VideoPlayerProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime();
        if (time) {
          onProgress(Math.floor(time));
        }
      }
    }, 5000); // Record progress every 5 seconds
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => stopTracking();
  }, []);

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    // We only seek if there is a start position
    if (startPositionSeconds > 0) {
      event.target.seekTo(startPositionSeconds, true);
    }
  };

  const onStateChange = (event: YouTubeEvent) => {
    switch (event.data) {
      case YouTube.PlayerState.PLAYING:
        startTracking();
        break;
      case YouTube.PlayerState.PAUSED:
      case YouTube.PlayerState.BUFFERING:
        stopTracking();
        break;
      case YouTube.PlayerState.ENDED:
        stopTracking();
        onCompleted();
        break;
      default:
        break;
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      fs: 1,
    },
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-zinc-800">
      <YouTube
        videoId={youtubeId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
