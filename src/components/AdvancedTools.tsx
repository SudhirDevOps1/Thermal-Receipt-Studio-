import { useMemo, useState } from 'react';
import {
  IconAlert,
  IconCamera,
  IconCheck,
  IconDatabase,
  IconExport,
  IconFileText,
  IconGlobe,
  IconImage,
  IconImport,
  IconPrint,
  IconQRIcon,
  IconSettings,
} from './Icons';

type TemplateItem = {
  id: string;
  name: string;
  author: string;
  style: string;
  description: string;
};

const starterTemplates: TemplateItem[] = [
  { id: 'premium-gold', name: 'Premium Gold Invoice', author: 'Sudhir Developer', style: 'modern', description: 'Gold border, clean totals, best for premium stores.' },
  { id: 'festival-sale', name: 'Festival Sale Receipt', author: 'Community', style: 'classic', description: 'Seasonal banner and loyalty stamp ready.' },
  { id: 'clinic-care', name: 'Clinic Care Slip', author: 'Community', style: 'minimal', description: 'Compact medical consultation receipt.' },
];

const languages = ['Hindi', 'Gujarati', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Kannada', 'Malayalam', 'Punjabi', 'English'];

export default function AdvancedTools() {
  const [templates, setTemplates] = useState<TemplateItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('trs_templates') || 'null') || starterTemplates;
    } catch {
      return starterTemplates;
    }
  });
  const [ocrText, setOcrText] = useState('');
  const [ocrItems, setOcrItems] = useState<string[]>([]);
  const [irn, setIrn] = useState('');
  const [logoName, setLogoName] = useState('');
  const [bannerText, setBannerText] = useState('Festival Offer: Save 10% Today');
  const [accessibilityLang, setAccessibilityLang] = useState('Hindi');
  const [hardwareStatus, setHardwareStatus] = useState('Not checked');
  const [pluginManifest, setPluginManifest] = useState('');

  const savedReceipts = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('inv_receipt_history') || '[]');
    } catch {
      return [];
    }
  }, []);

  const generateIRN = () => {
    const seed = `${Date.now()}-${Math.random()}-${savedReceipts.length}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    const value = `IRN-SIM-${Math.abs(hash).toString(16).toUpperCase()}-${new Date().getFullYear()}`;
    setIrn(value);
  };

  const exportTemplates = () => {
    const blob = new Blob([JSON.stringify(templates, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'receipt-template-marketplace.json';
    a.click();
  };

  const importTemplates = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(String(event.target?.result || '[]')) as TemplateItem[];
        const merged = [...templates, ...data].filter((item, index, arr) => arr.findIndex(x => x.id === item.id) === index);
        setTemplates(merged);
        localStorage.setItem('trs_templates', JSON.stringify(merged));
        alert(`Imported ${data.length} templates`);
      } catch {
        alert('Invalid template file');
      }
    };
    reader.readAsText(file);
  };

  const parseOcrText = () => {
    const lines = ocrText.split(/\n|,/).map(line => line.trim()).filter(Boolean);
    const parsed = lines.filter(line => /\d/.test(line)).slice(0, 20);
    setOcrItems(parsed.length ? parsed : ['No item-like text found. Try lines like: Chini 2 kg @48']);
  };

  const createCloudPack = () => {
    const pack = {
      version: '4.1-offline-pack',
      createdAt: new Date().toISOString(),
      receipts: savedReceipts,
      templates,
      stock: JSON.parse(localStorage.getItem('inv_stock_data') || '[]'),
      customers: JSON.parse(localStorage.getItem('inv_customer_data') || '[]'),
    };
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `thermal-receipt-offline-pack-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const checkHardware = async () => {
    const usb = 'usb' in navigator;
    const hid = 'hid' in navigator;
    setHardwareStatus(`WebUSB: ${usb ? 'available' : 'not available'} | WebHID: ${hid ? 'available' : 'not available'} | Browser: ${navigator.userAgent.split(' ')[0]}`);
  };

  const generatePluginManifest = () => {
    const manifest = {
      name: 'custom-tax-plugin',
      version: '1.0.0',
      hooks: ['beforeTotal', 'afterExport', 'receiptFooter'],
      permissions: ['read:invoice', 'write:receipt-fields'],
      example: 'Add custom cess, service charge, or regional tax logic.',
    };
    setPluginManifest(JSON.stringify(manifest, null, 2));
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="glass-panel">
        <h2 className="text-xl sm:text-2xl font-semibold gradient-amber flex items-center gap-2">
          <IconSettings className="w-6 h-6 text-amber-400" /> Advanced Tools & Integrations
        </h2>
        <p className="text-sm text-gray-400 mt-2">Production-ready local modules plus integration panels for government e-invoicing, hardware, AI, templates, offline sync, and developer extensibility.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="E-Invoicing IRN Ready" icon={<IconFileText className="w-5 h-5" />}>
          <p className="text-sm text-gray-400">Generate a local IRN simulation for testing invoice workflows. Real IRN generation requires GST portal/API credentials.</p>
          <button className="retro-btn mt-3" onClick={generateIRN}>Generate Test IRN</button>
          {irn && <code className="block mt-3 bg-[#0f0f18] border border-[#2c2c38] rounded-lg p-3 text-xs text-amber-400 break-all">{irn}</code>}
        </Panel>

        <Panel title="Template Marketplace" icon={<IconImport className="w-5 h-5" />}>
          <p className="text-sm text-gray-400">Share or import receipt templates from community JSON packs.</p>
          <div className="btn-group mt-3">
            <button className="retro-btn" onClick={exportTemplates}><IconExport className="w-4 h-4" /> Export Templates</button>
            <label className="retro-btn cursor-pointer"><IconImport className="w-4 h-4" /> Import Templates<input type="file" accept=".json" className="hidden" onChange={e => importTemplates(e.target.files?.[0])} /></label>
          </div>
          <div className="mt-3 space-y-2">
            {templates.map(t => <div key={t.id} className="bg-[#0f0f18] border border-[#2c2c38] rounded-lg p-2 text-xs"><b className="text-white">{t.name}</b><br /><span className="text-gray-500">{t.description}</span></div>)}
          </div>
        </Panel>

        <Panel title="Dynamic Visual Assets" icon={<IconImage className="w-5 h-5" />}>
          <div className="input-group"><label className="input-label">Store Logo / Mark Name</label><input className="retro-input" value={logoName} onChange={e => setLogoName(e.target.value)} placeholder="Himanshu Kirana Store" /></div>
          <div className="input-group mt-3"><label className="input-label">Promotional Banner</label><input className="retro-input" value={bannerText} onChange={e => setBannerText(e.target.value)} /></div>
          <div className="mt-3 bg-[#fef9e6] text-black rounded-lg p-3 text-center font-mono"><b>{logoName || 'STORE LOGO'}</b><br /><span>{bannerText}</span><br /><small>LOYALTY STAMP: VISIT 5 = DISCOUNT</small></div>
        </Panel>

        <Panel title="Regional Languages & Accessibility" icon={<IconGlobe className="w-5 h-5" />}>
          <p className="text-sm text-gray-400">Language roadmap with screen-reader friendly form labels and semantic controls.</p>
          <select className="retro-select mt-3" value={accessibilityLang} onChange={e => setAccessibilityLang(e.target.value)}>{languages.map(l => <option key={l}>{l}</option>)}</select>
          <p className="text-xs text-green-400 mt-3 flex items-center gap-2"><IconCheck className="w-4 h-4" /> Selected language profile: {accessibilityLang}</p>
        </Panel>

        <Panel title="OCR Receipt Intake" icon={<IconCamera className="w-5 h-5" />}>
          <p className="text-sm text-gray-400">Paste OCR text from a receipt photo to auto-detect item-like lines. Browser OCR engine can be added later.</p>
          <textarea className="retro-textarea mt-3" rows={4} value={ocrText} onChange={e => setOcrText(e.target.value)} placeholder="Paste OCR text here: Chini 2 kg @48, Tel 1 ltr @165" />
          <button className="retro-btn mt-3" onClick={parseOcrText}>Parse OCR Text</button>
          {ocrItems.length > 0 && <pre className="mt-3 bg-[#0f0f18] border border-[#2c2c38] rounded-lg p-3 text-xs text-gray-300 whitespace-pre-wrap">{ocrItems.join('\n')}</pre>}
        </Panel>

        <Panel title="AI-Style QR Visuals" icon={<IconQRIcon className="w-5 h-5" />}>
          <p className="text-sm text-gray-400">Design controls for branded QR codes. Current QR remains standard/scannable; branded QR options can be used in future AI/logo generation.</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {['Gold Retail', 'Clinic Blue', 'Festival Red', 'Minimal Black'].map(style => <button key={style} className="retro-btn">{style}</button>)}
          </div>
        </Panel>

        <Panel title="Direct Thermal / POS Hardware" icon={<IconPrint className="w-5 h-5" />}>
          <p className="text-sm text-gray-400">Check browser readiness for direct printer, cash drawer, barcode scanner, WebUSB, and WebHID integrations.</p>
          <button className="retro-btn mt-3" onClick={checkHardware}>Check Hardware APIs</button>
          <code className="block mt-3 bg-[#0f0f18] border border-[#2c2c38] rounded-lg p-3 text-xs text-gray-300 break-all">{hardwareStatus}</code>
        </Panel>

        <Panel title="Cloud Sync & Offline Pack" icon={<IconDatabase className="w-5 h-5" />}>
          <p className="text-sm text-gray-400">Export all local data as a portable pack for Google Drive/Dropbox/manual backup. The app already works offline after load.</p>
          <button className="retro-btn mt-3" onClick={createCloudPack}>Download Offline Data Pack</button>
        </Panel>

        <Panel title="Public API & Plugin System" icon={<IconSettings className="w-5 h-5" />}>
          <p className="text-sm text-gray-400">Generate a starter manifest for future plugins: custom tax logic, receipt fields, templates, integrations.</p>
          <button className="retro-btn mt-3" onClick={generatePluginManifest}>Generate Plugin Manifest</button>
          {pluginManifest && <pre className="mt-3 bg-[#0f0f18] border border-[#2c2c38] rounded-lg p-3 text-xs text-gray-300 overflow-x-auto">{pluginManifest}</pre>}
        </Panel>

        <Panel title="Testing Checklist" icon={<IconAlert className="w-5 h-5" />}>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>Unit tests: totals, taxes, QR text, history save/load.</li>
            <li>Component tests: billing form, stock manager, CRM cards.</li>
            <li>E2E tests: add item, export PDF, scan QR, restore JSON.</li>
            <li>Accessibility tests: labels, keyboard navigation, reduced motion.</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass-panel">
      <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2 mb-3">{icon} {title}</h3>
      {children}
    </div>
  );
}