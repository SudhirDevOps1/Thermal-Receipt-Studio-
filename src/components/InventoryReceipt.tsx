import { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCodeLib from 'qrcode';
import {
  IconShop, IconPrint, IconImage, IconPDF, IconWhatsApp, IconSave, IconHistory,
  IconExport, IconImport, IconAdd, IconCard, IconTable, IconBulk, IconMoney,
  IconKeyboard, IconSearch
} from './Icons';

interface Item {
  id: number;
  name: string;
  qty: number;
  unit: string;
  price: number;
  cost?: number;
  category?: string;
}

interface SavedReceipt {
  id: string;
  shopName: string;
  customerName: string;
  items: Item[];
  subtotal: number;
  discount: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
  date: string;
  time: string;
}

const UNIT_OPTIONS = ['pc', 'kg', 'ltr', 'pkt', 'dz', 'box', 'gm', 'ml', 'mtr', 'set', 'bdl', 'tin', 'can', 'dozen', 'pair', 'bottle', 'packet', 'sachet', 'strip'];
const CATEGORY_OPTIONS = ['General', 'Grocery', 'Vegetables', 'Sweets', 'Snacks', 'Hardware', 'Electrical', 'Dairy', 'Masale', 'Dry Fruits', 'Non-Veg', 'Medical', 'Stationery', 'Cosmetics', 'Clothing', 'Footwear', 'Services', 'Consultation'];

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
];

const HINDI_LABELS: Record<string, string> = {
  'Invoice': 'बिल',
  'Date': 'तारीख',
  'Time': 'समय',
  'Customer': 'ग्राहक',
  'Payment': 'भुगतान',
  'Item': 'सामान',
  'Qty': 'मात्रा',
  'Rate': 'दर',
  'Amt': 'राशि',
  'Subtotal': 'उप-योग',
  'Discount': 'छूट',
  'Total': 'कुल',
  'Cash Received': 'नकद प्राप्त',
  'Change': 'बाकी',
  'Due': 'बकाया',
  'Thank You': 'धन्यवाद',
};

interface PresetGroup {
  category: string;
  items: { name: string; data: { shop: string; tagline: string; phone: string; address: string; items: { name: string; qty: number; unit: string; price: number; cost?: number; category?: string }[] } }[];
}

const PRESET_GROUPS: PresetGroup[] = [
  {
    category: 'Kirana & General Store',
    items: [
      { name: 'Himanshu Kirana', data: { shop: 'HIMANSHU KIRANA STORE', tagline: 'Roz Ka Samaan Ek Hi Jagah', phone: '+91 98765 43210', address: 'Main Road, Market Chowk', items: [
        { name: 'Chini (Sugar)', qty: 2, unit: 'kg', price: 48, cost: 42, category: 'Grocery' }, { name: 'Chai Patti (Tea)', qty: 1, unit: 'pkt', price: 120, cost: 95, category: 'Grocery' },
        { name: 'Aata 10kg', qty: 1, unit: 'pkt', price: 380, cost: 340, category: 'Grocery' }, { name: 'Chawal Basmati', qty: 5, unit: 'kg', price: 85, cost: 72, category: 'Grocery' },
        { name: 'Dal Toor', qty: 1, unit: 'kg', price: 140, cost: 115, category: 'Grocery' }, { name: 'Dal Moong', qty: 500, unit: 'gm', price: 90, cost: 75, category: 'Grocery' },
        { name: 'Namak (Salt)', qty: 1, unit: 'pkt', price: 20, cost: 15, category: 'Grocery' }, { name: 'Haldi Powder', qty: 200, unit: 'gm', price: 35, cost: 28, category: 'Masale' },
        { name: 'Mirchi Powder', qty: 200, unit: 'gm', price: 45, cost: 36, category: 'Masale' }, { name: 'Tel (Oil) Refined', qty: 1, unit: 'ltr', price: 165, cost: 145, category: 'Grocery' },
        { name: 'Doodh (Milk) Pkt', qty: 2, unit: 'pkt', price: 58, cost: 52, category: 'Dairy' }, { name: 'Ande (Eggs)', qty: 12, unit: 'pc', price: 8, cost: 6, category: 'Non-Veg' },
      ]}},
      { name: 'Chai Wala Saman', data: { shop: 'CHAI & NASHTA CORNER', tagline: 'Chai Ke Liye Sab Kuch', phone: '+91 98765 43211', address: 'Station Road, Bus Stand', items: [
        { name: 'Chai Patti (Assam)', qty: 1, unit: 'kg', price: 320, cost: 260, category: 'Grocery' }, { name: 'Doodh (Milk)', qty: 5, unit: 'ltr', price: 58, cost: 52, category: 'Dairy' },
        { name: 'Cheeni (Sugar)', qty: 3, unit: 'kg', price: 48, cost: 42, category: 'Grocery' }, { name: 'Adrak (Ginger)', qty: 250, unit: 'gm', price: 40, cost: 32, category: 'Vegetables' },
        { name: 'Elaichi (Cardamom)', qty: 50, unit: 'gm', price: 120, cost: 95, category: 'Masale' }, { name: 'Biscuit Pack', qty: 5, unit: 'pkt', price: 25, cost: 20, category: 'Snacks' },
        { name: 'Namkeen Mixture', qty: 2, unit: 'pkt', price: 45, cost: 35, category: 'Snacks' }, { name: 'Bread Sliced', qty: 2, unit: 'pkt', price: 35, cost: 28, category: 'Grocery' },
        { name: 'Butter Block', qty: 1, unit: 'pc', price: 60, cost: 50, category: 'Dairy' }, { name: 'Ketchup Sachet', qty: 50, unit: 'pc', price: 2, cost: 1.5, category: 'Grocery' },
      ]}},
      { name: 'Monthly Kirana', data: { shop: 'SHARMA GENERAL STORE', tagline: 'Mahine Ka Samaan Mahine Bhar', phone: '+91 98765 43212', address: 'Gali No. 4, Patel Nagar', items: [
        { name: 'Aata Fortified', qty: 10, unit: 'kg', price: 38, cost: 32, category: 'Grocery' }, { name: 'Chawal (Rice)', qty: 5, unit: 'kg', price: 55, cost: 48, category: 'Grocery' },
        { name: 'Dal Mix', qty: 2, unit: 'kg', price: 130, cost: 108, category: 'Grocery' }, { name: 'Masoor Dal', qty: 1, unit: 'kg', price: 75, cost: 62, category: 'Grocery' },
        { name: 'Chole (Chickpeas)', qty: 2, unit: 'kg', price: 85, cost: 70, category: 'Grocery' }, { name: 'Maida (Flour)', qty: 2, unit: 'kg', price: 35, cost: 30, category: 'Grocery' },
        { name: 'Suji (Semolina)', qty: 1, unit: 'kg', price: 40, cost: 34, category: 'Grocery' }, { name: 'Besan (Gram Flour)', qty: 1, unit: 'kg', price: 75, cost: 62, category: 'Grocery' },
        { name: 'Tel (Mustard Oil)', qty: 2, unit: 'ltr', price: 185, cost: 158, category: 'Grocery' }, { name: 'Ghee', qty: 1, unit: 'ltr', price: 520, cost: 460, category: 'Dairy' },
        { name: 'Sugar 5kg', qty: 1, unit: 'pkt', price: 240, cost: 210, category: 'Grocery' }, { name: 'Tea 1kg', qty: 1, unit: 'pkt', price: 320, cost: 265, category: 'Grocery' },
        { name: 'Salt Crystal', qty: 2, unit: 'kg', price: 12, cost: 9, category: 'Grocery' }, { name: 'Red Chilli Whole', qty: 250, unit: 'gm', price: 55, cost: 44, category: 'Masale' },
      ]}},
      { name: 'Party Supplies', data: { shop: 'PREMIUM MART', tagline: 'Party Ka Complete Package', phone: '+91 98765 43213', address: 'Sector 12, Market Complex', items: [
        { name: 'Cold Drink (2L)', qty: 6, unit: 'bottle', price: 85, cost: 72, category: 'Grocery' }, { name: 'Chips Family Pack', qty: 5, unit: 'pkt', price: 75, cost: 60, category: 'Snacks' },
        { name: 'Namkeen Party Mix', qty: 4, unit: 'pkt', price: 55, cost: 42, category: 'Snacks' }, { name: 'Juice (1L) Tetrapack', qty: 4, unit: 'pc', price: 95, cost: 78, category: 'Grocery' },
        { name: 'Water Bottle 1L', qty: 12, unit: 'pc', price: 20, cost: 15, category: 'Grocery' }, { name: 'Paper Cup (50)', qty: 2, unit: 'pkt', price: 35, cost: 25, category: 'General' },
        { name: 'Plate Disposable (25)', qty: 3, unit: 'pkt', price: 40, cost: 30, category: 'General' }, { name: 'Biscuit Assorted', qty: 3, unit: 'pkt', price: 85, cost: 68, category: 'Snacks' },
        { name: 'Cake (Vanilla)', qty: 1, unit: 'kg', price: 450, cost: 350, category: 'Sweets' }, { name: 'Candle Set', qty: 1, unit: 'pkt', price: 35, cost: 22, category: 'General' },
      ]}},
    ]
  },
  {
    category: 'Sabzi Mandi (Vegetables)',
    items: [
      { name: 'Daily Sabzi', data: { shop: 'FRESH VEGETABLE MART', tagline: 'Taaza Sabzi Har Roz', phone: '+91 98765 43214', address: 'Sabzi Mandi, Nehru Nagar', items: [
        { name: 'Aloo (Potato)', qty: 3, unit: 'kg', price: 30, cost: 22, category: 'Vegetables' }, { name: 'Pyaz (Onion)', qty: 2, unit: 'kg', price: 40, cost: 32, category: 'Vegetables' },
        { name: 'Tamatar (Tomato)', qty: 1, unit: 'kg', price: 35, cost: 26, category: 'Vegetables' }, { name: 'Gobhi (Cauliflower)', qty: 1, unit: 'pc', price: 30, cost: 22, category: 'Vegetables' },
        { name: 'Bandh Gobhi (Cabbage)', qty: 1, unit: 'pc', price: 25, cost: 18, category: 'Vegetables' }, { name: 'Bhindi (Lady Finger)', qty: 500, unit: 'gm', price: 35, cost: 26, category: 'Vegetables' },
        { name: 'Baingan (Brinjal)', qty: 500, unit: 'gm', price: 30, cost: 22, category: 'Vegetables' }, { name: 'Karela (Bitter Gourd)', qty: 250, unit: 'gm', price: 25, cost: 18, category: 'Vegetables' },
      ]}},
      { name: 'Khatti-Meethi', data: { shop: 'HARIYALI SABZI STORE', tagline: 'Khaas Sabziyon Ka Khaas', phone: '+91 98765 43215', address: 'Gandhi Chowk Market', items: [
        { name: 'Palak (Spinach)', qty: 2, unit: 'bdl', price: 15, cost: 10, category: 'Vegetables' }, { name: 'Methi (Fenugreek)', qty: 2, unit: 'bdl', price: 12, cost: 8, category: 'Vegetables' },
        { name: 'Dhania (Coriander)', qty: 3, unit: 'bdl', price: 10, cost: 6, category: 'Vegetables' }, { name: 'Pudina (Mint)', qty: 2, unit: 'bdl', price: 8, cost: 5, category: 'Vegetables' },
        { name: 'Nimbu (Lemon)', qty: 6, unit: 'pc', price: 8, cost: 5, category: 'Vegetables' }, { name: 'Adrak (Ginger)', qty: 250, unit: 'gm', price: 40, cost: 30, category: 'Vegetables' },
        { name: 'Lahsun (Garlic)', qty: 200, unit: 'gm', price: 35, cost: 26, category: 'Vegetables' }, { name: 'Mirchi (Green Chilli)', qty: 100, unit: 'gm', price: 25, cost: 18, category: 'Vegetables' },
      ]}},
      { name: 'Sabzi Stock', data: { shop: 'BHAGAT JI SABZI WALE', tagline: 'Tokri Bhar Ke Le Jaye', phone: '+91 98765 43216', address: 'Subhash Nagar, Gali No. 7', items: [
        { name: 'Aloo (Potato) 10kg', qty: 1, unit: 'bdl', price: 280, cost: 220, category: 'Vegetables' }, { name: 'Pyaz (Onion) 5kg', qty: 1, unit: 'bdl', price: 180, cost: 140, category: 'Vegetables' },
        { name: 'Tamatar Box', qty: 1, unit: 'box', price: 320, cost: 250, category: 'Vegetables' }, { name: 'Matar (Peas)', qty: 1, unit: 'kg', price: 60, cost: 45, category: 'Vegetables' },
        { name: 'Shimla Mirch (Capsicum)', qty: 500, unit: 'gm', price: 45, cost: 34, category: 'Vegetables' }, { name: 'Gajar (Carrot)', qty: 1, unit: 'kg', price: 40, cost: 30, category: 'Vegetables' },
        { name: 'Mooli (Radish)', qty: 500, unit: 'gm', price: 20, cost: 14, category: 'Vegetables' }, { name: 'Chukandar (Beetroot)', qty: 500, unit: 'gm', price: 35, cost: 26, category: 'Vegetables' },
        { name: 'Kadddu (Pumpkin)', qty: 1, unit: 'kg', price: 25, cost: 18, category: 'Vegetables' }, { name: 'Tori (Ridge Gourd)', qty: 500, unit: 'gm', price: 30, cost: 22, category: 'Vegetables' },
      ]}},
    ]
  },
  {
    category: 'Mithai & Namkeen (Sweets & Snacks)',
    items: [
      { name: 'Mithai Ghar', data: { shop: 'SWEET PARADISE MITHALAY', tagline: 'Meetha Jo Dil Jeet Le', phone: '+91 98765 43217', address: 'Chauraha Bazaar, Main Road', items: [
        { name: 'Rasgulla (1kg)', qty: 500, unit: 'gm', price: 200, cost: 140, category: 'Sweets' }, { name: 'Jalebi (500gm)', qty: 500, unit: 'gm', price: 160, cost: 110, category: 'Sweets' },
        { name: 'Ladoo (MotiChoor)', qty: 8, unit: 'pc', price: 35, cost: 24, category: 'Sweets' }, { name: 'Barfi (Kaju)', qty: 500, unit: 'gm', price: 420, cost: 320, category: 'Sweets' },
        { name: 'Gulab Jamun (1kg)', qty: 1, unit: 'kg', price: 300, cost: 210, category: 'Sweets' }, { name: 'Soan Papdi', qty: 250, unit: 'gm', price: 120, cost: 85, category: 'Sweets' },
        { name: 'Peda (Khoa)', qty: 500, unit: 'gm', price: 280, cost: 200, category: 'Sweets' }, { name: 'Cham Cham', qty: 500, unit: 'gm', price: 240, cost: 170, category: 'Sweets' },
      ]}},
      { name: 'Namkeen Bhandar', data: { shop: 'NAMAK KEEDA CENTRE', tagline: 'Chura-Namkeen Ka Swad', phone: '+91 98765 43218', address: 'Station Road, Near Bus Stand', items: [
        { name: 'Aloo Bhujia', qty: 500, unit: 'gm', price: 85, cost: 62, category: 'Snacks' }, { name: 'Moong Dal', qty: 250, unit: 'gm', price: 60, cost: 44, category: 'Snacks' },
        { name: 'Khatta Meetha', qty: 500, unit: 'gm', price: 90, cost: 66, category: 'Snacks' }, { name: 'Chana Jor', qty: 250, unit: 'gm', price: 35, cost: 25, category: 'Snacks' },
        { name: 'Dal Mixture', qty: 500, unit: 'gm', price: 75, cost: 55, category: 'Snacks' }, { name: 'Bhujia Sev', qty: 250, unit: 'gm', price: 50, cost: 36, category: 'Snacks' },
        { name: 'Nimish Plain', qty: 500, unit: 'gm', price: 65, cost: 48, category: 'Snacks' }, { name: 'Kachori Aloo', qty: 6, unit: 'pc', price: 15, cost: 10, category: 'Snacks' },
        { name: 'Samosa Fried', qty: 10, unit: 'pc', price: 12, cost: 8, category: 'Snacks' }, { name: 'Papad Roasted', qty: 12, unit: 'pc', price: 5, cost: 3.5, category: 'Snacks' },
      ]}},
      { name: 'Cookie & Biscuit', data: { shop: 'MITHAS KOOKEEZ', tagline: 'Chai Ke Saath Perfect', phone: '+91 98765 43219', address: 'Mall Road, Shop No. 5', items: [
        { name: 'Marie Gold', qty: 3, unit: 'pkt', price: 35, cost: 28, category: 'Snacks' }, { name: 'Parle G', qty: 5, unit: 'pkt', price: 10, cost: 8, category: 'Snacks' },
        { name: 'Bourbon', qty: 2, unit: 'pkt', price: 40, cost: 32, category: 'Snacks' }, { name: 'Hide & Seek', qty: 2, unit: 'pkt', price: 55, cost: 44, category: 'Snacks' },
        { name: 'Good Day (Cashew)', qty: 3, unit: 'pkt', price: 45, cost: 36, category: 'Snacks' }, { name: 'Britannia Cake', qty: 2, unit: 'pkt', price: 35, cost: 28, category: 'Snacks' },
        { name: 'Cream Biscuit (Assorted)', qty: 2, unit: 'pkt', price: 65, cost: 52, category: 'Snacks' }, { name: 'Rusk (Toast)', qty: 2, unit: 'pkt', price: 40, cost: 32, category: 'Snacks' },
      ]}},
    ]
  },
  {
    category: 'Hardware & Electronics',
    items: [
      { name: 'Sudhir Hardware', data: { shop: 'SUDHIR HARDWARE STORE', tagline: 'Chhota Kaam Bada Kaam', phone: '+91 98765 43220', address: 'Loha Mandi, Industrial Area', items: [
        { name: 'Keel (Nails) 1kg', qty: 1, unit: 'kg', price: 80, cost: 55, category: 'Hardware' }, { name: 'Cement Bag', qty: 2, unit: 'bdl', price: 380, cost: 340, category: 'Hardware' },
        { name: 'Paint White 1L', qty: 1, unit: 'ltr', price: 220, cost: 175, category: 'Hardware' }, { name: 'Paint Brush 2"', qty: 2, unit: 'pc', price: 45, cost: 32, category: 'Hardware' },
        { name: 'Taar (Wire) 10m', qty: 1, unit: 'roll', price: 150, cost: 115, category: 'Electrical' }, { name: 'Switch Board', qty: 2, unit: 'pc', price: 85, cost: 62, category: 'Electrical' },
        { name: 'Bulb LED 12W', qty: 4, unit: 'pc', price: 60, cost: 44, category: 'Electrical' }, { name: 'Socket (5A)', qty: 3, unit: 'pc', price: 25, cost: 18, category: 'Electrical' },
        { name: 'Fevicol 50gm', qty: 1, unit: 'pc', price: 35, cost: 26, category: 'Hardware' }, { name: 'Screw Set (50)', qty: 1, unit: 'pkt', price: 40, cost: 28, category: 'Hardware' },
      ]}},
      { name: 'Bijli Ka Saman', data: { shop: 'ELECTRIC MART', tagline: 'Roshni Ka Vyapar', phone: '+91 98765 43221', address: 'Bijli Ghar Road', items: [
        { name: 'Tube Light 36W', qty: 2, unit: 'pc', price: 180, cost: 142, category: 'Electrical' }, { name: 'Holder (Batten)', qty: 5, unit: 'pc', price: 15, cost: 11, category: 'Electrical' },
        { name: 'Switch 1 Way', qty: 6, unit: 'pc', price: 18, cost: 13, category: 'Electrical' }, { name: 'MCB 16A', qty: 1, unit: 'pc', price: 145, cost: 112, category: 'Electrical' },
        { name: 'Wire Copper 1.5mm (10m)', qty: 1, unit: 'roll', price: 320, cost: 255, category: 'Electrical' }, { name: 'Tape Electric', qty: 2, unit: 'pc', price: 20, cost: 14, category: 'Electrical' },
        { name: 'Plug Top', qty: 4, unit: 'pc', price: 12, cost: 8, category: 'Electrical' }, { name: 'Fan Regulator', qty: 1, unit: 'pc', price: 120, cost: 92, category: 'Electrical' },
      ]}},
    ]
  },
  {
    category: 'Beauty & Personal Care',
    items: [
      { name: 'Stationery Items', data: { shop: 'PAPER & PEN STORE', tagline: 'Pads-Pen-Pencil Sab Kuch', phone: '+91 98765 43222', address: 'School Road, Education Hub', items: [
        { name: 'Copy Single Line', qty: 5, unit: 'pc', price: 25, cost: 18, category: 'Stationery' }, { name: 'Pen (Ball) pack 10', qty: 1, unit: 'pkt', price: 50, cost: 38, category: 'Stationery' },
        { name: 'Pencil (Natraj)', qty: 6, unit: 'pc', price: 8, cost: 5.5, category: 'Stationery' }, { name: 'Eraser', qty: 3, unit: 'pc', price: 5, cost: 3, category: 'Stationery' },
        { name: 'Sharpener', qty: 3, unit: 'pc', price: 5, cost: 3, category: 'Stationery' }, { name: 'Scale 12"', qty: 2, unit: 'pc', price: 15, cost: 10, category: 'Stationery' },
        { name: 'Glue Stick', qty: 2, unit: 'pc', price: 20, cost: 14, category: 'Stationery' }, { name: 'Notebook 200pg', qty: 2, unit: 'pc', price: 65, cost: 48, category: 'Stationery' },
      ]}},
      { name: 'Cosmetics', data: { shop: 'SHRINGAR COSMETICS', tagline: 'Khubsurti Ka Samaan', phone: '+91 98765 43223', address: 'Fashion Street', items: [
        { name: 'Face Cream Ponds', qty: 1, unit: 'pc', price: 120, cost: 92, category: 'Cosmetics' }, { name: 'Shampoo Sachet', qty: 20, unit: 'pc', price: 5, cost: 3.5, category: 'Cosmetics' },
        { name: 'Soap Lux/Pears', qty: 6, unit: 'pc', price: 35, cost: 26, category: 'Cosmetics' }, { name: 'Toothpaste', qty: 2, unit: 'pc', price: 80, cost: 62, category: 'Cosmetics' },
        { name: 'Hair Oil Coconut', qty: 1, unit: 'bottle', price: 95, cost: 72, category: 'Cosmetics' }, { name: 'Comb', qty: 2, unit: 'pc', price: 15, cost: 9, category: 'Cosmetics' },
        { name: 'Nail Cutter', qty: 1, unit: 'pc', price: 25, cost: 16, category: 'Cosmetics' }, { name: 'Towel Cotton', qty: 2, unit: 'pc', price: 120, cost: 88, category: 'Cosmetics' },
      ]}},
      { name: 'Sumant Medical', data: { shop: 'SUMANT MEDICAL STORE', tagline: 'Swasthya Ki Suraksha', phone: '+91 98765 43224', address: 'Hospital Road', items: [
        { name: 'Dettol Soap', qty: 3, unit: 'pc', price: 45, cost: 34, category: 'Medical' }, { name: 'Band Aid (20)', qty: 2, unit: 'pkt', price: 25, cost: 18, category: 'Medical' },
        { name: 'Sanitizer 100ml', qty: 2, unit: 'bottle', price: 45, cost: 32, category: 'Medical' }, { name: 'Paracetamol Tab (10)', qty: 2, unit: 'strip', price: 15, cost: 10, category: 'Medical' },
        { name: 'Vicks Vaporub', qty: 1, unit: 'pc', price: 85, cost: 64, category: 'Medical' }, { name: 'Cotton Ball (50gm)', qty: 1, unit: 'pkt', price: 35, cost: 24, category: 'Medical' },
        { name: 'Moov Spray', qty: 1, unit: 'pc', price: 95, cost: 72, category: 'Medical' }, { name: 'ORS (5 sachet)', qty: 2, unit: 'pkt', price: 18, cost: 12, category: 'Medical' },
      ]}},
    ]
  },
  {
    category: 'Non-Veg & Poultry',
    items: [
      { name: 'Chicken Fish', data: { shop: 'FRESH MEAT & FISH', tagline: 'Taaza Maas Har Roz', phone: '+91 98765 43225', address: 'Non-Veg Market, Gali No 2', items: [
        { name: 'Chicken (Skinless) kg', qty: 2, unit: 'kg', price: 170, cost: 135, category: 'Non-Veg' }, { name: 'Mutton kg', qty: 1, unit: 'kg', price: 580, cost: 480, category: 'Non-Veg' },
        { name: 'Fish (Rohu) kg', qty: 1, unit: 'kg', price: 320, cost: 260, category: 'Non-Veg' }, { name: 'Eggs (Farm Fresh)', qty: 30, unit: 'pc', price: 8, cost: 6, category: 'Non-Veg' },
        { name: 'Prawns kg', qty: 500, unit: 'gm', price: 380, cost: 310, category: 'Non-Veg' }, { name: 'Chicken Leg Piece', qty: 6, unit: 'pc', price: 35, cost: 26, category: 'Non-Veg' },
        { name: 'Mutton Bones', qty: 500, unit: 'gm', price: 120, cost: 95, category: 'Non-Veg' }, { name: 'Fish (Bangda)', qty: 500, unit: 'gm', price: 180, cost: 145, category: 'Non-Veg' },
      ]}},
    ]
  },
  {
    category: 'Dairy & Milk Products',
    items: [
      { name: 'Dairy Products', data: { shop: 'GAUSHALA DAIRY FARM', tagline: 'Shuddh Doodh Aur Uske Products', phone: '+91 98765 43226', address: 'Dairy Farm Road, Gaon Ke Paas', items: [
        { name: 'Doodh (Milk) 1L', qty: 4, unit: 'ltr', price: 58, cost: 48, category: 'Dairy' }, { name: 'Dahi (Curd) 500gm', qty: 2, unit: 'pkt', price: 40, cost: 32, category: 'Dairy' },
        { name: 'Butter (Amul) 100gm', qty: 1, unit: 'pc', price: 55, cost: 44, category: 'Dairy' }, { name: 'Paneer (Fresh) 250gm', qty: 2, unit: 'pkt', price: 90, cost: 72, category: 'Dairy' },
        { name: 'Cheese Slice', qty: 1, unit: 'pkt', price: 75, cost: 60, category: 'Dairy' }, { name: 'Ghee (Desi) 1L', qty: 1, unit: 'ltr', price: 480, cost: 400, category: 'Dairy' },
        { name: 'Chaach (ButterMilk) 1L', qty: 2, unit: 'ltr', price: 25, cost: 18, category: 'Dairy' }, { name: 'Lassi Sweet 500ml', qty: 2, unit: 'pc', price: 45, cost: 35, category: 'Dairy' },
      ]}},
    ]
  },
  {
    category: 'Masale & Dry Fruits',
    items: [
      { name: 'Masale (Spices)', data: { shop: 'MASALA KING', tagline: 'Khushbu Aur Swad Ka Raja', phone: '+91 98765 43227', address: 'Masala Market, Purana Shehar', items: [
        { name: 'Garam Masala (100gm)', qty: 2, unit: 'pkt', price: 55, cost: 40, category: 'Masale' }, { name: 'Dhaniya Powder (200gm)', qty: 1, unit: 'pkt', price: 35, cost: 26, category: 'Masale' },
        { name: 'Jeera (Cumin) 200gm', qty: 1, unit: 'pkt', price: 45, cost: 34, category: 'Masale' }, { name: 'Amchur (Mango) 100gm', qty: 1, unit: 'pkt', price: 30, cost: 22, category: 'Masale' },
        { name: 'Chaat Masala (100gm)', qty: 2, unit: 'pkt', price: 25, cost: 18, category: 'Masale' }, { name: 'Turmeric (Haldi) 200gm', qty: 1, unit: 'pkt', price: 40, cost: 30, category: 'Masale' },
        { name: 'Red Chilli Powder (200gm)', qty: 1, unit: 'pkt', price: 55, cost: 42, category: 'Masale' }, { name: 'Kashmiri Mirch (100gm)', qty: 1, unit: 'pkt', price: 40, cost: 30, category: 'Masale' },
        { name: 'Sarson (Mustard) 200gm', qty: 1, unit: 'pkt', price: 25, cost: 18, category: 'Masale' }, { name: 'Methi Dana (100gm)', qty: 1, unit: 'pkt', price: 18, cost: 13, category: 'Masale' },
      ]}},
      { name: 'Dry Fruits', data: { shop: 'KHATTA MEETHA DRY FRUITS', tagline: 'Sehat Aur Mazaa Dono', phone: '+91 98765 43228', address: 'Fancy Bazaar, Shop No. 12', items: [
        { name: 'Badam (Almond) 250gm', qty: 1, unit: 'pkt', price: 220, cost: 170, category: 'Dry Fruits' }, { name: 'Kaju (Cashew) 250gm', qty: 1, unit: 'pkt', price: 350, cost: 280, category: 'Dry Fruits' },
        { name: 'Kishmish (Raisins) 200gm', qty: 1, unit: 'pkt', price: 120, cost: 90, category: 'Dry Fruits' }, { name: 'Pista 200gm', qty: 1, unit: 'pkt', price: 320, cost: 255, category: 'Dry Fruits' },
        { name: 'Akhrot (Walnut) 250gm', qty: 1, unit: 'pkt', price: 280, cost: 220, category: 'Dry Fruits' }, { name: 'Anjeer (Fig) 200gm', qty: 1, unit: 'pkt', price: 180, cost: 140, category: 'Dry Fruits' },
        { name: 'Khajoor (Dates) 500gm', qty: 1, unit: 'pkt', price: 150, cost: 115, category: 'Dry Fruits' }, { name: 'Makhana (Fox Nut) 200gm', qty: 1, unit: 'pkt', price: 110, cost: 82, category: 'Dry Fruits' },
      ]}},
    ]
  },
  {
    category: 'Clothing & Apparel',
    items: [
      { name: 'Aarif Clothes', data: { shop: 'AARIF CLOTHES STORE', tagline: 'Latest Fashion, Best Price', phone: '+91 98765 43229', address: 'Cloth Market, Main Bazaar', items: [
        { name: 'Cotton Shirt', qty: 2, unit: 'pc', price: 650, cost: 480, category: 'Clothing' }, { name: 'Denim Jeans', qty: 1, unit: 'pc', price: 1200, cost: 850, category: 'Clothing' },
        { name: 'Kurta Pyjama Set', qty: 1, unit: 'set', price: 1450, cost: 1050, category: 'Clothing' }, { name: 'T-Shirt (Round Neck)', qty: 3, unit: 'pc', price: 350, cost: 240, category: 'Clothing' },
        { name: 'Saree (Silk)', qty: 1, unit: 'pc', price: 2800, cost: 2100, category: 'Clothing' }, { name: 'Salwar Suit', qty: 1, unit: 'set', price: 1650, cost: 1200, category: 'Clothing' },
        { name: 'Dupatta', qty: 2, unit: 'pc', price: 280, cost: 190, category: 'Clothing' }, { name: 'Socks (Pair)', qty: 5, unit: 'pair', price: 60, cost: 38, category: 'Clothing' },
      ]}},
      { name: 'Kids Wear', data: { shop: 'LITTLE STARS KIDS WEAR', tagline: 'Cute Clothes for Little Ones', phone: '+91 98765 43230', address: 'Children Market, Sector 5', items: [
        { name: 'Baby Frock', qty: 2, unit: 'pc', price: 450, cost: 320, category: 'Clothing' }, { name: 'Boys T-Shirt', qty: 3, unit: 'pc', price: 250, cost: 165, category: 'Clothing' },
        { name: 'Kids Jeans', qty: 2, unit: 'pc', price: 550, cost: 390, category: 'Clothing' }, { name: 'School Uniform Set', qty: 1, unit: 'set', price: 850, cost: 600, category: 'Clothing' },
        { name: 'Woolen Sweater', qty: 2, unit: 'pc', price: 480, cost: 340, category: 'Clothing' }, { name: 'Baby Shoes', qty: 1, unit: 'pair', price: 320, cost: 220, category: 'Footwear' },
      ]}},
      { name: 'Footwear Shop', data: { shop: 'STEP UP FOOTWEAR', tagline: 'Comfort in Every Step', phone: '+91 98765 43231', address: 'Shoe Market, Gandhi Road', items: [
        { name: 'Sports Shoes', qty: 1, unit: 'pair', price: 1800, cost: 1250, category: 'Footwear' }, { name: 'Formal Shoes', qty: 1, unit: 'pair', price: 1450, cost: 980, category: 'Footwear' },
        { name: 'Sandals (Gents)', qty: 1, unit: 'pair', price: 650, cost: 420, category: 'Footwear' }, { name: 'Ladies Heels', qty: 1, unit: 'pair', price: 950, cost: 640, category: 'Footwear' },
        { name: 'Slippers (Rubber)', qty: 3, unit: 'pair', price: 180, cost: 110, category: 'Footwear' }, { name: 'School Shoes (Black)', qty: 2, unit: 'pair', price: 720, cost: 500, category: 'Footwear' },
      ]}},
    ]
  },
  {
    category: 'Doctor & Clinic Services',
    items: [
      { name: 'Sumant Clinic', data: { shop: 'DR. SUMANT CLINIC', tagline: 'Your Health, Our Priority', phone: '+91 98765 43232', address: 'Health Center, Civil Lines', items: [
        { name: 'Consultation Fee', qty: 1, unit: 'pc', price: 500, cost: 0, category: 'Consultation' }, { name: 'Blood Pressure Check', qty: 1, unit: 'pc', price: 100, cost: 0, category: 'Services' },
        { name: 'Sugar Test (Random)', qty: 1, unit: 'pc', price: 150, cost: 50, category: 'Services' }, { name: 'Injection Charge', qty: 1, unit: 'pc', price: 80, cost: 30, category: 'Services' },
        { name: 'Dressing (Wound)', qty: 1, unit: 'pc', price: 200, cost: 60, category: 'Services' }, { name: 'ECG Test', qty: 1, unit: 'pc', price: 350, cost: 100, category: 'Services' },
        { name: 'Nebulization', qty: 1, unit: 'pc', price: 250, cost: 80, category: 'Services' },
      ]}},
      { name: 'Dental Clinic', data: { shop: 'SMILE DENTAL CARE', tagline: 'Healthy Smiles, Happy Lives', phone: '+91 98765 43233', address: 'Medical Complex, Ring Road', items: [
        { name: 'Consultation', qty: 1, unit: 'pc', price: 300, cost: 0, category: 'Consultation' }, { name: 'Tooth Cleaning (Scaling)', qty: 1, unit: 'pc', price: 800, cost: 200, category: 'Services' },
        { name: 'Tooth Filling', qty: 2, unit: 'pc', price: 600, cost: 180, category: 'Services' }, { name: 'Tooth Extraction', qty: 1, unit: 'pc', price: 500, cost: 100, category: 'Services' },
        { name: 'Root Canal (RCT)', qty: 1, unit: 'pc', price: 3500, cost: 800, category: 'Services' }, { name: 'X-Ray (Dental)', qty: 1, unit: 'pc', price: 200, cost: 60, category: 'Services' },
      ]}},
      { name: 'Pathology Lab', data: { shop: 'CARE DIAGNOSTIC LAB', tagline: 'Accurate Reports, Quick Service', phone: '+91 98765 43234', address: 'Lab Street, Hospital Road', items: [
        { name: 'CBC Test', qty: 1, unit: 'pc', price: 350, cost: 120, category: 'Services' }, { name: 'Lipid Profile', qty: 1, unit: 'pc', price: 600, cost: 200, category: 'Services' },
        { name: 'Thyroid (T3 T4 TSH)', qty: 1, unit: 'pc', price: 550, cost: 180, category: 'Services' }, { name: 'Liver Function Test', qty: 1, unit: 'pc', price: 700, cost: 240, category: 'Services' },
        { name: 'Urine Routine', qty: 1, unit: 'pc', price: 200, cost: 60, category: 'Services' }, { name: 'Sugar Fasting + PP', qty: 1, unit: 'pc', price: 250, cost: 80, category: 'Services' },
      ]}},
    ]
  }
];

export default function InventoryReceipt() {
  const [shopName, setShopName] = useState('HIMANSHU KIRANA STORE');
  const [shopTagline, setShopTagline] = useState('Sabse Sasta, Sabse Achha');
  const [shopPhone, setShopPhone] = useState('+91 98765 43210');
  const [shopAddress, setShopAddress] = useState('Main Bazaar, Market Road');
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Chini (Sugar)', qty: 1, unit: 'kg', price: 48, cost: 42, category: 'Grocery' },
    { id: 2, name: 'Chai Patti', qty: 1, unit: 'pkt', price: 120, cost: 95, category: 'Grocery' },
    { id: 3, name: 'Aata (Flour)', qty: 5, unit: 'kg', price: 42, cost: 36, category: 'Grocery' },
    { id: 4, name: 'Sabun (Soap)', qty: 3, unit: 'pc', price: 35, cost: 26, category: 'Cosmetics' },
    { id: 5, name: 'Tel (Oil)', qty: 1, unit: 'ltr', price: 165, cost: 142, category: 'Grocery' },
  ]);
  const [discount, setDiscount] = useState(0);
  const [cgstRate, setCgstRate] = useState(2.5);
  const [sgstRate, setSgstRate] = useState(2.5);
  const [nextId, setNextId] = useState(6);
  const [animate, setAnimate] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [upiId, setUpiId] = useState('');
  const [qrMode, setQrMode] = useState<'details' | 'upi'>('details');
  const [cashReceived, setCashReceived] = useState(0);
  const [notes, setNotes] = useState('Goods once sold will not be returned.');
  const [exportScale, setExportScale] = useState(4);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showCost, setShowCost] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [receiptHistory, setReceiptHistory] = useState<SavedReceipt[]>(() => {
    try { return JSON.parse(localStorage.getItem('inv_receipt_history') || '[]'); } catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [template, setTemplate] = useState<'classic' | 'modern' | 'minimal'>('classic');
  const [lastSaved, setLastSaved] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [historySearch, setHistorySearch] = useState('');
  const [shortcutsHelp, setShortcutsHelp] = useState(false);

  const receiptRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const clipperRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setItems([...items, { id: nextId, name: '', qty: 1, unit: 'pc', price: 0, cost: 0, category: 'General' }]);
    setNextId(nextId + 1);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: number, field: keyof Item, value: string | number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const totalCost = items.reduce((sum, i) => sum + i.qty * (i.cost || 0), 0);
  const profit = subtotal - totalCost;
  const profitPercent = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : '0';
  const discountAmt = subtotal * (discount / 100);
  const afterDiscount = subtotal - discountAmt;
  const cgstAmt = afterDiscount * (cgstRate / 100);
  const sgstAmt = afterDiscount * (sgstRate / 100);
  const taxAmt = cgstAmt + sgstAmt;
  const grandTotal = afterDiscount + taxAmt;
  const balanceAmount = paymentMode === 'Cash' && cashReceived > 0 ? cashReceived - grandTotal : 0;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            handlePrint();
            break;
          case 's':
            e.preventDefault();
            saveReceipt();
            break;
          case 'e':
            e.preventDefault();
            exportImage();
            break;
          case 'd':
            e.preventDefault();
            exportPDF();
            break;
          case 'n':
            e.preventDefault();
            addItem();
            break;
          case 'b':
            e.preventDefault();
            setShowBulk(true);
            break;
          case 'h':
            e.preventDefault();
            setShowHistory(v => !v);
            break;
          case '?':
            e.preventDefault();
            setShortcutsHelp(v => !v);
            break;
        }
      }
      if (e.key === 'Escape') {
        setShowBulk(false);
        setShowHistory(false);
        setShortcutsHelp(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Generate barcode
  const genBarcode = useCallback(() => {
    if (barcodeRef.current) {
      let html = '';
      for (let i = 0; i < 18; i++) {
        const w = Math.floor(Math.random() * 6) + 2;
        html += `<div style="background:#111;height:30px;width:${w}px;display:inline-block;flex-shrink:0;"></div>`;
      }
      barcodeRef.current.innerHTML = html;
    }
  }, []);

  // Generate QR as PNG data URL with FULL working invoice details
  // When someone scans this QR, they see the complete bill:
  //   Shop name, invoice no, date, time, customer, payment mode,
  //   every item with qty/unit/price/total, subtotal, discount,
  //   CGST, SGST, grand total, and notes.
  const genQR = useCallback(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // If UPI mode is selected and UPI ID is set, generate a payment QR.
    // Default mode remains detailed invoice QR so scanning shows all bill details.
    if (qrMode === 'upi' && upiId.trim()) {
      const qrText = `upi://pay?pa=${encodeURIComponent(upiId.trim())}&pn=${encodeURIComponent(shopName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(invoiceNo)}`;
      QRCodeLib.toDataURL(qrText, {
        width: 200, margin: 1, errorCorrectionLevel: 'M',
        color: { dark: '#000000', light: '#fef9e6' }
      })
        .then(url => { setQrDataUrl(url); })
        .catch(() => setTimeout(() => genQR(), 300));
      return;
    }

    // Build a full readable invoice text for the QR
    const lines: string[] = [];
    lines.push(`=============================`);
    lines.push(shopName);
    lines.push(`=============================`);
    lines.push(`Invoice : ${invoiceNo}`);
    lines.push(`Date    : ${dateStr}`);
    lines.push(`Time    : ${timeStr}`);
    if (customerName) lines.push(`Customer: ${customerName}`);
    lines.push(`Payment : ${paymentMode}`);
    lines.push(`-----------------------------`);

    // All items with number, name, qty, unit, rate, amount
    items.forEach((it, idx) => {
      const amt = (it.qty * it.price).toFixed(0);
      // Keep names short so QR stays scannable
      const nm = it.name.length > 18 ? it.name.slice(0, 18) + '..' : it.name;
      lines.push(`${idx + 1}. ${nm}`);
      lines.push(`   ${it.qty}${it.unit} x ${currency.symbol}${it.price} = ${currency.symbol}${amt}`);
    });

    lines.push(`-----------------------------`);
    lines.push(`Subtotal  : ${currency.symbol}${subtotal.toFixed(2)}`);
    if (discount > 0) lines.push(`Discount  : -${currency.symbol}${discountAmt.toFixed(2)} (${discount}%)`);
    if (cgstRate > 0) lines.push(`CGST ${cgstRate}%  : +${currency.symbol}${cgstAmt.toFixed(2)}`);
    if (sgstRate > 0) lines.push(`SGST ${sgstRate}%  : +${currency.symbol}${sgstAmt.toFixed(2)}`);
    lines.push(`=============================`);
    lines.push(`TOTAL     : ${currency.symbol}${grandTotal.toFixed(2)}`);
    lines.push(`=============================`);

    if (paymentMode === 'Cash' && cashReceived > 0) {
      lines.push(`Cash Rcvd : ${currency.symbol}${cashReceived.toFixed(2)}`);
      const bal = cashReceived - grandTotal;
      lines.push(`${bal >= 0 ? 'Change' : 'Due'}     : ${currency.symbol}${Math.abs(bal).toFixed(2)}`);
    }

    if (notes) lines.push(`Note: ${notes}`);

    const qrText = lines.join('\n');

    // Use error correction level based on data size for best scan reliability
    const ecLevel = qrText.length > 800 ? 'L' : qrText.length > 500 ? 'M' : 'Q';

    QRCodeLib.toDataURL(qrText, {
      width: 220, margin: 1,
      errorCorrectionLevel: ecLevel as any,
      color: { dark: '#000000', light: '#fef9e6' }
    })
      .then(url => { setQrDataUrl(url); })
      .catch(() => {
        // If data is too long, fall back to a shorter version
        const shortText = `${invoiceNo} | ${shopName}\n${dateStr} ${timeStr}\n${items.length} items | Total: ${currency.symbol}${grandTotal.toFixed(2)}`;
        QRCodeLib.toDataURL(shortText, {
          width: 200, margin: 1, errorCorrectionLevel: 'M',
          color: { dark: '#000000', light: '#fef9e6' }
        })
          .then(url => { setQrDataUrl(url); })
          .catch(() => setTimeout(() => genQR(), 400));
      });
  }, [qrMode, upiId, shopName, grandTotal, invoiceNo, items, customerName, paymentMode, currency, subtotal, discount, discountAmt, cgstRate, sgstRate, cgstAmt, sgstAmt, cashReceived, notes]);

  useEffect(() => {
    genBarcode();
    const timer = setTimeout(() => genQR(), 150);
    return () => clearTimeout(timer);
  }, [genBarcode, genQR]);

  // Auto-save draft every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const draft = { shopName, shopTagline, shopPhone, shopAddress, customerName, items, discount, cgstRate, sgstRate, invoiceNo, paymentMode, upiId, qrMode, cashReceived, notes, template };
      localStorage.setItem('inv_draft', JSON.stringify(draft));
      setLastSaved(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, [shopName, shopTagline, shopPhone, shopAddress, customerName, items, discount, cgstRate, sgstRate, invoiceNo, paymentMode, upiId, qrMode, cashReceived, notes, template]);

  // Load draft on mount
  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem('inv_draft') || '{}');
      if (draft.shopName) {
        setShopName(draft.shopName);
        setShopTagline(draft.shopTagline || '');
        setShopPhone(draft.shopPhone || '');
        setShopAddress(draft.shopAddress || '');
        setCustomerName(draft.customerName || '');
        if (draft.items?.length) setItems(draft.items);
        setDiscount(draft.discount || 0);
        setCgstRate(draft.cgstRate ?? 2.5);
        setSgstRate(draft.sgstRate ?? 2.5);
        setInvoiceNo(draft.invoiceNo || `INV-${Date.now().toString().slice(-6)}`);
        setPaymentMode(draft.paymentMode || 'Cash');
        setUpiId(draft.upiId || '');
        setQrMode(draft.qrMode || 'details');
        setCashReceived(draft.cashReceived || 0);
        setNotes(draft.notes || '');
        setTemplate(draft.template || 'classic');
      }
    } catch { /* ignore */ }
  }, []);

  const handlePrint = () => {
    if (clipperRef.current) clipperRef.current.style.maxHeight = '';
    setAnimate(false);
    setTimeout(() => genQR(), 50);
    void (clipperRef.current?.offsetWidth ?? 0);
    requestAnimationFrame(() => { setAnimate(true); });
  };

  const prepareForCapture = (el: HTMLDivElement) => {
    const clipper = el.parentElement;
    if (clipper) clipper.style.maxHeight = 'none';
    el.classList.add('receipt-exporting');
    el.style.width = '420px';
    el.style.padding = '18px 14px 14px';
    return () => {
      if (clipper) clipper.style.maxHeight = '';
      el.classList.remove('receipt-exporting');
      el.style.width = '';
      el.style.padding = '';
    };
  };

  const exportImage = async () => {
    if (!receiptRef.current) return;
    try {
      genBarcode(); genQR();
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 400));
      const el = receiptRef.current;
      const restore = prepareForCapture(el);
      const canvas = await html2canvas(el, {
        scale: exportScale,
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
      restore();
      const a = document.createElement('a');
      a.download = `invoice_${invoiceNo}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch (e) {
      console.error('Export error:', e);
      alert('Image export failed. Try again.');
    }
  };

  const exportPDF = async () => {
    if (!receiptRef.current) return;
    try {
      genBarcode(); genQR();
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 400));
      const el = receiptRef.current;
      const restore = prepareForCapture(el);
      const canvas = await html2canvas(el, {
        scale: Math.max(2, Math.min(exportScale, 4)),
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
      restore();
      const imgData = canvas.toDataURL('image/png');
      const pdfHeight = Math.max(90, (canvas.height * 80) / canvas.width + 4);
      const pdf = new jsPDF('p', 'mm', [80, pdfHeight]);
      const imgW = 76;
      const imgH = (canvas.height * imgW) / canvas.width;
      pdf.addImage(imgData, 'PNG', 2, 2, imgW, imgH);
      pdf.save(`invoice_${invoiceNo}.pdf`);
    } catch (e) {
      console.error('PDF error:', e);
      alert('PDF export failed. Try again.');
    }
  };

  const saveReceipt = () => {
    const receipt: SavedReceipt = {
      id: invoiceNo,
      shopName,
      customerName,
      items: [...items],
      subtotal,
      discount,
      cgst: cgstAmt,
      sgst: sgstAmt,
      grandTotal,
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN'),
    };
    const updated = [receipt, ...receiptHistory].slice(0, 50);
    setReceiptHistory(updated);
    localStorage.setItem('inv_receipt_history', JSON.stringify(updated));
    alert(`Receipt ${invoiceNo} saved to history!`);
  };

  const loadReceipt = (receipt: SavedReceipt) => {
    setInvoiceNo(receipt.id);
    setCustomerName(receipt.customerName);
    setItems(receipt.items.map((it, idx) => ({ ...it, id: Date.now() + idx })));
    setDiscount(receipt.discount);
    setShowHistory(false);
    alert(`Loaded receipt ${receipt.id}`);
  };

  const deleteReceipt = (id: string) => {
    const updated = receiptHistory.filter(r => r.id !== id);
    setReceiptHistory(updated);
    localStorage.setItem('inv_receipt_history', JSON.stringify(updated));
  };

  const exportAllJSON = () => {
    const data = JSON.stringify(receiptHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `receipts_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const shareWhatsApp = () => {
    const lines = items.map((it, i) => `${i + 1}. ${it.name} - ${it.qty}${it.unit} x ₹${it.price} = ₹${(it.qty * it.price).toFixed(2)}`);
    const text = encodeURIComponent(
      `*${shopName}*\n` +
      `Invoice: ${invoiceNo}\n` +
      `Date: ${new Date().toLocaleDateString('en-IN')}\n` +
      `${customerName ? `Customer: ${customerName}\n` : ''}` +
      `---\n${lines.join('\n')}\n---\n` +
      `Subtotal: ₹${subtotal.toFixed(2)}\n` +
      `${discount > 0 ? `Discount: -₹${discountAmt.toFixed(2)}\n` : ''}` +
      `CGST (${cgstRate}%): ₹${cgstAmt.toFixed(2)}\n` +
      `SGST (${sgstRate}%): ₹${sgstAmt.toFixed(2)}\n` +
      `*TOTAL: ₹${grandTotal.toFixed(2)}*\n` +
      `Payment: ${paymentMode}\n` +
      `${upiId ? `UPI: ${upiId}\n` : ''}` +
      `\n${notes}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const parseBulk = () => {
    const lines = bulkText.split(/\n|,/).map(l => l.trim()).filter(Boolean);
    const newItems: Item[] = [];
    lines.forEach((line, idx) => {
      const match = line.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*(\w+)\s*[@xX]\s*(\d+(?:\.\d+)?)$/);
      if (match) {
        newItems.push({
          id: nextId + idx,
          name: match[1].trim(),
          qty: parseFloat(match[2]),
          unit: match[3],
          price: parseFloat(match[4]),
          cost: parseFloat(match[4]) * 0.75,
          category: 'General',
        });
      }
    });
    if (newItems.length) {
      setItems([...items, ...newItems]);
      setNextId(nextId + newItems.length);
      setBulkText('');
      setShowBulk(false);
      alert(`${newItems.length} items imported!`);
    } else {
      alert('Could not parse. Format: Item Name Qty unit @price');
    }
  };

  const applyPreset = (preset: { shop: string; tagline: string; phone: string; address: string; items: { name: string; qty: number; unit: string; price: number; cost?: number; category?: string }[] }) => {
    setShopName(preset.shop);
    setShopTagline(preset.tagline);
    setShopPhone(preset.phone);
    setShopAddress(preset.address);
    const newItems = preset.items.map((it, idx) => ({ id: nextId + idx, ...it }));
    setItems(newItems);
    setNextId(nextId + preset.items.length + 1);
    setTimeout(() => genQR(), 200);
  };

  const templateClass = template === 'modern' ? 'receipt-modern' : template === 'minimal' ? 'receipt-minimal' : '';

  return (
    <div className="split-layout">
      {/* LEFT: FORM */}
      <div className="split-col">
        <div className="glass-panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold gradient-amber flex items-center gap-2"><IconShop className="w-6 h-6 text-amber-400" /> Dukandar Inventory</h2>
            {lastSaved && <span className="text-[10px] text-gray-500">Auto-saved {lastSaved}</span>}
          </div>

          <div className="section-title"><span>20+ Daily Presets</span></div>
          <div className="flex flex-col gap-3 max-h-[280px] sm:max-h-[360px] overflow-y-auto pr-1 rounded-lg border border-[#2c2c38] p-2 mb-1">
            {PRESET_GROUPS.map((group, gi) => (
              <div key={gi}>
                <div className="text-[11px] uppercase tracking-widest text-amber-500 font-bold mb-1.5 sticky top-0 bg-[#0f0f18] py-1 z-10">{group.category}</div>
                <div className="btn-group">
                  {group.items.map((preset, pi) => (
                    <button key={pi} className="retro-btn" onClick={() => applyPreset(preset.data)}>{preset.name}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="section-title"><span>Shop Details</span></div>
          <div className="flex flex-col gap-3">
            <div className="input-group">
              <label className="input-label">Dukaan Ka Naam</label>
              <input className="retro-input" value={shopName} onChange={e => setShopName(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">📢 Tagline</label>
              <input className="retro-input" value={shopTagline} onChange={e => setShopTagline(e.target.value)} />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Phone</label>
                <input className="retro-input" value={shopPhone} onChange={e => setShopPhone(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Customer</label>
                <input className="retro-input" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Walk-in" />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Address</label>
              <input className="retro-input" value={shopAddress} onChange={e => setShopAddress(e.target.value)} />
            </div>
          </div>

          <div className="section-title"><span>Billing & Export</span><button className="retro-btn text-[10px] flex items-center gap-1" onClick={() => setShortcutsHelp(true)}><IconKeyboard className="w-3.5 h-3.5" /> Shortcuts</button></div>
          <div className="flex flex-col gap-3">
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Invoice No.</label>
                <input className="retro-input" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Payment Mode</label>
                <select className="retro-select" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Credit">Credit / Udhaar</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">💱 Currency</label>
                <select className="retro-select" value={currency.code} onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}>
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">🌐 Language</label>
                <select className="retro-select" value={language} onChange={e => setLanguage(e.target.value as 'en' | 'hi')}>
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">QR Mode</label>
                <select className="retro-select" value={qrMode} onChange={e => setQrMode(e.target.value as 'details' | 'upi')}>
                  <option value="details">Detailed Bill QR</option>
                  <option value="upi">UPI Payment QR</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">UPI ID (for QR)</label>
                <input className="retro-input" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="shop@upi" />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Cash Received ₹</label>
                <input className="retro-input" type="number" min={0} value={cashReceived} onChange={e => setCashReceived(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Receipt Template</label>
                <select className="retro-select" value={template} onChange={e => setTemplate(e.target.value as any)}>
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Export Quality</label>
                <select className="retro-select" value={exportScale} onChange={e => setExportScale(parseInt(e.target.value, 10))}>
                  <option value={2}>Standard 2x</option>
                  <option value={3}>High 3x</option>
                  <option value={4}>Ultra 4x</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Bill Notes / Terms</label>
              <input className="retro-input" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          {/* Items */}
          <div className="section-title">
            <span>Items ({items.length})</span>
            <div className="flex flex-wrap gap-2 items-center justify-between sm:justify-start mb-4 p-3 bg-[#0f0f18] rounded-xl border border-[#2c2c38]">
              <div className="flex gap-2 flex-wrap">
                <button className={`retro-btn flex items-center gap-1 ${viewMode === 'card' ? 'bg-amber-400 text-black border-amber-400' : ''}`} onClick={() => setViewMode('card')}><IconCard className="w-3.5 h-3.5" /> Cards</button>
                <button className={`retro-btn flex items-center gap-1 ${viewMode === 'table' ? 'bg-amber-400 text-black border-amber-400' : ''}`} onClick={() => setViewMode('table')}><IconTable className="w-3.5 h-3.5" /> Table</button>
                <button className="retro-btn flex items-center gap-1" onClick={() => setShowBulk(!showBulk)}><IconBulk className="w-3.5 h-3.5" /> Bulk</button>
                <button className="retro-btn flex items-center gap-1" onClick={() => setShowCost(!showCost)}><IconMoney className="w-3.5 h-3.5" /> {showCost ? 'Hide Cost' : 'Show Cost'}</button>
              </div>
              <button className="retro-btn flex items-center gap-1 bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black" onClick={addItem}><IconAdd className="w-3.5 h-3.5" /> Add Item</button>
            </div>
          </div>

          {showBulk && (
            <div className="bg-[#0f0f18] border border-[#2c2c38] rounded-xl p-3 mb-3">
              <label className="text-[10px] uppercase text-gray-500 block mb-1">Bulk Import (Item Qty unit @price, one per line or comma)</label>
              <textarea className="retro-textarea" rows={3} value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder="Chini 2 kg @48, Tel 1 ltr @165" />
              <div className="btn-group mt-2">
                <button className="retro-btn" onClick={parseBulk}>Import</button>
                <button className="retro-btn" onClick={() => setShowBulk(false)}>Cancel</button>
              </div>
            </div>
          )}

          {viewMode === 'table' ? (
            <div className="inv-wrapper">
              <div className="inv-scroll">
                <table className="inv-table">
                  <thead>
                    <tr>
                      <th style={{ width: '32px' }}>#</th>
                      <th>Item</th>
                      <th style={{ width: '60px' }}>Qty</th>
                      <th style={{ width: '60px' }}>Unit</th>
                      <th style={{ width: '70px' }}>Price</th>
                      {showCost && <th style={{ width: '70px' }}>Cost</th>}
                      <th style={{ width: '70px' }}>Total</th>
                      <th style={{ width: '36px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="text-gray-500 text-xs font-mono">{idx + 1}</td>
                        <td>
                          <input className="inv-input mb-1" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} placeholder="Item..." />
                          <select className="inv-input text-[10px] py-1" value={item.category || 'General'} onChange={e => updateItem(item.id, 'category', e.target.value)}>
                            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td><input className="inv-input text-center" type="number" min={0} value={item.qty} onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)} /></td>
                        <td>
                          <select className="inv-input text-center" value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)}>
                            {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </td>
                        <td><input className="inv-input text-right" type="number" min={0} step="0.01" value={item.price} onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} /></td>
                        {showCost && <td><input className="inv-input text-right" type="number" min={0} step="0.01" value={item.cost || 0} onChange={e => updateItem(item.id, 'cost', parseFloat(e.target.value) || 0)} /></td>}
                        <td className="text-right font-mono text-amber-400 text-sm font-bold whitespace-nowrap">₹{(item.qty * item.price).toFixed(2)}</td>
                        <td><button className="inv-remove-btn" onClick={() => removeItem(item.id)} disabled={items.length <= 1}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-0.5">
              {items.length === 0 && <div className="text-center text-gray-500 py-4 text-sm">No items. Click "➕ Add" or use a preset!</div>}
              {items.map((item, idx) => (
                <div key={item.id} className="bg-[#0f0f18] border border-[#2c2c38] rounded-xl p-3 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="text-amber-400 font-bold text-sm flex-shrink-0">#{idx + 1}</span>
                    <span className="text-amber-400 font-mono font-bold text-sm whitespace-nowrap flex-1 text-right">₹{(item.qty * item.price).toFixed(2)}</span>
                    <button className="inv-remove-btn" onClick={() => removeItem(item.id)} disabled={items.length <= 1}>✕</button>
                  </div>
                  <input className="inv-input mb-2" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} placeholder="Item name..." />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] uppercase text-gray-500 block mb-1">Qty</label>
                      <input className="inv-input text-center" type="number" min={0} value={item.qty} onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-gray-500 block mb-1">Unit</label>
                      <select className="inv-input text-center" value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)}>
                        {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-gray-500 block mb-1">Price ₹</label>
                      <input className="inv-input text-right" type="number" min={0} step="0.01" value={item.price} onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} />
                    </div>
                    {showCost && (
                      <div>
                        <label className="text-[10px] uppercase text-gray-500 block mb-1">Cost ₹</label>
                        <input className="inv-input text-right" type="number" min={0} step="0.01" value={item.cost || 0} onChange={e => updateItem(item.id, 'cost', parseFloat(e.target.value) || 0)} />
                      </div>
                    )}
                  </div>
                  <select className="inv-input text-[10px] py-1 mt-2" value={item.category || 'General'} onChange={e => updateItem(item.id, 'category', e.target.value)}>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}

          <div className="section-title"><span>Discount & Tax</span></div>
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Discount %</label>
              <input className="retro-input" type="number" min={0} max={100} value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="input-group">
              <label className="input-label">CGST %</label>
              <input className="retro-input" type="number" min={0} max={50} value={cgstRate} onChange={e => setCgstRate(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="input-group">
              <label className="input-label">SGST %</label>
              <input className="retro-input" type="number" min={0} max={50} value={sgstRate} onChange={e => setSgstRate(parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          {showCost && (
            <div className="inv-total-box mt-3" style={{ borderColor: '#4ade80' }}>
              <div className="inv-total-row">
                <span className="text-gray-400">Total Cost</span>
                <span className="text-gray-300">₹{totalCost.toFixed(2)}</span>
              </div>
              <div className="inv-total-row">
                <span className="text-green-400">Profit</span>
                <span className="text-green-400">₹{profit.toFixed(2)} ({profitPercent}%)</span>
              </div>
            </div>
          )}

          <div className="inv-total-box">
            <div className="inv-total-row"><span className="text-gray-400">Subtotal ({items.length} items)</span><span className="text-white">₹{subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="inv-total-row"><span className="text-green-400">Discount ({discount}%)</span><span className="text-green-400">-₹{discountAmt.toFixed(2)}</span></div>}
            <div className="inv-total-row"><span className="text-gray-400">CGST ({cgstRate}%)</span><span className="text-yellow-400">+₹{cgstAmt.toFixed(2)}</span></div>
            <div className="inv-total-row"><span className="text-gray-400">SGST ({sgstRate}%)</span><span className="text-yellow-400">+₹{sgstAmt.toFixed(2)}</span></div>
            <div className="inv-total-row inv-grand-total"><span>GRAND TOTAL</span><span>₹{grandTotal.toFixed(2)}</span></div>
          </div>

          <button className="print-btn mt-4 flex items-center justify-center gap-2" onClick={handlePrint}><IconPrint className="w-5 h-5" /> Print Invoice</button>

          <div className="btn-group justify-center mt-3">
            <button className="retro-btn flex items-center gap-1" onClick={exportImage}><IconImage className="w-3.5 h-3.5" /> Image</button>
            <button className="retro-btn flex items-center gap-1" onClick={exportPDF}><IconPDF className="w-3.5 h-3.5" /> PDF</button>
            <button className="retro-btn flex items-center gap-1" onClick={shareWhatsApp}><IconWhatsApp className="w-3.5 h-3.5" /> WhatsApp</button>
            <button className="retro-btn flex items-center gap-1" onClick={saveReceipt}><IconSave className="w-3.5 h-3.5" /> Save</button>
          </div>

          <div className="btn-group justify-center mt-2">
            <button className="retro-btn flex items-center gap-1" onClick={() => setShowHistory(!showHistory)}><IconHistory className="w-3.5 h-3.5" /> History ({receiptHistory.length})</button>
            <button className="retro-btn flex items-center gap-1" onClick={exportAllJSON}><IconExport className="w-3.5 h-3.5" /> Export</button>
            <label className="retro-btn cursor-pointer flex items-center gap-1">
              <IconImport className="w-3.5 h-3.5" /> Import
              <input type="file" accept=".json" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    try {
                      const data = JSON.parse(ev.target?.result as string);
                      if (Array.isArray(data)) {
                        setReceiptHistory(data);
                        localStorage.setItem('inv_receipt_history', JSON.stringify(data));
                        alert(`Imported ${data.length} receipts!`);
                      } else {
                        alert('Invalid file format');
                      }
                    } catch {
                      alert('Failed to parse file');
                    }
                  };
                  reader.readAsText(file);
                }
                e.target.value = '';
              }} />
            </label>
          </div>

          {showHistory && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="relative">
                <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  className="retro-input text-sm pl-9"
                  placeholder="Search history..."
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                />
              </div>
              <div className="max-h-[250px] overflow-y-auto flex flex-col gap-2">
                {receiptHistory.length === 0 && <div className="text-center text-gray-500 text-sm py-2">No saved receipts yet</div>}
                {receiptHistory
                  .filter(r => 
                    r.id.toLowerCase().includes(historySearch.toLowerCase()) ||
                    r.shopName.toLowerCase().includes(historySearch.toLowerCase()) ||
                    r.customerName.toLowerCase().includes(historySearch.toLowerCase())
                  )
                  .map(r => (
                    <div key={r.id} className="bg-[#0f0f18] border border-[#2c2c38] rounded-xl p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-amber-400 truncate">{r.id}</div>
                        <div className="text-[10px] text-gray-400">{r.shopName} • {r.customerName || 'Walk-in'} • {currency.symbol}{r.grandTotal.toFixed(2)}</div>
                        <div className="text-[9px] text-gray-500">{r.date} {r.time}</div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button className="retro-btn text-[10px]" onClick={() => loadReceipt(r)}>Load</button>
                        <button className="retro-btn text-[10px]" onClick={() => { setInvoiceNo(`${r.id}-COPY`); setItems(r.items.map((it, idx) => ({ ...it, id: Date.now() + idx }))); }}>Duplicate</button>
                        <button className="retro-btn text-[10px]" onClick={() => deleteReceipt(r.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Keyboard Shortcuts Help */}
          {shortcutsHelp && (
            <div className="mt-3 bg-[#0f0f18] border border-[#2c2c38] rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400">Keyboard Shortcuts</span>
                <button className="retro-btn text-[10px]" onClick={() => setShortcutsHelp(false)}>Close</button>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-400">
                <div><kbd className="bg-[#2c2c38] px-1 rounded">Ctrl+P</kbd> Print</div>
                <div><kbd className="bg-[#2c2c38] px-1 rounded">Ctrl+S</kbd> Save</div>
                <div><kbd className="bg-[#2c2c38] px-1 rounded">Ctrl+E</kbd> Export Image</div>
                <div><kbd className="bg-[#2c2c38] px-1 rounded">Ctrl+D</kbd> Export PDF</div>
                <div><kbd className="bg-[#2c2c38] px-1 rounded">Ctrl+N</kbd> Add Item</div>
                <div><kbd className="bg-[#2c2c38] px-1 rounded">Ctrl+B</kbd> Bulk Import</div>
                <div><kbd className="bg-[#2c2c38] px-1 rounded">Ctrl+H</kbd> Toggle History</div>
                <div><kbd className="bg-[#2c2c38] px-1 rounded">Ctrl+?</kbd> This Help</div>
                <div><kbd className="bg-[#2c2c38] px-1 rounded">Esc</kbd> Close Modals</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: RECEIPT PREVIEW */}
      <div className="split-col center">
        <div className="printer-machine">
          <div className="paper-slot">
            <div className="slot-mouth"></div>
            <div ref={clipperRef} className={`receipt-clipper ${animate ? 'print-animate' : ''}`}>
                <div className={`receipt-content ${templateClass}`} ref={receiptRef}>
                <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 800, wordBreak: 'break-word' }}>{shopName}</div>
                <div className="receipt-tagline">{shopTagline}</div>
                <div style={{ textAlign: 'center', fontSize: '10px', wordBreak: 'break-word' }}>Tel: {shopPhone}</div>
                <div style={{ textAlign: 'center', fontSize: '10px', wordBreak: 'break-word' }}>{shopAddress}</div>
                <hr className="receipt-hr" />
                <div className="receipt-flex-row"><span>{language === 'hi' ? HINDI_LABELS['Invoice'] : 'INVOICE'}</span><span>{invoiceNo}</span></div>
                <div className="receipt-flex-row"><span>{language === 'hi' ? HINDI_LABELS['Date'] : 'DATE'}</span><span>{new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</span></div>
                <div className="receipt-flex-row"><span>{language === 'hi' ? HINDI_LABELS['Time'] : 'TIME'}</span><span>{new Date().toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })}</span></div>
                <div className="receipt-flex-row"><span>{language === 'hi' ? HINDI_LABELS['Payment'] : 'PAYMENT'}</span><span>{paymentMode}</span></div>
                {customerName && <div className="receipt-flex-row"><span>{language === 'hi' ? HINDI_LABELS['Customer'] : 'CUSTOMER'}</span><span>{customerName}</span></div>}
                <div className="receipt-stars">{'='.repeat(26)}</div>

                <div style={{ fontSize: '12px' }}>
                  <div className="receipt-flex-row" style={{ fontWeight: 800, borderBottom: '1px solid #333', paddingBottom: '3px' }}>
                    <span style={{ flex: '1 1 auto', minWidth: 0 }}>{language === 'hi' ? HINDI_LABELS['Item'] : 'ITEM'}</span>
                    <span style={{ width: '36px', textAlign: 'right', flexShrink: 0 }}>{language === 'hi' ? HINDI_LABELS['Qty'] : 'QTY'}</span>
                    <span style={{ width: '44px', textAlign: 'right', flexShrink: 0 }}>{language === 'hi' ? HINDI_LABELS['Rate'] : 'RATE'}</span>
                    <span style={{ width: '55px', textAlign: 'right', flexShrink: 0 }}>{language === 'hi' ? HINDI_LABELS['Amt'] : 'AMT'}</span>
                  </div>
                  {items.map((item, idx) => (
                    <div key={item.id} className="receipt-flex-row" style={{ borderBottom: '1px dotted #ccc', paddingBottom: '2px', alignItems: 'baseline' }}>
                      <span style={{ flex: '1 1 auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                        {idx + 1}. {item.name || '???'}
                      </span>
                      <span style={{ width: '36px', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap' }}>{item.qty}{item.unit}</span>
                      <span style={{ width: '44px', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap' }}>{currency.symbol}{item.price.toFixed(1)}</span>
                      <span style={{ width: '55px', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap', fontWeight: 'bold' }}>{currency.symbol}{(item.qty * item.price).toFixed(1)}</span>
                    </div>
                  ))}
                </div>

                <div className="receipt-stars">{'='.repeat(26)}</div>
                <div className="receipt-flex-row"><span>{language === 'hi' ? HINDI_LABELS['Subtotal'] : 'SUBTOTAL'}</span><span>{currency.symbol}{subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="receipt-flex-row"><span>{language === 'hi' ? HINDI_LABELS['Discount'] : 'DISCOUNT'} ({discount}%)</span><span>-{currency.symbol}{discountAmt.toFixed(2)}</span></div>}
                <div className="receipt-flex-row"><span>CGST ({cgstRate}%)</span><span>{currency.symbol}{cgstAmt.toFixed(2)}</span></div>
                <div className="receipt-flex-row"><span>SGST ({sgstRate}%)</span><span>{currency.symbol}{sgstAmt.toFixed(2)}</span></div>
                <div className="receipt-flex-row" style={{ fontWeight: 800, fontSize: '15px', borderTop: '2px solid #111', paddingTop: '4px' }}>
                  <span>{language === 'hi' ? HINDI_LABELS['Total'] : 'TOTAL'}</span><span>{currency.symbol}{grandTotal.toFixed(2)}</span>
                </div>
                {paymentMode === 'Cash' && cashReceived > 0 && (
                  <>
                    <div className="receipt-flex-row"><span>{language === 'hi' ? HINDI_LABELS['Cash Received'] : 'CASH RECEIVED'}</span><span>{currency.symbol}{cashReceived.toFixed(2)}</span></div>
                    <div className="receipt-flex-row"><span>{balanceAmount >= 0 ? (language === 'hi' ? HINDI_LABELS['Change'] : 'CHANGE') : (language === 'hi' ? HINDI_LABELS['Due'] : 'DUE')}</span><span>{currency.symbol}{Math.abs(balanceAmount).toFixed(2)}</span></div>
                  </>
                )}
                <hr className="receipt-hr" />
                {notes && <div style={{ fontSize: '9px', textAlign: 'center', marginBottom: '8px', wordBreak: 'break-word' }}>{notes}</div>}
                <div style={{ textAlign: 'center', fontSize: '10px', background: '#e5ddc7', padding: '5px', margin: '10px 0', fontFamily: 'monospace' }}>
                  {language === 'hi' ? HINDI_LABELS['Thank You'] : 'THANK YOU!'} PHIR AAIYEGA!
                </div>
                <hr className="receipt-hr" />
                <div className="receipt-barcode" ref={barcodeRef}></div>
                <div className="receipt-qr">
                  <div ref={qrRef} id="receiptQR_inv">
                    {qrDataUrl ? <img src={qrDataUrl} alt="Invoice QR" width={80} height={80} /> : <span style={{ fontSize: '9px' }}>QR loading...</span>}
                  </div>
                </div>
                <div className="receipt-footer">{shopName.toUpperCase()}</div>
                <div style={{ fontSize: '9px', textAlign: 'center', marginTop: '6px' }}>** SHUBH LABH **</div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 text-center px-2">Line-by-line items + CGST/SGST + QR + WhatsApp + History</p>
      </div>
    </div>
  );
}
