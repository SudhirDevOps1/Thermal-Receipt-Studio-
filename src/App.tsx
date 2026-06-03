import { useState } from 'react';
import ThermalReceipt from './components/ThermalReceipt';
import InventoryReceipt from './components/InventoryReceipt';
import GitHubWidget from './components/GitHubWidget';

type Tab = 'receipt' | 'inventory';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('receipt');

  const tabs: { key: Tab; label: string; short: string; icon: string }[] = [
    { key: 'receipt', label: 'Thermal Receipt', short: 'Receipt', icon: '📠' },
    { key: 'inventory', label: 'Dukandar Inventory', short: 'Dukan', icon: '🏪' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-20 bg-[#0B0B0B]/85 backdrop-blur-md">
        <div className="app-container py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              ⚡ Thermal Receipt Studio+
            </h1>
            <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
              Receipt Printer • Dukandar Inventory
            </p>
          </div>
          <GitHubWidget />
        </div>
      </header>

      {/* Tabs */}
      <div className="app-container pt-3 sm:pt-4">
        <div className="tab-nav">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="app-container py-3 sm:py-5 pb-12">
        <div key={activeTab} className="fade-in">
          {activeTab === 'receipt' && <ThermalReceipt />}
          {activeTab === 'inventory' && <InventoryReceipt />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-4 text-center text-gray-600 text-[10px] sm:text-xs">
        <div className="app-container">
          Built with ❤️ | Thermal Receipt Studio+ v2.5 — 20+ Daily Use Presets • QR Fixed • PDF/Image Fixed ✨
        </div>
      </footer>
    </div>
  );
}
