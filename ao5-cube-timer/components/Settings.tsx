'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { CubeType } from './types';

interface SettingsProps {
  isInspectionEnabled: boolean;
  onInspectionToggle: (enabled: boolean) => void;
  inspectionTime: number;
  onInspectionTimeChange: (time: number) => void;
  cubeType: CubeType;
  onCubeTypeChange: (type: CubeType) => void;
  isZenMode: boolean;
  onZenModeToggle: (enabled: boolean) => void;
  isSoundEnabled?: boolean;
  onSoundToggle?: (enabled: boolean) => void;
  isHapticsEnabled?: boolean;
  onHapticsToggle?: (enabled: boolean) => void;
  armDelayMs?: number;
  onArmDelayChange?: (ms: number) => void;
}

const cubeTypes: CubeType[] = ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7', 'OH', 'BLD', 'FMC'];

export default function Settings({
  isInspectionEnabled,
  onInspectionToggle,
  inspectionTime,
  onInspectionTimeChange,
  cubeType,
  onCubeTypeChange,
  isZenMode,
  onZenModeToggle,
  isSoundEnabled = true,
  onSoundToggle,
  isHapticsEnabled = true,
  onHapticsToggle,
  armDelayMs = 300,
  onArmDelayChange
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 border border-gray-200 dark:border-gray-700"
        aria-label="Settings"
      >
        <SettingsIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Sound */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Beeps
                </label>
                <button
                  onClick={() => onSoundToggle?.(!isSoundEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isSoundEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isSoundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Haptics */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Haptics
                </label>
                <button
                  onClick={() => onHapticsToggle?.(!isHapticsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isHapticsEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isHapticsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Zen Mode */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Zen Mode
                </label>
                <button
                  onClick={() => onZenModeToggle(!isZenMode)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isZenMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isZenMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Inspection */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Inspection
                </label>
                <button
                  onClick={() => onInspectionToggle(!isInspectionEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isInspectionEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isInspectionEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Inspection Time */}
              {isInspectionEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Inspection Time: {inspectionTime}s
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="30"
                    value={inspectionTime}
                    onChange={(e) => onInspectionTimeChange(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Arm Delay */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Arm Delay: {armDelayMs}ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="50"
                  value={armDelayMs}
                  onChange={(e) => onArmDelayChange?.(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Cube Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event
                </label>
                <select
                  value={cubeType}
                  onChange={(e) => onCubeTypeChange(e.target.value as CubeType)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  {cubeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
