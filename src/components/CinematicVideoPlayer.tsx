/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Cinematic AI Video Player & Generator
 * جانلىق كىنوچىلىق سىن ستۇدىيىسى، كۆپ كۆرۈنۈشلۈك كامېرا سىيرىلىش (Ken Burns)، توردىن تېپىلغان ماتېرىياللارنى جانلاندۇرۇش ۋە WebM سىن چۈشۈرۈش
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Download, Volume2, VolumeX, Sparkles, Video, Film, Check } from 'lucide-react';

export interface VideoScene {
  id: string;
  title: string;
  chyron: string;
  cameraMove?: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'orbit' | 'dramatic-tilt';
  imageUrl?: string;
  userMedia?: string | null;
  duration?: number;
}

interface CinematicVideoPlayerProps {
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  duration: '5s' | '10s';
  videoUrl?: string | null;
  bgSource?: string;
  userMedia?: string | null;
  userDocText?: string | null;
  scenes?: VideoScene[];
  narrationAudioUrl?: string | null;
}

export default function CinematicVideoPlayer({
  prompt,
  aspectRatio,
  duration,
  videoUrl,
  bgSource = '/assets/bg_karluk.jpg',
  userMedia = null,
  userDocText = null,
  scenes,
  narrationAudioUrl = null
}: CinematicVideoPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [recordSuccess, setRecordSuccess] = useState<boolean>(false);
  const [lensOverlay, setLensOverlay] = useState<'orbital' | 'cinema' | 'clean'>('orbital');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Narration Voiceover Audio Element
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (narrationAudioUrl) {
      const audio = new Audio(narrationAudioUrl);
      narrationAudioRef.current = audio;
    } else {
      narrationAudioRef.current = null;
    }
  }, [narrationAudioUrl]);

  const totalDurationSec = duration === '10s' ? 10 : 5;

  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);

  // Define effective scenes list (if not provided, generate default 3-scene sequence)
  const effectiveScenes: VideoScene[] = React.useMemo(() => {
    if (scenes && scenes.length > 0) {
      return scenes;
    }
    return [
      {
        id: 'scene-1',
        title: '1-كۆرۈنۈش: ئوربىتا ۋە سۈنئىي ھەمراھ كۆزىتىشى',
        chyron: prompt.length > 50 ? prompt.slice(0, 48) + '...' : prompt,
        cameraMove: 'zoom-in',
        imageUrl: '/assets/earth_satellite.jpg',
        duration: totalDurationSec / 3
      },
      {
        id: 'scene-2',
        title: '2-كۆرۈنۈش: تەڭرىتاغ ئېپىك قەھرىمانى ۋە خەلقئارالىق كارىدور',
        chyron: 'ئوتتۇرا ئاسىيا ۋە شەرقىي تۈركىستان ئوتتۇرىسىدىكى مەدەنىيەت-ئىقتىساد تۈگۈنى',
        cameraMove: 'pan-left',
        imageUrl: userMedia || bgSource,
        duration: totalDurationSec / 3
      },
      {
        id: 'scene-3',
        title: '3-كۆرۈنۈش: ئىستراتېگىيەلىك كەلگۈسى ۋە ئادالەت غەلىبىسى',
        chyron: 'دۇنياۋى ئەركىنلىك، كىشىلىك ھوقۇق ۋە خەلقئارالىق مۇستەقىل تەمىنات زەنجىرى',
        cameraMove: 'zoom-out',
        imageUrl: '/assets/logo_emblem.jpg',
        duration: totalDurationSec / 3
      }
    ];
  }, [scenes, prompt, totalDurationSec, userMedia, bgSource]);

  // Preload Images for all scenes
  const sceneImagesRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    effectiveScenes.forEach(scene => {
      const src = scene.imageUrl || scene.userMedia || bgSource;
      if (!sceneImagesRef.current[src]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        sceneImagesRef.current[src] = img;
      }
    });
  }, [effectiveScenes, bgSource]);

  // Particles for cinematic atmosphere
  const particlesRef = useRef<{ x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[]>([]);

  useEffect(() => {
    const pts = [];
    for (let i = 0; i < 45; i++) {
      pts.push({
        x: Math.random(),
        y: Math.random(),
        size: 1 + Math.random() * 2.5,
        speedX: (Math.random() - 0.5) * 0.0008,
        speedY: -0.0005 - Math.random() * 0.001,
        opacity: 0.2 + Math.random() * 0.6
      });
    }
    particlesRef.current = pts;
  }, []);

  // Web Audio Synth ambient rumble/tone when playing
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startAudio = () => {
    try {
      if (isMuted) return;
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      if (!oscRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A ambient drone
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;
      }
    } catch (e) {
      // Audio autoplay policy
    }
  };

  const stopAudio = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isPlaying && !isMuted) {
      startAudio();
      if (narrationAudioRef.current) {
        narrationAudioRef.current.play().catch(() => {});
      }
    } else {
      stopAudio();
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause();
      }
    }
    return () => {
      stopAudio();
      if (narrationAudioRef.current) narrationAudioRef.current.pause();
    };
  }, [isPlaying, isMuted]);

  // Main Canvas Render Loop (60 FPS Multi-Scene Ken Burns Motion)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    startTimeRef.current = Date.now() - pausedTimeRef.current;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      let elapsed = ((Date.now() - startTimeRef.current) / 1000) * playbackSpeed;
      if (elapsed > totalDurationSec) {
        startTimeRef.current = Date.now();
        elapsed = 0;
      }

      const normProgress = Math.min(1, Math.max(0, elapsed / totalDurationSec));
      setProgress(normProgress);

      // Determine active scene
      const numScenes = Math.max(1, effectiveScenes.length);
      const sceneFraction = 1 / numScenes;
      const rawIndex = Math.min(numScenes - 1, Math.floor(normProgress / sceneFraction));
      setActiveSceneIndex(rawIndex);

      const activeScene = effectiveScenes[rawIndex] || effectiveScenes[0];
      const nextScene = effectiveScenes[(rawIndex + 1) % numScenes];

      const sceneLocalProgress = (normProgress - rawIndex * sceneFraction) / sceneFraction;

      // Cubic ease-in-out for realistic cinematic camera movement
      const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
      const easedSceneProgress = easeInOutQuad(Math.max(0, Math.min(1, sceneLocalProgress)));

      // 1. Deep cinematic background
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, w, h);

      // Helper to draw an image with smooth Ken Burns motion
      const drawKenBurnsImage = (
        img: HTMLImageElement | undefined,
        move: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'orbit' | 'dramatic-tilt' | undefined = 'zoom-in',
        localProg: number,
        alpha: number = 1.0
      ) => {
        if (!img || !img.complete) return;

        let scale = 1.1;
        let panX = 0;
        let panY = 0;

        let rotation = 0;
        if (move === 'zoom-in') {
          scale = 1.04 + localProg * 0.18;
          panX = (localProg - 0.5) * 36;
          panY = (localProg - 0.5) * -16;
        } else if (move === 'zoom-out') {
          scale = 1.22 - localProg * 0.16;
          panX = (0.5 - localProg) * 36;
          panY = (0.5 - localProg) * -16;
        } else if (move === 'pan-left') {
          scale = 1.16;
          panX = (0.5 - localProg) * 90;
        } else if (move === 'pan-right') {
          scale = 1.16;
          panX = (localProg - 0.5) * 90;
        } else if (move === 'orbit') {
          scale = 1.14 + Math.sin(localProg * Math.PI) * 0.08;
          panX = Math.cos(localProg * Math.PI) * 50;
          panY = Math.sin(localProg * Math.PI) * 22;
          rotation = (localProg - 0.5) * 0.04;
        } else if (move === 'dramatic-tilt') {
          scale = 1.16;
          panY = (0.5 - localProg) * 75;
          panX = (localProg - 0.5) * 20;
          rotation = (localProg - 0.5) * 0.02;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.translate(w / 2 + panX, h / 2 + panY);
        if (rotation) ctx.rotate(rotation);
        ctx.scale(scale, scale);

        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;
        let drawW = w;
        let drawH = h;
        if (canvasRatio > imgRatio) {
          drawW = w;
          drawH = w / imgRatio;
        } else {
          drawH = h;
          drawW = h * imgRatio;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      };

      // 2. Draw current scene image with crossfade
      const currentSrc = activeScene.imageUrl || activeScene.userMedia || bgSource;
      const currentImg = sceneImagesRef.current[currentSrc];

      // Smooth crossfade during the last 15% of each scene
      const transitionWindow = 0.15;
      if (sceneLocalProgress > 1 - transitionWindow && numScenes > 1) {
        const fadeProg = (sceneLocalProgress - (1 - transitionWindow)) / transitionWindow;
        drawKenBurnsImage(currentImg, activeScene.cameraMove, easedSceneProgress, 1 - fadeProg);

        const nextSrc = nextScene.imageUrl || nextScene.userMedia || bgSource;
        const nextImg = sceneImagesRef.current[nextSrc];
        drawKenBurnsImage(nextImg, nextScene.cameraMove, easeInOutQuad(fadeProg * transitionWindow), fadeProg);
      } else {
        drawKenBurnsImage(currentImg, activeScene.cameraMove, easedSceneProgress, 1.0);
      }

      // 3. Cinematic Vignette & Lighting
      const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.75);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
      grad.addColorStop(0.7, 'rgba(4, 9, 20, 0.55)');
      grad.addColorStop(1, 'rgba(2, 5, 12, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Warm Amber Rim Flare
      const flare = ctx.createLinearGradient(0, 0, w, 0);
      flare.addColorStop(0, 'rgba(245, 158, 11, 0.14)');
      flare.addColorStop(0.5, 'transparent');
      flare.addColorStop(1, 'rgba(56, 189, 248, 0.12)');
      ctx.fillStyle = flare;
      ctx.fillRect(0, 0, w, h);

      // 4. Lens Overlay Style (Orbital HUD / Anamorphic Letterbox / Clean)
      if (lensOverlay === 'orbital') {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 75, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(w / 2 - 3, h / 2 - 3, 6, 6);

        // Orbital Crosshairs
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.moveTo(w / 2 - 100, h / 2); ctx.lineTo(w / 2 - 80, h / 2);
        ctx.moveTo(w / 2 + 80, h / 2); ctx.lineTo(w / 2 + 100, h / 2);
        ctx.moveTo(w / 2, h / 2 - 100); ctx.lineTo(w / 2, h / 2 - 80);
        ctx.moveTo(w / 2, h / 2 + 80); ctx.lineTo(w / 2, h / 2 + 100);
        ctx.stroke();

        // Orbital Coordinates readout
        ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.font = 'bold 11px monospace';
        ctx.direction = 'ltr';
        ctx.fillText('SAT-RECON · 39°28\'N 75°59\'E · ALT: 420KM · LOCK', w / 2 - 135, h / 2 + 105);
        ctx.restore();
      } else if (lensOverlay === 'cinema') {
        // Anamorphic 2.35:1 Letterbox Bars
        ctx.save();
        ctx.fillStyle = '#020617';
        const barH = h * 0.08;
        ctx.fillRect(0, 0, w, barH);
        ctx.fillRect(0, h - barH, w, barH);
        ctx.restore();
      }

      // 5. Atmospheric Dust Particle Drift
      ctx.fillStyle = 'rgba(254, 243, 199, 0.85)';
      particlesRef.current.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 6. Cinematic Uyghur Lower-Third Chyron
      if (lensOverlay !== 'clean') {
        ctx.save();
        const bannerH = 84;
        const bannerY = h - bannerH - 28;

        // Dark glass container with amber edge
        ctx.fillStyle = 'rgba(9, 14, 26, 0.92)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(24, bannerY, w - 48, bannerH, 16);
      ctx.fill();
      ctx.stroke();

      // Golden indicator line
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(w - 32, bannerY + 12, 4, bannerH - 24);

      // Scene Title Tag (Top Row)
      ctx.direction = 'rtl';
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px "UKIJ Tuz", "ALKATIP Basma", sans-serif';
      ctx.fillText(activeScene.title, w - 46, bannerY + 26);

      // Chyron text / Prompt (Middle Row)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "UKIJ Tuz", "ALKATIP Basma", sans-serif';
      const chyronText = activeScene.chyron || prompt;
      const textTruncated = chyronText.length > 58 ? chyronText.slice(0, 55) + '...' : chyronText;
      ctx.fillText(textTruncated, w - 46, bannerY + 48);

      // Document citation or broadcaster badge (Bottom Row)
      if (userDocText) {
        const docTruncated = userDocText.length > 52 ? userDocText.slice(0, 50) + '...' : userDocText;
        ctx.fillStyle = '#fbbf24';
        ctx.font = '11px "UKIJ Tuz", sans-serif';
        ctx.fillText(`📄 توردىن ئېرىشىلگەن پاكىت: ${docTruncated}`, w - 46, bannerY + 70);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "UKIJ Tuz", sans-serif';
        ctx.fillText('⚡ UyFox News كىنوچىلىق سىن ستۇدىيىسى · 4K AI Cinema Motion · ھەركەتلىك كامېرا', w - 46, bannerY + 70);
      }
      ctx.restore();
    } else {
      ctx.save();
      ctx.direction = 'rtl';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.beginPath();
      ctx.roundRect(24, h - 44, 220, 26, 6);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px "UKIJ Tuz", sans-serif';
      ctx.fillText(`⚡ ${activeScene.title}`, 220, h - 27);
      ctx.restore();
    }

      // 6. Live Timecode overlay in top corner
      ctx.save();
      ctx.direction = 'ltr';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.roundRect(20, 20, 130, 28, 6);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px monospace';
      const curSec = Math.floor(elapsed);
      const curMs = Math.floor((elapsed % 1) * 100);
      const strTime = `00:0${curSec}.${curMs < 10 ? '0' : ''}${curMs}`;
      ctx.fillText(`REC ${strTime}`, 28, 38);
      ctx.restore();

      // 7. Audio Waveform Spectrum Bars (Live Broadcast EQ)
      ctx.save();
      const barsCount = 14;
      const startX = 162;
      const barBaseY = 44;
      for (let b = 0; b < barsCount; b++) {
        const barH = isPlaying ? Math.sin(elapsed * 7 + b * 0.9) * 9 + 11 + (b % 3) * 2 : 4;
        ctx.fillStyle = b < 5 ? '#38bdf8' : b < 10 ? '#f59e0b' : '#ef4444';
        ctx.fillRect(startX + b * 4.5, barBaseY - barH, 2.8, barH);
      }
      ctx.restore();

      // 8. Active Scene Pill indicator (Top right)
      ctx.save();
      ctx.direction = 'rtl';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.beginPath();
      ctx.roundRect(w - 180, 20, 160, 28, 6);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px "UKIJ Tuz", sans-serif';
      ctx.fillText(`كۆرۈنۈش ${rawIndex + 1} / ${numScenes}`, w - 30, 38);
      ctx.restore();

      if (isPlaying) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    if (isPlaying) {
      animRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, prompt, totalDurationSec, bgSource, effectiveScenes, userDocText, lensOverlay, playbackSpeed]);

  const togglePlay = () => {
    if (isPlaying) {
      pausedTimeRef.current = Date.now() - startTimeRef.current;
      setIsPlaying(false);
    } else {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setProgress(0);
    setIsPlaying(true);
    if (narrationAudioRef.current) {
      narrationAudioRef.current.currentTime = 0;
      if (!isMuted) narrationAudioRef.current.play().catch(() => {});
    }
  };

  const handleJumpToScene = (index: number) => {
    const fraction = index / effectiveScenes.length;
    startTimeRef.current = Date.now() - (fraction * totalDurationSec * 1000);
    pausedTimeRef.current = fraction * totalDurationSec * 1000;
    setProgress(fraction);
    setActiveSceneIndex(index);
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newElapsed = ratio * totalDurationSec;
    startTimeRef.current = Date.now() - newElapsed * 1000;
    pausedTimeRef.current = newElapsed * 1000;
    setProgress(ratio);
    const numScenes = Math.max(1, effectiveScenes.length);
    setActiveSceneIndex(Math.min(numScenes - 1, Math.floor(ratio * numScenes)));
  };

  // HD Frame snapshot
  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `uyfox-cinema-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Record actual video stream to WebM video file
  const handleRecordVideoFile = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecordingVideo) return;

    try {
      setIsRecordingVideo(true);
      setRecordSuccess(false);

      // Start from beginning
      handleRestart();

      const stream: MediaStream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
      if (!stream) {
        handleDownloadSnapshot();
        setIsRecordingVideo(false);
        return;
      }

      // If Web Audio synth is running, capture its audio stream
      if (audioCtxRef.current && (audioCtxRef.current as any).createMediaStreamDestination && gainRef.current) {
        try {
          const dest = (audioCtxRef.current as any).createMediaStreamDestination();
          gainRef.current.connect(dest);
          const audioTracks = dest.stream.getAudioTracks();
          if (audioTracks.length > 0) {
            stream.addTrack(audioTracks[0]);
          }
        } catch (e) {}
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `uyfox-cinema-video-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecordingVideo(false);
        setRecordSuccess(true);
        setTimeout(() => setRecordSuccess(false), 3000);
      };

      mediaRecorder.start();

      // Record exactly for full duration
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }, totalDurationSec * 1000);
    } catch (err) {
      console.error('Recording error:', err);
      handleDownloadSnapshot();
      setIsRecordingVideo(false);
    }
  };

  // If real MP4 URL is present, render native video player with fallback
  if (videoUrl && videoUrl !== 'simulated' && !videoUrl.startsWith('data:text')) {
    return (
      <div className="w-full space-y-3">
        <div
          className={`w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative shadow-2xl flex items-center justify-center ${
            aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[500px] mx-auto' : 'aspect-video'
          }`}
        >
          <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Gemini Omni Flash MP4 سىن كۆرۈنۈشى</span>
          </span>
          <a
            href={videoUrl}
            download={`uyfox-video-${Date.now()}.mp4`}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>MP4 سىننى ساقلاش</span>
          </a>
        </div>
      </div>
    );
  }

  // Interactive 60FPS Multi-Scene Cinematic Canvas Video Engine
  const canvasW = aspectRatio === '9:16' ? 720 : 1280;
  const canvasH = aspectRatio === '9:16' ? 1280 : 720;

  return (
    <div ref={containerRef} className="w-full space-y-3 select-none">
      {/* Video Viewport */}
      <div
        className={`w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative shadow-2xl flex items-center justify-center ${
          aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[520px] mx-auto' : 'aspect-video'
        }`}
      >
        <canvas
          ref={canvasRef}
          width={canvasW}
          height={canvasH}
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Interactive Video Scrubber Overlay at Bottom */}
        <div
          onClick={handleScrubberClick}
          className="absolute bottom-0 inset-x-0 h-2 bg-slate-900/80 cursor-pointer hover:h-3.5 transition-all z-10 group"
          title="ۋاقىت ئوقىنى بېسىپ سۈرۈش"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-75 relative"
            style={{ width: `${progress * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>

        {/* Central Play/Pause overlay when paused */}
        {!isPlaying && !isRecordingVideo && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Recording Banner Overlay */}
        {isRecordingVideo && (
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-rose-600/90 text-white text-xs font-bold flex items-center gap-2 animate-pulse shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span>WebM سىن خاتىرىلىنىۋاتىدۇ ({Math.floor(progress * totalDurationSec)}s)...</span>
          </div>
        )}
      </div>

      {/* Control Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center cursor-pointer shadow-md transition-all"
            title={isPlaying ? 'توختىتىش' : 'قويۇش'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={handleRestart}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all"
            title="باپتىن باشلاش"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMuted(prev => !prev)}
            className={`p-2 rounded-lg cursor-pointer transition-all ${
              !isMuted ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
            }`}
            title={isMuted ? 'ئاۋازنى ئېچىش' : 'ئۈنسىز قىلىش'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span className="text-[11px] font-mono text-slate-400 mr-2">
            {Math.floor(progress * totalDurationSec)}s / {totalDurationSec}s
          </span>
        </div>

        {/* Middle Group: Lens Style and Playback Speed */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setLensOverlay('orbital')}
              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                lensOverlay === 'orbital'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="سۈنئىي ھەمراھ كۆزىتىشى ۋە ئوربىتا تورى"
            >
              🛰️ سۈنئىي ھەمراھ
            </button>
            <button
              onClick={() => setLensOverlay('cinema')}
              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                lensOverlay === 'cinema'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="ئانامورفىك كىنوچىلىق ئېپىك قارا تاسمىسى"
            >
              🎬 كىنو
            </button>
            <button
              onClick={() => setLensOverlay('clean')}
              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                lensOverlay === 'clean'
                  ? 'bg-slate-700 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="پاكىز كۆرۈنۈش (پۈتۈن ئېكران)"
            >
              📺 پاكىز
            </button>
          </div>

          <button
            onClick={() => {
              setPlaybackSpeed(prev => (prev === 1.0 ? 1.5 : prev === 1.5 ? 0.75 : 1.0));
            }}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[11px] font-bold cursor-pointer border border-slate-700"
            title="قويۇش تېزلىكى"
          >
            {playbackSpeed}x
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecordVideoFile}
            disabled={isRecordingVideo}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all disabled:opacity-50"
            title="پۈتۈن سىن كۆرۈنۈشىنى WebM ھۆججىتى قىلىپ خاتىرىلەش ۋە ساقلاش"
          >
            {recordSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-950" />
                <span>چۈشۈرۈلدى ✓</span>
              </>
            ) : isRecordingVideo ? (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                <span>خاتىرىلەۋاتىدۇ...</span>
              </>
            ) : (
              <>
                <Video className="w-3.5 h-3.5 fill-current" />
                <span>WebM سىننى چۈشۈرۈش</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSnapshot}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer transition-all border border-slate-700"
            title="ھازىرقى كۆرۈنۈشتىن سۈرەت ئېلىش"
          >
            <Download className="w-3.5 h-3.5" />
            <span>HD سۈرەت</span>
          </button>
        </div>
      </div>

      {/* Storyboard Visual Strip (ھەر بىر كۆرۈنۈش تەپسىلاتى) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>سىن سىنارىيە كۆرۈنۈشلىرى ({effectiveScenes.length}):</span>
          </span>
          <span className="text-[10px] text-slate-400">چەكسىڭىز ئاشۇ بۆلەكنى قويىدۇ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {effectiveScenes.map((scene, idx) => {
            const isActive = idx === activeSceneIndex;
            const sceneSrc = scene.imageUrl || scene.userMedia || bgSource;
            return (
              <div
                key={scene.id || idx}
                onClick={() => handleJumpToScene(idx)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'border-amber-400 bg-amber-950/25 ring-1 ring-amber-400/40'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 mb-1.5">
                  <img
                    src={sceneSrc}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-950/80 text-slate-300'
                  }`}>
                    {idx + 1}-كۆرۈنۈش
                  </span>
                  <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-slate-950/80 text-[8px] font-mono text-amber-300">
                    {scene.cameraMove || 'zoom-in'}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-200 line-clamp-1">{scene.title}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{scene.chyron}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
