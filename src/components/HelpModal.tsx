import { useEffect } from 'react';
import { IconInfo, IconReceipt, IconShop, IconKeyboard, IconExport } from './Icons';

export default function HelpModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="glass-panel w-full max-w-2xl my-4 fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '1.5rem' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <h2 className="text-xl font-bold gradient-amber flex items-center gap-2">
            <IconInfo className="w-5 h-5 text-amber-400" /> How to Use
          </h2>
          <button className="retro-btn" onClick={onClose}>Close (Esc)</button>
        </div>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Intro */}
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-white">Thermal Receipt Studio+</strong> is a free, browser-based tool to create,
            print, and export receipts & shop invoices. Nothing is uploaded — all data stays in your browser.
          </p>

          {/* Tab 1 */}
          <div>
            <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2 mb-2">
              <IconReceipt className="w-4 h-4" /> Thermal Receipt Tab
            </h3>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Pick a Quick Preset (or start blank).</li>
              <li>Edit header, tagline, name, date.</li>
              <li>Add up to 4 statistics + amount.</li>
              <li>Customize ASCII art, texture, style, width.</li>
              <li>Click <strong className="text-white">Print Receipt</strong>, then export as Image or PDF.</li>
            </ol>
          </div>

          {/* Tab 2 */}
          <div>
            <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2 mb-2">
              <IconShop className="w-4 h-4" /> Dukandar Inventory Tab
            </h3>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Choose from 20+ shop presets (Himanshu Kirana, Aarif Clothes, Sumant Clinic, etc.).</li>
              <li>Edit shop details, invoice no., payment mode.</li>
              <li>Add an <strong className="text-white">UPI ID</strong> to turn the QR into a scan-and-pay code.</li>
              <li>Add items (Cards or Table view) or use Bulk import.</li>
              <li>Set Discount %, CGST %, SGST % — totals update live.</li>
              <li>Print, export, share on WhatsApp, or Save to history.</li>
            </ol>
          </div>

          {/* Bulk format */}
          <div>
            <h3 className="text-base font-semibold text-amber-400 mb-2">Bulk Import Format</h3>
            <pre className="bg-[#0f0f18] border border-[#2c2c38] rounded-lg p-3 text-xs text-gray-300 overflow-x-auto">{`Item Name Qty unit @price
Chini 2 kg @48
Tel 1 ltr @165, Aata 5 kg @42`}</pre>
          </div>

          {/* Shortcuts */}
          <div>
            <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2 mb-2">
              <IconKeyboard className="w-4 h-4" /> Keyboard Shortcuts (Inventory)
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-400">
              <div><kbd className="bg-[#2c2c38] px-1.5 py-0.5 rounded">Ctrl+P</kbd> Print</div>
              <div><kbd className="bg-[#2c2c38] px-1.5 py-0.5 rounded">Ctrl+S</kbd> Save</div>
              <div><kbd className="bg-[#2c2c38] px-1.5 py-0.5 rounded">Ctrl+E</kbd> Export Image</div>
              <div><kbd className="bg-[#2c2c38] px-1.5 py-0.5 rounded">Ctrl+D</kbd> Export PDF</div>
              <div><kbd className="bg-[#2c2c38] px-1.5 py-0.5 rounded">Ctrl+N</kbd> Add Item</div>
              <div><kbd className="bg-[#2c2c38] px-1.5 py-0.5 rounded">Ctrl+B</kbd> Bulk Import</div>
              <div><kbd className="bg-[#2c2c38] px-1.5 py-0.5 rounded">Ctrl+H</kbd> History</div>
              <div><kbd className="bg-[#2c2c38] px-1.5 py-0.5 rounded">Esc</kbd> Close box</div>
            </div>
          </div>

          {/* Export */}
          <div>
            <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2 mb-2">
              <IconExport className="w-4 h-4" /> Export, Share & Backup
            </h3>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li><strong className="text-white">Image / PDF</strong> — full receipt, no cut-off text.</li>
              <li><strong className="text-white">WhatsApp</strong> — share bill as a message.</li>
              <li><strong className="text-white">Export / Import</strong> — backup all bills as a JSON file.</li>
              <li>Bills auto-save to history and a draft auto-saves every 10 seconds.</li>
            </ul>
          </div>

          {/* Footer link */}
          <div className="pt-3 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
              Full documentation in <code className="text-amber-400">GUIDE.md</code> &bull;{' '}
              <a href="https://github.com/SudhirDevOps1/Thermal-Receipt-Studio-" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
