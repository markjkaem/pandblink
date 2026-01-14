"use client";

import { useState, useCallback, useRef } from "react";
import type { QueuedImage } from "@/components/MultiImageUploader";
import type { PresetType, EnhancementSettings } from "@/components/EnhancementOptions";
import { getCreditCost } from "@/components/EnhancementOptions";

interface UseEnhancementQueueOptions {
  onCreditsUpdate?: (credits: number) => void;
  onComplete?: (results: QueuedImage[]) => void;
  onError?: (error: string) => void;
}

interface EnhancementQueueState {
  isProcessing: boolean;
  currentIndex: number;
  totalImages: number;
  completedCount: number;
  failedCount: number;
}

export function useEnhancementQueue(options: UseEnhancementQueueOptions = {}) {
  const { onCreditsUpdate, onComplete, onError } = options;
  const [state, setState] = useState<EnhancementQueueState>({
    isProcessing: false,
    currentIndex: 0,
    totalImages: 0,
    completedCount: 0,
    failedCount: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const enhanceImage = async (
    image: QueuedImage,
    settings: EnhancementSettings,
    signal: AbortSignal
  ): Promise<{ url: string; remainingCredits: number }> => {
    const formData = new FormData();
    formData.append("image", image.file);
    formData.append("preset", settings.preset);
    formData.append("options", JSON.stringify({
      strength: settings.strength,
      faceEnhance: settings.faceEnhance,
    }));

    const response = await fetch("/api/enhance", {
      method: "POST",
      body: formData,
      signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Verbetering mislukt");
    }

    return {
      url: data.enhancedImageUrl,
      remainingCredits: data.remainingCredits,
    };
  };

  const startQueue = useCallback(
    async (
      images: QueuedImage[],
      settings: EnhancementSettings,
      updateImages: (updater: (prev: QueuedImage[]) => QueuedImage[]) => void
    ) => {
      const pendingImages = images.filter((img) => img.status === "pending");

      if (pendingImages.length === 0) {
        onError?.("Geen foto's om te verbeteren");
        return;
      }

      abortControllerRef.current = new AbortController();

      setState({
        isProcessing: true,
        currentIndex: 0,
        totalImages: pendingImages.length,
        completedCount: 0,
        failedCount: 0,
      });

      let completedCount = 0;
      let failedCount = 0;

      for (let i = 0; i < pendingImages.length; i++) {
        if (abortControllerRef.current.signal.aborted) {
          break;
        }

        const image = pendingImages[i];

        // Update status to processing
        updateImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: "processing" as const } : img
          )
        );

        setState((prev) => ({ ...prev, currentIndex: i }));

        try {
          const result = await enhanceImage(
            image,
            settings,
            abortControllerRef.current.signal
          );

          // Update status to completed
          updateImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? { ...img, status: "completed" as const, enhancedUrl: result.url }
                : img
            )
          );

          completedCount++;
          setState((prev) => ({ ...prev, completedCount }));
          onCreditsUpdate?.(result.remainingCredits);
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            // Cancelled, reset status to pending
            updateImages((prev) =>
              prev.map((img) =>
                img.id === image.id ? { ...img, status: "pending" as const } : img
              )
            );
            break;
          }

          // Update status to failed
          updateImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? {
                    ...img,
                    status: "failed" as const,
                    error: error instanceof Error ? error.message : "Onbekende fout",
                  }
                : img
            )
          );

          failedCount++;
          setState((prev) => ({ ...prev, failedCount }));
        }
      }

      setState((prev) => ({ ...prev, isProcessing: false }));

      // Get final results
      const finalResults = images.map((img) => {
        const pending = pendingImages.find((p) => p.id === img.id);
        if (pending) {
          // Return updated image (need to get from current state)
          return img;
        }
        return img;
      });

      onComplete?.(finalResults);
    },
    [onCreditsUpdate, onComplete, onError]
  );

  const cancelQueue = useCallback(() => {
    abortControllerRef.current?.abort();
    setState((prev) => ({ ...prev, isProcessing: false }));
  }, []);

  const retryFailed = useCallback(
    (
      images: QueuedImage[],
      settings: EnhancementSettings,
      updateImages: (updater: (prev: QueuedImage[]) => QueuedImage[]) => void
    ) => {
      // Reset failed images to pending
      updateImages((prev) =>
        prev.map((img) =>
          img.status === "failed"
            ? { ...img, status: "pending" as const, error: undefined }
            : img
        )
      );

      // Start queue again
      startQueue(images, settings, updateImages);
    },
    [startQueue]
  );

  const getTotalCost = useCallback(
    (images: QueuedImage[], preset: PresetType): number => {
      const pendingCount = images.filter((img) => img.status === "pending").length;
      return pendingCount * getCreditCost(preset);
    },
    []
  );

  return {
    ...state,
    startQueue,
    cancelQueue,
    retryFailed,
    getTotalCost,
  };
}
