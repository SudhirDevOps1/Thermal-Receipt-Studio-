# Thermal Receipt Studio+ — Complete User Guide

> **Live Demo:** https://thermal-receipt-studio.vercel.app/
> **Source Code:** https://github.com/SudhirDevOps1/Thermal-Receipt-Studio-
> **Built by:** [SudhirDevOps1 (Sudhir Developer)](https://github.com/SudhirDevOps1)

---

## Table of Contents

1. [What is this App?](#1-what-is-this-app)
2. [Who is it for?](#2-who-is-it-for)
3. [Features Overview](#3-features-overview)
4. [Getting Started](#4-getting-started)
5. [Tab 1: Thermal Receipt — Step by Step](#5-tab-1-thermal-receipt--step-by-step)
6. [Tab 2: Dukandar Inventory — Step by Step](#6-tab-2-dukandar-inventory--step-by-step)
7. [Business BI & Stats](#7-business-bi--stats)
8. [Stock & Inventory](#8-stock--inventory)
9. [Customer Management (CRM)](#9-customer-management-crm)
10. [QR Scanning (Live Details)](#10-qr-scanning-live-details)
11. [Advanced Tools & Integrations](#11-advanced-tools--integrations)
12. [Keyboard Shortcuts](#12-keyboard-shortcuts)
13. [Export & Sharing](#13-export--sharing)
14. [Data Backup & Restore](#14-data-backup--restore)
15. [Tips & Best Practices](#15-tips--best-practices)
16. [FAQ](#16-faq)
17. [Developer Setup](#17-developer-setup)

---

## 1. What is this App?

**Thermal Receipt Studio+** is a free, online (browser-based) tool to **create, print, and export receipts and shop invoices**. It looks and works like the small paper receipts you get from a thermal printer at a shop.

It has **two main tools**:

| Tool | Use For |
|------|---------|
| **Thermal Receipt** | Stylish "creative" receipts — studio cards, gym passes, event tickets, dev cards, etc. |
| **Dukandar Inventory** | Real shop billing — kirana store, clothes shop, doctor clinic, etc. with GST, items, totals |

Everything runs **inside your browser**. No login, no server, no data leaves your device. Your saved bills are stored safely in your browser's local storage.

---

## 2. Who is it for?

- **Shopkeepers (Dukandar)** — Kirana, vegetable, sweets, hardware, clothes shops, etc.
- **Doctors / Clinics** — Generate consultation & service bills
- **Freelancers & Creators** — Make stylish receipt-style cards
- **Anyone** who needs a quick, printable bill or receipt

---

## 3. Features Overview

- **20+ ready-made shop presets** (Himanshu Kirana, Aarif Clothes, Sumant Clinic, and more)
- **Business dashboard** with revenue cards and charts
- **Stock management** with low-stock alerts
- **Customer CRM** with phone, birthday, and visit tracking
- **Advanced tools** for e-invoice IRN testing, templates, OCR intake, POS checks, plugins, and offline pack
- **Line-by-line item entry** with quantity, unit, price
- **Auto-calculated totals** — Subtotal, Discount, CGST, SGST, Grand Total
- **Live QR code** (works as a UPI payment QR if you add a UPI ID)
- **Auto-generated barcode**
- **Export to PNG image and PDF** (high quality, full receipt — no cut-off text)
- **Share on WhatsApp** in one click
- **Cost price & profit calculator**
- **Multi-currency** (₹, $, €, £, and more)
- **Hindi / English** receipt language
- **3 receipt templates** (Classic, Modern, Minimal)
- **Receipt history** — save, search, reload, duplicate bills
- **Bulk import** items from text
- **Backup / Restore** all data as a JSON file
- **Keyboard shortcuts** for fast billing
- **Auto-save draft** every 10 seconds
- **Fully responsive** — works on mobile, tablet, and desktop

---

## 4. Getting Started

1. Open the app: **https://thermal-receipt-studio.vercel.app/**
2. At the top you will see two tabs:
   - **Thermal Receipt**
   - **Dukandar Inventory**
3. Click a tab to switch tools.
4. The **left side** is where you enter details. The **right side** shows a **live preview** of the receipt.
5. When you are happy, click **Print**, **Image**, or **PDF**.

No installation needed. It works in any modern browser (Chrome, Edge, Firefox, Safari).

---

## 5. Tab 1: Thermal Receipt — Step by Step

This tab is for stylish, creative receipts.

### Step 1 — Pick a Preset (optional)
Click any **Quick Preset** (Producer, Dev Card, Coffee, Gym, Freelance, Event) to instantly fill sample data.

### Step 2 — Edit Basic Info
- **Header Title** — Big bold name at the top
- **Main Tagline** — Slogan line
- **Name** — Client / person name
- **Date** — Receipt date

### Step 3 — Add Statistics
Fill up to **4 stat rows** (label + value). Example: `TRACKS PRODUCED → 24`. Empty rows are skipped automatically.

### Step 4 — Amount
Enter the **Amount / Revenue** (this shows as TOTAL on the receipt).

### Step 5 — Customize
- **ASCII Art Preset** — Decorative line style
- **Custom ASCII Line** — Your own text art
- **Paper Texture** — None / Noise / Grid
- **Sound FX** — Printer buzz sound on/off
- **Receipt Style** — Retro / Clean / Bold
- **Receipt Width** — Adjust paper width (320–600 px)

### Step 6 — Print & Export
- **Print Receipt** — Animated paper-roll print with sound
- **Image** — Download as PNG
- **PDF** — Download as PDF

### Tools (top of panel)
- **Save** — Save your current design to browser
- **Load** — Load the last saved design
- **Copy** — Copy receipt as plain text
- **Print** — Open the browser print dialog

---

## 6. Tab 2: Dukandar Inventory — Step by Step

This tab is for **real shop billing**.

### Step 1 — Choose a Preset
Scroll the **20+ Daily Presets** box and click one. Categories include:
- **Kirana & General** — Himanshu Kirana, Chai Wala, Monthly Kirana, Party Supplies
- **Sabzi Mandi** — Daily Sabzi, Khatti-Meethi, Sabzi Stock
- **Mithai & Namkeen** — Mithai Ghar, Namkeen Bhandar, Cookie & Biscuit
- **Hardware & Electronics** — Sudhir Hardware, Bijli Ka Saman
- **Beauty & Personal Care** — Stationery, Cosmetics, Sumant Medical
- **Non-Veg & Poultry** — Chicken Fish
- **Dairy & Milk** — Dairy Products
- **Masale & Dry Fruits** — Masale King, Dry Fruits
- **Clothing & Apparel** — Aarif Clothes, Kids Wear, Footwear Shop
- **Doctor & Clinic** — Sumant Clinic, Dental Clinic, Pathology Lab

A preset auto-fills shop name, phone, address, and a full item list.

### Step 2 — Shop Details
Edit **Shop Name, Tagline, Phone, Customer name, Address**.

### Step 3 — Billing & Export Settings
- **Invoice No.** — Auto-generated, editable
- **Payment Mode** — Cash / UPI / Card / Credit / Mixed
- **Currency** — ₹, $, €, £, etc.
- **Language** — English or हिंदी (receipt prints in chosen language)
- **QR Mode** — Use **Detailed Bill QR** to show items/date/total when scanned, or **UPI Payment QR** for scan-and-pay.
- **UPI ID** — Needed only when using **UPI Payment QR** mode.
- **Cash Received** — Auto-calculates Change / Due
- **Receipt Template** — Classic / Modern / Minimal
- **Export Quality** — Standard 2x / High 3x / Ultra 4x
- **Bill Notes / Terms** — Footer note (e.g. "Goods once sold...")

### Step 4 — Add Items
Two view modes:
- **Cards** — Best on mobile. Each item is a card.
- **Table** — Best on desktop. Compact rows.

For each item set: **Name, Qty, Unit, Price**, and optionally **Cost** and **Category**.

**Other buttons:**
- **Add** — Add a blank item row
- **Bulk** — Paste many items at once (see format below)
- **Show Cost** — Reveal cost price column + profit summary

**Bulk import format** (one per line or comma separated):
```
Item Name Qty unit @price
Chini 2 kg @48
Tel 1 ltr @165, Aata 5 kg @42
```

### Step 5 — Discount & Tax
- **Discount %** — Percentage off the subtotal
- **CGST %** and **SGST %** — Indian GST split (default 2.5% + 2.5% = 5%)

The totals box updates **live**.

### Step 6 — Print, Export & Save
- **Print Invoice** — Animated print preview
- **Image / PDF** — Download the bill
- **WhatsApp** — Share the bill as a text message
- **Save** — Save the bill to history

### Receipt History
- **History** — Show all saved bills
- **Search** — Find by invoice number, shop, or customer
- **Load** — Reopen an old bill
- **Dup** — Duplicate a bill as a new copy
- **Del** — Delete a bill
- **Export / Import** — Backup or restore all bills as a JSON file

---

## 7. Business BI & Stats

The **Business Dashboard** provides real-time analytics for your shop:
- **Revenue Overview**: Total sales income across all saved bills.
- **Order Count**: Total number of invoices generated.
- **Charts**: Visual trends for revenue and sales growth over the last 7 days.
- Use this to monitor your shop's performance at a glance.

---

## 8. Stock & Inventory

Keep track of your products with the **Stock Manager**:
- **Inventory Tracking**: Add items with their current stock count.
- **Low Stock Alerts**: Define a "Min Level". Items falling below this will show a red alert.
- **Quick Adjust**: Use the +/- buttons to update stock as you sell or restock.

---

## 9. Customer Management (CRM)

Manage your client relationships in the **Customer CRM** tab:
- **Client Database**: Store names, phone numbers, and birthdays.
- **Visit Tracking**: Automatically tracks how many times a customer has visited.
- **Personalized Service**: See birthday reminders to offer special discounts.

---

## 10. QR Scanning (Live Details)

The **Scan QR** feature (top header) turns your device into a powerful scanner:
- **Point & Click**: Use your camera to scan any QR code generated by this app.
- **Live Details**: Instantly decodes and displays the full bill details (items, prices, date) on your screen.
- **QR Modes**: Detailed Bill QR shows the full invoice. UPI Payment QR opens a payment-compatible QR payload.
- No need for a separate scanner app!

---

## 11. Advanced Tools & Integrations

The **Advanced Tools** tab brings the recommended future features into one practical workspace:

- **E-Invoicing IRN Ready**: Generates a local test IRN for e-invoice workflow demos. Real government IRN generation needs official GST/e-invoice API credentials.
- **Template Marketplace**: Export and import community receipt template JSON packs.
- **Dynamic Visual Assets**: Create a simple store logo/mark text, seasonal promotional banner, and loyalty stamp preview.
- **Regional Languages & Accessibility**: Choose Indian language profiles and keep the app screen-reader friendly with labels and keyboard support.
- **OCR Receipt Intake**: Paste OCR text from a photographed receipt and auto-detect item-like lines.
- **AI-Style QR Visuals**: Style presets are prepared for future AI/logo-enhanced QR visuals while keeping the current QR scannable.
- **Direct Thermal / POS Hardware**: Checks WebUSB/WebHID browser support for thermal printer, barcode scanner, and cash drawer integrations.
- **Cloud Sync & Offline Pack**: Downloads one portable JSON pack containing receipts, templates, stock, and customer data for Google Drive/Dropbox/manual backup.
- **Public API & Plugin System**: Generates a starter plugin manifest for custom tax rules, receipt fields, templates, and integrations.
- **Testing Checklist**: Lists recommended unit, component, E2E, export, QR, and accessibility tests.

These modules are local and safe by default. Government, cloud, and hardware integrations require real user credentials or browser permission before going live.

---

## 12. Keyboard Shortcuts

(Inside the Dukandar Inventory tab)

| Shortcut | Action |
|----------|--------|
| `Ctrl + P` | Print Invoice |
| `Ctrl + S` | Save Receipt |
| `Ctrl + E` | Export Image |
| `Ctrl + D` | Export PDF |
| `Ctrl + N` | Add New Item |
| `Ctrl + B` | Open Bulk Import |
| `Ctrl + H` | Toggle History |
| `Ctrl + ?` | Show Shortcuts Help |
| `Esc` | Close any open box |

> Tip: On Mac, use `Cmd` instead of `Ctrl`.

---

## 13. Export & Sharing

### Image (PNG)
High-resolution image of the full receipt. Good for WhatsApp / saving.

### PDF
Thermal-receipt-sized PDF (80 mm width). The whole bill is captured — **no half / cut-off text**, fonts fully loaded before export.

### WhatsApp
Opens WhatsApp with a neatly formatted text version of your bill, ready to send to a customer.

### Browser Print
The Thermal Receipt tab's **Print** tool opens your system print dialog so you can print on a real printer.

---

## 14. Data Backup & Restore

All saved bills live in your browser (local storage). To keep a safe copy:

- **Export** — Downloads a `.json` file with all your saved bills.
- **Import** — Choose a previously exported `.json` file to restore everything.

> Use this when changing devices or clearing browser data.

---

## 15. Tips & Best Practices

- Add your **UPI ID** so the QR becomes a real **scan-and-pay** code.
- Turn on **Show Cost** to track your **profit margin** per bill.
- Use **Bulk import** to add a long item list in seconds.
- Pick **Ultra 4x** export quality for the sharpest printed image.
- Use **Hindi** language for customers who prefer Hindi bills.
- The app **auto-saves a draft** every 10 seconds — you won't lose work.

---

## 16. FAQ

**Q: Do I need an account / login?**
No. The app is 100% free and needs no login.

**Q: Where is my data stored?**
Only in your own browser. Nothing is uploaded to any server.

**Q: Does the QR code really work for payments?**
Yes — if you enter a valid **UPI ID**, the QR becomes a UPI payment QR. Without a UPI ID it stores invoice info.

**Q: Why was the text cut off in older exports?**
That bug is fixed. Exports now wait for fonts to load and capture the full receipt height.

**Q: Can I use it on my phone?**
Yes. The layout is fully responsive. The **Cards** item view is best on mobile.

**Q: Is it open source?**
Yes — see the [GitHub repo](https://github.com/SudhirDevOps1/Thermal-Receipt-Studio-).

---

## 17. Developer Setup

This project is built with **React + Vite + TypeScript + Tailwind CSS**.

### Run locally
```bash
# 1. Clone the repo
git clone https://github.com/SudhirDevOps1/Thermal-Receipt-Studio-.git
cd Thermal-Receipt-Studio-

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Build for production
npm run build
```

### Key libraries
| Library | Purpose |
|---------|---------|
| `react` + `vite` | App framework & bundler |
| `tailwindcss` | Styling |
| `qrcode` | QR code generation (reliable, exports correctly) |
| `html2canvas` | Convert receipt DOM to image |
| `jspdf` | Generate PDF files |

### Project structure
```
src/
  App.tsx                      # Main app + tabs + header
  components/
    ThermalReceipt.tsx         # Creative receipt tool
    InventoryReceipt.tsx       # Shop billing tool (presets, GST, history)
    GitHubWidget.tsx           # Developer profile widget
    Icons.tsx                  # All SVG icons (no emoji icons)
  index.css                    # Theme, layout, receipt styles
public/
  favicon.svg                  # App logo / favicon
GUIDE.md                       # This guide
```

### Deploy
The live version is hosted on **Vercel**: https://thermal-receipt-studio.vercel.app/
Any push to the `main` branch auto-deploys.

---

**Made with care by [SudhirDevOps1](https://github.com/SudhirDevOps1) — Open source & free forever.**
