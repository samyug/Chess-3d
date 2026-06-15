import { Sun, Volume2, Maximize, Menu, MessageCircle, BookOpen, PlusCircle } from 'lucide-react';
import { useState } from 'react';

export function BottomBar() {
  const [activeTab, setActiveTab] = useState('Moves');

  const tabs = [
    { id: 'Moves', icon: <Menu size={16} /> },
    { id: 'Analysis', icon: <MessageCircle size={16} /> },
    { id: 'Openings', icon: <BookOpen size={16} /> },
    { id: 'Play', icon: <PlusCircle size={16} /> },
  ];

  return (
    <div className="bottom-bar glass-panel">
      <div className="bottom-tabs">
        {tabs.map(tab => (
          <div 
            key={tab.id} 
            className={`bottom-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.id}
          </div>
        ))}
      </div>

      <div className="bottom-utils">
        <button className="util-btn">
          <Sun size={18} strokeWidth={1.5} />
        </button>
        <button className="util-btn">
          <Volume2 size={18} strokeWidth={1.5} />
        </button>
        <button className="util-btn">
          <Maximize size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
