import * as THREE from 'three';
import { mat, mesh, makePlant, DESK } from './models.js';
import { framedPicture } from './textures.js';

// Oggetti del negozio sulla scrivania del giocatore. Ognuno ha un posto fisso,
// in coordinate locali della postazione (centro della scrivania, y = pavimento).
// Monitor, tastiera e sedia non sono qui: sostituiscono i pezzi base (vedi OfficeScene).

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, seg = 20) => new THREE.CylinderGeometry(rt, rb, h, seg);
const TOP = DESK.height;

function cactus() {
  const g = new THREE.Group();
  g.add(mesh(cyl(0.045, 0.035, 0.07), mat('#d9774b', { roughness: 0.8 }), { y: 0.035 }));
  const green = mat('#4f8f4a', { roughness: 0.7 });
  g.add(mesh(new THREE.CapsuleGeometry(0.028, 0.09, 4, 10), green, { y: 0.14 }));
  g.add(mesh(new THREE.CapsuleGeometry(0.016, 0.04, 4, 8), green, { x: 0.035, y: 0.15, rz: -0.5 }));
  g.add(mesh(new THREE.CapsuleGeometry(0.014, 0.03, 4, 8), green, { x: -0.032, y: 0.12, rz: 0.6 }));
  g.add(mesh(new THREE.SphereGeometry(0.012, 8, 6), mat('#ff6f91'), { y: 0.215 }));
  return g;
}

function photo() {
  const g = new THREE.Group();
  const frame = new THREE.Group();
  frame.add(mesh(box(0.16, 0.12, 0.015), mat('#8b5e3c', { roughness: 0.5 })));
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.09), new THREE.MeshStandardMaterial({ map: framedPicture(9), roughness: 0.6 }));
  pic.position.z = 0.009;
  frame.add(pic);
  frame.position.y = 0.065;
  frame.rotation.x = -0.2;
  g.add(frame);
  g.add(mesh(box(0.02, 0.1, 0.02), mat('#8b5e3c'), { y: 0.05, z: -0.04, rx: 0.4 }));
  return g;
}

function lamp() {
  const g = new THREE.Group();
  const metal = mat('#2b2f36', { roughness: 0.3, metalness: 0.6 });
  g.add(mesh(cyl(0.07, 0.08, 0.02, 24), metal, { y: 0.01 }));
  const lower = new THREE.Group();
  lower.position.y = 0.02;
  lower.rotation.z = -0.35;
  lower.add(mesh(cyl(0.01, 0.01, 0.3, 8), metal, { y: 0.15 }));
  const upper = new THREE.Group();
  upper.position.y = 0.3;
  upper.rotation.z = -1.3;
  upper.add(mesh(cyl(0.01, 0.01, 0.26, 8), metal, { y: 0.13 }));
  const head = new THREE.Group();
  head.position.y = 0.26;
  head.rotation.z = 1.65; // somma delle rotazioni ≈ 0: il paralume guarda in basso
  head.add(mesh(new THREE.ConeGeometry(0.07, 0.11, 20, 1, true), mat('#e9c46a', { roughness: 0.4, metalness: 0.3 }), { y: -0.03 }));
  head.add(mesh(new THREE.SphereGeometry(0.03, 12, 8), new THREE.MeshBasicMaterial({ color: '#fff4d6' }), { y: -0.06, shadow: false }));
  const light = new THREE.PointLight('#ffd49a', 1.6, 2.2, 2);
  light.position.y = -0.1;
  head.add(light);
  upper.add(head);
  lower.add(upper);
  g.add(lower);
  return g;
}

function duck() {
  const g = new THREE.Group();
  const yellow = mat('#ffd23f', { roughness: 0.35 });
  const body = mesh(new THREE.SphereGeometry(0.05, 16, 12), yellow, { y: 0.045 });
  body.scale.set(1, 0.8, 1.25);
  g.add(body);
  g.add(mesh(new THREE.SphereGeometry(0.032, 14, 10), yellow, { y: 0.1, z: -0.035 }));
  g.add(mesh(new THREE.ConeGeometry(0.014, 0.035, 10), mat('#ff8c42'), { y: 0.095, z: -0.072, rx: -Math.PI / 2 }));
  for (const sx of [-1, 1]) {
    g.add(mesh(new THREE.SphereGeometry(0.006, 6, 4), mat('#111'), { x: sx * 0.017, y: 0.11, z: -0.06, shadow: false }));
  }
  g.add(mesh(new THREE.SphereGeometry(0.02, 10, 8), yellow, { y: 0.06, z: 0.06 }));
  return g;
}

function headphones() {
  const g = new THREE.Group();
  const dark = mat('#1d1f24', { roughness: 0.5 });
  // supporto
  g.add(mesh(cyl(0.05, 0.06, 0.015), mat('#6b6f76', { metalness: 0.7, roughness: 0.3 }), { y: 0.008 }));
  g.add(mesh(cyl(0.008, 0.008, 0.26, 8), mat('#6b6f76', { metalness: 0.7, roughness: 0.3 }), { y: 0.14 }));
  // cuffie appoggiate sopra
  const set = new THREE.Group();
  set.position.y = 0.27;
  set.add(mesh(new THREE.TorusGeometry(0.075, 0.01, 8, 24, Math.PI), dark, { y: -0.005 }));
  for (const sx of [-1, 1]) {
    set.add(mesh(cyl(0.035, 0.035, 0.03, 20), mat('#e76f51', { roughness: 0.4 }), { x: sx * 0.075, y: -0.02, rz: Math.PI / 2 }));
  }
  g.add(set);
  return g;
}

function figure() {
  const g = new THREE.Group();
  const body = mat('#9aa5b1', { metalness: 0.6, roughness: 0.3 });
  const eye = new THREE.MeshBasicMaterial({ color: '#4ec9b0' });
  g.add(mesh(box(0.06, 0.06, 0.045), body, { y: 0.03 }));
  g.add(mesh(box(0.05, 0.04, 0.04), body, { y: 0.085 }));
  for (const sx of [-1, 1]) {
    g.add(mesh(new THREE.SphereGeometry(0.007, 8, 6), eye, { x: sx * 0.012, y: 0.088, z: 0.021, shadow: false }));
    g.add(mesh(box(0.012, 0.04, 0.012), body, { x: sx * 0.038, y: 0.035 }));
  }
  g.add(mesh(cyl(0.002, 0.002, 0.03, 4), body, { y: 0.12 }));
  g.add(mesh(new THREE.SphereGeometry(0.008, 8, 6), new THREE.MeshBasicMaterial({ color: '#ff5d73' }), { y: 0.137 }));
  return g;
}

function espresso() {
  const g = new THREE.Group();
  const steel = mat('#b8bec6', { metalness: 0.8, roughness: 0.25 });
  const black = mat('#1f2226', { roughness: 0.4 });
  g.add(mesh(box(0.2, 0.26, 0.2), steel, { y: 0.13 }));
  g.add(mesh(box(0.2, 0.03, 0.22), black, { y: 0.275 }));
  g.add(mesh(cyl(0.03, 0.03, 0.03), black, { y: 0.14, z: 0.11 }));
  g.add(mesh(box(0.012, 0.012, 0.08), black, { y: 0.14, z: 0.17 }));
  g.add(mesh(box(0.16, 0.012, 0.08), black, { y: 0.03, z: 0.12 }));
  g.add(mesh(cyl(0.02, 0.017, 0.035), mat('#ffffff', { roughness: 0.3 }), { y: 0.055, z: 0.12 }));
  g.add(mesh(new THREE.SphereGeometry(0.008, 8, 6), new THREE.MeshBasicMaterial({ color: '#7cff9a' }), { x: 0.07, y: 0.22, z: 0.101, shadow: false }));
  return g;
}

// id → { build, position [x, y, z], rotY, scale? }. Tutti i posti sono visibili anche da seduti.
export const DESK_SLOTS = {
  cactus: { build: cactus, position: [-0.5, TOP, -0.02], rotY: 0.4 },
  photo: { build: photo, position: [0.5, TOP, -0.04], rotY: -0.35 },
  lamp: { build: lamp, position: [-0.64, TOP, -0.27], rotY: -0.5 },
  duck: { build: duck, position: [-0.4, TOP, 0.2], rotY: Math.PI + 0.6 },
  headphones: { build: headphones, position: [0.64, TOP, 0.18], rotY: 0.3 },
  espresso: { build: espresso, position: [0.63, TOP, -0.25], rotY: -0.3 },
  figure: { build: figure, position: [-0.26, TOP, -0.08], rotY: 0.35, scale: 1.3 },
  plant: { build: () => makePlant(1.15, '#2b2f36'), position: [1.2, 0, -0.15], rotY: 0.7, floor: true },
};

// Pezzi base che l'acquisto sostituisce.
export const REPLACEMENTS = ['monitor-xl', 'keyboard-rgb', 'chair-gaming'];

export function makeGamingChair() {
  const g = new THREE.Group();
  const metal = mat('#2b2e33', { roughness: 0.35, metalness: 0.6 });
  const black = mat('#18191c', { roughness: 0.7 });
  const accent = mat('#d62839', { roughness: 0.6 });
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    g.add(mesh(box(0.06, 0.035, 0.32), metal, { x: Math.sin(a) * 0.15, y: 0.05, z: Math.cos(a) * 0.15, ry: a }));
    g.add(mesh(new THREE.SphereGeometry(0.028, 8, 6), metal, { x: Math.sin(a) * 0.3, y: 0.028, z: Math.cos(a) * 0.3 }));
  }
  g.add(mesh(cyl(0.028, 0.034, 0.36), metal, { y: 0.24 }));
  g.add(mesh(box(0.54, 0.1, 0.52), black, { y: 0.47 }));
  g.add(mesh(box(0.3, 0.02, 0.44), accent, { y: 0.53 }));
  for (const sx of [-1, 1]) {
    g.add(mesh(box(0.08, 0.12, 0.5), accent, { x: sx * 0.26, y: 0.54 }));
    g.add(mesh(box(0.06, 0.03, 0.3), black, { x: sx * 0.3, y: 0.7, z: 0.05 }));
    g.add(mesh(box(0.03, 0.18, 0.03), metal, { x: sx * 0.3, y: 0.6, z: 0.1 }));
  }
  const back = new THREE.Group();
  back.position.set(0, 0.52, 0.28);
  back.rotation.x = -0.12;
  back.add(mesh(box(0.52, 0.78, 0.1), black, { y: 0.39 }));
  back.add(mesh(box(0.18, 0.7, 0.02), accent, { y: 0.4, z: -0.052 }));
  for (const sx of [-1, 1]) back.add(mesh(box(0.08, 0.6, 0.14), accent, { x: sx * 0.24, y: 0.34, z: -0.02 }));
  back.add(mesh(box(0.3, 0.12, 0.08), accent, { y: 0.72, z: -0.07 }));
  g.add(back);
  return g;
}
