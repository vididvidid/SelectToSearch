import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Camera,
  PenTool,
  Eraser,
  Search,
  Send,
  ChevronUp,
  Heart,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Image as ImageIcon,
} from "lucide-react";

// Enhanced haptic feedback system with sound
class HapticsSystem {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize audio context on first user interaction
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== "undefined" && window.AudioContext) {
      try {
        this.audioContext = new AudioContext();
      } catch (e) {
        console.warn("AudioContext not supported:", e);
      }
    }
  }

  private playSound(
    frequency: number,
    duration: number,
    volume: number = 0.1,
  ) {
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime,
      );
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        volume,
        this.audioContext.currentTime + 0.01,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + duration / 1000,
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.warn("Sound playback failed:", e);
    }
  }

  // Different haptic patterns for different actions
  buttonTap() {
    if ("vibrate" in navigator) {
      navigator.vibrate(15);
    }
    this.playSound(800, 80, 0.05);
  }

  buttonPress() {
    if ("vibrate" in navigator) {
      navigator.vibrate([10, 5, 10]);
    }
    this.playSound(600, 120, 0.08);
  }

  success() {
    if ("vibrate" in navigator) {
      navigator.vibrate([50, 25, 50]);
    }
    this.playSound(1000, 200, 0.1);
    setTimeout(() => this.playSound(1200, 150, 0.08), 100);
  }

  error() {
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
    this.playSound(300, 300, 0.12);
  }

  drawStart() {
    if ("vibrate" in navigator) {
      navigator.vibrate(20);
    }
    this.playSound(500, 100, 0.06);
  }

  drawEnd() {
    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }
    this.playSound(700, 150, 0.08);
  }

  zoom() {
    if ("vibrate" in navigator) {
      navigator.vibrate(5);
    }
    this.playSound(400, 60, 0.04);
  }

  cameraCapture() {
    if ("vibrate" in navigator) {
      navigator.vibrate([80, 20, 80]);
    }
    this.playSound(1200, 250, 0.15);
    setTimeout(() => this.playSound(800, 150, 0.1), 150);
  }

  // New UI interaction haptics
  boxExpand() {
    if ("vibrate" in navigator) {
      navigator.vibrate([25, 10, 15]);
    }
    this.playSound(900, 120, 0.06);
  }

  boxCollapse() {
    if ("vibrate" in navigator) {
      navigator.vibrate([15, 8, 10]);
    }
    this.playSound(600, 100, 0.05);
  }

  responseReceived() {
    if ("vibrate" in navigator) {
      navigator.vibrate([40, 15, 25, 15, 40]);
    }
    this.playSound(850, 180, 0.08);
    setTimeout(() => this.playSound(1100, 120, 0.06), 120);
  }

  responseBoxOpen() {
    if ("vibrate" in navigator) {
      navigator.vibrate([30, 5, 20]);
    }
    this.playSound(750, 140, 0.07);
  }
}

// Advanced logging system
class Logger {
  private static instance: Logger;
  private logs: Array<{
    timestamp: Date;
    level: string;
    message: string;
    data?: any;
  }> = [];
  private maxLogs = 1000;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: string, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
    };

    this.logs.push(logEntry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with styling
    const timestamp = logEntry.timestamp.toISOString().split("T")[1].slice(0, -1);
    const prefix = `[${timestamp}] ${level.toUpperCase()}:`;

    switch (level) {
      case "error":
        console.error(`🔴 ${prefix}`, message, data || "");
        break;
      case "warn":
        console.warn(`🟡 ${prefix}`, message, data || "");
        break;
      case "success":
        console.log(`🟢 ${prefix}`, message, data || "");
        break;
      case "info":
        console.log(`🔵 ${prefix}`, message, data || "");
        break;
      case "debug":
        console.log(`⚪ ${prefix}`, message, data || "");
        break;
      default:
        console.log(`${prefix}`, message, data || "");
    }
  }

  error(message: string, data?: any) {
    this.log("error", message, data);
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data);
  }

  success(message: string, data?: any) {
    this.log("success", message, data);
  }

  info(message: string, data?: any) {
    this.log("info", message, data);
  }

  debug(message: string, data?: any) {
    this.log("debug", message, data);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    this.info("Log history cleared");
  }

  exportLogs() {
    const logsText = this.logs
      .map(
        (log) =>
          `[${log.timestamp.toISOString()}] ${log.level.toUpperCase()}: ${log.message} ${
            log.data ? JSON.stringify(log.data) : ""
          }`,
      )
      .join("\n");

    const blob = new Blob([logsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `app-logs-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

const haptics = new HapticsSystem();
const logger = Logger.getInstance();

// START: NEW BACKGROUND ANIMATION COMPONENT
const FlowingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let streams: any[] = [];

    class FlowStream {
        x: number;
        y: number;
        width: number;
        length: number;
        height: number;
        opacity: number;
        hue: number;
        speed: number;
        waveOffset: number;
        
        constructor(canvasWidth: number, canvasHeight: number) {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
            this.width = Math.random() * 200 + 150; // 150-350px
            this.length = Math.random() * 400 + 300; // 300-700px
            this.height = Math.random() * 8 + 5; // 5-13px
            this.opacity = Math.random() * 0.15 + 0.08; // 0.08-0.23
            this.hue = Math.random() * 25 + 30; // 30-55°
            this.speed = Math.random() * 0.5 + 0.2;
            this.waveOffset = Math.random() * Math.PI * 2;
        }

        update(canvasWidth: number) {
            this.x += this.speed;
            if (this.x > canvasWidth + this.length) {
                this.x = -this.length;
            }
        }

        draw(ctx: CanvasRenderingContext2D) {
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.length, this.y);
            gradient.addColorStop(0, `hsla(${this.hue}, 50%, 90%, 0)`);
            gradient.addColorStop(0.5, `hsla(${this.hue}, 50%, 90%, ${this.opacity})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 50%, 90%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            
            for (let i = 0; i <= this.length; i++) {
                const yOffset = Math.sin(this.waveOffset + (i / this.width) * Math.PI) * this.height;
                ctx.lineTo(this.x + i, this.y + yOffset);
            }
            
            ctx.fill();
        }
    }

    const setup = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const streamCount = Math.max(5, Math.floor(window.innerWidth / 300));
        streams = [];
        for (let i = 0; i < streamCount; i++) {
            streams.push(new FlowStream(canvas.width, canvas.height));
        }
    };
    
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        streams.forEach(stream => {
            stream.update(canvas.width);
            stream.draw(ctx);
        });
        animationFrameId = requestAnimationFrame(animate);
    };

    setup();
    animate();

    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      setup();
      animate();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100vw', height: '100vh' }} />;
};
// END: NEW BACKGROUND ANIMATION COMPONENT

// Individual Box Components
const ImageBox: React.FC<{
  image: string | null;
  showCamera: boolean;
  onCameraCapture: (imageData: string) => void;
  onCameraError: () => void;
  drawingEnabled: boolean;
  drawnPaths: Array<{ x: number; y: number }>;
  selectedArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  onDrawingStart: (e: React.MouseEvent | React.TouchEvent) => void;
  onDrawingMove: (e: React.MouseEvent | React.TouchEvent) => void;
  onDrawingEnd: () => void;
  onZoomPanChange?: (zoom: number, panX: number, panY: number) => void;
  onImageDrop?: (file: File) => void;
  onTriggerUpload?: () => void;
}> = ({
  image,
  showCamera,
  onCameraCapture,
  onCameraError,
  drawingEnabled,
  drawnPaths,
  selectedArea,
  onDrawingStart,
  onDrawingMove,
  onDrawingEnd,
  onZoomPanChange,
  onImageDrop,
  onTriggerUpload,
}) => {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);
  // Notify parent component of zoom/pan changes
  React.useEffect(() => {
    onZoomPanChange?.(zoom, panX, panY);
  }, [zoom, panX, panY, onZoomPanChange]);

  // Add wheel event listener for trackpad zoom/pan
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle wheel events on the image container
      if (e.target !== container && !container.contains(e.target as Node)) {
        return;
      }

      if (e.ctrlKey) {
        // Ctrl+wheel = zoom (like browser behavior)
        e.preventDefault();

        const containerRect = container.getBoundingClientRect();
        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;

        // Calculate zoom change (negative deltaY = zoom in, positive = zoom out)
        const zoomChange = -e.deltaY * 0.001;
        const newZoom = Math.min(Math.max(zoom + zoomChange, 0.5), 3);

        if (newZoom !== zoom) {
          haptics.zoom();

          // Calculate new pan to keep mouse position fixed
          const zoomRatio = newZoom / zoom;
          const newPanX = mouseX - (mouseX - panX) * zoomRatio;
          const newPanY = mouseY - (mouseY - panY) * zoomRatio;

          setZoom(newZoom);
          setPanX(newPanX);
          setPanY(newPanY);
        }
      } else if (zoom > 1) {
        // Two-finger trackpad gesture = pan when zoomed
        e.preventDefault();

        // Use deltaX and deltaY for panning
        const panSpeed = 1;
        setPanX(panX - e.deltaX * panSpeed);
        setPanY(panY - e.deltaY * panSpeed);
      }
    };

    // Add wheel event listener with non-passive option to allow preventDefault
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [zoom, panX, panY]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [touchStartDistance, setTouchStartDistance] = useState(0);
  const [isPinching, setIsPinching] = useState(false);
  const [lastTouchCenter, setLastTouchCenter] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert screen coordinates to canvas coordinates for drawing
  const convertToCanvasCoords = useCallback(
    (screenCoords: Array<{ x: number; y: number }>) => {
      if (!containerRef.current) return screenCoords;

      const containerRect = containerRef.current.getBoundingClientRect();
      return screenCoords.map((point) => ({
        x: point.x - containerRect.left,
        y: point.y - containerRect.top,
      }));
    },
    [],
  );

  const handleZoomIn = () => {
    haptics.zoom();
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };
  const handleZoomOut = () => {
    haptics.zoom();
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };
  const handleResetZoom = () => {
    haptics.buttonPress();
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // Get touch distance for pinch detection
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get touch center point
  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return { x: 0, y: 0 };
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  // Touch event handlers for pinch-to-zoom and drawing
  const handleTouchStart = (e: React.TouchEvent) => {
    console.log(
      "ImageBox: Touch start, touches:",
      e.touches.length,
      "drawing enabled:",
      drawingEnabled,
    );
    if (e.touches.length === 2) {
      // Two fingers - start pinch
      setIsPinching(true);
      setTouchStartDistance(getTouchDistance(e.touches));
      setLastTouchCenter(getTouchCenter(e.touches));
      e.preventDefault();
    } else if (e.touches.length === 1 && drawingEnabled && !isPinching) {
      // Single finger - start drawing
      console.log("ImageBox: Starting touch drawing");
      setIsDrawing(true);
      haptics.drawStart();
      onDrawingStart(e);
    } else if (e.touches.length === 1 && !drawingEnabled && zoom > 1) {
      // Single finger - start panning when zoomed
      const touch = e.touches[0];
      setLastTouchCenter({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPinching && e.touches.length === 2) {
      // Handle pinch zoom
      const currentDistance = getTouchDistance(e.touches);
      const currentCenter = getTouchCenter(e.touches);

      if (touchStartDistance > 0) {
        const scaleChange = currentDistance / touchStartDistance;
        const newZoom = Math.min(Math.max(zoom * scaleChange, 0.5), 3);

        // Update zoom centered around pinch point
        const centerDeltaX = currentCenter.x - lastTouchCenter.x;
        const centerDeltaY = currentCenter.y - lastTouchCenter.y;

        setZoom(newZoom);
        setPanX(panX + centerDeltaX);
        setPanY(panY + centerDeltaY);

        setTouchStartDistance(currentDistance);
        setLastTouchCenter(currentCenter);
      }
      e.preventDefault();
    } else if (isDrawing && drawingEnabled && e.touches.length === 1) {
      // Handle drawing
      console.log("ImageBox: Touch drawing move");
      onDrawingMove(e);
      e.preventDefault();
    } else if (
      zoom > 1 &&
      e.touches.length === 1 &&
      !drawingEnabled &&
      !isPinching
    ) {
      // Handle panning when zoomed
      const touch = e.touches[0];
      if (lastTouchCenter.x !== 0 || lastTouchCenter.y !== 0) {
        const deltaX = touch.clientX - lastTouchCenter.x;
        const deltaY = touch.clientY - lastTouchCenter.y;

        setPanX(panX + deltaX);
        setPanY(panY + deltaY);
      }

      setLastTouchCenter({ x: touch.clientX, y: touch.clientY });
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    console.log(
      "ImageBox: Touch end, was drawing:",
      isDrawing,
      "was pinching:",
      isPinching,
    );
    if (isPinching) {
      setIsPinching(false);
      setTouchStartDistance(0);
    }
    if (isDrawing) {
      console.log("ImageBox: Ending touch drawing");
      setIsDrawing(false);
      haptics.drawEnd();
      onDrawingEnd();
    }

    // Reset touch center when touches end
    if (e.touches.length === 0) {
      setLastTouchCenter({ x: 0, y: 0 });
    }
  };

  // Mouse event handlers for drawing
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("ImageBox: Mouse down, drawing enabled:", drawingEnabled);
    if (drawingEnabled && !isPinching) {
      setIsDrawing(true);
      haptics.drawStart();
      onDrawingStart(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && drawingEnabled) {
      onDrawingMove(e);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      haptics.drawEnd();
      onDrawingEnd();
    }
  };

  // Draw on canvas - convert screen coords to canvas coords
  useEffect(() => {
    console.log(
      "Canvas effect running, paths:",
      drawnPaths.length,
      "selected area:",
      !!selectedArea,
    );
    const canvas = drawingCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      console.log("Canvas or container not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("Canvas context not found");
      return;
    }

    // Set canvas size to match container
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    console.log("Canvas size set to:", canvas.width, "x", canvas.height);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Convert screen coordinates to canvas coordinates and draw paths
    if (drawnPaths.length > 1) {
      const canvasCoords = convertToCanvasCoords(drawnPaths);
      console.log("Drawing paths on canvas:", canvasCoords);

      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(canvasCoords[0].x, canvasCoords[0].y);

      for (let i = 1; i < canvasCoords.length; i++) {
        ctx.lineTo(canvasCoords[i].x, canvasCoords[i].y);
      }

      ctx.stroke();
    }

    // Convert selected area coordinates and draw bounding box
    if (selectedArea) {
      const containerRect = container.getBoundingClientRect();
      const canvasBounds = {
        x: selectedArea.x - containerRect.left,
        y: selectedArea.y - containerRect.top,
        width: selectedArea.width,
        height: selectedArea.height,
      };

      console.log("Drawing bounding box on canvas:", canvasBounds);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        canvasBounds.x,
        canvasBounds.y,
        canvasBounds.width,
        canvasBounds.height,
      );
      ctx.setLineDash([]);
    }
  }, [drawnPaths, selectedArea, convertToCanvasCoords]);

  const startCamera = async () => {
    setCameraLoading(true);
    setCameraError(null);
    logger.info("🎥 Starting camera initialization...");

    // Wait for video element to be available
    let retries = 0;
    const maxRetries = 5;
    while (!videoRef.current && retries < maxRetries) {
      logger.debug(
        `⏳ Waiting for video element... (attempt ${retries + 1}/${maxRetries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      retries++;
    }

    if (!videoRef.current) {
      logger.error("❌ Video element missing after retries", {
        attempts: maxRetries,
        ref: "videoRef.current is still null",
      });
      setCameraError(
        "Camera interface failed to initialize. Please refresh and try again.",
      );
      setCameraLoading(false);
      haptics.error();
      return;
    }

    logger.success(
      "✅ Video element found, proceeding with camera initialization",
    );

    try {
      // Comprehensive browser support check
      if (!navigator.mediaDevices) {
        const error = "MediaDevices API not supported in this browser";
        logger.error("Camera initialization failed", {
          reason: "MediaDevices API not supported",
        });
        throw new Error(error);
      }

      if (!navigator.mediaDevices.getUserMedia) {
        const error = "getUserMedia not supported in this browser";
        logger.error("Camera initialization failed", {
          reason: "getUserMedia not supported",
        });
        throw new Error(error);
      }

      // Check for secure context (HTTPS or localhost)
      const isSecure =
        window.isSecureContext ||
        location.protocol === "https:" ||
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1";
      if (!isSecure) {
        const error = "Camera access requires HTTPS or localhost";
        logger.error("Camera initialization failed", {
          reason: "Insecure context",
          protocol: location.protocol,
          hostname: location.hostname,
        });
        throw new Error(error);
      }

      logger.info(
        "🔍 Browser environment check passed, requesting camera permission...",
      );

      // Enhanced camera constraints for better mobile support
      const constraints = {
        video: {
          width: { ideal: 1280, min: 320, max: 1920 },
          height: { ideal: 720, min: 240, max: 1080 },
          facingMode: facingMode, // Back camera preferred on mobile
          frameRate: { ideal: 30, min: 15 },
          aspectRatio: { ideal: 16 / 9 },
        },
        audio: false,
      };

      logger.debug("Camera constraints", constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      logger.success("🎉 Camera stream obtained successfully");

      const videoTracks = stream.getVideoTracks();
      logger.info("Video tracks obtained", {
        count: videoTracks.length,
        tracks: videoTracks.map((track) => ({
          id: track.id,
          label: track.label,
          kind: track.kind,
          readyState: track.readyState,
          enabled: track.enabled,
        })),
      });

      if (videoTracks.length === 0) {
        const error = "No video tracks available in stream";
        logger.error("Camera stream validation failed", {
          reason: "No video tracks",
        });
        throw new Error(error);
      }

      const videoTrack = videoTracks[0];
      const trackSettings = videoTrack.getSettings();
      logger.info("Video track settings", trackSettings);

      if (videoRef.current) {
        // Clean up any existing stream
        if (videoRef.current.srcObject) {
          const oldStream = videoRef.current.srcObject as MediaStream;
          oldStream.getTracks().forEach((track) => {
            track.stop();
            logger.debug("Stopped old video track", { id: track.id });
          });
        }

        // Reset video element properties
        videoRef.current.srcObject = null;
        videoRef.current.load();

        // Set up comprehensive event handlers
        const videoElement = videoRef.current;

        const cleanup = () => {
          videoElement.onloadstart = null;
          videoElement.onloadedmetadata = null;
          videoElement.oncanplay = null;
          videoElement.oncanplaythrough = null;
          videoElement.onplay = null;
          videoElement.onplaying = null;
          videoElement.onerror = null;
          videoElement.onabort = null;
          videoElement.onemptied = null;
        };

        videoElement.onloadstart = () => {
          logger.debug("📺 Video load started");
        };

        videoElement.onloadedmetadata = () => {
          logger.success("📊 Video metadata loaded", {
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
            duration: videoElement.duration,
            readyState: videoElement.readyState,
          });
        };

        videoElement.oncanplay = () => {
          logger.success("▶️ Video can start playing");
          setCameraLoading(false);
          haptics.success();
          cleanup();
        };

        videoElement.oncanplaythrough = () => {
          logger.debug("⏩ Video can play through without buffering");
        };

        videoElement.onplay = () => {
          logger.debug("▶️ Video playback started");
        };

        videoElement.onplaying = () => {
          logger.success("🎬 Video is actively playing");
        };

        videoElement.onerror = (e) => {
          const error = videoElement.error;
          logger.error("❌ Video element error", {
            code: error?.code,
            message: error?.message,
            event: e,
          });
          setCameraError(
            `Video playback error: ${error?.message || "Unknown error"}`,
          );
          haptics.error();
          cleanup();
        };

        videoElement.onabort = () => {
          logger.warn("⏹️ Video playback aborted");
        };

        videoElement.onemptied = () => {
          logger.debug("🗑️ Video element emptied");
        };

        // Set the stream source
        logger.info("🔗 Connecting stream to video element...");
        videoElement.srcObject = stream;

        // Force play with timeout fallback
        const playTimeout = setTimeout(() => {
          logger.error("⏰ Video play timeout - forcing error state");
          setCameraError("Camera initialization timeout");
          haptics.error();
          cleanup();
        }, 10000); // 10 second timeout

        try {
          logger.debug("▶️ Attempting to start video playback...");
          const playPromise = videoElement.play();

          if (playPromise !== undefined) {
            await playPromise;
            clearTimeout(playTimeout);
            logger.success("✅ Video playback started successfully");

            // Final validation
            setTimeout(() => {
              if (
                videoElement.videoWidth === 0 ||
                videoElement.videoHeight === 0
              ) {
                logger.error("⚠️ Video dimensions are zero after play", {
                  width: videoElement.videoWidth,
                  height: videoElement.videoHeight,
                });
                setCameraError("Camera feed not displaying properly");
                haptics.error();
              } else {
                logger.success("🎯 Camera fully operational", {
                  dimensions: `${videoElement.videoWidth}x${videoElement.videoHeight}`,
                  readyState: videoElement.readyState,
                });
              }
            }, 500);
          }
        } catch (playError: any) {
          clearTimeout(playTimeout);
          logger.error("❌ Video play promise rejected", playError);
          throw new Error(`Video playback failed: ${playError.message}`);
        }
      } else {
        const error = "Video element ref not available";
        logger.error("❌ Video element missing", {
          ref: "videoRef.current is null",
        });
        throw new Error(error);
      }
    } catch (error: any) {
      setCameraLoading(false);
      haptics.error();

      let errorMessage = "Camera access failed";
      logger.error("🚫 Camera initialization failed", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Enhanced error categorization
      if (error.name === "NotAllowedError") {
        errorMessage =
          "Camera permission denied. Please allow camera access and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera found on this device.";
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Camera not supported in this browser.";
      } else if (error.name === "NotReadableError") {
        errorMessage = "Camera is already in use by another application.";
      } else if (error.name === "OverconstrainedError") {
        errorMessage =
          "Camera constraints cannot be satisfied. Try a different resolution.";
      } else if (error.name === "AbortError") {
        errorMessage = "Camera access was aborted.";
      } else if (error.name === "SecurityError") {
        errorMessage = "Camera access blocked due to security restrictions.";
      } else if (
        error.message.includes("HTTPS") ||
        error.message.includes("secure")
      ) {
        errorMessage = "Camera requires HTTPS connection or localhost.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Camera initialization timeout. Please try again.";
      } else if (error.message.includes("Video element")) {
        errorMessage =
          "Camera interface error. Please refresh the page and try again.";
      } else {
        errorMessage = `Camera error: ${error.message}`;
      }

      setCameraError(errorMessage);
      logger.error("📱 Final camera error state", {
        errorMessage,
        originalError: error.message,
      });
    }
  };

  const captureImage = () => {
    logger.info("📸 Starting image capture...");

    if (!videoRef.current || !canvasRef.current) {
      logger.error("❌ Capture failed: Missing video or canvas ref", {
        hasVideo: !!videoRef.current,
        hasCanvas: !!canvasRef.current,
      });
      haptics.error();
      setCameraError("Camera components not properly initialized.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Comprehensive video readiness check
    logger.debug("🔍 Checking video readiness...", {
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      currentTime: video.currentTime,
      paused: video.paused,
      ended: video.ended,
    });

    if (video.readyState < 2) {
      logger.error("❌ Video not ready for capture", {
        readyState: video.readyState,
        readyStateText: [
          "HAVE_NOTHING",
          "HAVE_METADATA",
          "HAVE_CURRENT_DATA",
          "HAVE_FUTURE_DATA",
          "HAVE_ENOUGH_DATA",
        ][video.readyState],
      });
      haptics.error();
      setCameraError("Camera not ready. Please wait and try again.");
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      logger.error("❌ Video dimensions are zero", {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });
      haptics.error();
      setCameraError("Invalid video dimensions. Please restart camera.");
      return;
    }

    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    logger.info("📐 Canvas configured for capture", {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });

    if (!ctx) {
      logger.error("❌ Cannot get 2D context from canvas");
      haptics.error();
      setCameraError("Canvas context error. Please try again.");
      return;
    }

    try {
      // Capture the image
      logger.debug("🎬 Drawing video frame to canvas...");
      ctx.drawImage(video, 0, 0);

      // Verify capture success
      const imageData = ctx.getImageData(0, 0, 1, 1);
      if (imageData.data.every((value) => value === 0)) {
        logger.warn("⚠️ Captured image appears to be black/empty");
      }

      const dataURL = canvas.toDataURL("image/png");

      if (dataURL === "data:," || dataURL.length < 100) {
        logger.error("❌ Invalid image data captured", {
          dataURLLength: dataURL.length,
          preview: dataURL.substring(0, 50),
        });
        throw new Error("Failed to capture valid image data");
      }

      logger.success("✅ Image captured successfully", {
        dataSize: `${Math.round(dataURL.length / 1024)}KB`,
        dimensions: `${canvas.width}x${canvas.height}`,
        format: "PNG",
      });

      haptics.cameraCapture();
      onCameraCapture(dataURL);

      // Stop camera stream
      const stream = video.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
          logger.debug("🛑 Stopped camera track", {
            id: track.id,
            kind: track.kind,
          });
        });
        logger.info("📴 Camera stream stopped after capture");
      }
    } catch (error: any) {
      logger.error("❌ Image capture failed", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      haptics.error();
      setCameraError("Failed to capture image. Please try again.");
    }
  };

  const retryCamera = () => {
    startCamera();
  };
  const handleCameraSwitch = () => {
    haptics.buttonTap();
    logger.info(`Switching camera from ${facingMode}`);
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment",
    );
  };

  React.useEffect(() => {
    if (showCamera) {
      // Add a small delay to ensure the video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          logger.info("🎬 Video element found, starting camera...");
          startCamera();
        } else {
          logger.error("❌ Video element still not found after timeout, retrying...");
          // Try again with a longer delay
          setTimeout(() => {
            if (videoRef.current) {
              logger.info("🎬 Video element found on retry, starting camera...");
              startCamera();
            } else {
              logger.error(
                "❌ Video element never found, camera initialization failed",
              );
              setCameraError(
                "Failed to initialize camera interface. Please try again.",
              );
            }
          }, 200);
        }
      }, 50);
    }

    // Cleanup when component unmounts or showCamera becomes false
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          track.stop();
          logger.debug("🛑 Cleaned up camera track on component cleanup");
        });
      }
    };
  }, [showCamera, facingMode]);

  //--- MODIFIED DRAG AND DROP HANDLERS ---
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageDrop?.(file);
    } else {
      logger.error("Invalid file type dropped", { type: file?.type });
    }
  };

  if (showCamera) {
    if (cameraError) {
      return (
        <div className="bg-gray-100 w-full h-full flex flex-col items-center justify-center rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <Camera size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Camera Access Failed
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-md">{cameraError}</p>
          <div className="flex gap-3">
            <button
              onClick={retryCamera}
              className="bg-gray-800 text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-700 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={onCameraError}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl shadow-md hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="gradient-card w-full h-full flex flex-col items-center justify-center rounded-2xl shadow-card border border-white/20 relative overflow-hidden backdrop-blur-xl">
        {/* Always render video element so ref is available */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={() => {
            logger.success("📊 Video metadata loaded, stream should be visible");
            if (videoRef.current) {
              logger.info("Video dimensions", {
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
              });
            }
          }}
          onError={(e) => {
            logger.error("❌ Video element error occurred", e);
          }}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            cameraLoading ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Loading overlay */}
        {cameraLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white/80 to-gray-100/80 backdrop-blur-sm">
            <Camera size={48} className="text-gray-400 mb-4 animate-pulse" />
            <p className="text-gray-600 font-medium">Starting camera...</p>
          </div>
        )}

        {/* Camera controls - only show when camera is ready */}
        {!cameraLoading && (
          <>
            <div className="absolute top-4 right-4">
              <button
                onClick={handleCameraSwitch}
                className="p-3 bg-black/40 text-white rounded-full shadow-lg hover:bg-black/60 transition-all backdrop-blur-sm hover:scale-105"
                title="Switch Camera"
              >
                <RotateCw size={20} />
              </button>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              <button
                onClick={captureImage}
                className="gradient-primary text-white px-6 py-3 rounded-2xl shadow-card hover:shadow-soft transition-all backdrop-blur-xl hover:scale-105"
              >
                Capture
              </button>
              <button
                onClick={() => {
                  haptics.buttonTap();
                  onCameraError();
                }}
                className="gradient-card text-gray-700 px-6 py-3 rounded-2xl shadow-soft hover:shadow-card transition-all backdrop-blur-xl border border-white/20 hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (image) {
    return (
      <div
        ref={containerRef}
        className="gradient-card w-full h-full flex items-center justify-center rounded-2xl shadow-card border border-white/20 relative overflow-hidden backdrop-blur-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ touchAction: "none" }}
      >
        <img
          ref={imageRef}
          src={image}
          alt="Uploaded"
          className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
          style={{
            transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
            cursor: drawingEnabled ? "crosshair" : zoom > 1 ? "grab" : "default",
          }}
          draggable={false}
        />

        {/* Drawing Canvas Overlay */}
        <canvas
          ref={drawingCanvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            zIndex: 10,
            pointerEvents: drawingEnabled ? "none" : "none",
            touchAction: "none",
          }}
        />

        {/* Zoom Controls - moved to bottom-right */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white/90 text-gray-700 rounded-lg shadow-md hover:bg-white transition-all hover:scale-110"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white/90 text-gray-700 rounded-lg shadow-md hover:bg-white transition-all hover:scale-110"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 bg-white/90 text-gray-700 rounded-lg shadow-md hover:bg-white transition-all hover:scale-110"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Drawing Instructions */}
        {drawingEnabled && (
          <div className="absolute top-4 left-4 bg-black/75 text-white px-3 py-2 rounded-lg text-sm">
            {drawnPaths.length === 0
              ? "Draw to select area for search/analysis"
              : `Area selected (${drawnPaths.length} points) - will be used for searches`}
          </div>
        )}

        {/* Search Mode Indicator */}
        {!drawingEnabled && image && (
          <div className="absolute top-4 right-4 bg-blue-600/75 text-white px-3 py-2 rounded-lg text-sm">
            {selectedArea ? "Using selected area" : "Using full image"}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onTriggerUpload}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`gradient-card w-full h-full flex flex-col items-center justify-center rounded-2xl shadow-card border-2 p-8 text-center transition-all duration-300 cursor-pointer ${
        isDraggingOver
          ? "border-blue-500 border-dashed bg-blue-50/50"
          : "border-white/20 border-solid"
      }`}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-white/60 rounded-full shadow-soft border border-white/30">
            <ImageIcon size={40} className="text-gray-500" strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-apple mb-2 font-display">
          Start Your Visual Search
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Drag & drop an image, click to upload, or use your camera. Then, write
          a prompt or draw to start analyzing.
        </p>
      </motion.div>
    </div>
  );
};

const ResponseBox: React.FC<{
  expanded: boolean;
  toggle: () => void;
  response: string;
  isLoading: boolean;
  error: string | null;
}> = ({ expanded, toggle, response, isLoading, error }) => (
  <motion.div
    layout
    transition={{
      layout: { type: "spring", stiffness: 400, damping: 30 },
    }}
    onClick={!expanded ? toggle : undefined}
    className={`gradient-card rounded-2xl shadow-card border border-white/20 overflow-hidden flex flex-col transition-all duration-500 backdrop-blur-xl ${
      expanded
        ? "flex-grow p-8 md:p-10 cursor-default shadow-card"
        : "md:flex-1 h-[40%] md:h-1/3 p-6 md:p-8 cursor-pointer hover:shadow-card hover:border-white/30 hover:-translate-y-1"
    }`}
  >
    <div className="flex justify-between items-center mb-4 md:mb-6">
      <span className="text-xs text-muted-foreground uppercase tracking-wide font-mono">
        Response
      </span>
      <AnimatePresence>
        {expanded && (
          <motion.button
            key="collapse-response"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            onClick={toggle}
            className="p-2 md:p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
          >
            <ChevronUp size={16} className="md:w-[18px] md:h-[18px]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mb-3"></div>
            <p className="text-sm text-muted-foreground">Analyzing image...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">Error:</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : response ? (
        <p className="text-sm md:text-base leading-relaxed text-foreground whitespace-pre-wrap">
          {response}
        </p>
      ) : (
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
          Upload an image and write a prompt to get AI analysis results here.
        </p>
      )}
    </div>
  </motion.div>
);

const OptionsBox: React.FC<{
  onUploadImage: () => void;
  onOpenCamera: () => void;
  onGoogleSearch: () => void;
  hasImage: boolean;
  drawingEnabled: boolean;
  hasDrawings: boolean;
  onToggleDraw: () => void;
  onClearDrawing: () => void;
}> = ({
  onUploadImage,
  onOpenCamera,
  onGoogleSearch,
  hasImage,
  drawingEnabled,
  hasDrawings,
  onToggleDraw,
  onClearDrawing,
}) => {
  const options = [
    {
      icon: Upload,
      label: "Upload Image",
      action: () => {
        haptics.buttonTap();
        onUploadImage();
      },
    },
    {
      icon: Camera,
      label: "Camera",
      action: () => {
        haptics.buttonTap();
        onOpenCamera();
      },
    },
    {
      icon: PenTool,
      label: "Draw",
      action: () => {
        haptics.buttonPress();
        onToggleDraw();
      },
      active: drawingEnabled,
      disabled: !hasImage,
    },
    {
      icon: Eraser,
      label: "Clear Drawing",
      action: () => {
        haptics.buttonPress();
        onClearDrawing();
      },
      disabled: !hasDrawings,
    },
    {
      icon: Search,
      label: "Google Search",
      action: () => {
        haptics.buttonTap();
        onGoogleSearch();
      },
      disabled: !hasImage,
    },
  ];

  return (
    <div className="bg-transparent px-2 md:px-4 py-2 md:py-3 flex items-center w-full justify-between gap-2 md:gap-3">
      {options.map((option, i) => (
        <button
          key={i}
          onClick={option.action}
          title={option.label}
          disabled={option.disabled}
          className={`flex-1 p-3 md:p-4 gradient-card rounded-2xl shadow-soft border border-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-xl hover:-translate-y-1 ${
            option.disabled
              ? "text-gray-400 cursor-not-allowed opacity-50"
              : option.active
                ? "text-blue-600 gradient-primary text-white border-blue-200 hover:shadow-card"
                : "text-primary hover:gradient-soft hover:shadow-card hover:border-white/30"
          }`}
        >
          <option.icon size={18} className="md:w-6 md:h-6" />
        </button>
      ))}
    </div>
  );
};

const TextBox: React.FC<{
  expanded: boolean;
  toggle: () => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  hasImage: boolean;
}> = ({
  expanded,
  toggle,
  prompt,
  onPromptChange,
  onSend,
  isLoading,
  hasImage,
}) => {
  const handleSend = () => {
    if (!isLoading && hasImage && prompt.trim()) {
      onSend();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      layout
      transition={{
        layout: { type: "spring", stiffness: 400, damping: 30 },
      }}
      onClick={!expanded ? toggle : undefined}
      className={`gradient-card rounded-2xl shadow-card border border-white/20 flex flex-col transition-all duration-500 backdrop-blur-xl ${
        expanded
          ? "flex-grow p-8 md:p-10 cursor-default shadow-card"
          : "md:flex-1 h-[60%] md:h-1/3 p-6 md:p-8 cursor-pointer hover:shadow-card hover:border-white/30 hover:-translate-y-1"
      }`}
    >
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <span className="text-xs text-muted-foreground uppercase tracking-wide font-mono">
          Write Prompt
        </span>
        <AnimatePresence>
          {expanded && (
            <motion.button
              key="collapse-text"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              onClick={toggle}
              className="p-2 md:p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
            >
              <ChevronUp size={16} className="md:w-[18px] md:h-[18px]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile collapsed state - only show send button */}
      {!expanded && (
        <div className="md:hidden flex-1 flex items-end justify-end"></div>
      )}

      {/* Desktop collapsed state - show textarea */}
      {!expanded && (
        <div className="hidden md:flex relative flex-1 flex-col min-h-0">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onClick={(e) => e.stopPropagation()}
            placeholder="Write your prompt here..."
            className="w-full flex-1 resize-none outline-none text-base p-4 pb-16 rounded-xl overflow-y-hidden no-scrollbar border border-gray-200 appearance-none bg-gray-50 focus:bg-white focus:border-gray-300 transition-all placeholder-gray-400"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              haptics.buttonPress();
              handleSend();
            }}
            disabled={isLoading || !hasImage || !prompt.trim()}
            className={`absolute bottom-4 right-4 p-3 rounded-2xl shadow-soft transition-all hover:shadow-card backdrop-blur-xl hover:scale-105 ${
              isLoading || !hasImage || !prompt.trim()
                ? "bg-gray-400/80 text-gray-600 cursor-not-allowed"
                : "gradient-primary text-white hover:shadow-card"
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-[18px] w-[18px] border-b-2 border-current"></div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      )}

      {/* Expanded state - show textarea for both mobile and desktop */}
      {expanded && (
        <div className="relative flex-1 flex flex-col min-h-0">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onClick={(e) => e.stopPropagation()}
            placeholder="Write your prompt here..."
            className="w-full flex-1 resize-none outline-none text-sm md:text-base p-3 md:p-4 pb-14 md:pb-16 rounded-xl overflow-y-hidden no-scrollbar border border-gray-200 appearance-none bg-gray-50 focus:bg-white focus:border-gray-300 transition-all placeholder-gray-400"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              haptics.buttonPress();
              handleSend();
            }}
            disabled={isLoading || !hasImage || !prompt.trim()}
            className={`absolute bottom-3 right-3 md:bottom-4 md:right-4 p-2.5 md:p-3 rounded-2xl shadow-soft transition-all hover:shadow-card backdrop-blur-xl hover:scale-105 ${
              isLoading || !hasImage || !prompt.trim()
                ? "bg-gray-400/80 text-gray-600 cursor-not-allowed"
                : "gradient-primary text-white hover:shadow-card"
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Send size={16} className="md:w-[18px] md:h-[18px]" />
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Main Layout Component
const AppLayout: React.FC = () => {
  const [responseExpanded, setResponseExpanded] = useState(false);
  const [textExpanded, setTextExpanded] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [drawnPaths, setDrawnPaths] = useState<Array<{ x: number; y: number }>>(
    [],
  );
  const [selectedArea, setSelectedArea] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePanX, setImagePanX] = useState(0);
  const [imagePanY, setImagePanY] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if(import.meta.env.VITE_FILE_TYPE === 'extension'){
      useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      (async () => {
        const { screenshotUrl } = await chrome.storage.local.get("screenshotUrl");
        if (screenshotUrl) {
          logger.info("📸  Screenshot retrieved from storage");
          setCurrentImage(screenshotUrl);
          setDrawingEnabled(true);
          chrome.storage.local.remove("screenshotUrl");
        }
      })();
    } else {
      logger.debug("🧪  Running outside extension – skipping chrome.storage");
    }
  }, []);
  }


  const handleResponseToggle = () => {
    const wasExpanded = responseExpanded;
    setResponseExpanded((prev) => !prev);
    if (textExpanded) setTextExpanded(false);

    // Add haptic feedback for UI interaction
    if (wasExpanded) {
      haptics.boxCollapse();
      logger.debug("📦 Response box collapsed");
    } else {
      haptics.boxExpand();
      logger.debug("📦 Response box expanded");
    }
  };

  const handleTextToggle = () => {
    const wasExpanded = textExpanded;
    setTextExpanded((prev) => !prev);
    if (responseExpanded) setResponseExpanded(false);

    // Add haptic feedback for UI interaction
    if (wasExpanded) {
      haptics.boxCollapse();
      logger.debug("✏️ Text box collapsed");
    } else {
      haptics.boxExpand();
      logger.debug("✏️ Text box expanded");
    }
  };

  // Centralized function to process a new image file
  const processNewImageFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentImage(e.target?.result as string);
        setShowCamera(false);
        setDrawingEnabled(true);
        // Reset all state when new image loads
        setDrawnPaths([]);
        setSelectedArea(null);
        setImageZoom(1);
        setImagePanX(0);
        setImagePanY(0);
        logger.success("🖼️ New image loaded, all state reset");
      };
      reader.readAsDataURL(file);
    } else {
      logger.error("Invalid file provided", { type: file?.type });
    }
  };

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processNewImageFile(file);
    }
  };

  // Handler for dropped files
  const handleImageDrop = (file: File) => {
    processNewImageFile(file);
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
    setCurrentImage(null);
  };

  const handleCameraCapture = (imageData: string) => {
    setCurrentImage(imageData);
    setShowCamera(false);
    // Auto-enable drawing when image is captured
    setDrawingEnabled(true);
    // Reset all state when new image is captured
    setDrawnPaths([]);
    setSelectedArea(null);
    setImageZoom(1);
    setImagePanX(0);
    setImagePanY(0);
    console.log("Camera image captured, all state reset");
  };

  const handleCameraError = () => {
    setShowCamera(false);
  };

  const handleToggleDraw = () => {
    setDrawingEnabled(!drawingEnabled);
  };

  const clearDrawing = () => {
    setDrawnPaths([]);
    setSelectedArea(null);
    // Ensure zoom/pan state is synchronized after clearing
    console.log("Drawing cleared, current zoom/pan:", {
      zoom: imageZoom,
      panX: imagePanX,
      panY: imagePanY,
    });
  };

  // Drawing handlers - now in AppLayout where state is managed
  const handleDrawingStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      console.log("AppLayout: Drawing start called, zoom/pan state:", {
        zoom: imageZoom,
        panX: imagePanX,
        panY: imagePanY,
      });
      if (!drawingEnabled) return;

      // Clear previous drawing
      setDrawnPaths([]);
      setSelectedArea(null);

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      // Store screen coordinates - ImageBox will convert them for display
      console.log(
        "AppLayout: Starting draw at screen coordinates:",
        clientX,
        clientY,
      );
      setDrawnPaths([{ x: clientX, y: clientY }]);
    },
    [drawingEnabled, imageZoom, imagePanX, imagePanY],
  );

  const handleDrawingMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!drawingEnabled) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      // Store screen coordinates
      setDrawnPaths((prev) => [...prev, { x: clientX, y: clientY }]);
    },
    [drawingEnabled],
  );

  const handleDrawingEnd = useCallback(() => {
    console.log("AppLayout: Drawing end called, paths:", drawnPaths.length, "zoom/pan:", {
      zoom: imageZoom,
      panX: imagePanX,
      panY: imagePanY,
    });
    if (!drawingEnabled || drawnPaths.length < 2) return;

    // Calculate simple bounding rectangle from screen coordinates
    const xs = drawnPaths.map((p) => p.x);
    const ys = drawnPaths.map((p) => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const area = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };

    console.log("AppLayout: Selected area (screen coords):", area);
    setSelectedArea(area);
  }, [drawingEnabled, drawnPaths, imageZoom, imagePanX, imagePanY]);

  // Handle zoom/pan changes from ImageBox
  const handleZoomPanChange = useCallback(
    (zoom: number, panX: number, panY: number) => {
      setImageZoom(zoom);
      setImagePanX(panX);
      setImagePanY(panY);
    },
    [],
  );

  // Crop image to selected area - FIXED VERSION
  const cropImageToSelection = useCallback(
    async (imageDataUrl: string): Promise<string> => {
      if (!selectedArea) {
        logger.debug("❌ No selected area, returning original image");
        return imageDataUrl;
      }

      logger.info("✂️ Starting crop operation...", {
        selectedArea,
        zoom: imageZoom,
        panX: imagePanX,
        panY: imagePanY,
      });

      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          logger.debug("🖼️ Image loaded for cropping", {
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          });

          // Find the currently displayed image element
          const imageElement = document.querySelector(
            'img[alt="Uploaded"]',
          ) as HTMLImageElement;
          if (!imageElement) {
            logger.error("❌ Could not find uploaded image element");
            resolve(imageDataUrl);
            return;
          }

          const container = imageElement.parentElement as HTMLElement;
          if (!container) {
            logger.error("❌ Could not find container element");
            resolve(imageDataUrl);
            return;
          }

          try {
            // Get container and image bounds
            const containerRect = container.getBoundingClientRect();

            // Calculate the actual displayed image size (with object-contain)
            const imageAspect = img.naturalWidth / img.naturalHeight;
            const containerAspect = containerRect.width / containerRect.height;

            let displayedWidth, displayedHeight, offsetX, offsetY;

            if (imageAspect > containerAspect) {
              // Image is wider - limited by container width
              displayedWidth = containerRect.width;
              displayedHeight = containerRect.width / imageAspect;
              offsetX = 0;
              offsetY = (containerRect.height - displayedHeight) / 2;
            } else {
              // Image is taller - limited by container height
              displayedHeight = containerRect.height;
              displayedWidth = containerRect.height * imageAspect;
              offsetX = (containerRect.width - displayedWidth) / 2;
              offsetY = 0;
            }

            logger.debug("📐 Display calculations", {
              displayedWidth,
              displayedHeight,
              offsetX,
              offsetY,
              containerSize: {
                width: containerRect.width,
                height: containerRect.height,
              },
            });

            // Convert selected area from screen coordinates to image coordinates
            // Screen coords → Container coords → Display coords → Natural coords

            // Step 1: Convert screen coordinates to container-relative coordinates
            const containerRelativeX = selectedArea.x - containerRect.left;
            const containerRelativeY = selectedArea.y - containerRect.top;

            // Step 2: Convert to displayed image coordinates (accounting for centering)
            let imageDisplayX = containerRelativeX - offsetX;
            let imageDisplayY = containerRelativeY - offsetY;

            // Step 3: Reverse zoom and pan transformations
            // CSS transform: scale(zoom) translate(panX/zoom, panY/zoom)
            // To reverse: first undo pan, then undo scale
            imageDisplayX = (imageDisplayX - imagePanX) / imageZoom;
            imageDisplayY = (imageDisplayY - imagePanY) / imageZoom;

            const displayWidth = selectedArea.width / imageZoom;
            const displayHeight = selectedArea.height / imageZoom;

            logger.debug("📍 Coordinate conversion", {
              screenCoords: selectedArea,
              containerRelative: { x: containerRelativeX, y: containerRelativeY },
              imageDisplay: {
                x: imageDisplayX,
                y: imageDisplayY,
                width: displayWidth,
                height: displayHeight,
              },
            });

            // Step 4: Convert to natural image coordinates
            const scaleX = img.naturalWidth / displayedWidth;
            const scaleY = img.naturalHeight / displayedHeight;

            let naturalX = Math.round(imageDisplayX * scaleX);
            let naturalY = Math.round(imageDisplayY * scaleY);
            let naturalWidth = Math.round(displayWidth * scaleX);
            let naturalHeight = Math.round(displayHeight * scaleY);

            // Step 5: Clamp to image bounds
            naturalX = Math.max(0, Math.min(naturalX, img.naturalWidth - 1));
            naturalY = Math.max(0, Math.min(naturalY, img.naturalHeight - 1));
            naturalWidth = Math.max(
              1,
              Math.min(naturalWidth, img.naturalWidth - naturalX),
            );
            naturalHeight = Math.max(
              1,
              Math.min(naturalHeight, img.naturalHeight - naturalY),
            );

            logger.info("🎯 Final crop coordinates", {
              x: naturalX,
              y: naturalY,
              width: naturalWidth,
              height: naturalHeight,
              scaleFactors: { scaleX, scaleY },
            });

            // Step 6: Create and draw cropped image
            const cropCanvas = document.createElement("canvas");
            const cropCtx = cropCanvas.getContext("2d");

            if (!cropCtx) {
              logger.error("❌ Could not get crop canvas context");
              resolve(imageDataUrl);
              return;
            }

            cropCanvas.width = naturalWidth;
            cropCanvas.height = naturalHeight;

            logger.debug("🎨 Drawing cropped image", {
              canvasSize: {
                width: cropCanvas.width,
                height: cropCanvas.height,
              },
            });

            // Draw the cropped section
            cropCtx.drawImage(
              img,
              naturalX,
              naturalY,
              naturalWidth,
              naturalHeight, // source rectangle
              0,
              0,
              naturalWidth,
              naturalHeight, // destination rectangle
            );

            const croppedDataUrl = cropCanvas.toDataURL("image/png", 0.9);

            // Validation: check if crop actually worked
            if (croppedDataUrl === "data:," || croppedDataUrl.length < 1000) {
              logger.error("❌ Crop produced invalid data", {
                dataLength: croppedDataUrl.length,
              });
              resolve(imageDataUrl);
              return;
            }

            logger.success("✅ Crop completed successfully", {
              originalSize: `${Math.round(imageDataUrl.length / 1024)}KB`,
              croppedSize: `${Math.round(croppedDataUrl.length / 1024)}KB`,
              dimensions: `${naturalWidth}x${naturalHeight}`,
            });

            resolve(croppedDataUrl);
          } catch (error: any) {
            logger.error("❌ Crop operation failed", {
              error: error.message,
              stack: error.stack,
            });
            resolve(imageDataUrl);
          }
        };

        img.onerror = (error) => {
          logger.error("❌ Failed to load image for cropping", { error });
          resolve(imageDataUrl);
        };

        img.src = imageDataUrl;
      });
    },
    [selectedArea, imageZoom, imagePanX, imagePanY],
  );

  const handleGoogleSearch = async () => {
    if (!currentImage) {
      setError("Please upload an image first");
      return;
    }

    // Use cropped image if area is selected
    const imageToUpload = selectedArea
      ? await cropImageToSelection(currentImage)
      : currentImage;
    console.log(
      "Google Search - using",
      selectedArea ? "cropped area" : "full image",
    );

    setIsLoading(true);
    setError(null);

    try {
      // Debug environment access
      console.log("Environment check:", {
        hasImportMeta: typeof import.meta !== "undefined",
        hasImportMetaEnv: typeof import.meta?.env !== "undefined",
        envKeys:
          typeof import.meta?.env === "object"
            ? Object.keys(import.meta.env)
            : "not available",
      });

      // Get API key from environment with multiple fallback approaches
      let apiKey: string = "";

      // Try import.meta.env first (Vite standard)
      if (typeof import.meta !== "undefined" && import.meta.env) {
        apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        console.log("Found API key via import.meta.env:", !!apiKey);
      }

      // Convert image to base64 for ImgBB upload
      let base64Data: string;

      if (imageToUpload.startsWith("data:")) {
        // If it's already a data URL, extract the base64 part
        base64Data = imageToUpload.split(",")[1];
      } else {
        // If it's a blob URL, convert to base64
        const response = await fetch(imageToUpload);
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        base64Data = dataUrl.split(",")[1];
      }

      // Upload to ImgBB
      const formData = new FormData();
      formData.append("key", apiKey);
      formData.append("image", base64Data);

      console.log("Uploading image to ImgBB...");

      const uploadResponse = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`ImgBB upload failed: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(
          "ImgBB upload failed: " +
            (uploadData.error?.message || "Unknown error"),
        );
      }

      const uploadedImageUrl = uploadData.data.url;
      console.log("Image uploaded successfully:", uploadedImageUrl);

      // Open Google Lens with the uploaded image URL
      const lensUploadUrl = `https://lens.google.com/uploadbyurl?url=${uploadedImageUrl}`;

      // Open Google Lens in a new tab
      window.open(lensUploadUrl, "_blank");

      // Show success message
      setApiResponse(
        "🚀 Image uploaded and Google Lens opened!\n\nGoogle Lens should now be analyzing your image.",
      );

      // Success haptics and response feedback
      haptics.success();
      haptics.responseReceived();
      logger.success("🔍 Google Lens search initiated successfully");

      // Expand response box to show result
      if (!responseExpanded) {
        setResponseExpanded(true);
        setTextExpanded(false);
        haptics.responseBoxOpen();
        logger.info("📖 Response box auto-expanded for Google search result");
      }
    } catch (err: any) {
      console.error("Google search error:", err);
      setError(`Google search failed: ${err.message}`);
      haptics.error();

      // Fallback to manual download method
      const userChoice = window.confirm(
        "❌ Automatic upload failed\n\n" +
          `Error: ${err.message}\n\n` +
          "Would you like to download the image for manual search instead?\n\n" +
          "Click OK to download and get instructions.",
      );

      if (userChoice) {
        try {
          // Create download link
          const link = document.createElement("a");
          link.href = imageToUpload;
          link.download = `search-image-${Date.now()}.jpg`;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Open Google Images
          window.open("https://images.google.com/", "_blank");
          setApiResponse(
            "📁 Image downloaded!\n\n" +
              "1. Go to Google Images\n" +
              "2. Click the camera icon 📷\n" +
              "3. Upload the downloaded image\n" +
              "4. View your results!",
          );

          // Success haptics for download
          haptics.success();

          // Expand response box to show result
          if (!responseExpanded) {
            setResponseExpanded(true);
            setTextExpanded(false);
          }
        } catch (downloadError) {
          setError("Failed to download image");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Convert image to blob for API exactly matching the curl example
  const convertImageToBlob = async (dataURL: string): Promise<Blob> => {
    const response = await fetch(dataURL);
    return await response.blob();
  };

  const handleSendPrompt = async () => {
    if (!currentImage || !prompt.trim()) {
      setError("Please upload an image and enter a prompt");
      logger.warn("⚠️ Send prompt blocked: Missing image or prompt");
      return;
    }

    setIsLoading(true);
    setError(null);
    logger.info("🚀 Starting AI analysis request...");

    try {
      // Use cropped image if area is selected
      const imageToAnalyze = selectedArea
        ? await cropImageToSelection(currentImage)
        : currentImage;

      // Validation: Check if cropping actually happened
      const usedCropping = !!selectedArea;
      const imageSizeChanged = imageToAnalyze.length !== currentImage.length;

      logger.info("🖼️ Image prepared for analysis", {
        usesCropping: usedCropping,
        imageSizeChanged: imageSizeChanged,
        originalSize: `${Math.round(currentImage.length / 1024)}KB`,
        finalSize: `${Math.round(imageToAnalyze.length / 1024)}KB`,
        promptLength: prompt.trim().length,
        sizeReduction: usedCropping
          ? `${Math.round((1 - imageToAnalyze.length / currentImage.length) * 100)}%`
          : "0%",
      });

      // If we expected cropping but sizes are the same, warn about potential crop failure
      if (usedCropping && !imageSizeChanged) {
        logger.warn(
          "⚠️ Cropping was expected but image size unchanged - crop may have failed",
        );
      }

      // Convert image to blob
      const imageBlob = await convertImageToBlob(imageToAnalyze);

      // Create filename matching the curl example pattern
      const timestamp = Date.now();
      const filename = `${timestamp}.jpg`;

      logger.debug("📋 Request preparation complete", {
        imageSize: `${Math.round(imageBlob.size / 1024)}KB`,
        imageType: imageBlob.type,
        filename: filename,
        textLength: prompt.trim().length,
      });

      // Create FormData exactly as shown in curl
      const formData = new FormData();
      formData.append("image", imageBlob, filename);
      formData.append("text", prompt.trim());

      const apiUrl = import.meta.env.VITE_ANALYZE_API_URL || "/api/analyze-image";

      logger.info(`📡 Sending request to API endpoint: ${apiUrl}`);

      const response = await fetch(
        apiUrl,
        {
          method: "POST",
          body: formData,
        },
      );

      logger.info("📡 API response received", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("❌ API request failed", {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
        });
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      logger.success("🎯 API data parsed successfully", {
        hasResponse: !!data.response,
        responseType: typeof data.response,
      });

      // --- MODIFIED LINE ---
      // Changed `data.description` to `data.response` to match the new API output.
      setApiResponse(data.response || "No description received");

      // Success haptics and response received feedback
      haptics.success();
      haptics.responseReceived();
      logger.success("🤖 AI response received", {
        responseLength: (data.response || "").length,
        hasResponse: !!data.response,
      });

      // Expand response box to show result
      if (!responseExpanded) {
        setResponseExpanded(true);
        setTextExpanded(false);
        haptics.responseBoxOpen();
        logger.info("📖 Response box auto-expanded to show AI result");
      }
    } catch (err: any) {
      logger.error("❌ AI analysis request failed", {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
      setError(err.message || "Failed to analyze image");
      haptics.error();
    } finally {
      setIsLoading(false);
      logger.debug("🏁 AI analysis request completed");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row gap-4 p-4 md:p-6 font-body">
      {/* START: MODIFIED STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@600&family=Source+Serif+Pro:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        
        :root {
            /* Light Theme (Default) */
            --background: #faf9f7;      /* Warm paper white */
            --foreground: #2d2d2d;      /* Deep charcoal text */
            --primary: #4a4a4a;         /* Sophisticated gray */
            --muted-foreground: #6b6b6b; /* Gentle gray for secondary text */
            --secondary: #f0ede8;       /* Soft cream */
            --border: rgba(45, 45, 45, 0.12); /* Subtle borders */

            /* Mapped variables */
            --card-bg: rgba(255, 255, 255, 0.75);
            --popover-bg: var(--background);
            --accent-bg: #e8e5e0; /* Darker cream for accents */
            --input-bg: rgba(240, 237, 232, 0.5);
            
            /* Font Variables */
            --font-display: 'Crimson Text', Georgia, 'Times New Roman', serif;
            --font-body: 'Source Serif Pro', Georgia, 'Times New Roman', serif;
            --font-mono: 'IBM Plex Mono', 'Courier New', monospace;
        }

        body {
            background-color: var(--background);
        }

        .font-display { font-family: var(--font-display); }
        .font-body { font-family: var(--font-body); }
        .font-mono { font-family: var(--font-mono); }

        .text-apple { /* Re-purposing for new theme */
          color: var(--foreground);
          letter-spacing: -0.015em;
        }

        /* Removing old animated background */
        .animated-gradient-bg {
          background-color: transparent;
        }

        .gradient-card {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.85) 0%, 
            rgba(250, 249, 247, 0.8) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .gradient-primary {
          background: var(--primary);
          color: var(--background);
        }
        
        .gradient-soft {
          background: linear-gradient(135deg, 
            rgba(74, 74, 74, 0.05) 0%, 
            rgba(74, 74, 74, 0.1) 100%);
        }
        
        .shadow-soft {
          box-shadow: 0 4px 20px rgba(45, 45, 45, 0.08), 0 1px 3px rgba(45, 45, 45, 0.06);
        }
        
        .shadow-card {
          box-shadow: 0 8px 32px rgba(45, 45, 45, 0.08), 0 2px 8px rgba(45, 45, 45, 0.04);
        }
      `}</style>
      {/* END: MODIFIED STYLES */}

      {/* New Background Component */}
      <FlowingBackground />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Image Section */}
      <div className="md:w-2/3 w-full md:h-full h-[65%]">
        <ImageBox
          image={currentImage}
          showCamera={showCamera}
          onCameraCapture={handleCameraCapture}
          onCameraError={handleCameraError}
          drawingEnabled={drawingEnabled}
          drawnPaths={drawnPaths}
          selectedArea={selectedArea}
          onDrawingStart={handleDrawingStart}
          onDrawingMove={handleDrawingMove}
          onDrawingEnd={handleDrawingEnd}
          onZoomPanChange={handleZoomPanChange}
          onImageDrop={handleImageDrop}
          onTriggerUpload={handleUploadImage}
        />
      </div>

      {/* Interactive Section */}
      <div className="md:w-1/3 w-full md:h-full h-[35%] flex flex-col gap-4 min-h-0">
        <AnimatePresence>
          {!responseExpanded && !textExpanded && (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <OptionsBox
                onUploadImage={handleUploadImage}
                onOpenCamera={handleOpenCamera}
                onGoogleSearch={handleGoogleSearch}
                hasImage={!!currentImage}
                drawingEnabled={drawingEnabled}
                hasDrawings={drawnPaths.length > 0}
                onToggleDraw={handleToggleDraw}
                onClearDrawing={clearDrawing}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!textExpanded && (
            <motion.div
              key="response"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <ResponseBox
                expanded={responseExpanded}
                toggle={handleResponseToggle}
                response={apiResponse}
                isLoading={isLoading}
                error={error}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!responseExpanded && (
            <motion.div
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <TextBox
                expanded={textExpanded}
                toggle={handleTextToggle}
                prompt={prompt}
                onPromptChange={setPrompt}
                onSend={handleSendPrompt}
                isLoading={isLoading}
                hasImage={!!currentImage}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!responseExpanded && !textExpanded && (
            <motion.div
              key="footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center text-xs text-muted-foreground font-mono flex items-center justify-center gap-1 py-2"
            >
              made with <Heart size={10} className="inline text-red-400" /> by
              yash kumar
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppLayout;