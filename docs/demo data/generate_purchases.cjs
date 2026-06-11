const fs = require('fs');
const path = require('path');

// -------------------- LOAD SUPPLIERS --------------------
const suppliersPath = path.join(__dirname, 'suppliers.json');
const suppliers = JSON.parse(fs.readFileSync(suppliersPath, 'utf-8')).slice(0, 5);

// -------------------- HELPERS --------------------
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomUniqueKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 9; i++) key += chars[rand(0, chars.length - 1)];
    return key;
}

// -------------------- PRICE ENGINE --------------------
function getPrice(category, tier) {
    const map = {
        SPECTACLES: { budget: [400, 900], mid: [900, 2500], premium: [2500, 8000] },
        SUNGLASSES: { budget: [800, 2000], mid: [2000, 5000], premium: [5000, 15000] },
        FRAMES: { budget: [300, 800], mid: [800, 2000], premium: [2000, 6000] },
        LENS: { budget: [200, 600], mid: [600, 1500], premium: [1500, 5000] },
        CONTACT_LENSES: { budget: [600, 1200], mid: [1200, 2500], premium: [2500, 4000] },
        SOLUTIONS: { budget: [100, 300], mid: [300, 600], premium: [600, 1200] },
        OTHER: { budget: [20, 150], mid: [150, 400], premium: [400, 1000] },
        NON_CHARGEABLE: { budget: [0, 0], mid: [0, 0], premium: [0, 0] }
    };
    const [min, max] = map[category][tier];
    return rand(min, max);
}

// -------------------- QUANTITY --------------------
function getQuantity(tier) {
    if (tier === 'premium') return rand(10, 40);
    if (tier === 'mid') return rand(30, 80);
    return rand(80, 200);
}

// -------------------- HSN --------------------
function getHSN(category, material) {
    if (category === 'FRAMES') {
        return (material === 'Metal' || material === 'Titanium')
            ? '9003.1900'
            : '9003.1100';
    }
    const map = {
        SPECTACLES: '9004.9090',
        SUNGLASSES: '9004.1000',
        LENS: '9001.5000',
        CONTACT_LENSES: '9001.3000',
        SOLUTIONS: '3304.9910',
        OTHER: '9004.9090',
        NON_CHARGEABLE: '0000.0000'
    };
    return map[category] || '9004.9090';
