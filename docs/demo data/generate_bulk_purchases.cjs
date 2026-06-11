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
function generatePowerSteps() {
    const steps = [];
    for (let p = -4.0; p <= -0.25; p += 0.25) steps.push(parseFloat(p.toFixed(2)));
    for (let p = 0.25; p <= 4.0; p += 0.25) steps.push(parseFloat(p.toFixed(2)));
    return steps;
}

const POWER_STEPS = generatePowerSteps(); // 32 values

// -------------------- PRODUCT CATALOGUE --------------------
let codeSpectacles = 2000;
let codeLens = 3000;
let codeCL = 4000;

const catalogue = [];

// --- SPECTACLES ---
for (let i = 0; i < 30; i++) {
    const brand = pick(midBrands.SPECTACLES);
    const shape = pick(shapes);
    const material = pick(materials);
    const type = pick(types);
    catalogue.push({
        category: 'SPECTACLES',
        productCode: `SPE-${codeSpectacles++}`,
        materialName: `${brand} ${shape} ${i}`,
        productDescription: `${brand} ${material} ${type} Spectacle Frame with Demo Lens`,
        hsn: getHSN('SPECTACLES'),
        purchasePrice: getPrice('SPECTACLES'),
        brand,
        shape,
        material,
        type,
        color: pick(colors),
        size: pick(sizes),
        gender: pick(genders)
    });
}

// --- SUNGLASSES ---
for (let i = 0; i < 30; i++) {
    const brand = pick(midBrands.SUNGLASSES);
    const shape = pick(shapes);
    const material = pick(materials);
    const type = pick(types);
    catalogue.push({
        category: 'SUNGLASSES',
        productCode: `SUN-${codeSpectacles++}`,
        materialName: `${brand} ${shape} Sunglasses ${i}`,
        productDescription: `${brand} ${material} ${type} Sunglasses`,
        hsn: getHSN('SUNGLASSES'),
        purchasePrice: getPrice('SUNGLASSES'),
        brand,
        shape,
        material,
        type,
        color: pick(colors),
        size: pick(sizes),
        gender: pick(genders)
    });
}

// --- LENS ---
const coatings = ['ARC', 'Blue Cut', 'Photochromic', 'Anti Glare'];
const indices = ['1.5', '1.56', '1.6', '1.67'];

for (let i = 0; i < 20; i++) {
    const coating = pick(coatings);
    catalogue.push({
        category: 'LENS',
        productCode: `LNS-${codeLens++}`,
        materialName: `Single Vision Lens`,
        productDescription: `${coating} Lens Index ${pick(indices)}`,
        hsn: getHSN('LENS'),
        purchasePrice: getPrice('LENS'),
        coating,
        index: pick(indices)
    });
