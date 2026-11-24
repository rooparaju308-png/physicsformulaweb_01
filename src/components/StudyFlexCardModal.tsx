import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, Share2, X } from 'lucide-react';

interface StudyFlexCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  aspirantName: string;
  level: number;
  focusXp: number;
  streakDays: number;
  knownCount: number;
  totalFormulas: number;
  checklistPct: number;
  totalStudyMinutes: number;
  daysLeft: number;
  resolvedMistakes: number;
}

export const StudyFlexCardModal: React.FC<StudyFlexCardModalProps> = ({
  isOpen,
  onClose,
  aspirantName,
  level,
  focusXp,
  streakDays,
  knownCount,
  totalFormulas,
  checklistPct,
  totalStudyMinutes,
  daysLeft,
  resolvedMistakes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  const studyHours = (totalStudyMinutes / 60).toFixed(1);
  const masteryPct = Math.round((knownCount / Math.max(1, totalFormulas)) * 100);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 620;
    canvas.width = W;
    canvas.height = H;

    // Deep studio gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#050816');
    bgGrad.addColorStop(0.55, '#0b132b');
    bgGrad.addColorStop(1, '#111834');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle engineering grid
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Accent glow circles
    const glow1 = ctx.createRadialGradient(160, 120, 10, 160, 120, 320);
    glow1.addColorStop(0, 'rgba(34, 211, 238, 0.18)');
    glow1.addColorStop(1, 'rgba(34, 211, 238, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, W, H);

    const glow2 = ctx.createRadialGradient(920, 500, 10, 920, 500, 320);
    glow2.addColorStop(0, 'rgba(168, 85, 247, 0.18)');
    glow2.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, W, H);

    // Outer border card
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(28, 28, W - 56, H - 56, 28);
    ctx.stroke();

    // Header
    ctx.fillStyle = '#22d3ee';
    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('JEE PHYSICS WEB — ASPIRANT PROGRESS CARD', 68, 88);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 44px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(aspirantName || 'JEE Aspirant', 68, 148);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `Level ${level}  ·  ${focusXp.toLocaleString()} Focus XP  ·  ${daysLeft} Days to JEE Main`,
      68,
      188
    );

    // 4 Stat Tiles
    const tiles = [
      { label: 'STUDY STREAK', value: `${streakDays} Days`, sub: 'Daily consistency', color: '#f59e0b' },
      { label: 'FORMULA MASTERY', value: `${masteryPct}%`, sub: `${knownCount} / ${totalFormulas} mastered`, color: '#22d3ee' },
      { label: 'SYLLABUS CHECKLIST', value: `${checklistPct}%`, sub: '5-stage completion', color: '#10b981' },
      { label: 'FOCUS LOGGED', value: `${studyHours} hrs`, sub: `${resolvedMistakes} traps resolved`, color: '#a855f7' },
    ];

    const tileW = 224;
    const tileH = 190;
    const startX = 68;
    const tileY = 240;
    const gap = 16;

    tiles.forEach((tile, i) => {
      const tx = startX + i * (tileW + gap);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(tx, tileY, tileW, tileH, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = tile.color;
      ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(tile.label, tx + 20, tileY + 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 42px "JetBrains Mono", monospace';
      ctx.fillText(tile.value, tx + 20, tileY + 108);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(tile.sub, tx + 20, tileY + 150);
    });

    // Bottom bar
    ctx.fillStyle = 'rgba(34, 211, 238, 0.12)';
    ctx.beginPath();
    ctx.roundRect(68, 468, W - 136, 78, 18);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Active Recall · Interactive 3D Labs · Mistake Radar · 29 Chapter Short Notes', 94, 514);
  }, [
    isOpen,
    aspirantName,
    level,
    focusXp,
    streakDays,
    knownCount,
    totalFormulas,
    masteryPct,
    checklistPct,
    studyHours,
    daysLeft,
    resolvedMistakes,
  ]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `jee-physics-progress-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopySummary = async () => {
    const text = [
      `JEE Physics Progress (${aspirantName})`,
      `Streak: ${streakDays} days | Level ${level} (${focusXp} XP)`,
      `Formulas Mastered: ${knownCount}/${totalFormulas} (${masteryPct}%)`,
      `Checklist Completion: ${checklistPct}% | Study Time: ${studyHours} hrs`,
      `Traps Resolved: ${resolvedMistakes} | Target Countdown: ${daysLeft} days`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-5 space-y-4 shadow-2xl text-white"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold">Shareable Study Flex Card</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          <canvas ref={canvasRef} className="w-full h-auto block" />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleCopySummary}
            className="min-h-[42px] px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Summary Copied' : 'Copy Text Summary'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="min-h-[42px] px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            <span>Download PNG Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
