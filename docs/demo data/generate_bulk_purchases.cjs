const fs = require('fs');
const path = require('path');

// -------------------- LOAD SUPPLIERS (first 5 only) --------------------
const suppliersPath = path.join(__dirname, 'suppliers.json');
const allSuppliers = JSON.parse(fs.readFileSync(suppliersPath, 'utf-8')).slice(0, 5);

// -------------------- LOAD EXISTING PURCHASE DATES --------------------
const generatedPath = path.join(__dirname, 'generated_purchases.json');
const generated = JSON.parse(fs.readFileSync(generatedPath, 'utf-8'));
const existingDates = [...new Set(generated.map(p => p.purchaseDate))].sort();

// -------------------- HELPERS --------------------
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function addDays(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
}

function nearbyDate() {
    const base = pick(existingDates);
    const offset = rand(-3, 3);
    return addDays(base, offset);
}

function randomUniqueKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 9; i++) key += chars[rand(0, chars.length - 1)];
    return key;
}

// -------------------- BRANDS (MID TIER ONLY) --------------------
const midBrands = {
    SPECTACLES: ['Titan', 'Fastrack', 'Vogue'],
    SUNGLASSES: ['Titan', 'Fastrack', 'Vogue'],
    LENS: ['Insta', 'Carl Zeiss', 'Essilor'],
    CONTACT_LENSES: ['Acuvue', 'Air Optix', 'Biofinity']
};

// -------------------- SHAPES / MATERIALS / TYPES --------------------
const shapes = ['Rectangle', 'Round', 'Aviator', 'Square', 'Cat Eye'];
const materials = ['Acetate', 'Metal', 'TR90', 'Titanium'];
const types = ['Full Rim', 'Half Rim', 'Rimless'];
const colors = ['Black', 'Blue', 'Brown', 'Transparent'];
const sizes = ['S', 'M', 'L'];
const genders = ['Male', 'Female', 'Unisex'];

// -------------------- MID TIER PRICE ENGINE --------------------
function getPrice(category) {
    const map = {
        SPECTACLES: [900, 2500],
        SUNGLASSES: [2000, 5000],
        LENS: [600, 1500],
        CONTACT_LENSES: [1200, 2500]
    };
    const [min, max] = map[category];
    return rand(min, max);
}

// -------------------- HSN MAPPING --------------------
function getHSN(category) {
    if (category === 'SUNGLASSES') return '9004.1000';
    if (category === 'SPECTACLES') return '9004.9090';
    if (category === 'LENS') return '9001.5000';
    if (category === 'CONTACT_LENSES') return '9001.3000';
    return '9004.9090';
}

// -------------------- POWER STEPS FOR LENSES & CONTACT LENSES --------------------
