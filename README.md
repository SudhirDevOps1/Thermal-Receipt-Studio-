# Thermal Receipt Studio+

> **Free, browser-based receipt printer & dukandar (shopkeeper) inventory billing tool.**
> Create thermal receipts, GST invoices with live QR code & barcode, export PDF/Image, share on WhatsApp.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-thermal--receipt--studio.vercel.app-orange?style=for-the-badge)](https://thermal-receipt-studio.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-SudhirDevOps1-black?style=for-the-badge&logo=github)](https://github.com/SudhirDevOps1)

---

## How It Looks

> Replace `img1.png` through `img5.png` with your own screenshots.  
> Just drop the images in the project root and they will show up here.

---

### Screenshot 1 — Home Dashboard

<p align="center">
  <img src="./img1.png" alt="Home Dashboard" width="900" />
</p>

<p align="center">
  <em>The main dashboard with <strong>Thermal Receipt</strong> and <strong>Dukandar Inventory</strong> tabs.  
  Clean dark theme, SVG icons, "How to Use" guide button, and smooth animations.</em>
</p>

---

### Screenshot 2 — Dukandar Inventory (Billing Form)

<p align="center">
  <img src="./img2.png" alt="Billing Form" width="900" />
</p>

<p align="center">
  <em>The billing form with <strong>20+ shop presets</strong> (Himanshu Kirana, Aarif Clothes, Sumant Clinic, etc.).  
  Add items line-by-line with name, qty, unit, price. Toggle Card/Table view. Set Discount, CGST, SGST.  
  <strong>Auto-save draft</strong> every 10 seconds. Profit calculator with cost price column.</em>
</p>

---

### Screenshot 3 — Receipt Preview with Working QR Code

<p align="center">
  <img src="./img3.png" alt="Receipt with QR" width="500" />
</p>

<p align="center">
  <em>The thermal receipt preview with a <strong>live, scannable QR code</strong>.  
  Scan the QR with any phone camera and it instantly shows:</em>
</p>

```
=============================
HIMANSHU KIRANA STORE
=============================
Invoice : INV-482910
Date    : 06 Jun 2026
Time    : 03:45 pm
Customer: Rahul Kumar
Payment : Cash
-----------------------------
1. Chini (Sugar)
   2kg x ₹48 = ₹96
2. Chai Patti (Tea)
   1pkt x ₹120 = ₹120
3. Aata 10kg
   1pkt x ₹380 = ₹380
-----------------------------
Subtotal  : ₹596.00
CGST 2.5% : +₹14.90
SGST 2.5% : +₹14.90
=============================
TOTAL     : ₹625.80
=============================
Cash Rcvd : ₹700.00
Change    : ₹74.20
Note: Goods once sold will not be returned.
```

<p align="center">
  <em>If you enter a <strong>UPI ID</strong>, the QR becomes a real <strong>scan-and-pay</strong> UPI payment code.</em>
</p>

---

### Screenshot 4 — Export, PDF, Image & WhatsApp Share

<p align="center">
  <img src="./img4.png" alt="Export Options" width="900" />
</p>

<p align="center">
  <em>One-click export as <strong>high-quality PNG image</strong> or <strong>thermal-size PDF</strong>.  
  Share the full bill on <strong>WhatsApp</strong> as a formatted text message.  
  <strong>No cut-off text</strong> — full receipt captured with fonts loaded.</em>
</p>

---

### Screenshot 5 — Receipt History, Search & Backup

<p align="center">
  <img src="./img5.png" alt="Receipt History" width="900" />
</p>

<p align="center">
  <em>Save bills to history, <strong>search by invoice/customer/shop</strong>, reload old bills,  
  duplicate as a new copy, or delete. <strong>Export/Import</strong> all data as a JSON backup file.  
  Keyboard shortcuts for power users (Ctrl+S, Ctrl+P, Ctrl+E, etc.).</em>
</p>

---

## Features

| Category | Details |
|----------|---------|
| **Two Tools** | Creative Thermal Receipts + Dukandar Inventory billing |
| **20+ Presets** | Himanshu Kirana, Aarif Clothes, Sumant Clinic, Sabzi Mandi, Hardware, and more |
| **Live QR Code** | Scannable — shows every item, date, time, total. UPI payment QR if UPI ID is set |
| **GST Billing** | CGST + SGST split, Discount %, auto grand total |
| **Export** | High-quality PNG, thermal-size PDF, WhatsApp text share |
| **History** | Save, search, load, duplicate, delete bills. JSON backup/restore |
| **Profit Calc** | Cost price per item, total profit with percentage |
| **Multi-Currency** | INR ₹, USD $, EUR €, GBP £, AED, SAR |
| **Hindi/English** | Receipt language toggle |
| **3 Templates** | Classic, Modern, Minimal receipt styles |
| **Bulk Import** | Paste items: `Chini 2 kg @48, Tel 1 ltr @165` |
| **Keyboard** | Ctrl+P Print, Ctrl+S Save, Ctrl+E Image, Ctrl+D PDF, etc. |
| **Auto-Save** | Draft saved every 10 seconds |
| **Responsive** | Mobile, tablet, desktop — Card/Table view toggle |
| **SVG Icons** | All custom SVG, no emoji icons, no external CDN |
| **Privacy** | 100% client-side — no data leaves your browser |

---

## Tech Stack

| Library | Purpose |
|---------|---------|
| React + Vite + TypeScript | App framework & bundler |
| Tailwind CSS | Styling & responsive layout |
| `qrcode` (npm) | Reliable QR generation (works in exports) |
| `html2canvas` | DOM → image capture |
| `jspdf` | PDF generation |

---

## Quick Start

```bash
git clone https://github.com/SudhirDevOps1/Thermal-Receipt-Studio-.git
cd Thermal-Receipt-Studio-
npm install
npm run dev      # start dev server
npm run build    # production build
```

---

## Project Structure

```
src/
  App.tsx                  # App shell, tabs, header, help modal
  components/
    ThermalReceipt.tsx     # Creative receipt tool
    InventoryReceipt.tsx   # Shop billing (presets, GST, history, QR)
    GitHubWidget.tsx       # Developer profile widget
    HelpModal.tsx          # In-app usage guide
    Icons.tsx              # All SVG icons (40+)
  index.css                # Theme, layout, receipt styles, animations
public/
  favicon.svg              # App logo / favicon
GUIDE.md                   # Full step-by-step user guide
README.md                  # This file
img1.png – img5.png        # Your screenshots (add them here)
```

---

## Documentation

Full step-by-step guide with screenshots:  
**[GUIDE.md](./GUIDE.md)** — covers both tools, bulk import, keyboard shortcuts, export, backup, FAQ, developer setup.

You can also click the **"How to Use"** button inside the app (top-right corner).

---

## License

Open source & free forever.  
Built with care by [SudhirDevOps1](https://github.com/SudhirDevOps1).
