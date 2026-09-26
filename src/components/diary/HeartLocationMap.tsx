import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Compass, Navigation, ExternalLink, Copy, Check, 
  Layers, Maximize2, Minimize2, Radio, Wind, Sparkles 
} from 'lucide-react';
import { DiaryLocation } from '../../types';

interface HeartLocationMapProps {
  location: DiaryLocation;
  variant?: 'compact' | 'card' | 'expanded';
  className?: string;
  onSelectCoordinate?: (loc: DiaryLocation) => void;
}

// Sobu High Clubroom reference coordinates (Center of Oregairu world)
const SOBU_HIGH = { lat: 35.6375, lng: 140.0982, name: '千叶市立总武高校' };

// Calculate approximate distance between two points in km (Haversine Formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const HeartLocationMap: React.FC<HeartLocationMapProps> = ({
  location,
  variant = 'card',
  className = '',
  onSelectCoordinate
}) => {
  const [copied, setCopied] = useState(false);
  const [mapMode, setMapMode] = useState<'blueprint' | 'radar'>('blueprint');
  const [isZoomed, setIsZoomed] = useState(false);

  const distanceToClub = calculateDistance(
    location.lat, 
    location.lng, 
    SOBU_HIGH.lat, 
    SOBU_HIGH.lng
  );

  const handleCopyCoord = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

  // Formatting coordinates to Degree-Minute-Second style
  const formatDMS = (coord: number, isLat: boolean) => {
    const absCoord = Math.abs(coord);
    const deg = Math.floor(absCoord);
    const minFloat = (absCoord - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.floor((minFloat - min) * 60);
    const dir = isLat ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${deg}°${min}'${sec}"${dir}`;
  };

  // 1. Compact Pill for list headers & tags
  if (variant === 'compact') {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50/80 hover:bg-sky-100/80 border border-sky-200/60 text-sky-700 text-[11px] font-mono transition-colors cursor-pointer group ${className}`}
        title={`心之所属地：${location.name} (${formatDMS(location.lat, true)}, ${formatDMS(location.lng, false)})`}
        onClick={() => onSelectCoordinate?.(location)}
      >
        <MapPin className="w-3.5 h-3.5 text-sky-500 group-hover:scale-110 transition-transform shrink-0" />
        <span className="font-sans font-medium text-slate-700 truncate max-w-[140px] sm:max-w-[200px]">
          {location.name}
        </span>
        <span className="text-[10px] text-sky-500 hidden sm:inline">
          · {distanceToClub === 0 ? '侍奉部原地' : `距部室${distanceToClub}km`}
        </span>
      </div>
    );
  }

  // 2. Card Variant (Integrated inside Diary Card stream)
  return (
    <div 
      className={`rounded-2xl border border-sky-100/90 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white shadow-sm relative group/map ${className}`}
    >
      {/* Dynamic Vector Map Canvas Background */}
      <div className="relative h-28 sm:h-32 w-full overflow-hidden select-none">
        {/* SVG Topographic & Grid Map Simulation */}
        <svg 
          viewBox="0 0 500 200" 
          className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover/map:scale-105"
        >
          <defs>
            <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid lines */}
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          {/* Simulated Coastline of Tokyo Bay / Chiba Port */}
          <path
            d="M -20,180 Q 80,120 180,140 T 320,110 T 420,150 T 520,130 L 520,220 L -20,220 Z"
            fill="rgba(14, 165, 233, 0.08)"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="1.2"
          />

          {/* Secondary Topo Elevation Rings */}
          <ellipse cx="260" cy="90" rx="90" ry="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <ellipse cx="260" cy="90" rx="140" ry="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
          <line x1="260" y1="0" x2="260" y2="200" stroke="rgba(56, 189, 248, 0.15)" strokeDasharray="2 4" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(56, 189, 248, 0.15)" strokeDasharray="2 4" />

          {/* Sobu High Reference Pin */}
          <circle cx="160" cy="65" r="3" fill="#94a3b8" />
          <text x="170" y="68" fill="#94a3b8" fontSize="8" fontFamily="monospace">总武高</text>
          <line x1="160" y1="65" x2="260" y2="90" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Radar scan cone effect */}
          {mapMode === 'radar' && (
            <circle cx="260" cy="90" r="70" fill="url(#radar-glow)" />
          )}

          {/* Target Location Pulse Pin */}
          <circle cx="260" cy="90" r="14" fill="rgba(56, 189, 248, 0.2)" className="animate-ping" style={{ transformOrigin: '260px 90px' }} />
          <circle cx="260" cy="90" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="shadow-md" />
          <circle cx="260" cy="90" r="2" fill="#0f172a" />
        </svg>

        {/* HUD Overlay Top Bar */}
        <div className="absolute top-2 inset-x-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-mono text-sky-300">
            <Radio className="w-2.5 h-2.5 text-sky-400 animate-pulse" />
            <span>心之所属地 · 场景测绘</span>
          </div>

          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              onClick={() => setMapMode(m => m === 'blueprint' ? 'radar' : 'blueprint')}
              className="px-1.5 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-[9px] font-mono text-slate-300 border border-white/10 transition-colors"
              title="切换测绘雷达视图"
            >
              {mapMode === 'blueprint' ? '测绘网格' : '雷达侦测'}
            </button>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="在外部地图查看真实街景"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* HUD Overlay Bottom Coordinates */}
        <div className="absolute bottom-2 left-2.5 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-300 border border-white/10">
            <Compass className="w-3 h-3 text-sky-400" />
            <span>{formatDMS(location.lat, true)}</span>
            <span className="text-slate-500">·</span>
            <span>{formatDMS(location.lng, false)}</span>
          </div>

          {location.city && (
            <span className="hidden sm:inline-block text-[10px] text-slate-400 font-sans bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
              {location.city}
            </span>
          )}
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-2 right-2.5 pointer-events-none">
          <div className="flex items-center gap-1 bg-sky-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-sky-300 border border-sky-500/30">
            <Navigation className="w-2.5 h-2.5 rotate-45 text-sky-400" />
            <span>{distanceToClub === 0 ? '侍奉部部室中心' : `距总武高 ${distanceToClub} km`}</span>
          </div>
        </div>
      </div>

      {/* Map Bottom Metadata & Atmosphere Banner */}
      <div className="p-3 bg-slate-900/90 backdrop-blur-sm border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-editorial-mincho truncate">{location.name}</span>
            {location.landmark && (
              <span className="text-[10px] text-slate-400 font-normal font-sans hidden sm:inline truncate">
                · {location.landmark}
              </span>
            )}
          </div>
          {location.atmosphere && (
            <p className="text-[11px] text-sky-300/80 font-light mt-0.5 flex items-center gap-1">
              <Wind className="w-3 h-3 text-sky-400/80 shrink-0" />
              <span className="italic truncate">“{location.atmosphere}”</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleCopyCoord}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20 text-slate-200 text-[10px] font-mono flex items-center gap-1 transition-all"
            title="复制经纬度坐标"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">已复制坐标</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>复制经纬度</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
