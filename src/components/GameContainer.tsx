import React, { useState, useEffect } from 'react';

interface GameContainerProps {
  children: React.ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({ children }) => {
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);

  useEffect(() => {
    // 防止页面滚动
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };

    // 添加触摸事件监听器防止滚动
    document.body.addEventListener('touchmove', preventScroll, { passive: false });
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    return () => {
      document.body.removeEventListener('touchmove', preventScroll);
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* 游戏主体区域 */}
      <div className="h-screen flex flex-col">
        {/* 顶部标题 */}
        <div className="flex-shrink-0 bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-700">
          <h1 className="text-xl font-bold text-white text-center py-3">
            多人贪吃蛇大作战
          </h1>
        </div>

        {/* 游戏内容区域 */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {children}
        </div>

        {/* 悬浮控制面板 */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`bg-black bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl transition-all duration-300 ${isControlPanelOpen ? 'w-80 h-auto' : 'w-12 h-12'
            }`}>
            <button
              onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg transition-colors"
            >
              {isControlPanelOpen ? '×' : '⚙'}
            </button>

            {isControlPanelOpen && (
              <div className="p-4 text-white">
                <div className="pr-8"> {/* 为按钮留出空间 */}
                  {/* 这里将放置控制面板内容 */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameContainer;