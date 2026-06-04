import { useState } from 'react';
import ThermalReceipt from './components/ThermalReceipt';
import InventoryReceipt from './components/InventoryReceipt';
import HelpModal from './components/HelpModal';
import { IconReceipt, IconShop, IconBolt, IconHeart, IconInfo } from './components/Icons';

type Tab = 'receipt' | 'inventory';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('receipt');
  const [showHelp, setShowHelp] = useState(false);

  const tabs: { key: Tab; label: string; short: string; Icon: React.FC<{ className?: string }> }[] = [
    { key: 'receipt', label: 'Thermal Receipt', short: 'Receipt', Icon: IconReceipt },
    { key: 'inventory', label: 'Dukandar Inventory', short: 'Dukan', Icon: IconShop },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-20 bg-[#0B0B0B]/85 backdrop-blur-md">
        <div className="app-container py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-3">
            <div className="app-logo w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
              <IconBolt className="w-5 h-5 text-black" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent leading-tight truncate">
                Thermal Receipt Studio+
              </h1>
              <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm mt-0.5 truncate">
                Receipt Printer &bull; Dukandar Inventory &bull; Free Billing Tool
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a28] border border-[#2c2c38] hover:border-amber-400 hover:text-amber-400 transition-all text-gray-300"
            >
              <IconInfo className="w-4 h-4" />
              <span className="text-[10px] sm:text-xs font-medium hidden sm:inline">How to Use</span>
            </button>
          </div>
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
              <t.Icon className="w-4 h-4" />
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
        <div className="app-container flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="flex items-center gap-1">
            Built with <IconHeart className="w-3 h-3 text-red-500" /> by{' '}
            <a href="https://github.com/SudhirDevOps1" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">SudhirDevOps1</a>
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span>Thermal Receipt Studio+ v3.0 &mdash; Open Source & Free Forever</span>
        </div>
      </footer>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
