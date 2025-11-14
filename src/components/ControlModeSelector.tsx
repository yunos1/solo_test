import React, { useState } from 'react';
import { Direction } from '../types/game';

export type ControlMode = 'swipe' | 'joystick' | 'buttons';

interface ControlModeSelectorProps {
  currentMode: ControlMode;
  onModeChange: (mode: ControlMode) => void;
  isEnabled?: boolean;
}

const ControlModeSelector: React.FC<ControlModeSelectorProps> = ({
  currentMode,
  onModeChange,
  isEnabled = true
}) => {
  const modes = [
    {
      id: 'swipe' as ControlMode,
      name: '滑动控制',
      description: '在屏幕上滑动来控制方向',
      icon: '👆',
      color: 'blue'
    },
    {
      id: 'joystick' as ControlMode,
      name: '虚拟摇杆',
      description: '拖拽摇杆来控制方向',
      icon: '🎮',
      color: 'green'
    },
    {
      id: 'buttons' as ControlMode,
      name: '方向按钮',
      description: '点击方向按钮来控制',
      icon: '🎯',
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
    }
    
    if (isSelected) {
      switch (color) {
        case 'blue':
          return 'bg-blue-500 text-white border-blue-600 shadow-lg';
        case 'green':
          return 'bg-green-500 text-white border-green-600 shadow-lg';
        case 'purple':
          return 'bg-purple-500 text-white border-purple-600 shadow-lg';
        default:
          return 'bg-blue-500 text-white border-blue-600 shadow-lg';
      }
    } else {
      switch (color) {
        case 'blue':
          return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
        case 'green':
          return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
        case 'purple':
          return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
        default:
          return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">控制方式</h3>
        <p className="text-sm text-gray-600">
          选择你喜欢的移动端控制方式
        </p>
      </div>

      <div className="space-y-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => isEnabled && onModeChange(mode.id)}
            disabled={!isEnabled}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              getColorClasses(mode.color, currentMode === mode.id, !isEnabled)
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{mode.icon}</div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">{mode.name}</div>
                <div className="text-xs opacity-80">{mode.description}</div>
              </div>
              {currentMode === mode.id && (
                <div className="text-xl">✓</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {isEnabled && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600">
            <span className="font-medium">当前选择：</span>
            {modes.find(mode => mode.id === currentMode)?.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlModeSelector;