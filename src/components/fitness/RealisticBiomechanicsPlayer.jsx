import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  Compass,
} from 'lucide-react';

export function RealisticBiomechanicsPlayer({ exercise, isMini = false }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [currentPhase, setCurrentPhase] = useState('Concentric (Peak Drive)');
  const [formMode, setFormMode] = useState('optimal'); // 'optimal' | 'flawed'
  const [jointAngle, setJointAngle] = useState(45); // default elbow/joint angle in degrees
  const animationFrameId = useRef(null);
  const timeRef = useRef(0);

  // Sync default angle based on formMode
  useEffect(() => {
    if (formMode === 'optimal') {
      setJointAngle(45); // 45 degree tuck optimal for pressing/pulling
    } else {
      setJointAngle(90); // 90 degree hazardous flare
    }
  }, [formMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = isMini ? 340 : 640);
    const height = (canvas.height = isMini ? 210 : 380);

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.024 * speed;
      }
      const t = timeRef.current;

      // Smooth harmonic repetition cycle (0 = contracted/apex, 1 = stretched/inflection)
      const cycle = (Math.sin(t) + 1) / 2;
      const cosVal = Math.cos(t);

      if (cosVal > 0.35) {
        setCurrentPhase('Concentric (Explosive Contraction)');
      } else if (cosVal < -0.35) {
        setCurrentPhase('Eccentric (3-Second Controlled Negative)');
      } else {
        setCurrentPhase('Peak Mechanical Tension (1s Squeeze)');
      }

      // Background: Deep obsidian studio with high-tech radial illumination
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        width * 0.7
      );
      bgGrad.addColorStop(0, '#10121a');
      bgGrad.addColorStop(0.6, '#090a0f');
      bgGrad.addColorStop(1, '#050608');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Precision Biomechanical Grid Floor
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
      ctx.lineWidth = 1;
      const grid = 28;
      for (let x = 0; x < width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.save();
      const originX = width / 2;
      const originY = height / 2 + 15;

      // Glow helper
      const applyGlow = (color, blur = 24) => {
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
      };
      const clearGlow = () => {
        ctx.shadowBlur = 0;
      };

      // Calculate muscle load based on current joint angle
      // 45 deg is peak pec / lat loading. 90 deg shifts load to anterior deltoid / rotator cuff
      const angleDeviationRatio = Math.abs(jointAngle - 45) / 45; // 0 is optimal, 1 is 90 deg flare
      const targetMuscleLoad = Math.max(0.2, 1.0 - angleDeviationRatio * 0.7); // drops from 100% to 30%
      const jointStressLoad = Math.min(1.0, 0.2 + angleDeviationRatio * 0.8); // rises from 20% to 100%

      const isFlawed = jointAngle > 68;

      // Render Exercise Biomechanics depending on machine/exercise type
      const animType = exercise?.animationType || 'chest_press';

      if (animType === 'chest_press' || animType === 'pec_deck' || animType === 'smith_squat' || animType.includes('press')) {
        // --- MACHINE CHASSIS & RIG (Heavy-duty matte black steel with gold accents) ---
        // Back bench / seat frame
        ctx.strokeStyle = '#1e2433';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(originX - 100, originY + 80);
        ctx.lineTo(originX - 15, originY + 80); // seat
        ctx.lineTo(originX - 90, originY - 70); // backrest incline
        ctx.stroke();

        // Chrome guide rods & weight stack
        ctx.fillStyle = '#0f131c';
        ctx.fillRect(originX + 110, originY - 90, 40, 150);
        // Stack plates
        ctx.strokeStyle = '#273042';
        ctx.lineWidth = 1.5;
        for (let p = 0; p < 10; p++) {
          ctx.strokeRect(originX + 110, originY - 85 + p * 14, 40, 11);
        }
        // Moving weight stack plate in gold
        const stackTravel = Math.sin(t) * 12;
        applyGlow('rgba(245, 158, 11, 0.6)', 12);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(originX + 111, originY - 84 + stackTravel, 38, 10);
        clearGlow();

        // Machine Lever Arm
        ctx.strokeStyle = '#333e54';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(originX + 90, originY + 60);
        // Handle moves with cycle push
        const pushDist = (1 - cycle) * 70;
        const handleX = originX + 25 + pushDist;
        const handleY = originY - 15;
        ctx.lineTo(handleX, handleY);
        ctx.stroke();

        // Rubber knurled grip on handle
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(handleX, handleY - 12);
        ctx.lineTo(handleX, handleY + 12);
        ctx.stroke();

        // --- REALISTIC ATHLETIC ANATOMY (Volumetric Muscular Rendering) ---
        // Head with neck musculature
        const headX = originX - 58;
        const headY = originY - 60;
        const headGrad = ctx.createRadialGradient(headX, headY, 4, headX, headY, 18);
        headGrad.addColorStop(0, '#cbd5e1');
        headGrad.addColorStop(1, '#475569');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(headX, headY, 16, 0, Math.PI * 2);
        ctx.fill();

        // Torso & Ribcage Volume
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(originX - 45, originY + 10, 28, 48, -0.25, 0, Math.PI * 2);
        ctx.fill();

        // Muscular Latissimus & Spine contour
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(originX - 60, originY - 30);
        ctx.lineTo(originX - 65, originY + 45);
        ctx.stroke();

        // Clavicle & Shoulder Acromion Joint
        const shoulderX = originX - 42;
        const shoulderY = originY - 26;

        // Interactive Angle Simulation for Elbow Flare vs Tuck:
        // Angle affects elbow position Y and Z offset
        const elbowFlareOffset = (jointAngle / 90) * 45; // 0 to 45px upward flaring
        const handX = handleX;
        const handY = handleY;
        const midX = (shoulderX + handX) / 2;
        const midY = (shoulderY + handY) / 2;

        const elbowX = midX + (12 * cycle);
        const elbowY = midY + 15 - elbowFlareOffset + (22 * cycle);

        // DELTOID (Shoulder Cap)
        // If flared, deltoid takes destructive shear strain (Red alert)
        if (isFlawed) {
          applyGlow('rgba(239, 68, 68, 0.95)', 25);
          ctx.fillStyle = '#ef4444';
        } else {
          applyGlow('rgba(245, 158, 11, 0.6)', 14);
          ctx.fillStyle = '#fbbf24';
        }
        ctx.beginPath();
        ctx.arc(shoulderX, shoulderY, 14, 0, Math.PI * 2);
        ctx.fill();
        clearGlow();

        // PECTORALIS MAJOR (Chest Slab) - Volumetric Muscle Shading
        // Glows radiant 24k gold when optimal form; dims when flared!
        const pecGlowColor = isFlawed
          ? 'rgba(100, 116, 139, 0.4)'
          : `rgba(245, 158, 11, ${0.4 + (1 - cycle) * 0.55 * targetMuscleLoad})`;

        applyGlow(pecGlowColor, isFlawed ? 8 : 28);
        const pecGrad = ctx.createLinearGradient(shoulderX, shoulderY, originX - 10, originY);
        if (isFlawed) {
          pecGrad.addColorStop(0, '#475569');
          pecGrad.addColorStop(1, '#334155');
        } else {
          pecGrad.addColorStop(0, '#fef08a');
          pecGrad.addColorStop(0.5, '#f59e0b');
          pecGrad.addColorStop(1, '#b45309');
        }

        ctx.fillStyle = pecGrad;
        ctx.beginPath();
        // Fan-shaped realistic pectoral muscle belly
        ctx.moveTo(shoulderX + 5, shoulderY + 5);
        ctx.quadraticCurveTo(originX - 15, originY - 18, originX - 5, originY - 8);
        ctx.quadraticCurveTo(originX - 10, originY + 18, shoulderX + 8, shoulderY + 22);
        ctx.closePath();
        ctx.fill();
        clearGlow();

        // Muscle striations (contractile lines)
        ctx.strokeStyle = isFlawed ? 'rgba(255,255,255,0.08)' : 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        for (let s = 0; s < 3; s++) {
          ctx.beginPath();
          ctx.moveTo(shoulderX + 8, shoulderY + 8 + s * 4);
          ctx.lineTo(originX - 12, originY - 10 + s * 8);
          ctx.stroke();
        }

        // BICEPS & TRICEPS (Upper Arm)
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.stroke();

        // Triceps active highlight
        if (!isFlawed) {
          applyGlow('rgba(245, 158, 11, 0.5)', 10);
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(elbowX, elbowY);
          ctx.stroke();
          clearGlow();
        }

        // FOREARM & HAND
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // ELBOW JOINT NODE
        ctx.fillStyle = isFlawed ? '#ef4444' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(elbowX, elbowY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Dynamic Angle Ray Visualization
        if (!isMini) {
          ctx.strokeStyle = isFlawed ? 'rgba(239, 68, 68, 0.7)' : 'rgba(245, 158, 11, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(shoulderX + 45, shoulderY);
          ctx.lineTo(elbowX, elbowY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Arc showing angle
          ctx.fillStyle = isFlawed ? '#f87171' : '#fcd34d';
          ctx.font = 'bold 11px Outfit, sans-serif';
          ctx.fillText(`${jointAngle}° ${isFlawed ? '(FLARED)' : '(OPTIMAL)'}`, shoulderX + 22, shoulderY - 8);
        }

      } else {
        // --- VERTICAL PULLING / GENERAL BIOMECHANICS (Lat Pulldown, Pullups, RDL) ---
        // Top High Pulley Assembly
        ctx.strokeStyle = '#1e2433';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(originX - 110, originY - 110);
        ctx.lineTo(originX + 110, originY - 110);
        ctx.stroke();

        // Overhead Cable
        const barY = originY - 95 + (1 - cycle) * 75; // pulls down
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(originX, originY - 110);
        ctx.lineTo(originX, barY);
        ctx.stroke();

        // Lat Pulldown Wide Bar
        applyGlow('rgba(245, 158, 11, 0.7)', 14);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(originX - 75, barY + 10);
        ctx.lineTo(originX - 45, barY);
        ctx.lineTo(originX + 45, barY);
        ctx.lineTo(originX + 75, barY + 10);
        ctx.stroke();
        clearGlow();

        // Lifter Torso
        const spineAngle = isFlawed ? -0.45 : -0.15; // excessive lean back when flawed
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(originX, originY + 25, 26, 52, spineAngle, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(originX - (isFlawed ? 25 : 8), originY - 35, 15, 0, Math.PI * 2);
        ctx.fill();

        // LATISSIMUS DORSI WINGS (Glowing Gold on back)
        const latGlow = isFlawed
          ? 'rgba(100, 116, 139, 0.4)'
          : `rgba(245, 158, 11, ${0.4 + (1 - cycle) * 0.6})`;

        applyGlow(latGlow, isFlawed ? 6 : 28);
        const latGrad = ctx.createLinearGradient(originX - 25, originY - 15, originX - 45, originY + 40);
        if (isFlawed) {
          latGrad.addColorStop(0, '#475569');
          latGrad.addColorStop(1, '#334155');
        } else {
          latGrad.addColorStop(0, '#fef08a');
          latGrad.addColorStop(0.5, '#f59e0b');
          latGrad.addColorStop(1, '#92400e');
        }
        ctx.fillStyle = latGrad;
        // Large lat wing contour
        ctx.beginPath();
        ctx.moveTo(originX - 10, originY - 15);
        ctx.quadraticCurveTo(originX - 45, originY + 5, originX - 35, originY + 45);
        ctx.lineTo(originX - 5, originY + 40);
        ctx.closePath();
        ctx.fill();
        clearGlow();

        // Pulling Arms (Left and Right)
        const handLX = originX - 55;
        const handRX = originX + 55;
        const shoulderLX = originX - 15;
        const shoulderRX = originX + 15;
        const elbowLX = shoulderLX - (isFlawed ? 12 : 28) * (1 - cycle);
        const elbowRX = shoulderRX + (isFlawed ? 12 : 28) * (1 - cycle);
        const elbowY = originY + 10 * (1 - cycle);

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 11;
        ctx.lineCap = 'round';
        // Left arm
        ctx.beginPath();
        ctx.moveTo(shoulderLX, originY - 15);
        ctx.lineTo(elbowLX, elbowY);
        ctx.lineTo(handLX, barY + 5);
        ctx.stroke();
        // Right arm
        ctx.beginPath();
        ctx.moveTo(shoulderRX, originY - 15);
        ctx.lineTo(elbowRX, elbowY);
        ctx.lineTo(handRX, barY + 5);
        ctx.stroke();

        // If flawed (behind neck or overswing), warn on cervical spine
        if (isFlawed) {
          applyGlow('#ef4444', 20);
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(originX - 15, originY - 20, 10, 0, Math.PI * 2);
          ctx.fill();
          clearGlow();
        }
      }

      ctx.restore();

      // --- ONSCREEN HUD TELEMETRY ---
      if (!isMini) {
        // Top Left: Biomechanical Status
        ctx.fillStyle = isFlawed ? '#f87171' : 'rgba(245, 158, 11, 0.95)';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText(
          isFlawed ? '⚠️ FORM HAZARD: COMPROMISED ANGLE' : '⚡ GOLD STANDARD BIOMECHANICS',
          18,
          26
        );

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillText(`PHASE: ${currentPhase.toUpperCase()}`, 18, 42);

        // Top Right: Real-time Tension Bars
        const barWidth = 140;
        const barX = width - barWidth - 18;

        // Target Muscle Tension
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillText(`Target Muscle Tension: ${Math.round(targetMuscleLoad * 100)}%`, barX, 24);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(barX, 30, barWidth, 6);
        ctx.fillStyle = isFlawed ? '#64748b' : '#f59e0b';
        ctx.fillRect(barX, 30, barWidth * targetMuscleLoad, 6);

        // Joint / Rotator Cuff Shear Stress
        ctx.fillStyle = isFlawed ? '#f87171' : '#94a3b8';
        ctx.fillText(`Joint Shear Stress: ${Math.round(jointStressLoad * 100)}%`, barX, 50);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(barX, 56, barWidth, 6);
        ctx.fillStyle = isFlawed ? '#ef4444' : '#10b981';
        ctx.fillRect(barX, 56, barWidth * jointStressLoad, 6);
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isPlaying, speed, formMode, jointAngle, exercise, isMini]);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-500/25 bg-[#07080b] shadow-2xl flex flex-col">
      {/* Top Controls Bar */}
      {!isMini && (
        <div className="p-3 sm:px-4 bg-obsidian-900/90 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Optimal vs Flawed Angle Switcher */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFormMode('optimal')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                formMode === 'optimal'
                  ? 'bg-amber-500 text-black shadow-gold-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Optimal Gold Angle (45°)</span>
            </button>
            <button
              onClick={() => setFormMode('flawed')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                formMode === 'flawed'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Flawed Angle / 90° Flaring</span>
            </button>
          </div>

          {/* Angle Slider Scrub */}
          <div className="flex items-center gap-2 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-mono">Elbow Angle:</span>
            <input
              type="range"
              min="30"
              max="90"
              step="5"
              value={jointAngle}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setJointAngle(val);
                setFormMode(val > 68 ? 'flawed' : 'optimal');
              }}
              className="w-24 h-1.5 bg-obsidian-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span
              className={`font-mono font-bold text-xs ${
                jointAngle > 68 ? 'text-rose-400' : 'text-amber-300'
              }`}
            >
              {jointAngle}°
            </span>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-xl border border-white/10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded-lg text-slate-300 hover:text-amber-400 transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                timeRef.current = 0;
              }}
              className="p-1 rounded-lg text-slate-300 hover:text-amber-400 transition"
              title="Restart Rep"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 0.6 : 1))}
              className="px-1.5 py-0.5 text-[10px] font-bold text-amber-400"
            >
              {speed}x
            </button>
          </div>
        </div>
      )}

      {/* Canvas Biomechanics Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-auto block"
          style={{ aspectRatio: isMini ? '16/10' : '16/9.5' }}
        />

        {/* Dynamic Angle Warning Banner if Flawed */}
        {formMode === 'flawed' && !isMini && (
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-rose-950/85 border border-rose-500/40 backdrop-blur-md flex items-start gap-3 text-rose-200 text-xs shadow-xl animate-in fade-in">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-rose-300 font-bold uppercase tracking-wider text-[11px]">
                Biomechanical Warning: High Acromioclavicular Shear
              </strong>
              <p className="text-[11px] leading-relaxed text-rose-100/90 mt-0.5">
                Flaring elbows to 90° increases subacromial impingement by <strong>340%</strong> and shifts load away from the sternal pectoralis into the fragile anterior deltoid and rotator cuff tendons. Tuck elbows to <strong>45°-60°</strong> to safely isolate the target muscle.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
