# Advanced Tools & Integrations Guide

Welcome to the **Advanced Tools** section of Thermal Receipt Studio+. This module is designed for power users, developers, and businesses looking to integrate advanced workflows like e-invoicing, hardware connectivity, and automated data parsing.

---

## 1. E-Invoicing (IRN) Support
### What is it?
A local simulator that generates a mock Invoice Reference Number (IRN) based on your invoice data.
### Why use it?
In India, B2B invoices often require an IRN from the government's e-invoicing portal. This tool allows you to test your workflow and see how an IRN looks before integrating with the actual GST API.
### How to use:
1. Go to the **Advanced Tools** tab.
2. Click **"Generate Test IRN"**.
3. A unique, formatted IRN string will appear. You can copy this for testing your backend systems.

---

## 2. Premium Template Marketplace
### What is it?
A system to share and import community-designed receipt templates (JSON format).
### Why use it?
Instead of designing receipts from scratch, you can import professionally designed layouts shared by other users or export your own custom designs to use across different devices.
### How to use:
1. **Export:** Click "Export Templates" to download your current receipt styles as a `.json` file.
2. **Import:** Click "Import Templates", select a `.json` file, and it will instantly add new design options to your receipt generator.

---

## 3. Dynamic Visual Assets
### What is it?
A preview panel for adding seasonal banners, store logos (text-based), and loyalty stamps to your receipts.
### Why use it?
To make your receipts look more professional and branded. You can run "Festival Offers" or "Loyalty Programs" directly on the printed bill.
### How to use:
1. Enter your **Store Name** and **Promotional Banner** text (e.g., "Diwali Sale: 10% Off").
2. The preview box at the bottom shows exactly how it will look on the thermal paper.

---

## 4. AI-Powered OCR Scanning (Intake)
### What is it?
A text parser that takes raw text (from a photo of a physical receipt) and extracts item-like lines.
### Why use it?
If you have a physical bill from a supplier and want to add those items to your inventory quickly, you don't have to type them manually.
### How to use:
1. Use any OCR app on your phone to scan a physical receipt.
2. Copy the text and paste it into the **"Paste OCR text here"** box.
3. Click **"Parse OCR Text"**. The system will extract lines that look like items (containing numbers and units).

---

## 5. AI-Driven Visuals (QR Styling)
### What is it?
A panel showing presets for branded QR codes (e.g., Gold Retail, Clinic Blue).
### Why use it?
Standard black-and-white QR codes work best, but in the future, this section will allow you to generate QR codes with your store logo in the center or custom colors that match your brand.
### How to use:
Currently, this section shows available style presets. The default QR remains highly scannable for maximum compatibility.

---

## 6. Seamless Printing & POS Integration
### What is it?
A hardware readiness checker that tests your browser's support for WebUSB and WebHID APIs.
### Why use it?
To connect thermal printers, cash drawers, or barcode scanners directly to the web app without installing drivers.
### How to use:
1. Click **"Check Hardware APIs"**.
2. The system will tell you if your browser (Chrome/Edge recommended) supports direct hardware communication.

---

## 7. Cloud Sync & Offline Mode
### What is it?
A tool to export all your business data (Receipts, Stock, CRM, Templates) into a single portable file.
### Why use it?
Since the app runs 100% in your browser, this is your "Backup" button. You can save this file to Google Drive, Dropbox, or a USB drive.
### How to use:
1. Click **"Download Offline Data Pack"**.
2. A `.json` file containing your entire business database will download. Keep this safe!

---

## 8. Developer Experience (Public API & Plugins)
### What is it?
A generator for a `plugin-manifest.json` file.
### Why use it?
If you are a developer, you can use this manifest to build custom plugins (e.g., a specific regional tax calculator or a custom receipt field) that can hook into the app's logic.
### How to use:
1. Click **"Generate Plugin Manifest"**.
2. Copy the JSON code. This defines the hooks (`beforeTotal`, `afterExport`) available for custom code.
