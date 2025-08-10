// generateExam1.js
// Sinh testcases cho Exam 1: tạo thư mục "Exam 1"/A1..L1 với input1.txt..input20.txt + output1.txt..output20.txt
// Các bài theo đúng spec JSON bạn đưa; C1 in 2 chữ số thập phân.

const fs = require('fs');
const path = require('path');

const ROOT_NAME = 'Exam 1';
const ROOT_DIR = path.join(process.cwd(), ROOT_NAME);

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeCaseFiles(rootDir, problemId, inputs, outputs) {
    const dir = path.join(rootDir, problemId);
    ensureDir(dir);
    const n = Math.min(inputs.length, outputs.length, 20);
    for (let i = 0; i < n; i++) {
        fs.writeFileSync(path.join(dir, `input${i + 1}.txt`), inputs[i], 'utf8');
        fs.writeFileSync(path.join(dir, `output${i + 1}.txt`), outputs[i], 'utf8');
    }
    if (n < 20) {
        console.warn(`${problemId}: Only wrote ${n} cases (expected 20).`);
    }
}

/* ---------- Helpers ---------- */
function fmtDecimal2(x) {
    // Handle -0 -> 0.00
    if (Object.is(x, -0)) x = 0;
    return Number(x).toFixed(2);
}

/* ---------- Generators A1..L1 (deterministic sets; 20 cases each) ---------- */

/* A1: Factorial (0 ≤ n ≤ 20) */
function genA1() {
    const ns = [0,1,2,3,4,5,6,7,8,9,10,12,15,18,19,20,11,13,14,16];
    const inputs = [], outputs = [];
    for (let n of ns) {
        inputs.push(String(n));
        let f = 1n;
        for (let i = 1n; i <= BigInt(n); i++) f *= i;
        outputs.push(String(f));
    }
    return { inputs, outputs };
}

/* B1: Merge and sort two arrays (format: n k \n A \n B) */
function genB1() {
    const cases = [
        {a:[2,1,3], b:[8,7,9,4]},
        {a:[5], b:[]},
        {a:[], b:[5]},
        {a:[1], b:[1]},
        {a:[-1,0], b:[0,-1]},
        {a:[1000,-1000], b:[0]},
        {a:[1,2,3], b:[4,5,6]},
        {a:[7,8,9], b:[1,2,3]},
        {a:[1,1,1], b:[1,1]},
        {a:[10,-1], b:[0,5]},
        {a:[9,7], b:[8,6]},
        {a:[0], b:[0]},
        {a:[2,4,6], b:[1,3,5]},
        {a:[-5,-2], b:[-3,-4]},
        {a:[100], b:[50,150]},
        {a:[7,7,7], b:[7,7]},
        {a:[1,1000], b:[500,-500]},
        {a:[4], b:[3]},
        {a:[11,13,12], b:[14,10]},
        {a:[-100,0,100], b:[-50,50]}
    ];
    const inputs = [], outputs = [];
    for (let c of cases) {
        const n = c.a.length, k = c.b.length;
        const line2 = n>0 ? c.a.join(' ') : '';
        const line3 = k>0 ? c.b.join(' ') : '';
        inputs.push(`${n} ${k}\n${line2}\n${line3}`);
        const merged = [...c.a, ...c.b].sort((x,y)=>x-y);
        outputs.push(merged.join(' '));
    }
    return { inputs, outputs };
}

/* C1: Quadratic equation (a b c) -> 2 decimals, Invalid, Infinite */
function genC1() {
    const cases = [
        {a:1,b:-5,c:6},    // 2 roots 2 and 3
        {a:2,b:-2,c:3},    // Invalid (delta < 0)
        {a:1,b:2,c:1},     // double root -1
        {a:1,b:0,c:-4},    // -2 2
        {a:0,b:2,c:-4},    // linear 2
        {a:1,b:1,c:1},     // Invalid
        {a:0,b:0,c:0},     // Infinite
        {a:1,b:-4,c:4},    // double root 2
        {a:1,b:-3,c:2},    // 1 2
        {a:1,b:0,c:0},     // 0
        {a:1,b:-2,c:1},    // double root 1
        {a:2,b:5,c:-3},    // -3 and 0.5
        {a:1,b:-1,c:-6},   // -2 3
        {a:1,b:4,c:4},     // double root -2
        {a:5,b:0,c:-45},   // -3 3
        {a:1,b:-7,c:12},   // 3 4
        {a:1,b:5,c:6},     // -3 -2
        {a:2,b:-4,c:2},    // double root 1
        {a:3,b:0,c:-12},   // -2 2
        {a:1,b:-9,c:20}    // 4 5
    ];
    const inputs = [], outputs = [];
    const EPS = 1e-12;
    for (let t of cases) {
        inputs.push(`${t.a} ${t.b} ${t.c}`);
        const a = t.a, b = t.b, c = t.c;
        if (a===0 && b===0 && c===0) {
            outputs.push('Infinite');
            continue;
        }
        if (a===0 && b===0) {
            outputs.push('Invalid');
            continue;
        }
        if (a===0) {
            const x = -c / b;
            outputs.push(fmtDecimal2(x));
            continue;
        }
        const delta = b*b - 4*a*c;
        if (delta < -EPS) {
            outputs.push('Invalid');
            continue;
        }
        if (Math.abs(delta) <= EPS) {
            const x = -b / (2*a);
            outputs.push(`${fmtDecimal2(x)} ${fmtDecimal2(x)}`);
            continue;
        }
        const sd = Math.sqrt(delta);
        let x1 = (-b - sd) / (2*a);
        let x2 = (-b + sd) / (2*a);
        if (x1 > x2) [x1, x2] = [x2, x1];
        outputs.push(`${fmtDecimal2(x1)} ${fmtDecimal2(x2)}`);
    }
    return { inputs, outputs };
}

/* D1: Change money (T then T lines each N) -> minimal number of notes */
function genD1() {
    const Ns = [70,121,1,2,3,5,10,99999,100000,54321,500,999,1000,37,88,1234,10000,99998,47,9999];
    const coins = [100,50,20,10,5,2,1];
    const inputs = [], outputs = [];
    for (let N of Ns) {
        // we'll use single-test files (T=1) to keep format simple and consistent
        inputs.push(`1\n${N}`);
        let remain = N;
        let cnt = 0;
        for (let c of coins) {
            cnt += Math.floor(remain / c);
            remain %= c;
        }
        outputs.push(String(cnt));
    }
    return { inputs, outputs };
}

/* E1: 3Sum - input: one line of ints -> output: JSON-like array string of triplets */
function genE1() {
    const cases = [
        [-1,0,1,2,-1,-4],
        [0,1,1],
        [0,0,0,0],
        [1,2,-3,4,-1,-4,0],
        [-2,-1,3,0,1,2],
        [3,-3,0,0,0],
        [1,-1,-1,2,-2,0],
        [5,-5,0,0],
        [2,-2,1,-1,0],
        [10,-10,0],
        [1,1,-2],
        [4,-1,-3,0],
        [2,2,-4,0],
        [3,-1,-2,0],
        [-1,-1,2,0],
        [-3,1,2,0],
        [6,-6,0],
        [5,-2,-3,0],
        [7,-7,0],
        [8,-8,0]
    ];
    function threeSum(arr) {
        const nums = arr.slice().sort((a,b)=>a-b);
        const res = [];
        for (let i=0;i<nums.length-2;i++) {
            if (i>0 && nums[i]===nums[i-1]) continue;
            let l=i+1, r=nums.length-1;
            while (l<r) {
                const s = nums[i]+nums[l]+nums[r];
                if (s===0) {
                    res.push([nums[i],nums[l],nums[r]]);
                    while (l<r && nums[l]===nums[l+1]) l++;
                    while (l<r && nums[r]===nums[r-1]) r--;
                    l++; r--;
                } else if (s<0) l++;
                else r--;
            }
        }
        return JSON.stringify(res);
    }
    const inputs = [], outputs = [];
    for (let a of cases) {
        inputs.push(a.join(' '));
        outputs.push(threeSum(a));
    }
    return { inputs, outputs };
}

/* F1: Generate parentheses - input n (1..8) -> output JSON array of strings */
function genF1() {
    const ns = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,3,2,4,5,6,7];
    function gen(n) {
        const res = [];
        function dfs(s, open, close) {
            if (s.length === 2*n) { res.push(s); return; }
            if (open < n) dfs(s+'(', open+1, close);
            if (close < open) dfs(s+')', open, close+1);
        }
        dfs('',0,0);
        return JSON.stringify(res);
    }
    const inputs = [], outputs = [];
    for (let n of ns) {
        inputs.push(String(n));
        outputs.push(gen(n));
    }
    return { inputs, outputs };
}

/* G1: Check BST
   Input: N lines relations: parent child side
   Output: 'true' or 'false' */
function genG1() {
    function buildBSTEdges(values) {
        const nodes = new Map();
        const root = values[0];
        nodes.set(root, {val:root, left:null, right:null});
        for (let i=1;i<values.length;i++) {
            const v = values[i];
            let cur = nodes.get(root);
            while (true) {
                if (v < cur.val) {
                    if (cur.left === null) {
                        cur.left = v;
                        nodes.set(v, {val:v, left:null, right:null});
                        break;
                    } else cur = nodes.get(cur.left);
                } else {
                    if (cur.right === null) {
                        cur.right = v;
                        nodes.set(v, {val:v, left:null, right:null});
                        break;
                    } else cur = nodes.get(cur.right);
                }
            }
        }
        const edges = [];
        for (let [val,node] of nodes.entries()) {
            if (node.left !== null) edges.push(`${val} ${node.left} L`);
            if (node.right !== null) edges.push(`${val} ${node.right} R`);
        }
        return {edges, size: nodes.size};
    }

    const inputs = [], outputs = [];
    // 10 valid cases (deterministic)
    for (let t=0;t<10;t++) {
        const len = 5 + (t % 6);
        const vals = [];
        for (let i=0;i<len;i++) vals.push(10*(t+1)+i);
        // deterministic insertion order: increasing as in vals
        const ins = vals.slice();
        const {edges} = buildBSTEdges(ins);
        const lines = [String(edges.length), ...edges];
        inputs.push(lines.join('\n'));
        outputs.push('true');
    }
    // 10 invalid cases (create a violation deterministically)
    for (let t=0;t<10;t++) {
        const len = 4 + (t % 7);
        const vals = [];
        for (let i=0;i<len;i++) vals.push(200 + 5*t + i);
        const ins = vals.slice();
        const {edges} = buildBSTEdges(ins);
        const bad = edges.slice();
        if (bad.length > 0) {
            const idx = t % bad.length;
            const parts = bad[idx].split(' ');
            const parent = parseInt(parts[0],10);
            // violate by assigning a child value that breaks BST (too large on left)
            const violateChild = parent + 100 + t;
            bad[idx] = `${parent} ${violateChild} L`;
        }
        const lines = [String(bad.length), ...bad];
        inputs.push(lines.join('\n'));
        outputs.push('false');
    }
    return { inputs, outputs };
}

/* H1: Largest connected component
   Input file: T (we use T=1) then N M and M edges */
function genH1() {
    const cases = [
        {N:3, edges:[[1,2],[2,3]]},
        {N:12, edges:[[1,2],[3,1],[3,4],[5,4],[3,5],[4,6],[5,2],[2,1],[7,1],[9,10],[8,9]]},
        {N:5, edges:[[1,2],[3,4]]},
        {N:6, edges:[[1,2],[2,3],[4,5]]},
        {N:7, edges:[[1,2],[2,3],[3,4],[4,5],[6,7]]},
        {N:8, edges:[[1,2],[3,2],[4,3],[5,4],[6,5],[7,8]]},
        {N:4, edges:[[1,2],[2,1],[3,4]]},
        {N:9, edges:[[1,2],[2,3],[3,4],[4,5],[5,6],[7,8],[8,9]]},
        {N:3, edges:[]},
        {N:1, edges:[]},
        {N:10, edges:[[1,2],[2,3],[3,4],[4,5],[5,6],[7,8],[8,9],[9,10]]},
        {N:6, edges:[[1,2],[2,3],[3,1],[4,5],[5,6]]},
        {N:10, edges:[[1,2],[2,3],[3,1],[4,5],[5,6],[6,4],[7,8],[8,9],[9,10]]},
        {N:5, edges:[[1,2],[2,3],[3,4],[4,5]]},
        {N:15, edges:[[1,2],[3,4],[4,5],[5,6],[6,7],[7,8],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15]]},
        {N:8, edges:[[1,2],[2,3],[4,5],[6,7],[7,8]]},
        {N:20, edges:[]},
        {N:4, edges:[[1,2],[2,3],[3,4]]},
        {N:6, edges:[[1,2],[3,4],[5,6]]},
        {N:9, edges:[[1,2],[2,3],[3,4],[4,1],[5,6],[7,8],[8,9]]}
    ];
    const inputs = [], outputs = [];
    for (let c of cases) {
        const lines = ['1', `${c.N} ${c.edges.length}`, ...c.edges.map(e=>`${e[0]} ${e[1]}`)];
        inputs.push(lines.join('\n'));
        // compute largest component
        const adj = {};
        for (let i=1;i<=c.N;i++) adj[i]=[];
        for (let [u,v] of c.edges) { adj[u].push(v); adj[v].push(u); }
        const vis = new Array(c.N+1).fill(false);
        let best = 0;
        for (let i=1;i<=c.N;i++){
            if (!vis[i]) {
                let stack=[i], cnt=0; vis[i]=true;
                while (stack.length) {
                    const x = stack.pop(); cnt++;
                    for (let nb of adj[x]) if (!vis[nb]) { vis[nb]=true; stack.push(nb); }
                }
                if (cnt>best) best = cnt;
            }
        }
        outputs.push(String(best));
    }
    return { inputs, outputs };
}

/* I1: Process requests (high before low) */
function genI1() {
    const cases = [
        ['low','high','low','high','low'],
        ['high','high','low'],
        ['low','low','low','low'],
        ['high','low','high','low','high'],
        ['low','high'],
        ['high'],
        ['low'],
        ['high','low','low','high','low','high'],
        ['low','low','high','high'],
        ['high','low','high'],
        ['high','high','high'],
        ['low','high','low'],
        ['low','high','high','low','low','high','low'],
        ['low','low','high'],
        ['high','low','low'],
        ['low','high','low','high','low','high','low'],
        ['low','high','low','low','high'],
        ['high','low'],
        ['low','high','low'],
        ['high','high','low','low','high']
    ];
    const inputs = [], outputs = [];
    for (let arr of cases) {
        const N = arr.length;
        inputs.push(`${N}\n${arr.join(' ')}`);
        const high = [], low = [];
        for (let i=0;i<N;i++) (arr[i]==='high' ? high : low).push(i+1);
        outputs.push([...high, ...low].join(' '));
    }
    return { inputs, outputs };
}

/* J1: Shortest path queries (BFS). Each input file: T=1 then "N M Q" then M edges then Q queries */
function genJ1() {
    const cases = [
        {N:4, edges:[[1,2],[2,3],[3,4]], queries:[[1,4],[4,1]]},
        {N:5, edges:[[1,2],[2,3],[3,4],[4,5]], queries:[[1,5],[2,4]]},
        {N:6, edges:[[1,2],[2,3],[4,5]], queries:[[1,3],[1,4]]},
        {N:7, edges:[[1,2],[2,3],[3,1],[4,5],[5,6],[6,7]], queries:[[1,3],[4,7]]},
        {N:3, edges:[[1,2]], queries:[[1,3]]},
        {N:8, edges:[[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]], queries:[[1,8]]},
        {N:9, edges:[[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9]], queries:[[2,9]]},
        {N:5, edges:[[1,2],[2,3],[3,1],[4,5]], queries:[[1,3],[4,5]]},
        {N:4, edges:[[1,2],[2,3],[3,4]], queries:[[2,4]]},
        {N:6, edges:[[1,2],[2,3],[3,4],[4,5],[5,6]], queries:[[1,6]]},
        {N:10, edges:[[1,2],[2,3],[3,4],[4,5],[2,6],[6,7],[7,8],[8,9],[9,10]], queries:[[1,5],[1,10]]},
        {N:4, edges:[], queries:[[1,2]]},
        {N:3, edges:[[1,2],[2,3]], queries:[[3,1]]},
        {N:6, edges:[[1,2],[1,3],[3,4],[4,5],[2,6]], queries:[[5,6]]},
        {N:7, edges:[[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]], queries:[[1,7]]},
        {N:8, edges:[[1,2],[2,3],[3,4],[1,5],[5,6],[6,7],[7,8]], queries:[[4,8]]},
        {N:5, edges:[[1,2],[2,3]], queries:[[3,5]]},
        {N:9, edges:[[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9]], queries:[[1,9]]},
        {N:6, edges:[[1,2],[2,3],[4,5]], queries:[[3,4]]},
        {N:5, edges:[[1,2],[2,3],[3,4],[4,5]], queries:[[2,5]]}
    ];
    const inputs = [], outputs = [];
    for (let c of cases) {
        const lines = [];
        lines.push('1'); // T=1
        lines.push(`${c.N} ${c.edges.length} ${c.queries.length}`);
        for (let e of c.edges) lines.push(`${e[0]} ${e[1]}`);
        for (let q of c.queries) lines.push(`${q[0]} ${q[1]}`);
        inputs.push(lines.join('\n'));
        // compute BFS per query
        const adj = {};
        for (let i=1;i<=c.N;i++) adj[i]=[];
        for (let [u,v] of c.edges) { adj[u].push(v); adj[v].push(u); }
        function bfs(s,t) {
            const dist = new Array(c.N+1).fill(-1);
            const q = [];
            q.push(s); dist[s]=0;
            while (q.length) {
                const x = q.shift();
                if (x === t) return dist[x];
                for (let nb of adj[x]) if (dist[nb] === -1) { dist[nb]=dist[x]+1; q.push(nb); }
            }
            return -1;
        }
        const outs = c.queries.map(q => String(bfs(q[0], q[1])));
        outputs.push(outs.join('\n'));
    }
    return { inputs, outputs };
}

/* K1: Interval scheduling (activity selection) - format: T=1, N, then N lines start end -> output max non-overlapping */
function genK1() {
    const cases = [
        [[39,55],[37,74],[0,1],[19,25],[65,76],[51,52],[19,21],[5,94],[46,65],[32,40]],
        [[1,2],[2,3],[3,4],[4,5]],
        [[0,10],[1,2],[2,3],[3,4],[4,5]],
        [[5,9],[1,4],[0,6],[8,10],[5,7]],
        [[1,3],[2,5],[4,7],[6,9]],
        [[1,10],[2,3],[3,4],[5,6],[7,8]],
        [[2,3],[3,4],[1,2],[4,5]],
        [[0,5],[5,10],[10,15]],
        [[1,100],[2,3],[3,4],[4,5]],
        [[7,8],[1,10],[2,3],[4,5]],
        [[0,2],[1,4],[3,5],[4,6]],
        [[10,20],[15,25],[20,30]],
        [[0,1],[1,2],[2,3],[3,4]],
        [[1,5],[2,6],[3,7],[4,8],[5,9]],
        [[1,2],[2,4],[4,6],[6,8],[8,10]],
        [[5,6],[1,3],[2,4],[4,5]],
        [[1,1000],[2,3],[3,4],[4,5],[5,6]],
        [[0,100],[1,2],[2,3],[3,4]],
        [[1,4],[2,3],[3,6],[5,7]],
        [[2,5],[1,3],[3,4],[4,6]]
    ];
    const inputs = [], outputs = [];
    for (let arr of cases) {
        const N = arr.length;
        const lines = ['1', String(N), ...arr.map(p=>`${p[0]} ${p[1]}`)];
        inputs.push(lines.join('\n'));
        const sorted = arr.slice().sort((a,b)=>a[1]-b[1]);
        let cnt = 0, last = -Infinity;
        for (let [s,e] of sorted) {
            if (s >= last) { cnt++; last = e; }
        }
        outputs.push(String(cnt));
    }
    return { inputs, outputs };
}

/* L1: Keyboard simulation (single line operations) */
function genL1() {
    const cases = [
        '<<PI<T>>Ta-',
        'abc<<-d>e',
        'Hello<--World',
        'A<B>C-',
        '<<>>',
        'abc',
        '<<abc',
        'abc>>',
        'a-b-c-',
        '<<X>>Y-',
        'PTIT<<-',
        'ABCD<-E>F-',
        'A<-B<-C',
        '<<<>>>abc',
        'Type<-Here>',
        '<<PI<T>>Ta-',
        'LongTextWith<<->>--',
        '<<-<-<-',
        'abcd>efg<-',
        '<<PI<T>>Ta-'
    ];
    function simulate(s) {
        const left = [], right = [];
        for (let ch of s) {
            if (ch === '<') {
                if (left.length) right.push(left.pop());
            } else if (ch === '>') {
                if (right.length) left.push(right.pop());
            } else if (ch === '-') {
                if (left.length) left.pop();
            } else {
                left.push(ch);
            }
        }
        return left.join('') + right.reverse().join('');
    }
    const inputs = [], outputs = [];
    for (let s of cases) {
        inputs.push(s);
        outputs.push(simulate(s));
    }
    return { inputs, outputs };
}

/* ---------- Main: generate all and write to disk ---------- */
function main() {
    ensureDir(ROOT_DIR);
    const all = {
        A1: genA1(),
        B1: genB1(),
        C1: genC1(),
        D1: genD1(),
        E1: genE1(),
        F1: genF1(),
        G1: genG1(),
        H1: genH1(),
        I1: genI1(),
        J1: genJ1(),
        K1: genK1(),
        L1: genL1()
    };

    for (let pid of Object.keys(all)) {
        const { inputs, outputs } = all[pid];
        if (!inputs || !outputs) {
            console.warn(`No cases for ${pid}`);
            continue;
        }
        // ensure length 20 each (most generators produce exactly 20)
        const in20 = inputs.slice(0,20);
        while (in20.length < 20) in20.push('');
        const out20 = outputs.slice(0,20);
        while (out20.length < 20) out20.push('');
        writeCaseFiles(ROOT_DIR, pid, in20, out20);
    }
    console.log(`Done. Created folder '${ROOT_NAME}' with subfolders A1..L1 (each up to 20 input/output files).`);
}

main();
