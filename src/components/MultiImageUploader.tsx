"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

export interface QueuedImage {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "processing" | "completed" | "failed";
  enhancedUrl?: string;
  error?: string;
  progress?: number;
}

interface MultiImageUploaderProps {
  images: QueuedImage[];
  onImagesChange: (images: QueuedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function MultiImageUploader({
  images,
  onImagesChange,
  maxImages = 20,
  disabled = false,
}: MultiImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleFiles = useCallback(
    (files: FileList) => {
      const newImages: QueuedImage[] = [];
      const remainingSlots = maxImages - images.length;

      Array.from(files).slice(0, remainingSlots).forEach((file) => {
        if (file.type.startsWith("image/")) {
          newImages.push({
            id: generateId(),
            file,
            preview: URL.createObjectURL(file),
            status: "pending",
          });
        }
      });

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    },
    [images, maxImages, onImagesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
      // Reset input value to allow selecting the same files again
      e.target.value = "";
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    (id: string) => {
      const image = images.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      onImagesChange(images.filter((img) => img.id !== id));
    },
    [images, onImagesChange]
  );

  const clearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    onImagesChange([]);
  }, [images, onImagesChange]);

  const pendingCount = images.filter((img) => img.status === "pending").length;
  const processingCount = images.filter((img) => img.status === "processing").length;
  const completedCount = images.filter((img) => img.status === "completed").length;
  const failedCount = images.filter((img) => img.status === "failed").length;

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragActive
            ? "border-orange-500 bg-orange-50"
            : "border-slate-300 hover:border-orange-400 hover:bg-slate-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || images.length >= maxImages}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {images.length === 0
                ? "Sleep je foto's hierheen"
                : "Voeg meer foto's toe"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              of <span className="text-orange-500 font-medium">klik om te selecteren</span>
            </p>
          </div>
          <p className="text-xs text-slate-400">
            JPG, PNG of WebP • Max 10MB per foto • Max {maxImages} foto&apos;s
          </p>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <>
          {/* Stats Bar */}
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-600">
                <span className="font-medium">{images.length}</span> foto&apos;s
              </span>
              {pendingCount > 0 && (
                <span className="text-slate-500">
                  {pendingCount} wachtend
                </span>
              )}
              {processingCount > 0 && (
                <span className="text-orange-600">
                  {processingCount} bezig
                </span>
              )}
              {completedCount > 0 && (
                <span className="text-green-600">
                  {completedCount} klaar
                </span>
              )}
              {failedCount > 0 && (
                <span className="text-red-600">
                  {failedCount} mislukt
                </span>
              )}
            </div>
            <button
              onClick={clearAll}
              disabled={disabled}
              className="text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
            >
              Alles wissen
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 ${
                  image.status === "completed"
                    ? "border-green-500"
                    : image.status === "failed"
                    ? "border-red-500"
                    : image.status === "processing"
                    ? "border-orange-500"
                    : "border-slate-200"
                }`}
              >
                <Image
                  src={image.enhancedUrl || image.preview}
                  alt={image.file.name}
                  fill
                  className="object-cover"
                  unoptimized
                />

                {/* Status Overlay */}
                {image.status === "processing" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-white animate-spin mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-white text-xs mt-2 block">
                        Verbeteren...
                      </span>
                    </div>
                  </div>
                )}

                {/* Completed Badge */}
                {image.status === "completed" && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                {/* Failed Badge */}
                {image.status === "failed" && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <div className="bg-red-500 text-white p-2 rounded-lg text-xs text-center max-w-[80%]">
                      {image.error || "Mislukt"}
                    </div>
                  </div>
                )}

                {/* Remove Button (only for pending) */}
                {image.status === "pending" && !disabled && (
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                {/* File Name */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs truncate">
                    {image.file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
