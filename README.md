# Thermal Receipt Studio+

> A free, browser-based **receipt printer** and **shopkeeper (dukandar) inventory billing** tool.
> Create thermal-style receipts and GST invoices with QR & barcode, then export as PDF / Image.

**Live Demo:** https://thermal-receipt-studio.vercel.app/
**Author:** [SudhirDevOps1 (Sudhir Developer)](https://github.com/SudhirDevOps1)

---

## Features

- **Two tools in one** — Creative Thermal Receipts + Dukandar Inventory billing
- **20+ ready shop presets** — Himanshu Kirana, Aarif Clothes, Sumant Clinic, and more
- **Line-by-line items** with auto Subtotal, Discount, CGST, SGST, Grand Total
- **Live QR code** (works as a UPI payment QR with a UPI ID) + auto barcode
- **High-quality PDF & PNG export** (full receipt, no cut-off text)
- **WhatsApp sharing** in one click
- **Cost price & profit calculator**
- **Multi-currency** (INR, USD, EUR, GBP, AED, SAR)
- **Hindi / English** receipt language
- **3 receipt templates** (Classic, Modern, Minimal)
- **Receipt history** — save, search, reload, duplicate, backup/restore (JSON)
- **Bulk item import**, **keyboard shortcuts**, **auto-save draft**
- **Fully responsive** — mobile, tablet, desktop
- **All SVG icons**, no external icon CDN; data stays in your browser

---

## Tech Stack

- **React + Vite + TypeScript**
- **Tailwind CSS**
- **qrcode** — reliable QR generation (exports correctly)
- **html2canvas** — DOM → image
- **jspdf** — PDF generation

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

## Documentation

A full, step-by-step user guide is available in **[GUIDE.md](./GUIDE.md)** — covering both tools,
keyboard shortcuts, export/sharing, backup/restore, FAQ, and developer setup.

You can also open the in-app **"How to Use"** button (top-right) for a quick guide.

---

## Project Structure

```
src/
  App.tsx                 # App shell, tabs, header, help modal
  components/
    ThermalReceipt.tsx    # Creative receipt tool
    InventoryReceipt.tsx  # Shop billing tool (presets, GST, history)
    GitHubWidget.tsx      # Developer profile widget
    HelpModal.tsx         # In-app usage guide
    Icons.tsx             # All SVG icons
  index.css               # Theme + layout + receipt styles
public/
  favicon.svg             # App logo / favicon
GUIDE.md                  # Full user guide
```

---

## License

Open source & free forever. Built with care by [SudhirDevOps1](https://github.com/SudhirDevOps1).
