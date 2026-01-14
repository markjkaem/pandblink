"use client";

import { useState } from "react";
import { type PresetType, getCreditCost, PRESET_INFO } from "@/lib/stripe";

export type { PresetType };
export { getCreditCost };

export interface EnhancementSettings {
  preset: PresetType;
  strength: number;
  faceEnhance: boolean;
}

interface EnhancementOptionsProps {
  settings: EnhancementSettings;
  onChange: (settings: EnhancementSettings) => void;
  credits: number;
  disabled?: boolean;
}

const PRESETS = (Object.keys(PRESET_INFO) as PresetType[]).map((id) => ({
  id,
  ...PRESET_INFO[id],
}));

export default function EnhancementOptions({
  settings,
  onChange,
  credits,
  disabled = false,
}: EnhancementOptionsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetChange = (preset: PresetType) => {
    onChange({ ...settings, preset });
  };

  const handleStrengthChange = (strength: number) => {
    onChange({ ...settings, strength });
  };

  const handleFaceEnhanceChange = (faceEnhance: boolean) => {
    onChange({ ...settings, faceEnhance });
  };

  const currentCost = getCreditCost(settings.preset);
  const canAfford = credits >= currentCost;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Kies je verbetermodus
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((preset) => {
            const isSelected = settings.preset === preset.id;
            const affordable = credits >= preset.credits;

            return (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                disabled={disabled || !affordable}
                className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? "border-orange-500 bg-orange-50"
                    : affordable
                    ? "border-slate-200 hover:border-orange-300 hover:bg-slate-50"
                    : "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {preset.badge && (
                  <span
                    className={`absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full ${
                      preset.badge === "Populair"
                        ? "bg-orange-500 text-white"
                        : "bg-slate-700 text-white"
                    }`}
                  >
                    {preset.badge}
                  </span>
                )}
                <div className="font-medium text-slate-900 text-sm">
                  {preset.name}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {preset.description}
                </div>
                <div
                  className={`text-xs font-medium mt-2 ${
                    isSelected ? "text-orange-600" : "text-slate-600"
                  }`}
                >
                  {preset.credits} credit{preset.credits > 1 ? "s" : ""}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
        disabled={disabled}
      >
        <svg
          className={`w-4 h-4 transition-transform ${
            showAdvanced ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        Geavanceerde opties
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t border-slate-100">
          {/* Strength Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">
                Verbetersterkte
              </label>
              <span className="text-sm text-orange-600 font-medium">
                {settings.strength}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={settings.strength}
              onChange={(e) => handleStrengthChange(parseInt(e.target.value))}
              disabled={disabled}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Subtiel</span>
              <span>Normaal</span>
              <span>Intens</span>
            </div>
          </div>

          {/* Face Enhancement Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Gezichtsverbetering
              </label>
              <p className="text-xs text-slate-500">
                Optimaliseer gezichten in de foto
              </p>
            </div>
            <button
              onClick={() => handleFaceEnhanceChange(!settings.faceEnhance)}
              disabled={disabled}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings.faceEnhance ? "bg-orange-500" : "bg-slate-200"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.faceEnhance ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Cost Summary */}
      <div
        className={`flex items-center justify-between p-3 rounded-lg ${
          canAfford ? "bg-orange-50" : "bg-red-50"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-5 h-5 ${
              canAfford ? "text-orange-500" : "text-red-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span
            className={`text-sm font-medium ${
              canAfford ? "text-orange-700" : "text-red-700"
            }`}
          >
            Kosten: {currentCost} credit{currentCost > 1 ? "s" : ""}
          </span>
        </div>
        <span
          className={`text-sm ${
            canAfford ? "text-orange-600" : "text-red-600"
          }`}
        >
          {canAfford
            ? `${credits - currentCost} credits over na verbetering`
            : "Niet genoeg credits"}
        </span>
      </div>
    </div>
  );
}
