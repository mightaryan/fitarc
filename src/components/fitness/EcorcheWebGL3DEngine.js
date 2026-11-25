/**
 * FITARC REAL-TIME WEBGL 3D SCULPTED ANATOMICAL ECORCHÉ ENGINE (V2)
 * Renders GymVisual-grade dark obsidian 3D striated anatomy with seamless joint articulation,
 * exact aspect-ratio preservation across wide modals & mobile cards, fine silky ecorché striations,
 * white athletic compression shorts, terracotta active-muscle glow, and a true portrait 3D Face & Neck Bust.
 */

// ==================== 3D MATH UTILITIES (COLUMN-MAJOR MAT4 & MAT3) ====================
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function normalize3(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function add3(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function sub3(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale3(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function mat4Perspective(fovRad, aspect, near, far) {
  const f = 1.0 / Math.tan(fovRad / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function mat4LookAt(eye, target, up) {
  const zAxis = normalize3(sub3(eye, target));
  const xAxis = normalize3(cross3(up, zAxis));
  const yAxis = cross3(zAxis, xAxis);
  return new Float32Array([
    xAxis[0], yAxis[0], zAxis[0], 0,
    xAxis[1], yAxis[1], zAxis[1], 0,
    xAxis[2], yAxis[2], zAxis[2], 0,
    -dot3(xAxis, eye), -dot3(yAxis, eye), -dot3(zAxis, eye), 1,
  ]);
}

function mat4Multiply(a, b) {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[0 * 4 + row] * b[col * 4 + 0] +
        a[1 * 4 + row] * b[col * 4 + 1] +
        a[2 * 4 + row] * b[col * 4 + 2] +
        a[3 * 4 + row] * b[col * 4 + 3];
    }
  }
  return out;
}

function mat3NormalFromMat4(m) {
  const a00 = m[0], a01 = m[1], a02 = m[2];
  const a10 = m[4], a11 = m[5], a12 = m[6];
  const a20 = m[8], a21 = m[9], a22 = m[10];

  const b01 = a22 * a11 - a12 * a21;
  const b11 = -a22 * a10 + a12 * a20;
  const b21 = a21 * a10 - a11 * a20;

  let det = a00 * b01 + a01 * b11 + a02 * b21;
  if (Math.abs(det) < 1e-6) return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  det = 1.0 / det;

  return new Float32Array([
    b01 * det,
    (-a22 * a01 + a02 * a21) * det,
    (a12 * a01 - a02 * a11) * det,
    b11 * det,
    (a22 * a00 - a02 * a20) * det,
    (-a12 * a00 + a02 * a10) * det,
    b21 * det,
    (-a21 * a00 + a01 * a20) * det,
    (a11 * a00 - a01 * a10) * det,
  ]);
}

function buildBoneMatrix(p1, p2, rx, rz, refHint = [0, 0, 1], extStart = 0, extEnd = 0) {
  const delta = sub3(p2, p1);
  const rawLen = Math.hypot(delta[0], delta[1], delta[2]);
  if (rawLen < 1e-5) {
    return new Float32Array([
      rx, 0, 0, 0,
      0, 0.001, 0, 0,
      0, 0, rz, 0,
      p1[0], p1[1], p1[2], 1,
    ]);
  }
  const up = [delta[0] / rawLen, delta[1] / rawLen, delta[2] / rawLen];
  const origin = add3(p1, scale3(up, -extStart));
  const len = rawLen + extStart + extEnd;

  let ref = refHint;
  if (Math.abs(dot3(up, ref)) > 0.92) {
    ref = Math.abs(up[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
  }
  const right = normalize3(cross3(up, ref));
  const fwd = normalize3(cross3(right, up));

  return new Float32Array([
    right[0] * rx, right[1] * rx, right[2] * rx, 0,
    up[0] * len, up[1] * len, up[2] * len, 0,
    fwd[0] * rz, fwd[1] * rz, fwd[2] * rz, 0,
    origin[0], origin[1], origin[2], 1,
  ]);
}

function buildOrientedBoneMatrix(p1, p2, rx, rz, rightHint, extStart = 0, extEnd = 0) {
  const delta = sub3(p2, p1);
  const rawLen = Math.hypot(delta[0], delta[1], delta[2]);
  if (rawLen < 1e-5) {
    return new Float32Array([
      rx, 0, 0, 0,
      0, 0.001, 0, 0,
      0, 0, rz, 0,
      p1[0], p1[1], p1[2], 1,
    ]);
  }
  const up = [delta[0] / rawLen, delta[1] / rawLen, delta[2] / rawLen];
  const origin = add3(p1, scale3(up, -extStart));
  const len = rawLen + extStart + extEnd;

  let hint = rightHint;
  if (Math.abs(dot3(up, hint)) > 0.94) {
    hint = Math.abs(up[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0];
  }
  const fwd = normalize3(cross3(hint, up));
  const right = normalize3(cross3(up, fwd));

  return new Float32Array([
    right[0] * rx, right[1] * rx, right[2] * rx, 0,
    up[0] * len, up[1] * len, up[2] * len, 0,
    fwd[0] * rz, fwd[1] * rz, fwd[2] * rz, 0,
    origin[0], origin[1], origin[2], 1,
  ]);
}

function buildBasisSphereMatrix(center, rx, ry, rz, rightVec, upVec, fwdVec) {
  return new Float32Array([
    rightVec[0] * rx, rightVec[1] * rx, rightVec[2] * rx, 0,
    upVec[0] * ry, upVec[1] * ry, upVec[2] * ry, 0,
    fwdVec[0] * rz, fwdVec[1] * rz, fwdVec[2] * rz, 0,
    center[0], center[1], center[2], 1,
  ]);
}

function buildSphereMatrix(center, rx, ry, rz, yawRad = 0, pitchRad = 0) {
  const cy = Math.cos(yawRad), sy = Math.sin(yawRad);
  const cp = Math.cos(pitchRad), sp = Math.sin(pitchRad);

  return new Float32Array([
    cy * rx, sp * sy * rx, -cp * sy * rx, 0,
    0, cp * ry, sp * ry, 0,
    sy * rz, -sp * cy * rz, cp * cy * rz, 0,
    center[0], center[1], center[2], 1,
  ]);
}

// ==================== 3D SCULPTED ANATOMICAL MESH GENERATORS ====================
function finalizeMesh(gl, positions, normals, uvs, indices) {
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const normBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

  const uvBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

  const idxBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return { posBuf, normBuf, uvBuf, idxBuf, count: indices.length };
}

function computeSmoothNormals(positions, indices) {
  const norms = new Float32Array(positions.length);
  for (let i = 0; i < indices.length; i += 3) {
    const i0 = indices[i] * 3;
    const i1 = indices[i + 1] * 3;
    const i2 = indices[i + 2] * 3;
    const p0 = [positions[i0], positions[i0 + 1], positions[i0 + 2]];
    const p1 = [positions[i1], positions[i1 + 1], positions[i1 + 2]];
    const p2 = [positions[i2], positions[i2 + 1], positions[i2 + 2]];
    const e1 = sub3(p1, p0);
    const e2 = sub3(p2, p0);
    const n = cross3(e1, e2);
    [i0, i1, i2].forEach((idx) => {
      norms[idx] += n[0];
      norms[idx + 1] += n[1];
      norms[idx + 2] += n[2];
    });
  }
  for (let i = 0; i < norms.length; i += 3) {
    const l = Math.hypot(norms[i], norms[i + 1], norms[i + 2]) || 1;
    norms[i] /= l;
    norms[i + 1] /= l;
    norms[i + 2] /= l;
  }
  return norms;
}

function createSculptedMuscleGeo(gl, profileFn, stacks = 22, slices = 24) {
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let vIdx = 0; vIdx <= stacks; vIdx++) {
    const v = vIdx / stacks;
    for (let uIdx = 0; uIdx <= slices; uIdx++) {
      const u = uIdx / slices;
      const theta = u * Math.PI * 2;
      const [px, py, pz] = profileFn(u, v, theta);
      positions.push(px, py, pz);
      uvs.push(u, v);
    }
  }

  for (let vIdx = 0; vIdx < stacks; vIdx++) {
    for (let uIdx = 0; uIdx < slices; uIdx++) {
      const a = vIdx * (slices + 1) + uIdx;
      const b = a + slices + 1;
      const c = a + 1;
      const d = b + 1;
      indices.push(a, b, c, c, b, d);
    }
  }

  const normals = computeSmoothNormals(positions, indices);
  return finalizeMesh(gl, positions, normals, uvs, indices);
}

// Smooth capsule cap factor: rounded hemispherical ends ONLY at extreme 2%, continuous limb thickness everywhere else!
function limbEndCap(v, startMin = 0.72, endMin = 0.62) {
  if (v < 0.04) return lerp(0.18, startMin, v / 0.04);
  if (v > 0.96) return lerp(0.18, endMin, (1.0 - v) / 0.04);
  return lerp(startMin, endMin, v);
}

function buildAllGeometries(gl) {
  // 1. Quad / Thigh (continuous hip-to-knee silhouette with vastus curve, zero pinched balloon ends!)
  const thigh = createSculptedMuscleGeo(gl, (u, v, th) => {
    const baseTaper = limbEndCap(v, 0.98, 0.66);
    const quadSweep = 1.0 + 0.16 * Math.sin(v * Math.PI) + 0.07 * Math.sin(v * Math.PI * 1.3) * Math.max(0, Math.sin(th));
    const rx = baseTaper * quadSweep * 0.96;
    const rz = baseTaper * quadSweep * 1.04;
    return [Math.cos(th) * rx, v, Math.sin(th) * rz];
  }, 22, 24);

  // 2. Calf (smooth knee joint bridge -> gastrocnemius upper bulge -> sleek Achilles taper to ankle)
  const calf = createSculptedMuscleGeo(gl, (u, v, th) => {
    const baseTaper = limbEndCap(v, 0.88, 0.46);
    const gastroBell = v < 0.62 ? Math.sin((v / 0.62) * Math.PI) : 0;
    const postSin = Math.max(0, -Math.sin(th));
    const gastroBump = 1.0 + 0.28 * gastroBell * (0.45 + 0.55 * postSin);
    return [Math.cos(th) * baseTaper * gastroBump * 0.94, v, Math.sin(th) * baseTaper * gastroBump * 1.06];
  }, 22, 24);

  // 3. Upper Arm (deltoid fullness -> sleek bicep/tricep taper -> continuous elbow thickness)
  const armUpper = createSculptedMuscleGeo(gl, (u, v, th) => {
    const baseTaper = limbEndCap(v, 0.96, 0.72);
    const deltPeak = v < 0.36 ? 0.18 * Math.sin((v / 0.36) * Math.PI) : 0;
    const biPeak = 0.14 * Math.sin(v * Math.PI);
    const r = baseTaper * (1.0 + deltPeak + biPeak);
    return [Math.cos(th) * r * 0.95, v, Math.sin(th) * r * 1.05];
  }, 20, 22);

  // 4. Forearm / Neck Cylinder (smooth elbow/brachioradialis -> slender wrist, also serves as clean cervical neck)
  const armForearm = createSculptedMuscleGeo(gl, (u, v, th) => {
    const baseTaper = limbEndCap(v, 0.92, 0.56);
    const belly = 1.0 + 0.16 * Math.sin(Math.pow(v, 0.75) * Math.PI);
    return [Math.cos(th) * baseTaper * belly * 0.95, v, Math.sin(th) * baseTaper * belly * 1.05];
  }, 18, 22);

  // 5. Continuous Athletic V-Taper Torso (seamlessly links Waist/Abs -> Obliques -> Pecs/Lats -> Trap Collars)
  const torso = createSculptedMuscleGeo(gl, (u, v, th) => {
    const endCap = v < 0.04 ? lerp(0.55, 0.78, v / 0.04) : v > 0.95 ? lerp(0.55, 0.72, (1 - v) / 0.05) : 1.0;
    // Athletic V-taper: hips/waist (0.76) -> upper chest/lats (1.04)
    const widthProfile = 0.76 + 0.28 * Math.sin(Math.min(1, v * 1.15) * Math.PI * 0.62);
    const depthProfile = 0.64 + 0.14 * Math.sin(v * Math.PI * 0.9);
    const isFront = Math.max(0, Math.sin(th));
    const pecBulge = v > 0.58 && v < 0.90 ? 0.12 * Math.sin(((v - 0.58) / 0.32) * Math.PI) * Math.pow(isFront, 1.3) : 0;
    const absRelief = v > 0.14 && v < 0.54 ? 0.04 * Math.abs(Math.sin(v * Math.PI * 4.5)) * Math.pow(isFront, 1.8) : 0;
    const isBack = Math.max(0, -Math.sin(th));
    const spineGroove = isBack > 0.3 ? -0.04 * Math.exp(-Math.pow(Math.cos(th), 2) * 16) : 0;
    const latWing = v > 0.48 && v < 0.86 ? 0.10 * Math.sin(((v - 0.48) / 0.38) * Math.PI) * Math.abs(Math.cos(th)) : 0;

    const rx = endCap * (widthProfile + latWing);
    const rz = endCap * (depthProfile + pecBulge + absRelief + spineGroove);
    return [Math.cos(th) * rx, v, Math.sin(th) * rz];
  }, 26, 26);

  // 6. Sculpted Compression Shorts Pelvis & Glutes (zero pinched waist seam!)
  const shorts = createSculptedMuscleGeo(gl, (u, v, th) => {
    const endCap = v < 0.05 ? lerp(0.55, 0.92, v / 0.05) : v > 0.94 ? lerp(0.65, 0.88, (1 - v) / 0.06) : 1.0;
    const gluteBump = v > 0.15 && v < 0.85 ? 0.18 * Math.sin(((v - 0.15) / 0.70) * Math.PI) * Math.max(0, -Math.sin(th)) * (0.55 + 0.45 * Math.abs(Math.cos(th))) : 0;
    const rx = endCap * (0.94 + 0.06 * Math.sin(v * Math.PI));
    const rz = endCap * (0.76 + gluteBump);
    return [Math.cos(th) * rx, v, Math.sin(th) * rz];
  }, 18, 24);

  // 7. Full-Body Anatomical Head & Jawline (integrated into neck, cranium + brow + nose + jaw)
  const head = createSculptedMuscleGeo(gl, (u, v, th) => {
    const theta = v * Math.PI; // 0 bottom chin -> PI top crown
    const sinT = Math.sin(theta);
    const ny = -Math.cos(theta); // -1 bottom chin -> +1 crown top
    const jawTaper = ny < 0 ? 0.74 + 0.26 * (1 + ny) : 1.0;
    let x = sinT * Math.cos(th) * 0.76 * jawTaper;
    const y = ny;
    let z = sinT * Math.sin(th) * 0.94 * (ny > 0 ? 1.02 : 0.92 + 0.08 * (1 + ny));

    const frontFace = Math.max(0, Math.sin(th));
    const centerAz = Math.exp(-Math.pow(Math.cos(th), 2) * 18);
    // Clean sculpted nasal bridge & tip
    if (ny > -0.22 && ny < 0.22 && frontFace > 0.5) {
      const noseEnv = Math.sin(((ny + 0.22) / 0.44) * Math.PI);
      z += 0.24 * noseEnv * Math.exp(-Math.pow(Math.cos(th), 2) * 32);
    }
    // Chin forward contour
    if (ny < -0.45 && frontFace > 0.4) {
      z += 0.10 * Math.exp(-Math.pow((ny + 0.72) * 3.5, 2)) * centerAz;
    }
    // Subtle orbital hollow & brow ridge
    if (ny > 0.08 && ny < 0.34 && frontFace > 0.45) {
      const eyeSocket = Math.exp(-Math.pow(Math.abs(Math.cos(th)) - 0.32, 2) * 30);
      z -= 0.06 * eyeSocket;
    }
    if (ny > 0.28 && ny < 0.46 && frontFace > 0.4) {
      z += 0.07 * Math.sin(((ny - 0.28) / 0.18) * Math.PI) * frontFace;
    }
    return [x, y, z];
  }, 24, 24);

  // 8A. Face Yoga Dedicated Cervical Neck, SCM V-Straps & Clavicle Trapezius Base (no cliff step!)
  const faceNeckBust = createSculptedMuscleGeo(gl, (u, v, th) => {
    // Spans y = -1.10 (shoulders/clavicles) -> y = -0.10 (deep inside cranial skull base!)
    const y = lerp(-1.10, -0.10, v);
    const front = Math.max(0, Math.sin(th));
    const back = Math.max(0, -Math.sin(th));
    const sideSym = Math.abs(Math.cos(th));

    // Shoulder slope smoothly blends into true anatomical neck column (rx ~ 0.32, rz ~ 0.35)
    const shoulderBlend = v < 0.38 ? Math.pow(1.0 - v / 0.38, 1.55) : 0;
    let rx = 0.32 + 0.78 * shoulderBlend;
    let rz = 0.35 + 0.24 * shoulderBlend;

    // Close bottom base smoothly so mesh has no open seam
    if (v < 0.04) {
      const cap = lerp(0.2, 1.0, v / 0.04);
      rx *= cap;
      rz *= cap;
    }

    // Subtle Sternocleidomastoid (SCM) diagonal V-cords from ear/mastoid to sternal notch
    const scmXTarget = 0.15 + (1.0 - v) * 0.28;
    const scmRidge = Math.exp(-Math.pow(sideSym - scmXTarget, 2) * 28) * Math.max(0, front - 0.1) * (v > 0.08 ? 1.0 : 0.3);
    // Subtle clavicle bone contour at v ~ 0.16..0.28
    const clavicle = v > 0.12 && v < 0.28 ? Math.sin(((v - 0.12) / 0.16) * Math.PI) * Math.max(0, front - 0.25) * sideSym : 0;
    // Slight cervical lordosis (neck sits slightly behind chin line cleanly)
    const zShift = (1.0 - v) * -0.05 - 0.05 + back * 0.04;

    rz += 0.045 * scmRidge + 0.035 * clavicle;
    return [Math.cos(th) * rx, y, Math.sin(th) * rz + zShift];
  }, 28, 36);

  // 8B. Face Yoga Sculpted Anatomical Portrait Cranium, Jawline, Cheekbones, Nose & Orbits
  const faceHead = createSculptedMuscleGeo(gl, (u, v, th) => {
    const theta = v * Math.PI; // 0 bottom chin -> PI crown top
    const sinT = Math.sin(theta);
    const ny = -Math.cos(theta); // -1.0 chin/submental -> 0 mid-face -> +1.0 crown

    // Classic 1.48 : 1.0 vertical anatomical cranium + sharp sculpted V-mandible
    const jawNarrow = ny < -0.05 ? 0.56 + 0.44 * Math.min(1, (ny + 1.0) / 0.95) : 1.0;
    const mandibleAngle = ny > -0.62 && ny < -0.15 ? 0.09 * Math.sin(((ny + 0.62) / 0.47) * Math.PI) * Math.exp(-Math.pow(Math.abs(Math.cos(th)) - 0.72, 2) * 14) : 0;

    let x = sinT * Math.cos(th) * (0.45 * jawNarrow + mandibleAngle);
    const y = 0.24 + ny * 0.68; // Spans y = -0.44 (chin base overlapping neck -0.10!) -> +0.92 (crown)
    let z = sinT * Math.sin(th) * (0.55 * (ny > 0 ? 1.02 : 0.88 + 0.12 * (1 + ny))) + 0.04;

    const front = Math.max(0, Math.sin(th));
    const sideSym = Math.abs(Math.cos(th));
    const center = Math.exp(-Math.pow(Math.cos(th), 2) * 26);

    // Pogonion / Chiseled Chin tip protrusion
    if (ny > -0.88 && ny < -0.42 && front > 0.35) {
      const chinEnv = Math.sin(((ny + 0.88) / 0.46) * Math.PI);
      z += 0.11 * chinEnv * Math.exp(-Math.pow(Math.cos(th), 2) * 14);
    }

    // Upper & Lower Sculpted Lips
    if (ny > -0.52 && ny < -0.26 && front > 0.45) {
      const lT = (ny + 0.52) / 0.26;
      const lipWave = Math.sin(lT * Math.PI * 2.0);
      z += 0.048 * Math.abs(lipWave) * center * (lipWave > 0 ? 1.1 : 0.75);
    }

    // Sculpted Nose Bridge, Tip & Nasal Wings
    if (ny > -0.25 && ny < 0.26 && front > 0.5) {
      const nT = (ny + 0.25) / 0.51;
      const tipProfile = nT < 0.25 ? Math.sin((nT / 0.25) * Math.PI * 0.5) : 1.0 - (nT - 0.25) * 0.68;
      z += 0.165 * Math.max(0, tipProfile) * Math.exp(-Math.pow(Math.cos(th), 2) * 34);
      if (nT < 0.30) {
        z += 0.042 * Math.exp(-Math.pow(sideSym - 0.19, 2) * 45) * Math.sin((nT / 0.30) * Math.PI);
      }
    }

    // Zygomatic Cheekbones (subtle protrusion) & Buccal hollow below
    if (ny > -0.30 && ny < 0.14 && front > 0.25) {
      const cheekEnv = Math.sin(((ny + 0.30) / 0.44) * Math.PI);
      z += 0.055 * cheekEnv * Math.exp(-Math.pow(sideSym - 0.52, 2) * 14);
    }
    if (ny > -0.52 && ny < -0.18 && front > 0.25) {
      z -= 0.038 * Math.sin(((ny + 0.52) / 0.34) * Math.PI) * Math.exp(-Math.pow(sideSym - 0.48, 2) * 16);
    }

    // Smooth Eye Orbits + Subtle Brow Ridge
    if (ny > 0.06 && ny < 0.32 && front > 0.42) {
      const eyeEnv = Math.sin(((ny - 0.06) / 0.26) * Math.PI);
      z -= 0.058 * eyeEnv * Math.exp(-Math.pow(sideSym - 0.32, 2) * 28);
    }
    if (ny > 0.26 && ny < 0.44 && front > 0.38) {
      const browEnv = Math.sin(((ny - 0.26) / 0.18) * Math.PI);
      z += 0.052 * browEnv * (0.4 + 0.6 * front);
    }

    return [x, y, z];
  }, 44, 48);

  // 9. Unit Sphere for Stability Ball, Shoulder Deltoids, Elbows, Knees, Hands & Feet
  const sphere = createSculptedMuscleGeo(gl, (u, v, th) => {
    const phi = v * Math.PI;
    return [Math.sin(phi) * Math.cos(th), -Math.cos(phi), Math.sin(phi) * Math.sin(th)];
  }, 20, 24);

  // 10. Ground Plane Non-Slip Yoga Mat
  const matPos = [
    -1, 0.0, -0.55,
    1, 0.0, -0.55,
    1, 0.0, 0.55,
    -1, 0.0, 0.55,
    -1, -0.025, -0.55,
    1, -0.025, -0.55,
    1, -0.025, 0.55,
    -1, -0.025, 0.55,
  ];
  const matIdx = [
    0, 1, 2, 0, 2, 3,
    3, 2, 6, 3, 6, 7,
    1, 0, 4, 1, 4, 5,
    0, 3, 7, 0, 7, 4,
    2, 1, 5, 2, 5, 6,
  ];
  const matNorms = computeSmoothNormals(matPos, matIdx);
  const matUv = [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1];
  const yogaMat = finalizeMesh(gl, matPos, matNorms, matUv, matIdx);

  return { thigh, calf, armUpper, armForearm, torso, shorts, head, faceNeckBust, faceHead, sphere, yogaMat };
}

// ==================== GLSL SHADERS (SILKY GYMVISUAL 3D ECORCHÉ LOOK) ====================
const VERTEX_SHADER = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 uMVP;
uniform mat4 uModel;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;
varying vec3 vLocalPos;

void main() {
  vec4 worldPos = uModel * vec4(aPosition, 1.0);
  vWorldPos = worldPos.xyz;
  vNormal = normalize(uNormalMatrix * aNormal);
  vUv = aUv;
  vLocalPos = aPosition;
  gl_Position = uMVP * vec4(aPosition, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;
varying vec3 vLocalPos;

uniform vec3 uCameraPos;
uniform float uMaterialType; // 0: Body Ecorche, 1: White Shorts, 2: Yoga Mat, 3: Stability Ball, 4: Face Neck Bust, 5: Face Head
uniform float uActiveGlow;   // 0.0 .. 1.0 muscle activation highlight
uniform float uFaceMode;     // 0=jawline, 1=mewing, 2=cheek, 3=forehead, 4=eyes, 5=lips, 6=lion, 7=lymph
uniform float uPulse;        // 0.0 .. 1.0 breath pulse
uniform float uIsFarSide;    // 0.0 or 1.0

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCameraPos - vWorldPos);

  // Clean 3-point Blender Cycles studio lighting
  vec3 keyDir = normalize(vec3(0.42, 0.85, 0.72));
  vec3 fillDir = normalize(vec3(-0.78, 0.25, 0.42));
  vec3 rimDir = normalize(vec3(-0.18, 0.60, -0.88));

  float ndotlKey = max(dot(N, keyDir), 0.0);
  float ndotlFill = max(dot(N, fillDir), 0.0);
  vec3 H = normalize(keyDir + V);
  float spec = pow(max(dot(N, H), 0.0), 34.0);
  float rimSpec = pow(max(dot(N, normalize(rimDir + V)), 0.0), 16.0);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.5);

  // 1. Matte Athletic White Compression Shorts
  if (uMaterialType > 0.5 && uMaterialType < 1.5) {
    vec3 baseWhite = vec3(0.84, 0.86, 0.89);
    vec3 litWhite = baseWhite * (0.34 + 0.66 * ndotlKey + 0.16 * ndotlFill) + vec3(0.18) * fresnel;
    gl_FragColor = vec4(litWhite, 1.0);
    return;
  }

  // 2. Dark Architectural Yoga Mat
  if (uMaterialType > 1.5 && uMaterialType < 2.5) {
    float edgeMask = max(step(0.95, abs(vLocalPos.x)), step(0.49, abs(vLocalPos.z)));
    vec3 matBase = mix(vec3(0.055, 0.065, 0.085), vec3(0.28, 0.30, 0.34), edgeMask * 0.45);
    float sheen = 0.05 * ndotlKey + 0.03 * fresnel;
    gl_FragColor = vec4(matBase + vec3(sheen), 1.0);
    return;
  }

  // 3. Matte Emerald-Slate Stability Ball
  if (uMaterialType > 2.5 && uMaterialType < 3.5) {
    float ringBand = smoothstep(0.965, 1.0, abs(sin(vUv.y * 16.0)));
    vec3 ballAlbedo = mix(vec3(0.06, 0.11, 0.10), vec3(0.18, 0.34, 0.29), ringBand * 0.45);
    vec3 col = ballAlbedo * (0.28 + 0.78 * ndotlKey + 0.24 * ndotlFill) + vec3(0.28) * spec + vec3(0.20, 0.42, 0.36) * fresnel;
    gl_FragColor = vec4(col, 1.0);
    return;
  }

  float angleCoord = vUv.x * 6.283185;
  float fiberWave = 0.5;
  float tendonFade = 1.0;
  float targetMask = 0.0;

  if (uMaterialType > 3.5 && uMaterialType < 4.5) {
    // 4. Face Bust Neck & Clavicles (Fine oblique Sternocleidomastoid & Platysma striations)
    float sideSym = abs(cos(angleCoord));
    float frontFace = max(0.0, sin(angleCoord));
    float yNorm = vUv.y;
    float scmFibers = sin((vUv.x * 78.0 - sideSym * 10.0 - yNorm * 14.0) * 3.14159);
    fiberWave = scmFibers * 0.5 + 0.5;

    if (uFaceMode < 0.5 || (uFaceMode > 0.5 && uFaceMode < 1.5) || uFaceMode > 5.5) {
      // Jawline/Platysma, Mewing Hyoid, Lion Neck & Lymphatic SCM channels glow softly on upper neck
      float frontNeck = smoothstep(0.15, 0.72, frontFace + sideSym * 0.35);
      float upperNeck = smoothstep(0.10, 0.42, yNorm) * smoothstep(0.98, 0.70, yNorm);
      float scale = uFaceMode > 6.5 ? 0.92 : (uFaceMode < 0.5 ? 0.65 : 0.78);
      targetMask = frontNeck * upperNeck * scale;
    }
  } else if (uMaterialType > 4.5) {
    // 5. Face Yoga Sculpted Head (Clean anatomical ecorche with delicate longitudinal muscle sheen)
    float sideSym = abs(cos(angleCoord));
    float frontFace = max(0.0, sin(angleCoord));
    float yNorm = vUv.y; // 0 chin -> 1 crown
    float fineFibers = sin((vUv.x * 84.0 + yNorm * 18.0) * 3.14159);
    fiberWave = fineFibers * 0.5 + 0.5;

    if (uFaceMode < 0.5) {
      // Jawline & Masseter Sculpt
      float jawArc = smoothstep(0.20, 0.0, abs(yNorm - 0.25)) * smoothstep(0.15, 0.70, frontFace + sideSym * 0.5);
      float masseter = smoothstep(0.45, 0.85, sideSym) * smoothstep(0.18, 0.35, yNorm) * smoothstep(0.50, 0.35, yNorm);
      targetMask = max(jawArc, masseter);
    } else if (uFaceMode < 1.5) {
      // Mewing & Submental Chin
      float subChin = smoothstep(0.02, 0.20, yNorm) * smoothstep(0.32, 0.14, yNorm) * smoothstep(0.25, 0.80, frontFace);
      targetMask = subChin;
    } else if (uFaceMode < 2.5) {
      // Zygomatic Cheek Lift
      float cheeks = smoothstep(0.32, 0.48, yNorm) * smoothstep(0.62, 0.48, yNorm) * smoothstep(0.25, 0.75, sideSym) * smoothstep(0.1, 0.6, frontFace);
      targetMask = cheeks;
    } else if (uFaceMode < 3.5) {
      // Frontalis Forehead Smooth
      float brow = smoothstep(0.60, 0.74, yNorm) * smoothstep(0.88, 0.74, yNorm) * smoothstep(0.25, 0.78, frontFace);
      targetMask = brow;
    } else if (uFaceMode < 4.5) {
      // Orbicularis Oculi (Eyes)
      float dEye = length(vec2(sideSym - 0.32, (yNorm - 0.56) * 2.1));
      targetMask = smoothstep(0.24, 0.08, dEye) * smoothstep(0.3, 0.7, frontFace);
    } else if (uFaceMode < 5.5) {
      // Orbicularis Oris (Lips)
      float dLip = length(vec2(1.0 - frontFace, (yNorm - 0.30) * 3.0));
      targetMask = smoothstep(0.34, 0.10, dLip) * smoothstep(0.55, 0.88, frontFace);
    } else if (uFaceMode < 6.5) {
      // Simhasana / Lion Tension Release (Jaw + Buccal + Cheekbones)
      float jawMouth = smoothstep(0.15, 0.42, yNorm) * smoothstep(0.58, 0.34, yNorm) * smoothstep(0.3, 0.8, frontFace);
      targetMask = jawMouth * 0.9;
    } else {
      // Lymphatic Cheek & Jawline Flow
      float lymphArc = smoothstep(0.20, 0.48, yNorm) * smoothstep(0.60, 0.38, yNorm) * smoothstep(0.3, 0.85, sideSym) * smoothstep(0.1, 0.55, frontFace);
      targetMask = lymphArc * 0.8;
    }
    targetMask = clamp(targetMask, 0.0, 1.0);
  } else {
    // 0. Full-Body Ecorche Muscles (Silky high-frequency GymVisual striations!)
    float twist = sin(vUv.y * 8.0 + sin(angleCoord * 2.0)) * 0.25;
    fiberWave = sin((vUv.x * 86.0 + twist) * 6.283185) * 0.5 + 0.5;
    tendonFade = smoothstep(0.05, 0.20, vUv.y) * smoothstep(0.95, 0.80, vUv.y);
    targetMask = uActiveGlow * smoothstep(0.08, 0.34, vUv.y) * smoothstep(0.92, 0.66, vUv.y);
  }

  // Refined satin charcoal ecorche albedo (subtle ~18% striation relief, zero harsh zebra bands!)
  float striationDetail = mix(0.28, 0.64, pow(fiberWave, 1.35)) * tendonFade + (1.0 - tendonFade) * 0.36;
  vec3 inactiveMuscle = mix(vec3(0.075, 0.082, 0.098), vec3(0.165, 0.178, 0.205), striationDetail);

  // Translucent warm coral-terracotta active muscle belly highlight (GymVisual signature look)
  vec3 activeTerracotta = mix(vec3(0.45, 0.14, 0.08), vec3(0.93, 0.41, 0.24), 0.38 + 0.62 * striationDetail);
  vec3 albedo = mix(inactiveMuscle, activeTerracotta, targetMask * (0.76 + 0.16 * uPulse));

  float shadowDepth = uIsFarSide > 0.5 ? 0.72 : 1.0;

  // Crisp studio key + fill + satin specular + silver-white Fresnel silhouette rim
  vec3 lit = albedo * (0.30 + 0.84 * ndotlKey + 0.22 * ndotlFill) * shadowDepth;
  lit += mix(vec3(0.26, 0.29, 0.34), vec3(0.70, 0.45, 0.32), targetMask) * spec * (0.40 + 0.40 * striationDetail);
  lit += mix(vec3(0.44, 0.48, 0.55), vec3(0.92, 0.54, 0.34), targetMask * 0.55) * fresnel * 0.62;
  lit += vec3(0.18, 0.20, 0.24) * rimSpec * shadowDepth;

  gl_FragColor = vec4(lit, 1.0);
}
`;

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('WebGL Shader error:', gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

class EcorcheWebGLStudio {
  constructor() {
    this.glCanvas = document.createElement('canvas');
    this.glCanvas.width = 560;
    this.glCanvas.height = 560;
    const opts = { antialias: true, alpha: false, preserveDrawingBuffer: true };
    this.gl = this.glCanvas.getContext('webgl2', opts) || this.glCanvas.getContext('webgl', opts);
    this.ready = false;

    if (!this.gl) return;

    const gl = this.gl;
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('WebGL link error:', gl.getProgramInfoLog(prog));
      return;
    }

    this.prog = prog;
    gl.useProgram(prog);

    this.locs = {
      aPosition: gl.getAttribLocation(prog, 'aPosition'),
      aNormal: gl.getAttribLocation(prog, 'aNormal'),
      aUv: gl.getAttribLocation(prog, 'aUv'),
      uMVP: gl.getUniformLocation(prog, 'uMVP'),
      uModel: gl.getUniformLocation(prog, 'uModel'),
      uNormalMatrix: gl.getUniformLocation(prog, 'uNormalMatrix'),
      uCameraPos: gl.getUniformLocation(prog, 'uCameraPos'),
      uMaterialType: gl.getUniformLocation(prog, 'uMaterialType'),
      uActiveGlow: gl.getUniformLocation(prog, 'uActiveGlow'),
      uFaceMode: gl.getUniformLocation(prog, 'uFaceMode'),
      uPulse: gl.getUniformLocation(prog, 'uPulse'),
      uIsFarSide: gl.getUniformLocation(prog, 'uIsFarSide'),
    };

    this.meshes = buildAllGeometries(gl);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.02, 0.024, 0.032, 1.0);
    this.ready = true;
  }

  // Resize offscreen WebGL canvas strictly proportionally so w / h ALWAYS matches destW / destH!
  syncProportionalViewport(destW, destH) {
    const safeW = Math.max(96, destW);
    const safeH = Math.max(96, destH);
    const maxDim = Math.max(safeW, safeH);
    const scale = Math.min(1, 768 / maxDim);
    const w = Math.max(96, Math.round(safeW * scale));
    const h = Math.max(96, Math.round(safeH * scale));

    if (this.glCanvas.width !== w || this.glCanvas.height !== h) {
      this.glCanvas.width = w;
      this.glCanvas.height = h;
    }
    return { w, h };
  }

  drawMesh(mesh, modelMat, vpMat, materialType = 0, activeGlow = 0, isFarSide = 0, pulse = 0.5, faceMode = 0) {
    const gl = this.gl;
    const mvp = mat4Multiply(vpMat, modelMat);
    const normMat = mat3NormalFromMat4(modelMat);

    gl.uniformMatrix4fv(this.locs.uMVP, false, mvp);
    gl.uniformMatrix4fv(this.locs.uModel, false, modelMat);
    gl.uniformMatrix3fv(this.locs.uNormalMatrix, false, normMat);
    gl.uniform1f(this.locs.uMaterialType, materialType);
    gl.uniform1f(this.locs.uActiveGlow, activeGlow);
    gl.uniform1f(this.locs.uFaceMode, faceMode);
    gl.uniform1f(this.locs.uPulse, pulse);
    gl.uniform1f(this.locs.uIsFarSide, isFarSide);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.posBuf);
    gl.enableVertexAttribArray(this.locs.aPosition);
    gl.vertexAttribPointer(this.locs.aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normBuf);
    gl.enableVertexAttribArray(this.locs.aNormal);
    gl.vertexAttribPointer(this.locs.aNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuf);
    gl.enableVertexAttribArray(this.locs.aUv);
    gl.vertexAttribPointer(this.locs.aUv, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.idxBuf);
    gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
  }

  renderBodyPoseTo2D(destCtx, destW, destH, pose3D, ballSpec, pulse, compact) {
    if (!this.ready) return false;
    const gl = this.gl;
    const { w, h } = this.syncProportionalViewport(destW, destH);

    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.prog);

    const allPts = [
      pose3D.hips, pose3D.waist, pose3D.chest, pose3D.neck, pose3D.head,
      pose3D.lShoulder, pose3D.lElbow, pose3D.lHand,
      pose3D.rShoulder, pose3D.rElbow, pose3D.rHand,
      pose3D.lKnee, pose3D.lFoot, pose3D.rKnee, pose3D.rFoot,
    ];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    allPts.forEach(([x, y]) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });
    if (ballSpec) {
      minX = Math.min(minX, ballSpec[0] - ballSpec[2]);
      maxX = Math.max(maxX, ballSpec[0] + ballSpec[2]);
      minY = Math.min(minY, ballSpec[1] - ballSpec[2]);
      maxY = Math.max(maxY, ballSpec[1] + ballSpec[2]);
    }
    minY = Math.min(minY, 0);

    const cx = (minX + maxX) * 0.5;
    const cy = (minY + maxY) * 0.5 - (compact ? 0.01 : 0.04);
    const bodySpanW = maxX - minX + 0.35;
    const bodySpanH = maxY - minY + 0.35;
    const aspect = w / h;
    // Account for wide container aspect ratio so tall standing poses never get cropped vertically!
    const neededVertSpan = Math.max(bodySpanH, bodySpanW / Math.max(0.75, aspect));

    const isFront = pose3D.facing === 'front';
    const camYaw = isFront ? 0.28 : 0.52;
    const camPitch = 0.20;
    const dist = Math.max(neededVertSpan, 0.92) * (compact ? 1.50 : 1.66);
    const eye = [
      cx + dist * Math.sin(camYaw) * Math.cos(camPitch),
      cy + dist * Math.sin(camPitch),
      dist * Math.cos(camYaw) * Math.cos(camPitch),
    ];
    const target = [cx, cy, 0];

    const proj = mat4Perspective(34 * Math.PI / 180, aspect, 0.1, 20.0);
    const view = mat4LookAt(eye, target, [0, 1, 0]);
    const vp = mat4Multiply(proj, view);
    gl.uniform3fv(this.locs.uCameraPos, new Float32Array(eye));

    const glow = pose3D.glow || [];
    const has = (tag) => (glow.includes(tag) ? 1.0 : 0.0);

    // 1. Perspective Dark Yoga Mat on floor plane y = 0
    const matScale = Math.max(0.88, (maxX - minX) * 0.72);
    const matM = new Float32Array([
      matScale, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 0.85, 0,
      cx, 0, 0, 1,
    ]);
    this.drawMesh(this.meshes.yogaMat, matM, vp, 2.0, 0, 0, pulse);

    // 2. Stability Ball if present
    if (ballSpec) {
      const [bx, by, br] = ballSpec;
      this.drawMesh(this.meshes.sphere, buildSphereMatrix([bx, by, 0], br, br, br), vp, 3.0, 0, 0, pulse);
    }

    // 3. Legs (Far side L, Near side R — with overlapping hip/knee sockets & patella spheres!)
    this.drawMesh(this.meshes.thigh, buildBoneMatrix(pose3D.lHip, pose3D.lKnee, 0.066, 0.066, [0, 0, 1], 0.03, 0.025), vp, 0.0, Math.max(has('quads'), has('hamstrings')), 1.0, pulse);
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.lKnee, 0.044, 0.044, 0.044), vp, 0.0, 0, 1.0, pulse);
    this.drawMesh(this.meshes.calf, buildBoneMatrix(pose3D.lKnee, pose3D.lFoot, 0.045, 0.045, [0, 0, 1], 0.02, 0.015), vp, 0.0, has('calves'), 1.0, pulse);
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.lFoot, 0.033, 0.024, 0.058), vp, 0.0, 0, 1.0, pulse);

    this.drawMesh(this.meshes.thigh, buildBoneMatrix(pose3D.rHip, pose3D.rKnee, 0.068, 0.068, [0, 0, 1], 0.03, 0.025), vp, 0.0, Math.max(has('quads'), has('hamstrings')), 0.0, pulse);
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.rKnee, 0.046, 0.046, 0.046), vp, 0.0, 0, 0.0, pulse);
    this.drawMesh(this.meshes.calf, buildBoneMatrix(pose3D.rKnee, pose3D.rFoot, 0.047, 0.047, [0, 0, 1], 0.02, 0.015), vp, 0.0, has('calves'), 0.0, pulse);
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.rFoot, 0.034, 0.025, 0.060), vp, 0.0, 0, 0.0, pulse);

    // 4. Sculpted Continuous V-Taper Torso & Seamless White Athletic Compression Shorts
    const lateralHint = isFront
      ? normalize3(sub3(pose3D.rShoulder, pose3D.lShoulder))
      : pose3D.facing === 'quarter'
      ? normalize3([pose3D.rShoulder[0] - pose3D.lShoulder[0], 0, -0.45])
      : [0, 0, -1];

    const torsoStart = [lerp(pose3D.hips[0], pose3D.waist[0], 0.25), lerp(pose3D.hips[1], pose3D.waist[1], 0.25), pose3D.hips[2]];
    this.drawMesh(this.meshes.torso, buildOrientedBoneMatrix(torsoStart, pose3D.chest, 0.138, 0.098, lateralHint, 0.05, 0.03), vp, 0.0, Math.max(has('core'), has('back')), 0.0, pulse);

    const pelvisMid = [lerp(pose3D.hips[0], pose3D.waist[0], 0.42), lerp(pose3D.hips[1], pose3D.waist[1], 0.42), pose3D.hips[2]];
    const hipMid = [(pose3D.lHip[0] + pose3D.rHip[0]) * 0.5, (pose3D.lHip[1] + pose3D.rHip[1]) * 0.5, (pose3D.lHip[2] + pose3D.rHip[2]) * 0.5];
    this.drawMesh(this.meshes.shorts, buildOrientedBoneMatrix(hipMid, pelvisMid, 0.125, 0.098, lateralHint, 0.05, 0.02), vp, 1.0, has('glutes'), 0.0, pulse);

    const lCuff = [lerp(pose3D.lHip[0], pose3D.lKnee[0], 0.36), lerp(pose3D.lHip[1], pose3D.lKnee[1], 0.36), lerp(pose3D.lHip[2], pose3D.lKnee[2], 0.36)];
    const rCuff = [lerp(pose3D.rHip[0], pose3D.rKnee[0], 0.36), lerp(pose3D.rHip[1], pose3D.rKnee[1], 0.36), lerp(pose3D.rHip[2], pose3D.rKnee[2], 0.36)];
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.lHip, 0.072, 0.072, 0.072), vp, 1.0, 0, 0.0, pulse);
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.rHip, 0.074, 0.074, 0.074), vp, 1.0, 0, 0.0, pulse);
    this.drawMesh(this.meshes.shorts, buildBoneMatrix(pose3D.lHip, lCuff, 0.072, 0.070, [0, 0, 1], 0.045, 0.01), vp, 1.0, 0, 0.0, pulse);
    this.drawMesh(this.meshes.shorts, buildBoneMatrix(pose3D.rHip, rCuff, 0.074, 0.072, [0, 0, 1], 0.045, 0.01), vp, 1.0, 0, 0.0, pulse);

    // 5. Continuous Cervical Neck & Anchored Sculpted 3D Head (ZERO floating orb gap!)
    const torsoUp = normalize3(sub3(pose3D.chest, pose3D.hips));
    const headBasePos = [lerp(pose3D.neck[0], pose3D.head[0], 0.48), lerp(pose3D.neck[1], pose3D.head[1], 0.48), lerp(pose3D.neck[2], pose3D.head[2], 0.48)];
    // Neck cylinder extends continuously from chest inside collar up into cranium skull base
    this.drawMesh(this.meshes.armForearm, buildBoneMatrix(pose3D.chest, headBasePos, 0.056, 0.054, [0, 0, 1], 0.04, 0.025), vp, 0.0, 0, 0.0, pulse);

    // Head basis aligned tightly with spine -> head direction & facing anterior!
    const headAxis = normalize3(sub3(pose3D.head, pose3D.chest));
    let headRightHint = lateralHint;
    if (Math.abs(dot3(headAxis, headRightHint)) > 0.92) headRightHint = [1, 0, 0];
    const headFwd = normalize3(cross3(headRightHint, headAxis));
    const headRight = normalize3(cross3(headAxis, headFwd));
    const headMat = buildBasisSphereMatrix(headBasePos, 0.082, 0.106, 0.092, headRight, headAxis, headFwd);
    this.drawMesh(this.meshes.head, headMat, vp, 0.0, 0, 0.0, pulse);

    // 6. Arms & Sculpted Deltoid/Elbow Caps (Left Far, Right Near)
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.lShoulder, 0.056, 0.056, 0.056), vp, 0.0, has('shoulders'), 1.0, pulse);
    this.drawMesh(this.meshes.armUpper, buildBoneMatrix(pose3D.lShoulder, pose3D.lElbow, 0.046, 0.046, [0, 0, 1], 0.025, 0.02), vp, 0.0, has('shoulders'), 1.0, pulse);
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.lElbow, 0.035, 0.035, 0.035), vp, 0.0, 0, 1.0, pulse);
    this.drawMesh(this.meshes.armForearm, buildBoneMatrix(pose3D.lElbow, pose3D.lHand, 0.036, 0.036, [0, 0, 1], 0.02, 0.015), vp, 0.0, has('arms'), 1.0, pulse);
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.lHand, 0.028, 0.022, 0.042), vp, 0.0, 0, 1.0, pulse);

    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.rShoulder, 0.058, 0.058, 0.058), vp, 0.0, has('shoulders'), 0.0, pulse);
    this.drawMesh(this.meshes.armUpper, buildBoneMatrix(pose3D.rShoulder, pose3D.rElbow, 0.048, 0.048, [0, 0, 1], 0.025, 0.02), vp, 0.0, has('shoulders'), 0.0, pulse);
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.rElbow, 0.036, 0.036, 0.036), vp, 0.0, 0, 0.0, pulse);
    this.drawMesh(this.meshes.armForearm, buildBoneMatrix(pose3D.rElbow, pose3D.rHand, 0.038, 0.038, [0, 0, 1], 0.02, 0.015), vp, 0.0, has('arms'), 0.0, pulse);
    this.drawMesh(this.meshes.sphere, buildSphereMatrix(pose3D.rHand, 0.030, 0.023, 0.044), vp, 0.0, 0, 0.0, pulse);

    destCtx.clearRect(0, 0, destW, destH);
    destCtx.drawImage(this.glCanvas, 0, 0, w, h, 0, 0, destW, destH);
    return true;
  }

  renderFaceBustTo2D(destCtx, destW, destH, modeStr, timeSec, compact) {
    if (!this.ready) return false;
    const gl = this.gl;
    const { w, h } = this.syncProportionalViewport(destW, destH);

    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.prog);

    const modeMap = {
      face_jawline: 0,
      face_mewing_chin: 1,
      face_cheek: 2,
      face_forehead: 3,
      face_eyes: 4,
      face_lips: 5,
      face_lion_breath: 6,
      face_lymphatic: 7,
    };
    const modeIdx = modeMap[modeStr] ?? 0;

    // Gentle 3/4 portrait orbit highlighting true human cheekbones, nose bridge, jawline & SCM cords
    const yaw = Math.sin(timeSec * 0.85) * 0.28 + 0.20;
    const pitch = modeIdx === 1 ? -0.10 : 0.06;
    const dist = compact ? 3.9 : 4.25;
    const targetY = compact ? -0.02 : -0.04;
    const eye = [
      dist * Math.sin(yaw) * Math.cos(pitch),
      targetY + dist * Math.sin(pitch),
      dist * Math.cos(yaw) * Math.cos(pitch),
    ];

    const proj = mat4Perspective(32 * Math.PI / 180, w / h, 0.1, 20.0);
    const view = mat4LookAt(eye, [0, targetY, 0], [0, 1, 0]);
    const vp = mat4Multiply(proj, view);
    gl.uniform3fv(this.locs.uCameraPos, new Float32Array(eye));

    const pulse = (Math.sin(timeSec * 2.1) + 1) / 2;
    const bustScale = compact ? 1.05 : 1.0;

    // 1. Cervical Neck, SCM & Clavicle Bust (stationary foundation)
    const neckMat = buildSphereMatrix([0, 0, 0], bustScale, bustScale, bustScale, 0, 0);
    this.drawMesh(this.meshes.faceNeckBust, neckMat, vp, 4.0, 1.0, 0.0, pulse, modeIdx);

    // 2. Articulated Portrait Cranium & Jawline (gently lifts in mewing/double-chin mode)
    const headPitch = modeIdx === 1 ? -0.12 * pulse : Math.sin(timeSec * 1.4) * 0.025;
    const headYaw = modeIdx === 7 ? Math.sin(timeSec * 1.1) * 0.08 : 0;
    const headMat = buildSphereMatrix([0, 0, 0], bustScale, bustScale, bustScale, headYaw, headPitch);
    this.drawMesh(this.meshes.faceHead, headMat, vp, 5.0, 1.0, 0.0, pulse, modeIdx);

    destCtx.clearRect(0, 0, destW, destH);
    destCtx.drawImage(this.glCanvas, 0, 0, w, h, 0, 0, destW, destH);
    return true;
  }
}

let sharedStudioInstance = null;
export function getEcorcheWebGLStudio() {
  if (!sharedStudioInstance && typeof document !== 'undefined') {
    sharedStudioInstance = new EcorcheWebGLStudio();
  }
  return sharedStudioInstance;
}
