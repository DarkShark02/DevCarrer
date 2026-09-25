import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  mat,
  mesh,
  makeWorkstation,
  makePerson,
  animateTyping,
  animateWalk,
  makePlant,
  makeLamp,
  makeSofa,
  makeCoffeeTable,
  makeKitchen,
  makeDesk,
  makeMonitor,
  makeKeyboard,
  makeChair,
  makeMug,
  DESK,
} from './models.js';
import { DESK_SLOTS, makeGamingChair } from './deskItems.js';
import { woodFloor, rug, skyline, logo, whiteboard, framedPicture, DeskScreen } from './textures.js';

// Ufficio open space visto dall'alto, "a casa di bambola": la parete verso la camera non c'è.
// Stanza: x in [-11, 11], z in [-7, 7]. Le finestre sono sulla parete di fondo (z = -7).

const ROOM = { minX: -11, maxX: 11, minZ: -7, maxZ: 7, height: 3.2 };
const PLAYER_RADIUS = 0.3;
const WALK_SPEED = 3.2;
const SIT_DISTANCE = 1.2;
const CAMERA_OFFSET = new THREE.Vector3(0, 6.2, 7.0);
// Da seduto la camera guarda lo schermo sempre dritto (parallela al monitor, inclinato
// all'indietro di SEAT_TILT): così lo schermo appare come un rettangolo esatto e il desktop
// HTML ci si sovrappone perfettamente. Due inquadrature:
//  - desk:  tutta la scrivania, con tastiera e oggetti; lo schermo è piccolo
//  - focus: vicino al monitor, per lavorare; la scrivania resta visibile ai bordi
// `fraction` = parte dell'altezza della vista occupata dallo schermo.
const SEAT_TILT = 0.25;
const SEAT_VIEWS = {
  desk: { fov: 45, fraction: 0.36, fractionXL: 0.46 },
  focus: { fov: 30, fraction: 0.8, fractionXL: 0.9 },
};
const TRANSITION_SECONDS = 0.9;
const ZOOM_SECONDS = 0.55;

const DESK_X = [-6.8, -5.2, -0.8, 0.8, 4.2, 5.8];
const DESK_ROWS = [-3.4, 0.6];
const PLAYER_DESK = { row: 1, col: 3 };

// I colleghi, uno per postazione occupata (row, col).
const COLLEAGUES = [
  { row: 0, col: 0, skin: '#f1c9a5', shirt: '#c0392b', pants: '#2d3142', hair: '#2b1d14', hairStyle: 'short' },
  { row: 0, col: 1, skin: '#8d5a3b', shirt: '#f4d35e', pants: '#3c3c3c', hair: '#111111', hairStyle: 'bun', glasses: true },
  { row: 0, col: 2, skin: '#e0b48f', shirt: '#2a9d8f', pants: '#264653', hair: '#a0522d', hairStyle: 'long' },
  { row: 0, col: 4, skin: '#c68e62', shirt: '#6c5ce7', pants: '#2d3142', hair: '#1c1c1c', hairStyle: 'short', glasses: true },
  { row: 0, col: 5, skin: '#f5d6ba', shirt: '#e76f51', pants: '#3d405b', hair: '#d9b56a', hairStyle: 'long' },
  { row: 1, col: 0, skin: '#6b4430', shirt: '#3d7ea6', pants: '#1f2937', hair: '#0e0e0e', hairStyle: 'short' },
  { row: 1, col: 2, skin: '#e8b995', shirt: '#95a5a6', pants: '#34495e', hair: '#5a3825', hairStyle: 'bun' },
  { row: 1, col: 5, skin: '#d4a07a', shirt: '#27ae60', pants: '#2c3e50', hair: '#3b2a20', hairStyle: 'short', glasses: true },
];
const CHAIR_COLORS = ['#34495e', '#7f3b3b', '#2f5d50', '#4a4a6a'];

export class OfficeScene {
  constructor(container, { onNearDeskChange, onSit, onEscape, onScreenRect }) {
    this.container = container;
    this.onNearDeskChange = onNearDeskChange;
    this.onSit = onSit;
    this.onEscape = onEscape;
    this.onScreenRect = onScreenRect;
    this.seatView = 'desk'; // inquadratura da seduto: 'desk' | 'focus'
    this.mode = 'walk'; // 'walk' | 'transition' | 'seated'
    this.transition = null;
    this.deskItems = new Map(); // id oggetto → Object3D sulla scrivania
    this.keys = new Set();
    this.target = null; // destinazione del click-to-move
    this.sitOnArrival = false;
    this.nearDesk = false;
    this.zoom = 1;
    this.animated = []; // { person, phase }
    this.screens = []; // { screen, next }
    this.colliders = [];

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1c2027');
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.envMap;
    this.scene.environmentIntensity = 0.45;

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);

    this.buildLights();
    this.buildRoom();
    this.buildFurniture();
    this.buildPlayer();

    this.clock = new THREE.Clock();
    this.bindEvents();
    this.resize();
    this.snapCamera();
    this.loop = this.loop.bind(this);
    this.frame = requestAnimationFrame(this.loop);
  }

  // ------------------------------------------------------------ costruzione

  buildLights() {
    const s = this.scene;
    s.add(new THREE.HemisphereLight('#dfe9ff', '#b89b7a', 0.9));

    // sole che entra dalle finestre
    const sun = new THREE.DirectionalLight('#fff1dc', 2.4);
    sun.position.set(4, 11, -12);
    sun.target.position.set(0, 0, 1);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -14;
    sun.shadow.camera.right = 14;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -12;
    sun.shadow.camera.far = 40;
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    s.add(sun, sun.target);

    // luce calda delle lampade a sospensione
    for (const x of [-6, 0, 5]) {
      const light = new THREE.PointLight('#ffd9a0', 6, 7, 1.6);
      light.position.set(x, 2.5, -1.4);
      s.add(light);
    }
  }

  buildRoom() {
    const s = this.scene;
    const w = ROOM.maxX - ROOM.minX;
    const d = ROOM.maxZ - ROOM.minZ;

    // pavimento e "zoccolo" sotto, per l'effetto plastico
    const floor = mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: woodFloor([w / 1.6, d / 1.6]), roughness: 0.55 }), { rx: -Math.PI / 2, shadow: false });
    s.add(floor);
    this.floor = floor;
    s.add(mesh(new THREE.BoxGeometry(w + 0.4, 0.4, d + 0.2), mat('#3a3f47'), { y: -0.201, z: -0.1, shadow: false }));

    const wallM = mat('#ece7df', { roughness: 0.9 });
    const baseM = mat('#5b5f66', { roughness: 0.6 });
    const H = ROOM.height;
    // parete di fondo e pareti laterali
    s.add(mesh(new THREE.BoxGeometry(w + 0.4, H, 0.2), wallM, { y: H / 2, z: ROOM.minZ - 0.1 }));
    for (const side of [-1, 1]) {
      const x = side > 0 ? ROOM.maxX + 0.1 : ROOM.minX - 0.1;
      s.add(mesh(new THREE.BoxGeometry(0.2, H, d), wallM, { x, y: H / 2 }));
      s.add(mesh(new THREE.BoxGeometry(0.03, 0.1, d), baseM, { x: x - side * 0.115, y: 0.05, shadow: false }));
    }
    s.add(mesh(new THREE.BoxGeometry(w, 0.1, 0.03), baseM, { y: 0.05, z: ROOM.minZ + 0.015, shadow: false }));

    // finestre con vista sulla città
    const sky = skyline();
    const frameM = mat('#2b2f36', { roughness: 0.4, metalness: 0.5 });
    [-6, 0, 6].forEach((cx, i) => {
      const ww = 4.5;
      const wh = 2.0;
      const y0 = 0.9;
      const tex = sky.clone();
      tex.repeat.set(1 / 3, 1);
      tex.offset.set(i / 3, 0);
      tex.needsUpdate = true;
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), new THREE.MeshBasicMaterial({ map: tex }));
      glass.position.set(cx, y0 + wh / 2, ROOM.minZ + 0.005);
      s.add(glass);
      const z = ROOM.minZ + 0.04;
      s.add(mesh(new THREE.BoxGeometry(ww + 0.12, 0.08, 0.08), frameM, { x: cx, y: y0 + wh, z }));
      s.add(mesh(new THREE.BoxGeometry(ww + 0.3, 0.06, 0.25), mat('#f4f1ea'), { x: cx, y: y0 - 0.03, z: ROOM.minZ + 0.12 }));
      for (let k = 0; k <= 3; k++) {
        s.add(mesh(new THREE.BoxGeometry(0.07, wh, 0.08), frameM, { x: cx - ww / 2 + (k * ww) / 3, y: y0 + wh / 2, z }));
      }
      s.add(mesh(new THREE.BoxGeometry(ww, 0.05, 0.06), frameM, { x: cx, y: y0 + wh * 0.72, z }));
    });

    // logo aziendale sulla parete destra, sopra la cucina
    const logoPlane = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.75), new THREE.MeshStandardMaterial({ map: logo(), transparent: true, roughness: 0.6 }));
    logoPlane.position.set(ROOM.maxX - 0.01, 2.35, -4);
    logoPlane.rotation.y = -Math.PI / 2;
    s.add(logoPlane);

    // lavagna dello sprint e quadri sulla parete sinistra
    const board = new THREE.Group();
    board.add(mesh(new THREE.BoxGeometry(3.2, 1.6, 0.05), mat('#c9ced4', { metalness: 0.5, roughness: 0.4 })));
    const boardFace = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.5), new THREE.MeshStandardMaterial({ map: whiteboard(), roughness: 0.35 }));
    boardFace.position.z = 0.03;
    board.add(boardFace);
    board.position.set(ROOM.minX + 0.04, 1.65, -2);
    board.rotation.y = Math.PI / 2;
    s.add(board);
    [1.8, 3.6].forEach((z, i) => {
      const pic = new THREE.Group();
      pic.add(mesh(new THREE.BoxGeometry(1.0, 0.76, 0.04), mat('#222')));
      const art = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.66), new THREE.MeshStandardMaterial({ map: framedPicture(i + 1), roughness: 0.8 }));
      art.position.z = 0.025;
      pic.add(art);
      pic.position.set(ROOM.minX + 0.03, 1.75, z);
      pic.rotation.y = Math.PI / 2;
      s.add(pic);
    });
  }

  addCollider(minX, maxX, minZ, maxZ) {
    this.colliders.push({ minX, maxX, minZ, maxZ });
  }

  buildFurniture() {
    const s = this.scene;
    let seed = 1;
    DESK_ROWS.forEach((z, row) => {
      DESK_X.forEach((x, col) => {
        seed++;
        if (row === PLAYER_DESK.row && col === PLAYER_DESK.col) {
          this.buildPlayerDesk(x, z);
          return;
        }
        const colleague = COLLEAGUES.find((c) => c.row === row && c.col === col);
        const extras = [];
        if (seed % 2) extras.push('mug');
        if (seed % 3 === 0) extras.push('plant');
        const ws = makeWorkstation({
          seed,
          colleague,
          extras,
          chairColor: CHAIR_COLORS[seed % CHAIR_COLORS.length],
        });
        ws.group.position.set(x, 0, z);
        s.add(ws.group);
        if (ws.person) this.animated.push({ person: ws.person, phase: seed * 1.37 });
        if (ws.codeScreen && colleague) this.screens.push({ screen: ws.codeScreen, next: Math.random() });

        this.addCollider(x - 0.8, x + 0.8, z - 0.4, z + 0.4);
        const cz = colleague ? 0.62 : 0.85;
        this.addCollider(x - 0.32, x + 0.32, z + cz - 0.3, z + cz + 0.35);
      });
      // lampade sopra ogni isola
      for (const x of [-6, 0, 5]) {
        const lamp = makeLamp();
        lamp.position.set(x, 2.9, z + 0.1);
        s.add(lamp);
      }
    });

    // segnaposto della tua scrivania: freccia che fluttua e cerchio a terra
    this.marker = new THREE.Group();
    const arrow = mesh(new THREE.ConeGeometry(0.16, 0.32, 20), new THREE.MeshBasicMaterial({ color: '#4ec9b0' }), { rx: Math.PI, shadow: false });
    this.marker.add(arrow);
    this.marker.position.set(this.deskSpot.x, 1.6, this.deskSpot.z);
    s.add(this.marker);
    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.52, 40),
      new THREE.MeshBasicMaterial({ color: '#4ec9b0', transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
    );
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.set(this.deskSpot.x, 0.01, this.deskSpot.z);
    s.add(this.ring);

    // cucina lungo la parete destra
    const kitchen = makeKitchen();
    kitchen.position.set(ROOM.maxX - 0.35, 0, -4);
    s.add(kitchen);
    this.addCollider(ROOM.maxX - 0.75, ROOM.maxX, -5.65, -2.35);
    this.addCollider(ROOM.maxX - 0.55, ROOM.maxX, -2.0, -1.6);

    // area relax in basso a sinistra
    const rugMesh = mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshStandardMaterial({ map: rug('#8c6d5a', '#e9dccb'), roughness: 1 }), { x: -8.3, y: 0.005, z: 4.5, rx: -Math.PI / 2, shadow: false });
    s.add(rugMesh);
    const sofa = makeSofa();
    sofa.position.set(-8.3, 0, 5.4);
    s.add(sofa);
    this.addCollider(-9.35, -7.25, 4.95, 5.85);
    const table = makeCoffeeTable();
    table.position.set(-8.3, 0, 4.1);
    s.add(table);
    this.addCollider(-8.8, -7.8, 3.6, 4.6);

    // piante
    const plants = [
      [-10.4, -6.4, 1.3],
      [10.4, -6.4, 1.2],
      [-3.0, 0.6, 1.0],
      [2.5, -3.4, 1.0],
      [-10.4, 6.3, 1.1],
      [-6.5, 5.6, 0.9],
    ];
    for (const [x, z, sc] of plants) {
      const p = makePlant(sc, sc > 1.1 ? '#2b2f36' : '#d9cfc1');
      p.position.set(x, 0, z);
      s.add(p);
      this.addCollider(x - 0.25 * sc, x + 0.25 * sc, z - 0.25 * sc, z + 0.25 * sc);
    }
  }

  // La tua postazione: pezzi base sostituibili (monitor, tastiera, sedia) e posti per gli oggetti.
  buildPlayerDesk(x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    this.scene.add(g);
    this.playerDesk = g;
    g.add(makeDesk());
    const mug = makeMug('#ffffff');
    mug.position.set(0.43, DESK.height, 0.22);
    g.add(mug);
    this.deskScreen = new DeskScreen();
    this.placeMonitor(false);
    this.placeKeyboard(false);
    this.placeChair(false);
    this.deskSpot = new THREE.Vector3(x, 0, z + 0.85);
    this.addCollider(x - 0.8, x + 0.8, z - 0.4, z + 0.4);
    this.addCollider(x - 0.25, x + 0.25, z + 0.62, z + 1.08);
  }

  placeMonitor(xl) {
    if (this.monitor && this.monitorXL === xl) return;
    this.monitor?.removeFromParent();
    this.monitorXL = xl;
    this.monitor = makeMonitor(this.deskScreen.texture, { wide: xl ? 0.9 : 0.62, tilt: SEAT_TILT, bezel: xl ? 0.02 : 0.03 });
    this.monitor.position.set(0, DESK.height, -0.18);
    this.playerDesk.add(this.monitor);
  }

  placeKeyboard(rgb) {
    if (this.keyboard && !!this.keyboard.userData.rgb === rgb) return;
    this.keyboard?.removeFromParent();
    this.keyboard = makeKeyboard({ rgb });
    this.keyboard.position.set(-0.05, DESK.height, 0.15);
    this.playerDesk.add(this.keyboard);
  }

  placeChair(gaming) {
    if (this.chair && this.chairGaming === gaming) return;
    this.chair?.removeFromParent();
    this.chairGaming = gaming;
    this.chair = gaming ? makeGamingChair() : makeChair('#1f6f63');
    this.chair.position.set(0, 0, 0.85);
    this.chair.rotation.y = 0.35;
    this.playerDesk.add(this.chair);
  }

  buildPlayer() {
    this.player = makePerson({ skin: '#e6b893', shirt: '#4ec9b0', pants: '#2b2f3a', hair: '#4a3222', hairStyle: 'short' });
    this.player.root.position.set(0, 0, 4.2);
    this.scene.add(this.player.root);
    this.heading = 0; // guarda verso -z, cioè verso le finestre
    this.walkBlend = 0;
  }

  // ------------------------------------------------------------ input

  bindEvents() {
    const typing = (e) => e.target.closest?.('input, textarea, select, [contenteditable="true"]');
    this.handlers = {
      keydown: (e) => {
        if (typing(e)) return;
        if (this.mode !== 'walk' && e.code === 'Escape') {
          e.preventDefault();
          this.onEscape();
          return;
        }
        if (this.mode !== 'walk') return;
        const move = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (move.includes(e.code)) {
          this.keys.add(e.code);
          this.target = null;
          this.sitOnArrival = false;
          e.preventDefault();
        } else if ((e.code === 'KeyE' || e.code === 'Enter') && this.nearDesk) {
          e.preventDefault();
          this.onSit();
        }
      },
      keyup: (e) => this.keys.delete(e.code),
      blur: () => this.keys.clear(),
      pointerdown: (e) => {
        this.pointerStart = { x: e.clientX, y: e.clientY };
      },
      pointerup: (e) => {
        if (this.mode !== 'walk' || !this.pointerStart) return;
        const moved = Math.hypot(e.clientX - this.pointerStart.x, e.clientY - this.pointerStart.y);
        this.pointerStart = null;
        if (moved < 6) this.clickAt(e);
      },
      wheel: (e) => {
        if (this.mode !== 'walk') return;
        e.preventDefault();
        this.zoom = THREE.MathUtils.clamp(this.zoom + Math.sign(e.deltaY) * 0.08, 0.55, 1.35);
      },
    };
    window.addEventListener('keydown', this.handlers.keydown);
    window.addEventListener('keyup', this.handlers.keyup);
    window.addEventListener('blur', this.handlers.blur);
    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointerdown', this.handlers.pointerdown);
    canvas.addEventListener('pointerup', this.handlers.pointerup);
    canvas.addEventListener('wheel', this.handlers.wheel, { passive: false });
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
  }

  // Click su un punto del pavimento: il personaggio ci va. Click sulla tua scrivania: ci va e si siede.
  clickAt(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const hits = ray.intersectObjects(this.scene.children, true);
    if (!hits.length) return;
    const p = hits[0].point;
    const deskCenter = new THREE.Vector3(this.deskSpot.x, 0, this.deskSpot.z - 0.85);
    const onDesk = Math.hypot(p.x - deskCenter.x, p.z - deskCenter.z) < 1.0 || Math.hypot(p.x - this.deskSpot.x, p.z - this.deskSpot.z) < 0.6;
    if (onDesk) {
      if (this.nearDesk) return this.onSit();
      this.target = new THREE.Vector3(this.deskSpot.x, 0, this.deskSpot.z + 0.55);
      this.sitOnArrival = true;
    } else {
      const floorHit = hits.find((h) => h.object === this.floor);
      if (!floorHit) return;
      this.target = floorHit.point.clone().setY(0);
      this.sitOnArrival = false;
    }
  }

  // ------------------------------------------------------------ aggiornamento

  updatePlayer(dt, t) {
    const dir = new THREE.Vector3();
    const k = this.keys;
    if (k.has('KeyW') || k.has('ArrowUp')) dir.z -= 1;
    if (k.has('KeyS') || k.has('ArrowDown')) dir.z += 1;
    if (k.has('KeyA') || k.has('ArrowLeft')) dir.x -= 1;
    if (k.has('KeyD') || k.has('ArrowRight')) dir.x += 1;

    const pos = this.player.root.position;
    if (dir.lengthSq() === 0 && this.target) {
      dir.subVectors(this.target, pos).setY(0);
      if (dir.length() < 0.08) {
        this.target = null;
        dir.set(0, 0, 0);
        if (this.sitOnArrival && this.nearDesk) {
          this.sitOnArrival = false;
          this.onSit();
        }
      }
    }

    const moving = dir.lengthSq() > 0;
    if (moving) {
      dir.normalize();
      const before = pos.clone();
      pos.addScaledVector(dir, WALK_SPEED * dt);
      this.resolveCollisions(pos);
      // bloccato contro un ostacolo mentre va verso un click: si ferma
      if (this.target && pos.distanceTo(before) < WALK_SPEED * dt * 0.2) this.target = null;
      const desired = Math.atan2(-dir.x, -dir.z);
      let delta = desired - this.heading;
      delta = Math.atan2(Math.sin(delta), Math.cos(delta));
      this.heading += delta * Math.min(1, dt * 12);
    }
    this.player.root.rotation.y = this.heading;
    this.walkBlend = THREE.MathUtils.damp(this.walkBlend, moving ? 1 : 0, 10, dt);
    animateWalk(this.player, t, this.walkBlend);

    const near = pos.distanceTo(this.deskSpot) < SIT_DISTANCE;
    if (near !== this.nearDesk) {
      this.nearDesk = near;
      this.onNearDeskChange(near);
    }
  }

  resolveCollisions(pos) {
    const r = PLAYER_RADIUS;
    pos.x = THREE.MathUtils.clamp(pos.x, ROOM.minX + r, ROOM.maxX - r);
    pos.z = THREE.MathUtils.clamp(pos.z, ROOM.minZ + r, ROOM.maxZ - r);
    for (const c of this.colliders) {
      const minX = c.minX - r;
      const maxX = c.maxX + r;
      const minZ = c.minZ - r;
      const maxZ = c.maxZ + r;
      if (pos.x <= minX || pos.x >= maxX || pos.z <= minZ || pos.z >= maxZ) continue;
      const push = [
        [pos.x - minX, () => (pos.x = minX)],
        [maxX - pos.x, () => (pos.x = maxX)],
        [pos.z - minZ, () => (pos.z = minZ)],
        [maxZ - pos.z, () => (pos.z = maxZ)],
      ].sort((a, b) => a[0] - b[0]);
      push[0][1]();
    }
  }

  cameraGoal() {
    const p = this.player.root.position;
    const goal = p.clone().add(CAMERA_OFFSET.clone().multiplyScalar(this.zoom));
    goal.x = THREE.MathUtils.clamp(goal.x, -7, 7);
    const look = new THREE.Vector3(goal.x * 0.9 + p.x * 0.1, 0.6, p.z - 1.2);
    return { goal, look };
  }

  snapCamera() {
    const { goal, look } = this.cameraGoal();
    this.camera.position.copy(goal);
    this.lookAt = look;
    this.camera.lookAt(look);
  }

  updateCamera(dt) {
    const { goal, look } = this.cameraGoal();
    const k = 1 - Math.exp(-dt * 4);
    this.camera.position.lerp(goal, k);
    this.lookAt.lerp(look, k);
    this.camera.lookAt(this.lookAt);
  }

  loop() {
    this.frame = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (!this.hasSize) return;
    const t = this.clock.elapsedTime;

    if (this.mode === 'walk') this.updatePlayer(dt, t);
    if (this.transition) this.stepTransition(dt);
    const rgb = this.keyboard?.userData.rgb;
    if (rgb) rgb.color.setHSL((t * 0.15) % 1, 1, 0.55);
    for (const { person, phase } of this.animated) animateTyping(person, t, phase);
    for (const s of this.screens) {
      s.next -= dt;
      if (s.next <= 0) {
        s.screen.tick();
        s.next = 0.25 + Math.random() * 0.9;
      }
    }
    this.marker.position.y = 1.6 + Math.sin(t * 3) * 0.08;
    this.marker.rotation.y = t * 1.5;
    const pulse = this.nearDesk ? 0.85 : 0.35 + Math.sin(t * 3) * 0.15;
    this.ring.material.opacity = pulse;
    this.ring.scale.setScalar(this.nearDesk ? 1.15 : 1);
    if (this.mode === 'walk') this.updateCamera(dt);
    this.renderer.render(this.scene, this.camera);
  }

  // ------------------------------------------------------------ API per React

  resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.hasSize = w > 0 && h > 0;
    if (!this.hasSize) return;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    if (this.mode === 'walk') this.camera.fov = this.officeFov();
    this.camera.updateProjectionMatrix();
    if (this.mode === 'seated') this.applySeat();
    else if (this.mode === 'zoom') this.emitScreenRect();
  }

  // su schermi stretti la camera si allontana un po'
  officeFov() {
    return this.camera.aspect < 1 ? 60 : 42;
  }

  // ------------------------------------------------------------ seduto alla scrivania

  // Posa della camera che inquadra lo schermo dritto davanti, nella parte alta della vista,
  // lasciando visibile la scrivania sotto e ai lati.
  seatPose(view = this.seatView) {
    const preset = SEAT_VIEWS[view];
    const screen = this.monitor.userData.screen;
    this.scene.updateMatrixWorld();
    const center = screen.getWorldPosition(new THREE.Vector3());
    const quat = screen.getWorldQuaternion(new THREE.Quaternion());
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quat);
    const { width, height } = screen.geometry.parameters;
    const tan = Math.tan(THREE.MathUtils.degToRad(preset.fov / 2));
    const wanted = this.monitorXL ? preset.fractionXL : preset.fraction;
    const fraction = Math.min(wanted, (0.94 * this.camera.aspect * height) / width);
    const distance = height / 2 / (tan * fraction);
    // centro dello schermo nella vista (0 = centro, 1 = bordo alto): lo schermo sta in alto
    const centerY = Math.max(0, 1 - fraction - 0.03);
    const pos = center.addScaledVector(normal, distance).addScaledVector(up, -centerY * distance * tan);
    return { pos, quat, fov: preset.fov };
  }

  applySeat() {
    const { pos, quat, fov } = this.seatPose();
    this.camera.position.copy(pos);
    this.camera.quaternion.copy(quat);
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
    this.emitScreenRect();
  }

  // Rettangolo dello schermo in pixel (relativo al contenitore) con una camera data.
  screenRectFor(camera) {
    const screen = this.monitor.userData.screen;
    const { width, height } = screen.geometry.parameters;
    camera.updateMatrixWorld();
    const xs = [];
    const ys = [];
    for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const p = screen.localToWorld(new THREE.Vector3((cx * width) / 2, (cy * height) / 2, 0)).project(camera);
      xs.push(((p.x + 1) / 2) * this.container.clientWidth);
      ys.push(((1 - p.y) / 2) * this.container.clientHeight);
    }
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
  }

  // Il desktop HTML è impaginato sempre alla dimensione dell'inquadratura «focus»
  // e scalato per coincidere con lo schermo com'è ora: zoom fluido, senza re-impaginare.
  emitScreenRect() {
    const rect = this.screenRectFor(this.camera);
    const focus = this.seatPose('focus');
    const focusCamera = this.camera.clone();
    focusCamera.position.copy(focus.pos);
    focusCamera.quaternion.copy(focus.quat);
    focusCamera.fov = focus.fov;
    focusCamera.updateProjectionMatrix();
    const layout = this.screenRectFor(focusCamera);
    this.onScreenRect({ ...rect, layoutWidth: layout.width, layoutHeight: layout.height });
  }

  startTransition(to, onDone, { seconds = TRANSITION_SECONDS, emit = false } = {}) {
    this.transition = {
      fromPos: this.camera.position.clone(),
      fromQuat: this.camera.quaternion.clone(),
      fromFov: this.camera.fov,
      to,
      t: 0,
      seconds,
      emit, // true = la camera resta parallela allo schermo: il desktop la segue fotogramma per fotogramma
      onDone,
    };
  }

  stepTransition(dt) {
    const tr = this.transition;
    tr.t = Math.min(1, tr.t + dt / tr.seconds);
    const k = tr.t * tr.t * (3 - 2 * tr.t);
    this.camera.position.lerpVectors(tr.fromPos, tr.to.pos, k);
    this.camera.quaternion.slerpQuaternions(tr.fromQuat, tr.to.quat, k);
    this.camera.fov = THREE.MathUtils.lerp(tr.fromFov, tr.to.fov, k);
    this.camera.updateProjectionMatrix();
    if (tr.emit) this.emitScreenRect();
    if (tr.t === 1) {
      this.transition = null;
      tr.onDone();
    }
  }

  // Passa dall'inquadratura della scrivania a quella ravvicinata (app aperta) e viceversa.
  setFocus(focused) {
    const view = focused ? 'focus' : 'desk';
    if (view === this.seatView) return;
    this.seatView = view;
    if (this.mode !== 'seated') return; // se sta ancora arrivando alla sedia, userà la nuova inquadratura
    this.zoomToSeat();
  }

  zoomToSeat() {
    this.mode = 'zoom';
    this.startTransition(
      this.seatPose(),
      () => {
        this.mode = 'seated';
        this.applySeat();
      },
      { seconds: ZOOM_SECONDS, emit: true },
    );
  }

  sit() {
    if (this.mode !== 'walk') return;
    this.mode = 'transition';
    this.keys.clear();
    this.target = null;
    this.sitOnArrival = false;
    this.onScreenRect(null);
    this.player.root.visible = false;
    this.marker.visible = false;
    this.ring.visible = false;
    if (this.nearDesk) {
      this.nearDesk = false;
      this.onNearDeskChange(false);
    }
    this.startTransition(this.seatPose(), () => {
      this.mode = 'seated';
      this.applySeat();
    });
  }

  // Ci si alza accanto alla sedia, rivolti verso la stanza, e la camera torna a seguire.
  standUp() {
    if (this.mode === 'walk') return;
    this.mode = 'transition';
    this.onScreenRect(null);
    this.player.root.position.set(this.deskSpot.x - 0.6, 0, this.deskSpot.z + 0.7);
    this.heading = Math.PI;
    this.player.root.rotation.y = this.heading;
    this.player.root.visible = true;
    this.marker.visible = true;
    this.ring.visible = true;
    const { goal, look } = this.cameraGoal();
    const m = new THREE.Matrix4().lookAt(goal, look, new THREE.Vector3(0, 1, 0));
    const quat = new THREE.Quaternion().setFromRotationMatrix(m);
    this.startTransition({ pos: goal, quat, fov: this.officeFov() }, () => {
      this.mode = 'walk';
      this.lookAt = look;
    });
  }

  // Oggetti comprati e posati sulla scrivania.
  setDeskItems(ids) {
    const want = new Set(ids);
    const xlBefore = this.monitorXL;
    this.placeMonitor(want.has('monitor-xl'));
    this.placeKeyboard(want.has('keyboard-rgb'));
    this.placeChair(want.has('chair-gaming'));

    for (const [id, slot] of Object.entries(DESK_SLOTS)) {
      const current = this.deskItems.get(id);
      if (want.has(id) && !current) {
        const obj = slot.build();
        obj.rotation.y = slot.rotY;
        if (slot.scale) obj.scale.setScalar(slot.scale);
        obj.position.set(...slot.position);
        this.playerDesk.add(obj);
        if (slot.floor) {
          const wx = this.playerDesk.position.x + slot.position[0];
          const wz = this.playerDesk.position.z + slot.position[2];
          obj.userData.collider = { minX: wx - 0.3, maxX: wx + 0.3, minZ: wz - 0.3, maxZ: wz + 0.3 };
          this.colliders.push(obj.userData.collider);
        }
        this.deskItems.set(id, obj);
      } else if (!want.has(id) && current) {
        current.removeFromParent();
        if (current.userData.collider) this.colliders = this.colliders.filter((c) => c !== current.userData.collider);
        this.deskItems.delete(id);
      }
    }

    // Monitor cambiato mentre sei seduto: la camera si riadatta al nuovo schermo.
    if (this.mode === 'seated' && xlBefore !== this.monitorXL) this.zoomToSeat();
  }

  setDeskInfo(info) {
    this.deskScreen?.update(info);
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener('keydown', this.handlers.keydown);
    window.removeEventListener('keyup', this.handlers.keyup);
    window.removeEventListener('blur', this.handlers.blur);
    this.resizeObserver.disconnect();
    this.scene.traverse((obj) => {
      obj.geometry?.dispose();
      const materials = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
      for (const m of materials) {
        m.map?.dispose();
        m.dispose();
      }
    });
    this.envMap.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
