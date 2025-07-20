import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { compressImage, validateImageFile } from '../utils/imageUtils';
import { useToast } from '../hooks/use-toast';

const CameraCapture = ({ onImageCapture, onClose, isOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera by default
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setCameraStarted(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions or use file upload.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraStarted(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
  }, []);

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setIsLoading(true);
      
      const compressedImage = await compressImage(file);
      setCapturedImage(compressedImage);
    } catch (error) {
      toast({
        title: "File Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleConfirmImage = useCallback(() => {
    if (capturedImage) {
      onImageCapture(capturedImage);
      resetCapture();
      onClose();
    }
  }, [capturedImage, onImageCapture, onClose]);

  const resetCapture = useCallback(() => {
    setCapturedImage(null);
    stopCamera();
  }, [stopCamera]);

  const handleClose = useCallback(() => {
    resetCapture();
    onClose();
  }, [resetCapture, onClose]);

  React.useEffect(() => {
    if (isOpen && !cameraStarted && !capturedImage) {
      startCamera();
    }
    return () => {
      if (!isOpen) {
        stopCamera();
      }
    };
  }, [isOpen, cameraStarted, capturedImage, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden">
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Capture Product Image</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Camera/Image Area */}
          <div className="relative bg-gray-900 min-h-[300px] flex items-center justify-center">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="max-w-full max-h-[400px] object-contain"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-auto ${cameraStarted ? 'block' : 'hidden'}`}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p>Starting camera...</p>
                    </div>
                  </div>
                )}
                {!cameraStarted && !isLoading && (
                  <div className="text-white text-center p-4">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Camera not started</p>
                  </div>
                )}
              </>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls */}
          <div className="p-4 space-y-3">
            {capturedImage ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCapturedImage(null)}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={handleConfirmImage}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Use Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={capturePhoto}
                  disabled={!cameraStarted || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
                
                <div className="text-center text-sm text-gray-500">or</div>
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  disabled={isLoading}
                >
                  Choose from Gallery
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CameraCapture;