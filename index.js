// Exam1 Full Test Generator
const fs = require('fs');
const path = require('path');

function createTestFolder(folder) {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
}

function writeTest(folder, index, input, output) {
    fs.writeFileSync(path.join(folder, `input${index}.txt`), input);
    fs.writeFileSync(path.join(folder, `output${index}.txt`), output);
}

// A1: Tính Giai Thừa
function genA1() {
    const folder = 'Exam1/A1';
    createTestFolder(folder);
    for (let i = 1; i <= 20; i++) {
        const n = Math.floor(Math.random() * 21);
        const input = `${n}`;
        const output = `${factorial(n)}`;
        writeTest(folder, i, input, output);
    }
    function factorial(n) {
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    }
}

// B1: Sắp Xếp Hai Mảng
function genB1() {
    const folder = 'Exam1/B1';
    createTestFolder(folder);
    for (let i = 1; i <= 20; i++) {
        const n = Math.floor(Math.random() * 20) + 1;
        const k = Math.floor(Math.random() * 20) + 1;
        const arr1 = Array.from({ length: n }, () => Math.floor(Math.random() * 100));
        const arr2 = Array.from({ length: k }, () => Math.floor(Math.random() * 100));
        const input = `${n} ${k}\n${arr1.join(' ')}\n${arr2.join(' ')}`;
        const merged = arr1.concat(arr2).sort((a, b) => a - b);
        const output = `${merged.join(' ')}`;
        writeTest(folder, i, input, output);
    }
}

// C1: Phương Trình Bậc Hai
function genC1() {
    const folder = 'Exam1/C1';
    createTestFolder(folder);
    for (let i = 1; i <= 20; i++) {
        let a, b, c;
        do {
            a = rand(-10, 10);
        } while (a === 0);
        b = rand(-20, 20);
        c = rand(-20, 20);
        const input = `${a} ${b} ${c}`;
        const d = b * b - 4 * a * c;
        let output;
        if (d < 0) output = 'Invalid';
        else {
            let x1 = (-b - Math.sqrt(d)) / (2 * a);
            let x2 = (-b + Math.sqrt(d)) / (2 * a);
            x1 = +x1.toFixed(6);
            x2 = +x2.toFixed(6);
            output = `${Math.min(x1, x2)} ${Math.max(x1, x2)}`;
        }
        writeTest(folder, i, input, output);
    }
    function rand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

// D1: Đổi Tiền
function genD1() {
    const folder = 'Exam1/D1';
    createTestFolder(folder);
    const denominations = [500, 200, 100, 50, 20, 10, 5, 2, 1];
    for (let i = 1; i <= 20; i++) {
        const T = rand(1, 5);
        const arr = Array.from({ length: T }, () => rand(1, 100000));
        const input = `${T}\n` + arr.join('\n');
        const output = arr.map(n => minCoins(n)).join('\n');
        writeTest(folder, i, input, output);
    }
    function minCoins(n) {
        let count = 0;
        for (const d of denominations) {
            count += Math.floor(n / d);
            n %= d;
        }
        return count;
    }
    function rand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

// E1: 3Sum
function genE1() {
    const folder = 'Exam1/E1';
    createTestFolder(folder);
    for (let t = 1; t <= 20; t++) {
        const n = rand(3, 30);
        const nums = Array.from({ length: n }, () => rand(-20, 20));
        const input = nums.join(' ');
        const output = JSON.stringify(threeSum(nums));
        writeTest(folder, t, input, output);
    }
    function threeSum(nums) {
        const res = new Set();
        nums.sort((a, b) => a - b);
        for (let i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] === nums[i - 1]) continue;
            let l = i + 1, r = nums.length - 1;
            while (l < r) {
                const sum = nums[i] + nums[l] + nums[r];
                if (sum === 0) {
                    res.add(JSON.stringify([nums[i], nums[l], nums[r]]));
                    while (nums[l] === nums[l + 1]) l++;
                    while (nums[r] === nums[r - 1]) r--;
                    l++;
                    r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return Array.from(res).map(s => JSON.parse(s));
    }
    function rand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

// F1 to L1 generators
function genF1() {
    const folder = 'Exam1/F1';
    createTestFolder(folder);
    for (let i = 1; i <= 20; i++) {
        const n = rand(1, 100);
        const s = Array.from({ length: n }, () => String.fromCharCode(rand(97, 122))).join('');
        const input = `${n}\n${s}`;
        const output = s.split('').reverse().join(''); // placeholder logic
        writeTest(folder, i, input, output);
    }
    function rand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

function genG1() {
    const folder = 'Exam1/G1';
    createTestFolder(folder);
    for (let i = 1; i <= 20; i++) {
        const n = rand(1, 100);
        const a = Array.from({ length: n }, () => rand(-1e6, 1e6));
        const input = `${n}\n${a.join(' ')}`;
        const output = `${Math.max(...a)}`;
        writeTest(folder, i, input, output);
    }
    function rand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

function genH1() {
    const folder = 'Exam1/H1';
    createTestFolder(folder);
    for (let i = 1; i <= 20; i++) {
        const a = rand(-1e9, 1e9);
        const b = rand(-1e9, 1e9);
        const c = rand(-1e9, 1e9);
        const input = `${a} ${b} ${c}`;
        const output = `${a + b + c}`;
        writeTest(folder, i, input, output);
    }
    function rand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

function genI1() {
    const folder = 'Exam1/I1';
    createTestFolder(folder);
    for (let i = 1; i <= 20; i++) {
        const n = rand(1, 100);
        const words = Array.from({ length: n }, () => {
            const len = rand(1, 10);
            return Array.from({ length: len }, () => String.fromCharCode(rand(97, 122))).join('');
        });
        const input = `${n}\n${words.join('\n')}`;
        const output = `${words.sort().join('\n')}`;
        writeTest(folder, i, input, output);
    }
    function rand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

function genJ1() {
    const folder = 'Exam1/J1';
    createTestFolder(folder);
    for (let i = 1; i <= 20; i++) {
        const n = rand(1, 100);
        const input = `${n}`;
        const output = `${n * n}`;
        writeTest(folder, i, input, output);
    }
    function rand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

function genK1() {
    const folder = 'Exam1/K1';
    createTestFolder(folder);
    for (let i = 1; i <= 20; i++) {
        const n = rand(2, 100);
        const edges = [];
        for (let j = 2; j <= n; j++) {
            const p = rand(1, j - 1);
            edges.push(`${p} ${j}`);
        }
        const input = `${n}\n${edges.join('\n')}`;
        const output = `${n - 1}`;
        writeTest(folder, i, input, output);
    }
    function rand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

function genL1() {
    const folder = 'Exam1/L1';
    createTestFolder(folder);
    for (let i = 1; i <= 20; i++) {
        const n = rand(1, 100);
        const a = Array.from({ length: n }, () => rand(1, 1e6));
        const input = `${n}\n${a.join(' ')}`;
        const output = `${a.reduce((s, x) => s + x, 0)}`;
        writeTest(folder, i, input, output);
    }
    function rand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}

function generateAll() {
    genA1();
    genB1();
    genC1();
    genD1();
    genE1();
    genF1();
    genG1();
    genH1();
    genI1();
    genJ1();
    genK1();
    genL1();
}

generateAll();