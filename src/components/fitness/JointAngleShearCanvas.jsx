import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  Compass,
  Lightbulb,
  Zap,
  Activity,
  RotateCcw,
} from 'lucide-react';

export function JointAngleShearCanvas({ exercise }) {
  const canvasRef = useRef(null);
  const [jointAngle, setJointAngle] = useState(45); // default 45° optimal tuck
  const [formMode, setFormMode] = useState('optimal'); // 'optimal' | 'flawed'
  const timeRef = useRef(0);
  const animRef = useRef(null);

  const isHazard = jointAngle > 65;

  const handleModeToggle = (mode) => {
    setFormMode(mode);
    if (mode === 'optimal') {
      setJointAngle(45);
    } else {
      setJointAngle(90);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = 720);
    const height = (canvas.height = 420);

    const render = () => {
      timeRef.current += 0.025;
      const t = timeRef.current;
      const cycle = (Math.sin(t) + 1) / 2; // 0 = peak contracted, 1 = stretched

      // Background: Deep obsidian
      ctx.fillStyle = '#08090C';
      ctx.fillRect(0, 0, width, height);

      // Subtle tech grid
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Origin center for athletic torso
      const originX = width * 0.42;
      const originY = height * 0.52;

      // Bench representation
      ctx.save();
      ctx.fillStyle = '#141824';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(originX - 160, originY + 30, 260, 28, 8);
      ctx.fill();
      ctx.stroke();

      // Bench leg
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(originX - 140, originY + 58, 14, 90);
      ctx.fillRect(originX + 60, originY + 58, 14, 90);
      ctx.restore();

      // Head & Neck
      const headX = originX - 100;
      const headY = originY - 15;
      const headGrad = ctx.createRadialGradient(headX, headY, 6, headX, headY, 26);
      headGrad.addColorStop(0, '#e2e8f0');
      headGrad.addColorStop(1, '#334155');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(headX, headY, 24, 0, Math.PI * 2);
      ctx.fill();

      // Torso / Ribcage
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(originX - 40, originY + 10, 48, 70, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Shoulder Joint (Glenohumeral / Acromion)
      const shoulderX = originX - 45;
      const shoulderY = originY - 20;

      // Hand trajectory (press stroke)
      const pressStroke = (1 - cycle) * 90;
      const handX = originX + 40 + pressStroke * 0.7;
      const handY = originY - 60 - pressStroke * 0.4;

      // ELBOW POSITION DYNAMICALLY CALCULATED FROM jointAngle:
      // When jointAngle = 45° (optimal), elbow stays tucked down in natural scapular plane
      // When jointAngle = 90° (hazard), elbow flares WAY UP into dangerous impingement line!
      const flareRatio = (jointAngle - 30) / 60; // 0 at 30°, 1 at 90°
      const elbowBaseX = (shoulderX + handX) * 0.5;
      const elbowBaseY = (shoulderY + handY) * 0.5 + 25; // default tucked position
      const elbowFlaredY = elbowBaseY - 65 * flareRatio; // flares upward into shoulder plane!
      const elbowFlaredX = elbowBaseX - 25 * flareRatio;

      const elbowX = elbowFlaredX + Math.sin(t) * 4;
      const elbowY = elbowFlaredY + Math.cos(t) * 4;

      // Upper arm bone (Humerus)
      ctx.strokeStyle = isHazard ? '#f43f5e' : '#94a3b8';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(elbowX, elbowY);
      ctx.stroke();

      // Forearm
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(elbowX, elbowY);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      // Dumbbell in Hand
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(handX - 8, handY - 28, 16, 56, 4);
      ctx.fill();

      // Dumbbell shaft
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(handX - 20, handY);
      ctx.lineTo(handX + 20, handY);
      ctx.stroke();

      // Dumbbell outer plates
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.roundRect(handX - 22, handY - 22, 6, 44, 2);
      ctx.roundRect(handX + 16, handY - 22, 6, 44, 2);
      ctx.fill();

      // PECTORALIS MUSCLE BELLY (Target Fiber Alignment)
      // When optimal (45°), glows radiant 24k gold. When flared (90°), goes cold/gray as chest loses tension!
      const pecGrad = ctx.createLinearGradient(shoulderX, shoulderY, originX + 10, originY);
      if (isHazard) {
        pecGrad.addColorStop(0, '#475569');
        pecGrad.addColorStop(1, '#334155');
      } else {
        pecGrad.addColorStop(0, '#fef08a');
        pecGrad.addColorStop(0.5, '#f59e0b');
        pecGrad.addColorStop(1, '#b45309');
      }

      ctx.fillStyle = pecGrad;
      ctx.shadowColor = isHazard ? 'transparent' : 'rgba(251, 191, 36, 0.6)';
      ctx.shadowBlur = isHazard ? 0 : 25;
      ctx.beginPath();
      ctx.moveTo(shoulderX + 8, shoulderY);
      ctx.quadraticCurveTo(originX - 10, originY - 35, originX + 20, originY - 10);
      ctx.quadraticCurveTo(originX + 10, originY + 25, shoulderX + 10, shoulderY + 25);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // ANTERIOR DELTOID CAP (Strain Point)
      // If flared, deltoid takes destructive shear strain (Red alert pulse)
      ctx.fillStyle = isHazard ? '#ef4444' : '#fbbf24';
      ctx.shadowColor = isHazard ? '#ef4444' : '#fbbf24';
      ctx.shadowBlur = isHazard ? 20 : 8;
      ctx.beginPath();
      ctx.arc(shoulderX, shoulderY, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // ELBOW JOINT NODE
      ctx.fillStyle = isHazard ? '#f43f5e' : '#34d399';
      ctx.beginPath();
      ctx.arc(elbowX, elbowY, 8, 0, Math.PI * 2);
      ctx.fill();

      // ANGLE VECTOR ARC OVERLAY
      ctx.strokeStyle = isHazard ? '#f43f5e' : '#10b981';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(shoulderX + 70, shoulderY);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(shoulderX, shoulderY, 35, 0, (jointAngle * Math.PI) / 180, true);
      ctx.stroke();

      // Angle indicator label
      ctx.fillStyle = isHazard ? '#f43f5e' : '#34d399';
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${jointAngle}°`, shoulderX + 42, shoulderY - 12);

      // SHEAR STRAIN HUD TELEMETRY IN TOP RIGHT OF CANVAS
      const shearPercent = isHazard ? Math.min(98, 40 + (jointAngle - 65) * 2.3) : Math.max(8, 12 + (jointAngle - 30) * 0.4);
      const chestTension = isHazard ? Math.max(28, 92 - (jointAngle - 65) * 2.5) : Math.min(96, 75 + (jointAngle - 30) * 1.2);

      // Mini Telemetry Box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.strokeStyle = isHazard ? 'rgba(244, 63, 94, 0.5)' : 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(width - 240, 20, 220, 115, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isHazard ? '#fda4af' : '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(isHazard ? '⚠️ AC JOINT SHEAR: HAZARDOUS' : '✓ BIOMECHANICAL ALIGNMENT: OPTIMAL', width - 225, 42);

      // Shear meter bar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(width - 225, 52, 190, 8);
      ctx.fillStyle = isHazard ? '#f43f5e' : '#10b981';
      ctx.fillRect(width - 225, 52, (shearPercent / 100) * 190, 8);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`Joint Shear Strain: ${Math.round(shearPercent)}%`, width - 225, 75);
      ctx.fillText(`Pectoral Mechanical Tension: ${Math.round(chestTension)}%`, width - 225, 92);
      ctx.fillText(`Subacromial Clearance: ${isHazard ? '2.1 mm (Pinching)' : '6.4 mm (Safe)'}`, width - 225, 109);
    };

    let animationId;
    const loop = () => {
      render();
      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationId);
  }, [jointAngle, isHazard]);

  return (
    <div className="space-y-6">
      {/* Interactive Biomechanical Simulator Card */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/25 bg-[#08090C] shadow-2xl flex flex-col">
        {/* Top Telemetry Header */}
        <div className="p-4 sm:px-6 bg-obsidian-900/95 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">
              Live Joint Angle & Subacromial Shear Simulator
            </h3>
          </div>

          {/* Mode Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleModeToggle('optimal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                formMode === 'optimal'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-bold'
                  : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              🟢 45° Optimal Tuck
            </button>
            <button
              onClick={() => handleModeToggle('flawed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                formMode === 'flawed'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm font-bold'
                  : 'bg-black/40 text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              🔴 90° Flared Risk
            </button>
          </div>
        </div>

        {/* Live Canvas Area */}
        <div className="relative w-full overflow-hidden bg-[#08090C] flex items-center justify-center p-2">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-w-full rounded-2xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
          />

          {/* Floating Live Alert Badge */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <div
              className={`p-3 rounded-2xl border backdrop-blur-md shadow-xl transition-all duration-300 flex items-center justify-between gap-3 ${
                isHazard
                  ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                  : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isHazard ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">
                    {isHazard
                      ? `Hazard Alert: Dangerous ${jointAngle}° Joint Flare`
                      : `Safe Alignment: Optimal ${jointAngle}° Scapular Plane`}
                  </span>
                  <span className="text-[11px] opacity-85 block">
                    {isHazard
                      ? 'Subacromial space compresses to 2.1mm · Supraspinatus tendon pinching · Chest tension drops to ~31%'
                      : 'Zero joint impingement · 94% mechanical tension focused directly across target pectoral fibers'}
                  </span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-white/10 font-mono text-sm font-extrabold shrink-0 text-amber-300">
                {jointAngle}° Track
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Slider Bar */}
        <div className="p-4 sm:p-5 bg-obsidian-900/95 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              Interactive Elbow / Joint Angle Slider (Drag to test biomechanics):
            </span>
            <span className="font-mono text-amber-300 font-bold text-sm">{jointAngle}°</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-emerald-400 font-mono font-semibold shrink-0">
              30° Tuck (Safe)
            </span>
            <input
              type="range"
              min="30"
              max="90"
              step="5"
              value={jointAngle}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setJointAngle(val);
                setFormMode(val > 65 ? 'flawed' : 'optimal');
              }}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-xs text-rose-400 font-mono font-semibold shrink-0">
              90° Flare (Hazard)
            </span>
          </div>
        </div>
      </div>

      {/* Common Pitfalls & Injury Hazards */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Common Form Pitfalls & Injury Hazards
          </h4>
          <div className="space-y-2">
            {exercise?.commonMistakes?.map((mistake, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs sm:text-sm"
              >
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        {exercise?.proTip && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                Elite Biomechanics Pro Tip
              </strong>
              <p className="text-xs sm:text-sm leading-relaxed">{exercise.proTip}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
