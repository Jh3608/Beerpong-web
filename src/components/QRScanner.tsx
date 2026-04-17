import React, { useRef, useEffect } from 'react';

interface QRScannerProps {
  onScanned: (code: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanned, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('[QRScanner] Camera error:', error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    // For now, just extract text from the canvas
    // In a real app, you'd use a QR code library
    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Simple fallback: ask user to enter code manually
    const code = prompt('QR-Code konnte nicht automatisch gescannt werden. Bitte geben Sie den Code manuell ein:');
    if (code) {
      onScanned(code.toUpperCase());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg overflow-hidden max-w-md w-full">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full aspect-square object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={handleCapture}
            className="w-full px-4 py-2 bg-primary text-secondary font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            📷 Foto aufnehmen
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-surface border border-border text-foreground rounded-lg hover:bg-opacity-80 transition-all"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
