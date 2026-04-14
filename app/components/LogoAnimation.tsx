"use client";

import { useEffect, useState } from "react";

const TOTAL_DURATION_MS = 100_000;

type LogoAnimationProps = {
    frames: string[];
};

export function LogoAnimation({ frames }: LogoAnimationProps) {
    const [frameIndex, setFrameIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const currentFrameIndex = Math.min(frameIndex, Math.max(frames.length - 1, 0));

    useEffect(() => {
        if (frames.length <= 1 || isPaused) {
            return;
        }

        const frameDurationMs = Math.max(1, Math.floor(TOTAL_DURATION_MS / frames.length));
        const intervalId = window.setInterval(() => {
            setFrameIndex((currentIndex) => {
                return (currentIndex + 1) % frames.length;
            });
        }, frameDurationMs);

        return () => window.clearInterval(intervalId);
    }, [frames, isPaused]);

    if (frames.length === 0) {
        return <div className="logo-animation">No animation frames found.</div>;
    }

    return (
        <div
            className="logo-animation"
            onClick={() => setIsPaused((currentValue) => !currentValue)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setIsPaused((currentValue) => !currentValue);
                }
            }}
            aria-label={isPaused ? "Resume logo animation" : "Pause logo animation"}
        >
            {/* Using a native img keeps rapid frame swapping simple and predictable. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                className="logo-animation__image"
                src={frames[currentFrameIndex]}
                alt="Bankfilm logo animation"
            />
        </div>
    );
}
