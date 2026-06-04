import { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCodeLib from 'qrcode';

interface PresetData {
  header: string; tagline: string; client: string; date: string;
  stat1L: string; stat1V: string; stat2L: string; stat2V: string;
  stat3L: string; stat3V: string; stat4L: string; stat4V: string;
  amount: string; asciiSelect: string; customAscii: string;
}

export default function ThermalReceipt() {
  const [header, setHeader] = useState('THERMAL RECEIPT STUDIO');
  const [tagline, setTagline] = useState('YOUR CREATIVE RECEIPT MAKER');
  const [client, setClient] = useState('GUEST USER');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [stat1L, setStat1L] = useState('TRACKS PRODUCED');
  const [stat1V, setStat1V] = useState('24');
  const [stat2L, setStat2L] = useState('HOURS STUDIO');
  const [stat2V, setStat2V] = useState('128.5');
  const [stat3L, setStat3L] = useState('');
  const [stat3V, setStat3V] = useState('');
  const [stat4L, setStat4L] = useState('');
  const [stat4V, setStat4V] = useState('');
  const [amount, setAmount] = useState('$ 4,299');
  const [asciiPreset, setAsciiPreset] = useState('stars');
  const [customAscii, setCustomAscii] = useState('[ S N A R E   &   B A S S ]');
  const [paperTexture, setPaperTexture] = useState('none');
  const [soundOn, setSoundOn] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [receiptTemplate, setReceiptTemplate] = useState<'retro' | 'clean' | 'bold'>('retro');
  const [receiptWidth, setReceiptWidth] = useState(420);

  const receiptRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const clipperRef = useRef<HTMLDivElement>(null);
  const qrGenerated = useRef(false);

  // Generate QR with full receipt details — scan it to see everything
  const genQR = useCallback(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const lines: string[] = [];
    lines.push(header);
    lines.push(`"${tagline}"`);
    lines.push(`Client: ${client}`);
    lines.push(`Date  : ${date || dateStr}`);
    lines.push(`Time  : ${timeStr}`);
    if (stat1L) lines.push(`${stat1L}: ${stat1V}`);
    if (stat2L) lines.push(`${stat2L}: ${stat2V}`);
    if (stat3L) lines.push(`${stat3L}: ${stat3V}`);
    if (stat4L) lines.push(`${stat4L}: ${stat4V}`);
    lines.push(`TOTAL : ${amount}`);

    QRCodeLib.toDataURL(lines.join('\n'), {
      width: 180,
      margin: 1,
      errorCorrectionLevel: 'Q',
      color: { dark: '#000000', light: '#fef9e6' }
    })
      .then(url => {
        setQrDataUrl(url);
        qrGenerated.current = true;
      })
      .catch(() => setTimeout(() => genQR(), 300));
  }, [header, tagline, client, date, amount, stat1L, stat1V, stat2L, stat2V, stat3L, stat3V, stat4L, stat4V]);

  // Barcode
  useEffect(() => {
    if (barcodeRef.current) {
      let html = '';
      for (let i = 0; i < 18; i++) {
        const w = Math.floor(Math.random() * 6) + 2;
        html += `<div class="receipt-bar" style="width:${w}px;"></div>`;
      }
      barcodeRef.current.innerHTML = html;
    }
  }, [header, client, amount]);

  // QR Code on mount and data change
  useEffect(() => {
    qrGenerated.current = false;
    const timer = setTimeout(() => genQR(), 150);
    return () => clearTimeout(timer);
  }, [genQR]);

  const playPrintSound = useCallback(() => {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 780; gain.gain.value = 0.2; osc.type = 'square';
      osc.start(); gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.3);
      const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain();
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc2.frequency.value = 440; gain2.gain.value = 0.08; osc2.type = 'sine';
      osc2.start(ctx.currentTime + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.55);
      osc2.stop(ctx.currentTime + 0.55);
    } catch { /* blocked */ }
  }, [soundOn]);

  const handlePrint = () => {
    if (clipperRef.current) clipperRef.current.style.maxHeight = '';
    setAnimate(false);
    qrGenerated.current = false;
    setTimeout(() => genQR(), 50);
    void (clipperRef.current?.offsetWidth ?? 0);
    requestAnimationFrame(() => {
      setAnimate(true);
      setShaking(true);
      playPrintSound();
      setTimeout(() => setShaking(false), 600);
    });
  };

  const exportImage = async () => {
    if (!receiptRef.current) return;
    try {
      genQR();
      const el = receiptRef.current;
      const clipper = el.parentElement;
      const origMaxH = clipper?.style.maxHeight || '';
      if (clipper) clipper.style.maxHeight = 'none';
      el.classList.add('receipt-exporting');
      el.style.width = `${receiptWidth}px`;
      el.style.padding = '18px 14px 14px';

      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 400));
      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: '#fef9e6',
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: el.scrollWidth,
        height: el.scrollHeight,
        scrollY: -window.scrollY,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });

      if (clipper) clipper.style.maxHeight = origMaxH;
      el.classList.remove('receipt-exporting');
      el.style.width = '';
      el.style.padding = '';

      const a = document.createElement('a'); a.download = 'thermal_receipt.png';
      a.href = canvas.toDataURL(); a.click();
    } catch { alert('Image export failed'); }
  };

  const exportPDF = async () => {
    if (!receiptRef.current) return;
    try {
      genQR();
      const el = receiptRef.current;
      const clipper = el.parentElement;
      const origMaxH = clipper?.style.maxHeight || '';
      if (clipper) clipper.style.maxHeight = 'none';
      el.classList.add('receipt-exporting');
      el.style.width = `${receiptWidth}px`;
      el.style.padding = '18px 14px 14px';

      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 400));
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#fef9e6',
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: el.scrollWidth,
        height: el.scrollHeight,
        scrollY: -window.scrollY,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });

      if (clipper) clipper.style.maxHeight = origMaxH;
      el.classList.remove('receipt-exporting');
      el.style.width = '';
      el.style.padding = '';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', [80, Math.max(90, (canvas.height * 80) / canvas.width + 4)]);
      const imgW = 76;
      const imgH = (canvas.height * imgW) / canvas.width;
      pdf.addImage(imgData, 'PNG', 2, 2, imgW, imgH);
      pdf.save('receipt.pdf');
    } catch { alert('PDF export failed'); }
  };

  const saveTemplate = () => {
    localStorage.setItem('receipt_template', JSON.stringify({
      header, tagline, client, date, stat1L, stat1V, stat2L, stat2V,
      stat3L, stat3V, stat4L, stat4V, amount, asciiPreset, customAscii
    }));
    alert('Template saved!');
  };

  const loadTemplate = () => {
    const raw = localStorage.getItem('receipt_template');
    if (!raw) { alert('No saved template'); return; }
    try {
      const d = JSON.parse(raw);
      setHeader(d.header); setTagline(d.tagline); setClient(d.client); setDate(d.date);
      setStat1L(d.stat1L); setStat1V(d.stat1V); setStat2L(d.stat2L); setStat2V(d.stat2V);
      setStat3L(d.stat3L); setStat3V(d.stat3V); setStat4L(d.stat4L); setStat4V(d.stat4V);
      setAmount(d.amount); setAsciiPreset(d.asciiPreset); setCustomAscii(d.customAscii);
      alert('Template loaded!');
    } catch { alert('Load failed'); }
  };

  const copyAsText = () => {
    if (!receiptRef.current) return;
    const text = receiptRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!')).catch(() => alert('Could not copy'));
  };

  const browserPrint = () => {
    if (!receiptRef.current) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Receipt</title><style>body{font-family:'Courier New',monospace;margin:1rem;background:#fef9e6;}</style></head><body>${receiptRef.current.outerHTML}</body></html>`);
    win.document.close(); win.print();
  };

  const applyPreset = (p: PresetData) => {
    setHeader(p.header); setTagline(p.tagline); setClient(p.client); setDate(p.date);
    setStat1L(p.stat1L); setStat1V(p.stat1V); setStat2L(p.stat2L); setStat2V(p.stat2V);
    setStat3L(p.stat3L); setStat3V(p.stat3V); setStat4L(p.stat4L); setStat4V(p.stat4V);
    setAmount(p.amount); setAsciiPreset(p.asciiSelect); setCustomAscii(p.customAscii);
  };

  const today = new Date().toISOString().slice(0, 10);
  const presets: { name: string; data: PresetData }[] = [
    { name: 'Producer', data: { header: 'OF ARTISTS GETTING PAID', tagline: 'BEATS THAT HIT HARD', client: 'DJ SPECTRUM', date: today, stat1L: 'MIXES MASTERED', stat1V: '18', stat2L: 'GLOBAL STREAMS', stat2V: '2.4M', stat3L: 'HITS', stat3V: '12', stat4L: 'PLATINUM', stat4V: 'YES', amount: '$ 12,750', asciiSelect: 'stars', customAscii: '[ 808 SLIDE ]' }},
    { name: 'Dev Card', data: { header: 'GEEK CODE RECEIPT', tagline: 'COMMITS & CAFFEINE', client: 'DEV OPS INC', date: today, stat1L: 'LINES OF CODE', stat1V: '8,420', stat2L: 'BUG FIXES', stat2V: '94', stat3L: 'TESTS PASSED', stat3V: '271', stat4L: 'REVIEWS', stat4V: '5/5', amount: '$ 3,250', asciiSelect: 'wave', customAscii: '{ while (true) cout << "beep"; }' }},
    { name: 'Coffee', data: { header: 'COFFEE CORNER', tagline: 'ARTISAN BREW & VIBES', client: 'Caffeine Addict', date: today, stat1L: 'SHOTS PULLED', stat1V: '4', stat2L: 'PASTRY SCORE', stat2V: '10/10', stat3L: 'SYRUP', stat3V: 'Vanilla', stat4L: 'TEMP', stat4V: '160°F', amount: '$ 14.50', asciiSelect: 'custom', customAscii: '(  (  )  )  STEAM   ~~~' }},
    { name: 'Gym', data: { header: 'IRON TEMPLE GYM', tagline: 'NO PAIN NO GAIN', client: 'BEAST MODE', date: today, stat1L: 'SESSIONS', stat1V: '42', stat2L: 'HOURS', stat2V: '86.5', stat3L: 'PRs', stat3V: '7', stat4L: 'STREAK', stat4V: '21 DAYS', amount: '$ 89.99', asciiSelect: 'stars', customAscii: '[  D E A D L I F T  ]' }},
    { name: 'Freelance', data: { header: 'CREATIVE INVOICE', tagline: 'DESIGN THAT CONVERTS', client: 'ACME CORP', date: today, stat1L: 'HOURS BILLED', stat1V: '47', stat2L: 'REVISIONS', stat2V: '3', stat3L: 'ASSETS', stat3V: '24', stat4L: 'RATING', stat4V: '5/5', amount: '$ 2,850', asciiSelect: 'wave', customAscii: '~ * ~  C R E A T I V E  ~ * ~' }},
    { name: 'Event', data: { header: 'EVENT PASS', tagline: 'ADMIT ONE - VIP ACCESS', client: 'GUEST', date: today, stat1L: 'TICKET NO', stat1V: '#A-742', stat2L: 'SEAT', stat2V: 'ROW 5 / SEAT 12', stat3L: 'GATE', stat3V: 'B', stat4L: 'TYPE', stat4V: 'VIP', amount: '$ 150.00', asciiSelect: 'custom', customAscii: '< < <  E N J O Y  > > >' }},
  ];

  const getAsciiLine = () => {
    if (asciiPreset === 'custom') return customAscii || '* ~ custom cut ~ *';
    if (asciiPreset === 'stars') return '✦ ✦ ✦  SESSION ACTIVE  ✦ ✦ ✦';
    if (asciiPreset === 'wave') return '~ * ~ * ~   NEXT LEVEL   ~ * ~ * ~';
    return '✂️ ----------- ✂️ VIBES';
  };

  const textureClass = paperTexture === 'noise' ? 'paper-noise' : paperTexture === 'grid' ? 'paper-grid' : '';

  return (
    <div className="split-layout">
      {/* LEFT FORM */}
      <div className="split-col">
        <div className="glass-panel">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 gradient-title">Receipt Studio+</h2>

          <div className="section-title"><span>Quick Presets</span></div>
          <div className="btn-group">
            {presets.map(p => (
              <button key={p.name} className="retro-btn" onClick={() => applyPreset(p.data)}>{p.name}</button>
            ))}
          </div>

          <div className="section-title"><span>Tools</span></div>
          <div className="btn-group">
            <button className="retro-btn" onClick={saveTemplate}>Save</button>
            <button className="retro-btn" onClick={loadTemplate}>Load</button>
            <button className="retro-btn" onClick={copyAsText}>Copy</button>
            <button className="retro-btn" onClick={browserPrint}>Print</button>
          </div>

          <div className="section-title"><span>Basic Info</span></div>
          <div className="flex flex-col gap-3">
            <div className="input-group">
              <label className="input-label">Header Title</label>
              <input className="retro-input" value={header} onChange={e => setHeader(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Main Tagline</label>
              <input className="retro-input" value={tagline} onChange={e => setTagline(e.target.value)} />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Name</label>
                <input className="retro-input" value={client} onChange={e => setClient(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Date</label>
                <input className="retro-input" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="section-title"><span>Statistics</span></div>
          <div className="flex flex-col gap-3">
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Stat #1 Label</label>
                <input className="retro-input" value={stat1L} onChange={e => setStat1L(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Value</label>
                <input className="retro-input" value={stat1V} onChange={e => setStat1V(e.target.value)} />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Stat #2 Label</label>
                <input className="retro-input" value={stat2L} onChange={e => setStat2L(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Value</label>
                <input className="retro-input" value={stat2V} onChange={e => setStat2V(e.target.value)} />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Stat #3 (optional)</label>
                <input className="retro-input" value={stat3L} onChange={e => setStat3L(e.target.value)} placeholder="e.g. Hits" />
              </div>
              <div className="input-group">
                <label className="input-label">Value</label>
                <input className="retro-input" value={stat3V} onChange={e => setStat3V(e.target.value)} placeholder="e.g. 99%" />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Stat #4 (optional)</label>
                <input className="retro-input" value={stat4L} onChange={e => setStat4L(e.target.value)} placeholder="e.g. Platinum" />
              </div>
              <div className="input-group">
                <label className="input-label">Value</label>
                <input className="retro-input" value={stat4V} onChange={e => setStat4V(e.target.value)} placeholder="e.g. Yes" />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">💰 Amount / Revenue</label>
              <input className="retro-input" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
          </div>

          <div className="section-title"><span>Customization</span></div>
          <div className="flex flex-col gap-3">
            <div className="input-group">
              <label className="input-label">ASCII Art Preset</label>
              <select className="retro-select" value={asciiPreset} onChange={e => setAsciiPreset(e.target.value)}>
                <option value="stars">* * *  BOOM  * * *</option>
                <option value="wave">~ * ~ * ~  REWIND  ~ * ~ * ~</option>
                <option value="custom">--- Custom ASCII ---</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Custom ASCII Line</label>
              <textarea className="retro-textarea" rows={2} value={customAscii} onChange={e => setCustomAscii(e.target.value)} placeholder="Custom ASCII art..." />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Paper Texture</label>
                <select className="retro-select" value={paperTexture} onChange={e => setPaperTexture(e.target.value)}>
                  <option value="none">None</option>
                  <option value="noise">Noise / Speckle</option>
                  <option value="grid">Grid lines</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Sound FX</label>
                <select className="retro-select" value={soundOn ? 'on' : 'off'} onChange={e => setSoundOn(e.target.value === 'on')}>
                  <option value="on">ON (printer buzz)</option>
                  <option value="off">OFF</option>
                </select>
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Receipt Style</label>
                <select className="retro-select" value={receiptTemplate} onChange={e => setReceiptTemplate(e.target.value as any)}>
                  <option value="retro">Retro</option>
                  <option value="clean">Clean</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Receipt Width (px)</label>
                <input className="retro-input" type="number" min={320} max={600} step={10} value={receiptWidth} onChange={e => setReceiptWidth(parseInt(e.target.value) || 420)} />
              </div>
            </div>
          </div>

          <button className="print-btn mt-5" onClick={handlePrint}>Print Receipt</button>
        </div>
      </div>

      {/* RIGHT PRINTER */}
      <div className="split-col center">
        <div className={`printer-machine ${shaking ? 'printer-shake' : ''}`}>
          <div className="paper-slot">
            <div className="slot-mouth"></div>
            <div ref={clipperRef} className={`receipt-clipper ${animate ? 'print-animate' : ''}`}>
              <div className={`receipt-content ${textureClass} receipt-${receiptTemplate}`} ref={receiptRef}>
                <div style={{ textAlign: 'center', fontSize: receiptTemplate === 'bold' ? '18px' : '16px', fontWeight: 800, wordBreak: 'break-word' }}>{header}</div>
                <div className="receipt-tagline">{tagline}</div>
                <div className="receipt-stars">{'*'.repeat(28)}</div>
                <div className="receipt-flex-row"><span>CLIENT</span><span>{client}</span></div>
                <div className="receipt-flex-row"><span>DATE</span><span>{date}</span></div>
                <div className="receipt-flex-row"><span>{stat1L || 'STAT'}</span><span>{stat1V}</span></div>
                <div className="receipt-flex-row"><span>{stat2L || 'STAT'}</span><span>{stat2V}</span></div>
                {stat3L && <div className="receipt-flex-row"><span>{stat3L}</span><span>{stat3V}</span></div>}
                {stat4L && <div className="receipt-flex-row"><span>{stat4L}</span><span>{stat4V}</span></div>}
                <div className="receipt-flex-row"><span>💰 TOTAL</span><span>{amount}</span></div>
                <hr className="receipt-hr" />
                <div className="receipt-ascii">{getAsciiLine()}</div>
                <hr className="receipt-hr" />
                <div className="receipt-barcode" ref={barcodeRef}></div>
                <div className="receipt-qr">
                  <div ref={qrRef} id="receiptQR">
                    {qrDataUrl ? <img src={qrDataUrl} alt="Receipt QR" width={80} height={80} /> : <span style={{ fontSize: '9px' }}>QR loading...</span>}
                  </div>
                </div>
                <div className="receipt-footer">THERMAL RECEIPT STUDIO+</div>
                <div className="receipt-stars">{'*'.repeat(28)}</div>
                <div style={{ fontSize: '9px', textAlign: 'center', marginTop: '6px' }}>THANK YOU FOR YOUR BUSINESS</div>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-group justify-center">
          <button className="retro-btn" onClick={exportImage}>Image</button>
          <button className="retro-btn" onClick={exportPDF}>PDF</button>
        </div>
        <p className="text-[11px] text-gray-500 text-center">Paper roll + QR + Barcode + Stats</p>
      </div>
    </div>
  );
}
