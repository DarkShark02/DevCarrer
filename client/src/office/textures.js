import * as THREE from 'three';

// Texture disegnate su canvas: niente file esterni da scaricare.

function canvasTexture(width, height, draw, { repeat, srgb = true } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  if (repeat) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(...repeat);
  }
  return texture;
}

// Generatore pseudo-casuale con seme: la scena è uguale a ogni caricamento.
export function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function woodFloor(repeat) {
  return canvasTexture(
    512,
    512,
    (ctx, w, h) => {
      const rand = seeded(7);
      const plankH = h / 8;
      for (let row = 0; row < 8; row++) {
        const offset = (row % 2) * (w / 3);
        for (let x = -offset; x < w; x += w / 1.5) {
          const tone = 150 + rand() * 30;
          ctx.fillStyle = `rgb(${tone + 30}, ${tone - 5}, ${tone - 45})`;
          ctx.fillRect(x, row * plankH, w / 1.5, plankH);
          // venature
          ctx.strokeStyle = `rgba(90, 55, 30, ${0.08 + rand() * 0.08})`;
          ctx.lineWidth = 1;
          for (let g = 0; g < 5; g++) {
            const y = row * plankH + rand() * plankH;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.bezierCurveTo(x + 100, y + rand() * 6 - 3, x + 220, y + rand() * 6 - 3, x + w / 1.5, y);
            ctx.stroke();
          }
          ctx.fillStyle = 'rgba(60, 35, 20, 0.35)';
          ctx.fillRect(x, row * plankH, 2, plankH);
        }
        ctx.fillStyle = 'rgba(60, 35, 20, 0.4)';
        ctx.fillRect(0, row * plankH, w, 2);
      }
    },
    { repeat },
  );
}

export function rug(color, border) {
  return canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = border;
    ctx.lineWidth = 10;
    ctx.strokeRect(16, 16, w - 32, h - 32);
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 34, w - 68, h - 68);
    const rand = seeded(3);
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${rand() * 0.04})`;
      ctx.fillRect(rand() * w, rand() * h, 2, 2);
    }
  });
}

// Panorama cittadino visto dalle finestre.
export function skyline() {
  return canvasTexture(2048, 512, (ctx, w, h) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#6fa8dc');
    sky.addColorStop(0.55, '#b9d7ee');
    sky.addColorStop(1, '#f5dcb8');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const rand = seeded(42);
    // nuvole
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    for (let i = 0; i < 14; i++) {
      const x = rand() * w;
      const y = 30 + rand() * 140;
      for (let j = 0; j < 5; j++) {
        ctx.beginPath();
        ctx.ellipse(x + j * 26, y + rand() * 10, 40 + rand() * 30, 14 + rand() * 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // due file di palazzi: lontani (chiari) e vicini (scuri, con finestre)
    const layers = [
      { color: '#9fb4c8', min: 120, max: 260, window: null },
      { color: '#4d5f73', min: 60, max: 220, window: 'rgba(255, 230, 170, 0.55)' },
    ];
    for (const layer of layers) {
      let x = -20;
      while (x < w) {
        const bw = 60 + rand() * 110;
        const bh = layer.min + rand() * layer.max;
        ctx.fillStyle = layer.color;
        ctx.fillRect(x, h - bh, bw, bh);
        if (layer.window) {
          for (let wy = h - bh + 12; wy < h - 10; wy += 18) {
            for (let wx = x + 8; wx < x + bw - 12; wx += 16) {
              if (rand() < 0.35) {
                ctx.fillStyle = layer.window;
                ctx.fillRect(wx, wy, 8, 10);
              }
            }
          }
        }
        x += bw + rand() * 12;
      }
    }
  });
}

export function logo() {
  return canvasTexture(1024, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.font = 'bold 150px Consolas, "Cascadia Code", monospace';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#4ec9b0';
    ctx.fillText('</>', 20, h / 2);
    ctx.font = 'bold 140px system-ui, "Segoe UI", sans-serif';
    ctx.fillStyle = '#2b3440';
    ctx.fillText('DevCareer', 330, h / 2 + 6);
  });
}

// Lavagna dello sprint: colonne e post-it.
export function whiteboard() {
  return canvasTexture(1024, 512, (ctx, w, h) => {
    ctx.fillStyle = '#fbfbf8';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#9aa3ad';
    ctx.lineWidth = 3;
    ctx.font = 'bold 34px "Segoe Print", "Comic Sans MS", cursive';
    ctx.fillStyle = '#2f5d8a';
    const cols = ['TODO', 'DOING', 'REVIEW', 'DONE'];
    cols.forEach((c, i) => {
      const x = (i * w) / 4;
      if (i) {
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, h - 20);
        ctx.stroke();
      }
      ctx.fillText(c, x + 40, 55);
    });
    const rand = seeded(11);
    const notes = ['#ffe680', '#ffb3c1', '#a8e6cf', '#9ad0f5'];
    cols.forEach((_, i) => {
      const count = 2 + Math.floor(rand() * 3);
      for (let n = 0; n < count; n++) {
        const x = (i * w) / 4 + 30 + (n % 2) * 110 + rand() * 10;
        const y = 90 + Math.floor(n / 2) * 120 + rand() * 20;
        ctx.save();
        ctx.translate(x + 45, y + 45);
        ctx.rotate((rand() - 0.5) * 0.15);
        ctx.fillStyle = notes[Math.floor(rand() * notes.length)];
        ctx.fillRect(-45, -45, 90, 90);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        for (let l = 0; l < 3; l++) ctx.fillRect(-32, -25 + l * 18, 40 + rand() * 25, 4);
        ctx.restore();
      }
    });
  });
}

export function framedPicture(seed) {
  return canvasTexture(256, 192, (ctx, w, h) => {
    const rand = seeded(seed);
    const palettes = [
      ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
      ['#22223b', '#4a4e69', '#9a8c98', '#c9ada7', '#f2e9e4'],
    ];
    const pal = palettes[seed % palettes.length];
    ctx.fillStyle = pal[0];
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = pal[1 + Math.floor(rand() * 4)];
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h, 20 + rand() * 60, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Schermo con codice finto che scorre. `tick()` aggiunge una riga, come se qualcuno scrivesse.
const TOKEN_COLORS = ['#569cd6', '#c586c0', '#9cdcfe', '#ce9178', '#dcdcaa', '#4ec9b0', '#6a9955', '#d4d4d4'];

export class CodeScreen {
  constructor(seed, { width = 256, height = 160 } = {}) {
    this.rand = seeded(seed);
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.lines = [];
    this.indent = 0;
    this.lineNo = 1;
    for (let i = 0; i < 14; i++) this.lines.push(this.randomLine());
    this.draw();
  }

  randomLine() {
    const r = this.rand;
    if (r() < 0.12) this.indent = Math.max(0, this.indent - 1);
    const tokens = [];
    const count = 1 + Math.floor(r() * 4);
    for (let i = 0; i < count; i++) {
      tokens.push({ w: 10 + r() * 40, color: TOKEN_COLORS[Math.floor(r() * TOKEN_COLORS.length)] });
    }
    const line = { indent: this.indent, tokens, no: this.lineNo++ };
    if (r() < 0.2) this.indent = Math.min(3, this.indent + 1);
    return line;
  }

  tick() {
    this.lines.push(this.randomLine());
    if (this.lines.length > 14) this.lines.shift();
    this.draw();
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#252526';
    ctx.fillRect(0, 0, canvas.width, 12);
    ctx.fillStyle = '#4ec9b0';
    ctx.fillRect(6, 3, 30, 6);
    this.lines.forEach((line, i) => {
      const y = 18 + i * 10;
      ctx.fillStyle = '#5a5a5a';
      ctx.fillRect(4, y + 2, 10, 4);
      let x = 22 + line.indent * 12;
      for (const t of line.tokens) {
        ctx.fillStyle = t.color;
        ctx.fillRect(x, y + 1, t.w, 5);
        x += t.w + 5;
      }
    });
    // cursore
    const last = this.lines.length - 1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(22 + this.lines[last].indent * 12, 18 + last * 10, 2, 8);
    this.texture.needsUpdate = true;
  }
}

// Lo schermo del giocatore mostra l'esercizio corrente.
export class DeskScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 320;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.update({});
  }

  update({ title = '', subtitle = '' }) {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#16202a');
    bg.addColorStop(1, '#0f1419');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#4ec9b0';
    ctx.font = 'bold 44px Consolas, monospace';
    ctx.fillText('</>', 28, 70);
    ctx.fillStyle = '#d8dbe2';
    ctx.font = 'bold 34px system-ui, "Segoe UI", sans-serif';
    ctx.fillText('DevCareer', 120, 68);
    ctx.fillStyle = '#e6c16a';
    ctx.font = '26px system-ui, "Segoe UI", sans-serif';
    ctx.fillText(subtitle, 28, 150, w - 56);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px system-ui, "Segoe UI", sans-serif';
    ctx.fillText(title, 28, 200, w - 56);
    ctx.fillStyle = '#2a2e37';
    ctx.fillRect(28, 240, w - 56, 4);
    ctx.fillStyle = '#4ec9b0';
    ctx.fillRect(28, 240, (w - 56) * 0.35, 4);
    this.texture.needsUpdate = true;
  }
}
