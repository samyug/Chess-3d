import { PlusCircle, Maximize, Camera, Settings, Undo } from 'lucide-react';

interface LeftSidebarProps {
  onNewGame: () => void;
  onFlipBoard: () => void;
  onResetCamera: () => void;
  onSettings: () => void;
  onTakeBack: () => void;
}

export function LeftSidebar({
  onNewGame,
  onFlipBoard,
  onResetCamera,
  onSettings,
  onTakeBack
}: LeftSidebarProps) {
  return (
    <aside className="left-sidebar glass-panel">
      <button className="sidebar-btn" onClick={onNewGame}>
        <PlusCircle size={22} strokeWidth={1.5} />
        <span>New Game</span>
      </button>
      
      <button className="sidebar-btn" onClick={onFlipBoard}>
        <Maximize size={22} strokeWidth={1.5} />
        <span>Flip Board</span>
      </button>
      
      <button className="sidebar-btn" onClick={onResetCamera}>
        <Camera size={22} strokeWidth={1.5} />
        <span>Reset Camera</span>
      </button>
      
      <button className="sidebar-btn" onClick={onSettings}>
        <Settings size={22} strokeWidth={1.5} />
        <span>Settings</span>
      </button>
      
      <button className="sidebar-btn" onClick={onTakeBack} style={{ marginTop: '16px' }}>
        <Undo size={22} strokeWidth={1.5} />
        <span>Take Back</span>
      </button>
    </aside>
  );
}
