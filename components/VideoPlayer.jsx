// components/VideoPlayer.jsx

// ─────────────────────────────────────────────────────────────────
// Secure Full-Screen Video Player Overlay
//
// ── WATCH-TIME TRACKING (KEY CHANGE) ─────────────────────────────
//   PROBLEM: The old approach tracked the highest video position
//   reached. If a student scrubbed to the end, it counted as watched.
//
//   FIX: We now track actual wall-clock time the video was PLAYING.
//   A 60-second video requires 60 seconds of real playback.
//   Scrubbing, fast-forwarding, or seeking does NOT count.
//
//   HOW IT WORKS:
//     • `accumulatedRef`     — total seconds of actual playback so far
//     • `playStartWallRef`   — wall-clock timestamp when current play
//                              session started (null when paused)
//     • On every timeUpdate  — report (accumulated + current session, duration, position)
//     • On pause / close     — flush session seconds into accumulatedRef
//     • `savedWatched` prop  — restores accumulated time when reopening
//
// ── PROPS ─────────────────────────────────────────────────────────
//   src            — Video file path (e.g. /videos/excel1.mp4)
//   onClose        — Called when player closes
//   onTimeUpdate   — (accumulatedWatched, duration, currentPosition)
//                    Called periodically while playing
//   onComplete     — () → void
//                    Called ONCE when accumulated wall-clock watch time
//                    reaches (watchThreshold × duration). Seeking /
//                    scrubbing does NOT count — only real play time.
//                    Guaranteed to fire at most once per video open;
//                    will not re-fire if the video is rewatched after
//                    completion (alreadyCompleted should be true then).
//   alreadyCompleted — boolean, default false
//                    If true, the completion badge is shown immediately
//                    and onComplete will NOT fire again.
//   onEnded        — Called when video reaches its natural end
//   savedTime      — Resume seek position in seconds (from last close)
//   savedWatched   — Previously accumulated real watch time (seconds)
//   watchThreshold — Fraction of duration required to mark complete.
//                    Default 0.90 = 90%. Must actually watch — no scrub.
//   watermarkText  — Text shown as diagonal watermark overlay
//
// ── SECURITY FEATURES ─────────────────────────────────────────────
//   • No right-click on video element
//   • No browser download button (controlsList="nodownload")
//   • No picture-in-picture
//   • Pauses when user switches tab (visibilitychange)
//   • Pauses when window loses focus (blur)
//   • Diagonal watermark overlay
//
// ── VIDEO CONTROLS ────────────────────────────────────────────────
//   • Restart (↺) — leftmost button; always visible; clicking it
//     seeks to 0 and resets the wall-clock watch-time accumulator
//     so completion can fire again if the student rewatches.
//   • Play / Pause (click overlay or button)
//   • ±15 second skip buttons
//   • Seekable timeline (scrubbing changes position BUT does NOT
//     add to accumulated watch time — student must actually watch)
//   • Volume slider + mute toggle
//   • Fullscreen toggle
//   • Playback speed selector (0.75x / 1x / 1.25x / 1.5x)
//   • Auto-hide controls after 3s of inactivity
//   • Keyboard: Space=play/pause, ←→=±15s, Esc=close
// ─────────────────────────────────────────────────────────────────

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  X, Play, Pause, RotateCcw,
  SkipBack, SkipForward,
  Volume2, VolumeX,
  Maximize, Minimize
} from "lucide-react";

export default function VideoPlayer({
  src,
  onClose,
  onTimeUpdate,              // (accumulatedWatched, duration, currentPosition)
  onComplete,                // () → called once when ≥ watchThreshold of real watch time reached
  onEnded,
  alreadyCompleted = false,  // true if this video was previously completed — shows badge immediately
  savedTime        = 0,      // Resume seek position (seconds)
  savedWatched     = 0,      // Previously accumulated real watch time (seconds)
  watchThreshold   = 0.90,   // Fraction of duration required (wall-clock only). Default = 90%
  watermarkText    = "GogalEdu Academy • gogaledu.com"
}) {
  const videoRef    = useRef(null);
  const wrapperRef  = useRef(null);
  const progressRef = useRef(null);
  const hideTimer   = useRef(null);

  // ── WATCH TIME TRACKING REFS ────────────────────────────────────
  const accumulatedRef    = useRef(savedWatched);
  const playStartWallRef  = useRef(null);

  // ── COMPLETION GATE REF ─────────────────────────────────────────
  const completedFiredRef = useRef(alreadyCompleted);

  // ── UI STATE ────────────────────────────────────────────────────
  const [playing,        setPlaying]        = useState(false);
  const [currentTime,    setCurrentTime]    = useState(0);
  const [duration,       setDuration]       = useState(0);
  const [volume,         setVolume]         = useState(1);
  const [muted,          setMuted]          = useState(false);
  const [showControls,   setShowControls]   = useState(true);
  const [isFullscreen,   setIsFullscreen]   = useState(false);
  const [buffered,       setBuffered]       = useState(0);
  const [speed,          setSpeed]          = useState(1);
  const [showSpeed,      setShowSpeed]      = useState(false);
  // ended: true after the video reaches its natural end.
  // Used to keep the restart button visually prominent.
  const [ended,          setEnded]          = useState(false);
  const [completedBadge, setCompletedBadge] = useState(alreadyCompleted);

  // ── RESET WHEN SRC CHANGES ──────────────────────────────────────
  useEffect(() => {
    accumulatedRef.current    = savedWatched;
    playStartWallRef.current  = null;
    completedFiredRef.current = alreadyCompleted;
    setCompletedBadge(alreadyCompleted);
    setEnded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // ── SECURITY: right-click block, pause-on-hide, fullscreen ─────
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const blockCtx = (e) => e.preventDefault();
    vid.addEventListener("contextmenu", blockCtx);

    const handleVisibility = () => {
      if (document.hidden && videoRef.current) {
        flushSession();
        videoRef.current.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const handleBlur = () => {
      if (videoRef.current) {
        flushSession();
        videoRef.current.pause();
        setPlaying(false);
      }
    };
    window.addEventListener("blur", handleBlur);

    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);

    return () => {
      vid.removeEventListener("contextmenu", blockCtx);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── FLUSH SESSION ───────────────────────────────────────────────
  const flushSession = useCallback(() => {
    if (playStartWallRef.current !== null) {
      accumulatedRef.current += (Date.now() - playStartWallRef.current) / 1000;
      playStartWallRef.current = null;
    }
  }, []);

  // ── VIDEO LOADED ────────────────────────────────────────────────
  const handleLoadedMetadata = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setDuration(vid.duration || 0);
    if (savedTime > 0 && savedTime < vid.duration) vid.currentTime = savedTime;
  };

  // ── TIME UPDATE ─────────────────────────────────────────────────
  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;

    setCurrentTime(vid.currentTime);

    if (vid.buffered.length > 0) {
      setBuffered((vid.buffered.end(vid.buffered.length - 1) / vid.duration) * 100);
    }

    let totalWatched = accumulatedRef.current;
    if (playStartWallRef.current !== null) {
      totalWatched += (Date.now() - playStartWallRef.current) / 1000;
    }

    onTimeUpdate && onTimeUpdate(totalWatched, vid.duration, vid.currentTime);

    if (
      !completedFiredRef.current &&
      vid.duration > 0 &&
      totalWatched >= vid.duration * watchThreshold
    ) {
      completedFiredRef.current = true;
      setCompletedBadge(true);
      onComplete && onComplete();
    }
  };

  // ── PLAY ────────────────────────────────────────────────────────
  const handlePlay = () => {
    playStartWallRef.current = Date.now();
    setPlaying(true);
    setEnded(false); // clear ended flag whenever playback resumes
  };

  // ── PAUSE ───────────────────────────────────────────────────────
  const handlePause = () => {
    flushSession();
    setPlaying(false);
  };

  // ── VIDEO ENDED ─────────────────────────────────────────────────
  const handleVideoEnded = () => {
    flushSession();
    setPlaying(false);
    setEnded(true); // mark as ended → restart button becomes prominent
    onEnded && onEnded();
  };

  // ── CLOSE ───────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    flushSession();
    const vid = videoRef.current;
    if (vid && onTimeUpdate) {
      onTimeUpdate(accumulatedRef.current, vid.duration, vid.currentTime);
    }
    onClose();
  }, [flushSession, onTimeUpdate, onClose]);

  // ── TOGGLE PLAY ─────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      const p = vid.play();
      if (p && typeof p.catch === "function") {
        p.catch((err) => {
          if (err.name !== "AbortError") console.warn("VideoPlayer play() failed:", err.name, err.message);
        });
      }
    } else {
      vid.pause();
    }
  }, []);

  // ── RESTART ─────────────────────────────────────────────────────
  // Seeks to 0 and resets the watch-time accumulator so the
  // 90% completion threshold can fire again on this rewatch.
  const handleRestart = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    flushSession();
    accumulatedRef.current    = 0;       // reset accumulated watch time
    completedFiredRef.current = false;   // allow onComplete to fire again
    vid.currentTime           = 0;
    setEnded(false);
    const p = vid.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [flushSession]);

  // ── SKIP ±15s ───────────────────────────────────────────────────
  const skip = useCallback((seconds) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = Math.max(0, Math.min(vid.currentTime + seconds, duration));
  }, [duration]);

  // ── SEEK ────────────────────────────────────────────────────────
  const handleSeek = (e) => {
    const bar = progressRef.current;
    const vid = videoRef.current;
    if (!bar || !vid || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    vid.currentTime = pct * duration;
  };

  // ── VOLUME ──────────────────────────────────────────────────────
  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.volume = v;
    setVolume(v);
    setMuted(v === 0);
  };

  // ── MUTE ────────────────────────────────────────────────────────
  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !muted;
    setMuted(!muted);
  };

  // ── SPEED ───────────────────────────────────────────────────────
  const changeSpeed = (newSpeed) => {
    const vid = videoRef.current;
    if (vid) vid.playbackRate = newSpeed;
    setSpeed(newSpeed);
    setShowSpeed(false);
  };

  // ── FULLSCREEN ──────────────────────────────────────────────────
  const toggleFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // ── AUTO-HIDE CONTROLS ──────────────────────────────────────────
  const resetHideTimer = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  // ── KEYBOARD SHORTCUTS ──────────────────────────────────────────
  useEffect(() => {
    if (!src) return;
    const handler = (e) => {
      if (e.key === "Escape")      handleClose();
      if (e.key === " ")           { e.preventDefault(); togglePlay(); }
      if (e.key === "ArrowRight")  skip(15);
      if (e.key === "ArrowLeft")   skip(-15);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [src, handleClose, togglePlay, skip]);

  // ── FORMAT SECONDS ──────────────────────────────────────────────
  const fmt = (s) => {
    if (isNaN(s) || s < 0) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const pct    = duration > 0 ? (currentTime / duration) * 100 : 0;
  const SPEEDS = [0.75, 1, 1.25, 1.5];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* ── VIDEO WRAPPER (16:9) ──────────────────────────────── */}
      <div
        ref={wrapperRef}
        className="relative w-full bg-black rounded-2xl overflow-hidden"
        style={{ maxWidth: "900px", aspectRatio: "16/9" }}
        onMouseMove={resetHideTimer}
        onMouseLeave={() => playing && setShowControls(false)}
        onTouchStart={resetHideTimer}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition"
          style={{ top: 12, right: 12 }}
          aria-label="Close video"
        >
          <X size={18} />
        </button>

        {/* Completed badge */}
        {completedBadge && (
          <div
            className="absolute z-20 flex items-center gap-1.5 bg-green-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
            style={{ top: 14, left: 14 }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="6" fill="rgba(255,255,255,0.25)" />
              <path d="M3.5 6l1.8 1.8L8.5 4.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Completed
          </div>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleVideoEnded}
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          style={{ pointerEvents: "none", userSelect: "none" }}
          playsInline
        />

        {/* Watermark overlay */}
        <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 5 }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%) rotate(-25deg)",
            color: "rgba(255,255,255,0.10)",
            fontSize: "clamp(12px, 1.5vw, 18px)", fontWeight: "700",
            whiteSpace: "nowrap", userSelect: "none", letterSpacing: "0.05em"
          }}>
            {watermarkText}
          </div>
          <div style={{
            position: "absolute", bottom: "64px", right: "12px",
            color: "rgba(255,255,255,0.18)", fontSize: "11px", userSelect: "none"
          }}>
            GogalEdu
          </div>
        </div>

        {/* Click-to-play / double-click-to-fullscreen */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 6 }}
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
        />

        {/* Controls bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
            showControls || !playing ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.80))", padding: "28px 14px 12px", zIndex: 7 }}
        >
          {/* Seek bar */}
          <div
            ref={progressRef}
            className="relative w-full mb-3 cursor-pointer group"
            style={{ height: "4px" }}
            onClick={handleSeek}
          >
            <div className="absolute inset-0 bg-white/25 rounded-full" />
            <div className="absolute left-0 top-0 h-full bg-white/30 rounded-full" style={{ width: `${buffered}%` }} />
            <div className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow group-hover:scale-125 transition-transform"
              style={{ left: `calc(${pct}% - 6px)` }}
            />
          </div>

          {/* Button row */}
          <div className="flex items-center gap-2">

            {/* ── RESTART — leftmost button ──────────────────────
                Always present. Highlighted in green when the video
                has just ended so the student knows to click it.
                Clicking it seeks to 0 and resets the watch-time
                accumulator so the 90% completion can fire again.
            ─────────────────────────────────────────────────── */}
            <button
              onClick={handleRestart}
              className={`transition p-1 rounded ${
                ended
                  ? "text-green-400 hover:text-green-300"   // prominent after video ends
                  : "text-white/60 hover:text-white"         // subtle while video is playing
              }`}
              title="Restart video (resets watch timer)"
              aria-label="Restart video"
            >
              <RotateCcw size={17} />
            </button>

            {/* Back 15s */}
            <button
              onClick={() => skip(-15)}
              className="text-white/80 hover:text-white transition p-1"
              title="Back 15 seconds"
            >
              <SkipBack size={18} />
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-green-400 transition p-1"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing
                ? <Pause size={20} fill="currentColor" />
                : <Play  size={20} fill="currentColor" />
              }
            </button>

            {/* Forward 15s */}
            <button
              onClick={() => skip(15)}
              className="text-white/80 hover:text-white transition p-1"
              title="Forward 15 seconds"
            >
              <SkipForward size={18} />
            </button>

            {/* Time display */}
            <span className="text-white/70 text-xs font-mono ml-1 select-none">
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Speed selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeed(!showSpeed)}
                className="text-white/80 hover:text-white text-xs font-semibold px-2 py-1 rounded border border-white/20 hover:border-white/40 transition"
                title="Playback Speed"
              >
                {speed}x
              </button>
              {showSpeed && (
                <div className="absolute bottom-8 right-0 bg-gray-900 border border-white/20 rounded-lg overflow-hidden shadow-xl">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`block w-full text-left px-4 py-2 text-xs font-medium transition ${
                        speed === s ? "bg-green-600 text-white" : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {s}x {s === 1 ? "(Normal)" : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume mute toggle */}
            <button
              onClick={toggleMute}
              className="text-white/80 hover:text-white transition p-1"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>

            {/* Volume slider */}
            <input
              type="range" min="0" max="1" step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 accent-green-500 cursor-pointer"
              style={{ height: "3px" }}
            />

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white/80 hover:text-white transition p-1 ml-1"
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
            </button>
          </div>
        </div>

        {/* Big play button when paused */}
        {!playing && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 8 }}
          >
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <Play size={30} fill="white" className="text-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Keyboard hint */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs select-none pointer-events-none">
        Space = Play/Pause  |  -15s ←     → +15s  |  Esc = Close
      </p>
    </div>
  );
}