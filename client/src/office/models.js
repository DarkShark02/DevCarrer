import * as THREE from 'three';
import { CodeScreen } from './textures.js';

// Modelli low-poly costruiti con le primitive di Three.js.
// Convenzione: ogni modello "guarda" verso -z; y = 0 è il pavimento.

const materials = new Map();
export function mat(color, { roughness = 0.7, metalness = 0, emissive, emissiveIntensity } = {}) {
  const key = [color, roughness, metalness, emissive, emissiveIntensity].join('|');
  if (!materials.has(key)) {
    materials.set(
      key,
      new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity }),
    );
  }
  return materials.get(key);
}

export function mesh(geometry, material, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, shadow = true } = {}) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, seg = 20) => new THREE.CylinderGeometry(rt, rb, h, seg);

export const DESK = { width: 1.6, depth: 0.8, height: 0.76 };

// ---------------------------------------------------------------- Arredi

export function makeDesk() {
  const g = new THREE.Group();
  const top = mat('#efe9df', { roughness: 0.45 });
  const metal = mat('#3a3d42', { roughness: 0.35, metalness: 0.6 });
  g.add(mesh(box(DESK.width, 0.045, DESK.depth), top, { y: DESK.height - 0.022 }));
  for (const sx of [-1, 1]) {
    g.add(mesh(box(0.05, DESK.height - 0.045, DESK.depth - 0.1), metal, { x: sx * (DESK.width / 2 - 0.08), y: (DESK.height - 0.045) / 2 }));
    g.add(mesh(box(0.08, 0.03, DESK.depth - 0.05), metal, { x: sx * (DESK.width / 2 - 0.08), y: 0.015 }));
  }
  // pannello frontale
  g.add(mesh(box(DESK.width - 0.2, 0.35, 0.02), mat('#d9d2c5'), { y: 0.5, z: -DESK.depth / 2 + 0.06 }));
  return g;
}

// Monitor con schermo animato (CodeScreen) o con una texture data.
// `tilt` inclina lo schermo all'indietro (radianti). In userData: `screen`, il piano dello schermo.
export function makeMonitor(screenTexture, { wide = 0.62, tilt = 0, bezel = 0.03 } = {}) {
  const g = new THREE.Group();
  const black = mat('#1b1c1f', { roughness: 0.4, metalness: 0.3 });
  g.add(mesh(box(0.22, 0.015, 0.16), black, { y: 0.008 }));
  g.add(mesh(box(0.04, 0.26, 0.03), black, { y: 0.14, z: -0.035 }));
  const h = wide * 0.6;
  const head = new THREE.Group();
  head.position.set(0, 0.25, -0.02);
  head.rotation.x = -tilt;
  g.add(head);
  head.add(mesh(box(wide, h, 0.03), black, { y: h / 2, z: 0.02 }));
  // Il piano guarda verso +z, cioè verso chi siede alla scrivania.
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(wide - bezel, h - bezel),
    new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }),
  );
  screen.position.set(0, h / 2, 0.036);
  head.add(screen);
  g.userData = { screen, tilt };
  return g;
}

// Con `rgb` la tastiera ha una striscia luminosa; il suo materiale è in userData.rgb
// e OfficeScene ne fa ruotare il colore.
export function makeKeyboard({ rgb = false } = {}) {
  const g = new THREE.Group();
  g.add(mesh(box(0.44, 0.02, 0.14), mat('#2a2c30', { roughness: 0.6 }), { y: 0.01 }));
  if (rgb) {
    const glow = new THREE.MeshBasicMaterial({ color: '#ff00aa', toneMapped: false });
    g.add(mesh(box(0.45, 0.008, 0.15), glow, { y: 0.004, shadow: false }));
    const keys = mat('#15161a', { roughness: 0.5 });
    for (let row = 0; row < 4; row++) {
      g.add(mesh(box(0.4, 0.014, 0.022), keys, { y: 0.027, z: -0.042 + row * 0.028 }));
    }
    g.userData.rgb = glow;
  } else {
    g.add(mesh(box(0.41, 0.006, 0.11), mat('#50545b', { roughness: 0.8 }), { y: 0.023 }));
  }
  const mouse = mesh(new THREE.SphereGeometry(0.035, 16, 10), mat('#2a2c30'), { x: 0.32, y: 0.012 });
  mouse.scale.set(0.8, 0.45, 1.25);
  g.add(mouse);
  return g;
}

export function makeMug(color) {
  const g = new THREE.Group();
  g.add(mesh(cyl(0.04, 0.035, 0.1), mat(color, { roughness: 0.3 }), { y: 0.05 }));
  g.add(mesh(new THREE.TorusGeometry(0.025, 0.008, 8, 16), mat(color, { roughness: 0.3 }), { x: 0.045, y: 0.055, ry: Math.PI / 2 }));
  g.add(mesh(cyl(0.035, 0.035, 0.005), mat('#3b2417', { roughness: 0.2 }), { y: 0.092, shadow: false }));
  return g;
}

export function makePlant(scale = 1, potColor = '#d9cfc1') {
  const g = new THREE.Group();
  g.add(mesh(cyl(0.2 * scale, 0.15 * scale, 0.4 * scale), mat(potColor, { roughness: 0.8 }), { y: 0.2 * scale }));
  g.add(mesh(cyl(0.18 * scale, 0.18 * scale, 0.02 * scale), mat('#3b2a1e'), { y: 0.39 * scale }));
  const leaf = mat('#3f8f4f', { roughness: 0.6 });
  const leafDark = mat('#2f6e3c', { roughness: 0.6 });
  const leafGeo = new THREE.SphereGeometry(0.12 * scale, 10, 8);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const r = 0.1 * scale + (i % 3) * 0.04 * scale;
    const l = mesh(leafGeo, i % 2 ? leaf : leafDark, {
      x: Math.cos(a) * r,
      y: (0.55 + (i % 3) * 0.18) * scale,
      z: Math.sin(a) * r,
    });
    l.scale.set(0.7, 1.6, 0.35);
    l.rotation.set(Math.sin(a) * 0.5, -a, Math.cos(a) * 0.5);
    g.add(l);
  }
  return g;
}

export function makeDeskPlant() {
  const g = new THREE.Group();
  g.add(mesh(cyl(0.05, 0.04, 0.08), mat('#c96f4a'), { y: 0.04 }));
  const s = mesh(new THREE.IcosahedronGeometry(0.07, 0), mat('#4c9a5a'), { y: 0.13 });
  g.add(s);
  return g;
}

export function makeChair(fabric = '#34495e') {
  const g = new THREE.Group();
  const metal = mat('#2b2e33', { roughness: 0.35, metalness: 0.6 });
  const cloth = mat(fabric, { roughness: 0.9 });
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    g.add(mesh(box(0.05, 0.03, 0.3), metal, { x: Math.sin(a) * 0.14, y: 0.05, z: Math.cos(a) * 0.14, ry: a }));
    g.add(mesh(new THREE.SphereGeometry(0.025, 8, 6), metal, { x: Math.sin(a) * 0.28, y: 0.025, z: Math.cos(a) * 0.28 }));
  }
  g.add(mesh(cyl(0.025, 0.03, 0.36), metal, { y: 0.24 }));
  g.add(mesh(box(0.5, 0.08, 0.48), cloth, { y: 0.46 }));
  g.add(mesh(box(0.04, 0.35, 0.04), metal, { y: 0.62, z: 0.26 }));
  g.add(mesh(box(0.48, 0.55, 0.07), cloth, { y: 0.9, z: 0.27, rx: -0.08 }));
  return g;
}

export function makeLamp() {
  const g = new THREE.Group();
  const cable = mesh(cyl(0.006, 0.006, 1.4, 6), mat('#222'), { y: 0.7, shadow: false });
  g.add(cable);
  g.add(mesh(new THREE.ConeGeometry(0.28, 0.22, 24, 1, true), mat('#2b3440', { roughness: 0.4, metalness: 0.4 }), { y: -0.1, shadow: false }));
  const bulb = mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: '#fff3d6' }), { y: -0.18, shadow: false });
  g.add(bulb);
  return g;
}

export function makeSofa(color = '#6b7f99') {
  const g = new THREE.Group();
  const c = mat(color, { roughness: 0.95 });
  g.add(mesh(box(2.0, 0.4, 0.85), c, { y: 0.25 }));
  g.add(mesh(box(2.0, 0.5, 0.2), c, { y: 0.65, z: 0.33 }));
  for (const sx of [-1, 1]) g.add(mesh(box(0.2, 0.3, 0.85), c, { x: sx * 0.95, y: 0.6 }));
  for (const sx of [-0.45, 0.45]) g.add(mesh(box(0.85, 0.12, 0.6), mat('#7d91ab', { roughness: 1 }), { x: sx, y: 0.5, z: -0.05 }));
  return g;
}

export function makeCoffeeTable() {
  const g = new THREE.Group();
  g.add(mesh(cyl(0.45, 0.45, 0.04, 32), mat('#caa477', { roughness: 0.4 }), { y: 0.42 }));
  g.add(mesh(cyl(0.05, 0.05, 0.4), mat('#3a3d42', { metalness: 0.6, roughness: 0.3 }), { y: 0.2 }));
  g.add(mesh(cyl(0.25, 0.25, 0.02, 24), mat('#3a3d42', { metalness: 0.6, roughness: 0.3 }), { y: 0.01 }));
  return g;
}

// Angolo cucina: bancone, macchina del caffè, distributore d'acqua.
export function makeKitchen() {
  const g = new THREE.Group();
  const cabinet = mat('#f4f1ea', { roughness: 0.5 });
  const counterTop = mat('#2f3338', { roughness: 0.25, metalness: 0.2 });
  g.add(mesh(box(0.65, 0.88, 3.2), cabinet, { y: 0.44 }));
  g.add(mesh(box(0.7, 0.05, 3.25), counterTop, { y: 0.9 }));
  for (let i = 0; i < 4; i++) {
    g.add(mesh(box(0.02, 0.02, 0.3), mat('#8a8f96', { metalness: 0.8, roughness: 0.3 }), { x: -0.33, y: 0.75, z: -1.2 + i * 0.8 }));
  }
  // macchina del caffè
  const machine = new THREE.Group();
  machine.add(mesh(box(0.35, 0.45, 0.3), mat('#1f2226', { roughness: 0.3, metalness: 0.5 }), { y: 0.225 }));
  machine.add(mesh(box(0.25, 0.08, 0.02), new THREE.MeshBasicMaterial({ color: '#4ec9b0' }), { x: 0, y: 0.36, z: -0.16, shadow: false }));
  machine.add(makeMug('#ffffff'));
  machine.children.at(-1).position.set(0, 0.02, -0.08);
  machine.position.set(0, 0.925, -0.8);
  machine.rotation.y = Math.PI / 2; // il fronte (-z) guarda verso la stanza (-x)
  g.add(machine);
  // tazze
  ['#e76f51', '#2a9d8f', '#e9c46a'].forEach((c, i) => {
    const m = makeMug(c);
    m.position.set(-0.1, 0.925, 0.1 + i * 0.14);
    g.add(m);
  });
  // distributore d'acqua
  const cooler = new THREE.Group();
  cooler.add(mesh(box(0.35, 1.0, 0.35), mat('#e8eaec', { roughness: 0.4 }), { y: 0.5 }));
  const bottle = mesh(cyl(0.15, 0.15, 0.45, 24), new THREE.MeshStandardMaterial({ color: '#a8d8f0', roughness: 0.05, transparent: true, opacity: 0.6 }), { y: 1.25 });
  cooler.add(bottle);
  cooler.position.set(0, 0, 2.2);
  g.add(cooler);
  return g;
}

// ---------------------------------------------------------------- Persone

const capsule = (r, len) => new THREE.CapsuleGeometry(r, len, 6, 12);

// Personaggio con articolazioni animabili. Guarda verso -z.
export function makePerson({ skin = '#e0b48f', shirt = '#3d7ea6', pants = '#2d3142', hair = '#3b2a20', hairStyle = 'short', glasses = false } = {}) {
  const root = new THREE.Group();
  const hips = new THREE.Group();
  hips.position.y = 0.95;
  root.add(hips);

  const skinM = mat(skin, { roughness: 0.65 });
  const shirtM = mat(shirt, { roughness: 0.85 });
  const pantsM = mat(pants, { roughness: 0.85 });
  const hairM = mat(hair, { roughness: 0.9 });
  const shoeM = mat('#1f1f22', { roughness: 0.6 });

  // gambe: anca → coscia → ginocchio → stinco → scarpa
  const legs = [-1, 1].map((side) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.1, 0, 0);
    hip.add(mesh(capsule(0.08, 0.3), pantsM, { y: -0.23 }));
    const knee = new THREE.Group();
    knee.position.y = -0.46;
    knee.add(mesh(capsule(0.07, 0.3), pantsM, { y: -0.22 }));
    knee.add(mesh(box(0.11, 0.07, 0.22), shoeM, { y: -0.45, z: -0.04 }));
    hip.add(knee);
    hips.add(hip);
    return { hip, knee };
  });

  // busto
  const torso = new THREE.Group();
  hips.add(torso);
  const body = mesh(capsule(0.19, 0.3), shirtM, { y: 0.32 });
  body.scale.set(1, 1, 0.72);
  torso.add(body);
  torso.add(mesh(cyl(0.06, 0.06, 0.08, 10), skinM, { y: 0.63 }));

  // testa
  const head = new THREE.Group();
  head.position.y = 0.78;
  torso.add(head);
  head.add(mesh(new THREE.SphereGeometry(0.14, 20, 16), skinM));
  const eyeM = mat('#1d1d1f', { roughness: 0.3 });
  for (const sx of [-1, 1]) {
    head.add(mesh(new THREE.SphereGeometry(0.017, 8, 6), eyeM, { x: sx * 0.05, y: 0.02, z: -0.128, shadow: false }));
  }
  const hairCap = mesh(new THREE.SphereGeometry(0.152, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hairM, { y: 0.015, z: 0.012, rx: 0.25 });
  head.add(hairCap);
  if (hairStyle === 'long') {
    const back = mesh(box(0.27, 0.3, 0.1), hairM, { y: -0.1, z: 0.1 });
    head.add(back);
  } else if (hairStyle === 'bun') {
    head.add(mesh(new THREE.SphereGeometry(0.07, 12, 10), hairM, { y: 0.12, z: 0.1 }));
  }
  if (glasses) {
    const frame = mat('#111', { roughness: 0.3 });
    for (const sx of [-1, 1]) {
      head.add(mesh(new THREE.TorusGeometry(0.03, 0.006, 6, 16), frame, { x: sx * 0.05, y: 0.02, z: -0.138, shadow: false }));
    }
    head.add(mesh(box(0.04, 0.006, 0.006), frame, { y: 0.025, z: -0.14, shadow: false }));
  }

  // braccia: spalla → braccio → gomito → avambraccio → mano
  const arms = [-1, 1].map((side) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.25, 0.55, 0);
    shoulder.add(mesh(capsule(0.06, 0.2), shirtM, { y: -0.15 }));
    const elbow = new THREE.Group();
    elbow.position.y = -0.3;
    elbow.add(mesh(capsule(0.05, 0.2), skinM, { y: -0.13 }));
    elbow.add(mesh(new THREE.SphereGeometry(0.05, 10, 8), skinM, { y: -0.28 }));
    shoulder.add(elbow);
    torso.add(shoulder);
    return { shoulder, elbow, side };
  });

  return { root, hips, torso, head, legs, arms };
}

// Pose e animazioni. t = tempo in secondi, phase = sfasamento per persona.

export function poseSitting(p) {
  p.hips.position.y = 0.56;
  for (const leg of p.legs) {
    leg.hip.rotation.x = Math.PI / 2;
    leg.knee.rotation.x = -Math.PI / 2 + 0.1;
  }
}

export function animateTyping(p, t, phase) {
  const tt = t + phase;
  // ogni tanto si appoggia allo schienale e pensa
  const think = Math.max(0, Math.sin(tt * 0.23) - 0.75) * 4; // 0..1
  const k = 1 - think;
  p.torso.rotation.x = 0.12 * k - 0.1 * think;
  p.head.rotation.x = 0.15 * k + Math.sin(tt * 1.7) * 0.03;
  p.head.rotation.y = Math.sin(tt * 0.5) * 0.12 * k + 0.25 * think;
  for (const arm of p.arms) {
    const tap = Math.max(0, Math.sin(tt * 14 + (arm.side > 0 ? 0 : 1.9)));
    arm.shoulder.rotation.x = (0.55 + tap * 0.04) * k + 0.2 * think;
    arm.shoulder.rotation.z = arm.side * 0.12;
    arm.elbow.rotation.x = (1.05 - tap * 0.12) * k + 0.6 * think;
  }
  // nella pausa una mano va al mento
  if (think > 0) {
    const right = p.arms[1];
    right.shoulder.rotation.x = 0.55 * k + 1.0 * think;
    right.shoulder.rotation.z = right.side * (0.12 - 0.2 * think);
    right.elbow.rotation.x = 1.05 * k + 2.4 * think;
  }
}

export function animateWalk(p, t, speed) {
  // speed 0..1: 0 = fermo (respiro), 1 = camminata piena
  const s = Math.sin(t * 9);
  p.hips.position.y = 0.95 + Math.abs(Math.cos(t * 9)) * 0.03 * speed + Math.sin(t * 2) * 0.004;
  p.legs[0].hip.rotation.x = s * 0.55 * speed;
  p.legs[1].hip.rotation.x = -s * 0.55 * speed;
  p.legs[0].knee.rotation.x = -Math.max(0, -s) * 0.7 * speed;
  p.legs[1].knee.rotation.x = -Math.max(0, s) * 0.7 * speed;
  p.arms[0].shoulder.rotation.x = -s * 0.45 * speed;
  p.arms[1].shoulder.rotation.x = s * 0.45 * speed;
  for (const arm of p.arms) {
    arm.shoulder.rotation.z = arm.side * 0.08;
    arm.elbow.rotation.x = 0.25 * speed + 0.08;
  }
  p.torso.rotation.x = 0.05 * speed;
  p.head.rotation.set(0, 0, 0);
}

// Postazione completa: scrivania, sedia, monitor, accessori e (se c'è) il collega.
export function makeWorkstation({ seed, colleague, extras = [], screenTexture, chairColor }) {
  const g = new THREE.Group();
  g.add(makeDesk());

  let codeScreen = null;
  let texture = screenTexture;
  if (!texture) {
    codeScreen = new CodeScreen(seed);
    texture = codeScreen.texture;
  }
  const monitor = makeMonitor(texture);
  monitor.position.set(0, DESK.height, -0.18);
  g.add(monitor);

  const kb = makeKeyboard();
  kb.position.set(-0.05, DESK.height, 0.15);
  g.add(kb);

  for (const extra of extras) {
    const obj = extra === 'mug' ? makeMug(['#e76f51', '#ffffff', '#2a9d8f', '#e9c46a'][seed % 4]) : makeDeskPlant();
    obj.position.set(extra === 'mug' ? 0.55 : -0.6, DESK.height, extra === 'mug' ? 0.1 : -0.2);
    g.add(obj);
  }

  const chair = makeChair(chairColor);
  chair.position.set(0, 0, colleague ? 0.62 : 0.85);
  if (!colleague) chair.rotation.y = 0.35;
  g.add(chair);

  let person = null;
  if (colleague) {
    person = makePerson(colleague);
    poseSitting(person);
    person.root.position.set(0, 0, 0.62);
    g.add(person.root);
  }
  return { group: g, person, codeScreen, chair };
}
