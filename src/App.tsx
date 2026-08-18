import { useState, useEffect, useRef } from "react";

type Screen =
  | "splash"
  | "upload"
  | "history"
  | "inventory"
  | "newpurchase"
  | "analysis"
  | "alerts"
  | "optimized"
  | "dashboard";

type NavTab = "inicio" | "compras" | "inventario" | "perfil";

// ─── Palette constants ────────────────────────────────────────────────────────
const NAVY = "#0A1628";
const NAVY2 = "#0F2040";
const NAVY3 = "#0F2D6B";
const GREEN = "#00C16E";
const GREEN_LIGHT = "#E6FFF5";
const WHITE = "#FFFFFF";
const GRAY = "#F0F4FF";
const GRAY2 = "#E2E8F4";
const SLATE = "#64748B";
const RED_SOFT = "#FFF1F0";
const RED = "#E53935";
const AMBER = "#F59E0B";
const AMBER_LIGHT = "#FFFBEB";

// ─── Logo ─────────────────────────────────────────────────────────────────────
function FinovaIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="13" fill={GREEN} />
      <path
        d="M24 33V16"
        stroke={WHITE}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M24 16L17 23"
        stroke={WHITE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 16L31 23"
        stroke={WHITE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="35" r="6" fill={WHITE} opacity="0.2" />
      <circle cx="33" cy="35" r="4" fill={WHITE} />
      <path
        d="M31 35L32.5 36.5L35.5 33.5"
        stroke={GREEN}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FinovaLogo({
  light = false,
  size = "md",
}: {
  light?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = size === "lg" ? 52 : size === "md" ? 40 : 30;
  const textSize =
    size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <FinovaIcon size={iconSize} />
      <span
        className={`${textSize} font-bold tracking-tight ${light ? "text-white" : ""}`}
        style={{
          fontFamily: "Outfit, sans-serif",
          color: light ? WHITE : NAVY,
        }}
      >
        FINOVA
      </span>
    </div>
  );
}

// ─── Reusable components ──────────────────────────────────────────────────────
function Btn({
  children,
  onClick,
  variant = "primary",
  fullWidth = true,
  small = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  small?: boolean;
}) {
  const base = `${fullWidth ? "w-full" : ""} ${small ? "py-2.5 px-5 text-sm" : "py-4 px-6 text-base"} rounded-2xl font-semibold transition-all duration-200 active:scale-95 cursor-pointer select-none`;
  const variants = {
    primary: "text-white shadow-lg",
    secondary: "border-2 font-semibold",
    ghost: "font-medium",
    danger: "text-white",
  };
  const styles = {
    primary: { background: `linear-gradient(135deg, ${NAVY3} 0%, #1a3d8a 100%)`, color: WHITE },
    secondary: { borderColor: NAVY3, color: NAVY3, background: WHITE },
    ghost: { color: SLATE, background: "transparent" },
    danger: { background: RED, color: WHITE },
  };
  return (
    <button
      className={`${base} ${variants[variant]}`}
      style={styles[variant]}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function GreenBtn({
  children,
  onClick,
  fullWidth = true,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      className={`${fullWidth ? "w-full" : ""} py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-95 cursor-pointer select-none text-white shadow-lg`}
      style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #00a85e 100%)`, color: WHITE, fontFamily: "Outfit, sans-serif" }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Card({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border ${className}`}
      style={{ borderColor: GRAY2, ...style }}
    >
      {children}
    </div>
  );
}

function Badge({
  children,
  color = "green",
}: {
  children: React.ReactNode;
  color?: "green" | "amber" | "red" | "navy";
}) {
  const colors = {
    green: { bg: GREEN_LIGHT, color: "#047857" },
    amber: { bg: AMBER_LIGHT, color: "#92400E" },
    red: { bg: RED_SOFT, color: RED },
    navy: { bg: "#EEF2FF", color: NAVY3 },
  };
  const c = colors[color];
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: c.bg, color: c.color }}
    >
      {children}
    </span>
  );
}

function ScreenHeader({
  title,
  subtitle,
  back,
  onBack,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
}) {
  return (
    <div className="px-6 pt-14 pb-5">
      {back && (
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium"
          style={{ color: SLATE }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver
        </button>
      )}
      <h1
        className="text-2xl font-bold leading-tight"
        style={{ color: NAVY, fontFamily: "Outfit, sans-serif" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm leading-relaxed" style={{ color: SLATE }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function QuantityControl({
  value,
  unit,
  onChange,
  min = 0,
  step = 0.5,
}: {
  value: number;
  unit: string;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all active:scale-90"
        style={{ background: GRAY2, color: NAVY }}
        onClick={() => onChange(Math.max(min, parseFloat((value - step).toFixed(1))))}
      >
        −
      </button>
      <span
        className="text-base font-semibold min-w-[60px] text-center"
        style={{ color: NAVY, fontFamily: "JetBrains Mono, monospace" }}
      >
        {value} {unit}
      </span>
      <button
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all active:scale-90"
        style={{ background: GREEN, color: WHITE }}
        onClick={() => onChange(parseFloat((value + step).toFixed(1)))}
      >
        +
      </button>
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({
  active,
  onNav,
}: {
  active: NavTab;
  onNav: (t: NavTab) => void;
}) {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "inicio",
      label: "Inicio",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 21V12h6v9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "compras",
      label: "Compras",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M16 10a4 4 0 01-8 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "inventario",
      label: "Inventario",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect
            x="2"
            y="3"
            width="20"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 3v18M16 3v18"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M2 9h20M2 15h20"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "perfil",
      label: "Perfil",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];
  return (
    <div
      className="flex items-center justify-around px-2 pt-3 pb-6"
      style={{ background: WHITE, borderTop: `1px solid ${GRAY2}` }}
    >
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onNav(t.id)}
            className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all"
            style={{ color: isActive ? NAVY3 : SLATE }}
          >
            {t.icon}
            <span
              className="text-[10px] font-semibold"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {t.label}
            </span>
            {isActive && (
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: GREEN }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Screen 1: Splash ─────────────────────────────────────────────────────────
function SplashScreen({ onNext }: { onNext: () => void }) {
  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY3} 60%, #1a3d8a 100%)` }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: GREEN }}
        />
        <div
          className="absolute -bottom-10 -left-16 w-60 h-60 rounded-full opacity-10"
          style={{ background: GREEN }}
        />
        <div
          className="absolute top-1/3 -left-10 w-32 h-32 rounded-full opacity-5"
          style={{ background: WHITE }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-8 relative">
        <div className="flex flex-col items-center gap-5">
          <FinovaIcon size={80} />
          <div>
            <h1
              className="text-5xl font-bold text-white tracking-tight"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              FINOVA
            </h1>
            <div
              className="mt-2 h-0.5 w-16 mx-auto rounded-full"
              style={{ background: GREEN }}
            />
          </div>
        </div>

        <p
          className="text-lg font-light leading-relaxed"
          style={{ color: "rgba(255,255,255,0.75)", fontFamily: "Outfit, sans-serif" }}
        >
          Compra lo que necesitas.
          <br />
          <span className="font-semibold text-white">Ahorra lo que importa.</span>
        </p>

        <div
          className="w-full max-w-xs rounded-2xl p-5 mt-4"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.7)" }}>
            Inteligencia artificial para optimizar tus compras de víveres
          </p>
        </div>
      </div>

      <div className="px-8 pb-12 flex flex-col gap-3 relative">
        <GreenBtn onClick={onNext}>Comenzar</GreenBtn>
        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          Prototipo · Universidad 2026
        </p>
      </div>
    </div>
  );
}

// ─── Screen 2: Upload Invoices ────────────────────────────────────────────────
function UploadScreen({ onNext }: { onNext: () => void }) {
  const [uploaded, setUploaded] = useState([false, false, false]);

  const invoices = [
    { label: "Factura 1 — Enero 2026", date: "15 Ene 2026", amount: "$185.00", items: 12 },
    { label: "Factura 2 — Febrero 2026", date: "18 Feb 2026", amount: "$192.50", items: 14 },
    { label: "Factura 3 — Marzo 2026", date: "12 Mar 2026", amount: "$179.80", items: 11 },
  ];

  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: GRAY }}>
      <ScreenHeader
        title="Conoce tus compras"
        subtitle="Agrega tus compras anteriores para que FINOVA pueda identificar tus hábitos de compra."
      />

      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-4">
        {/* Upload options */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              ),
              label: "Escanear factura",
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ),
              label: "Subir factura",
            },
          ].map((opt, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-2.5 py-5 rounded-2xl font-medium text-sm transition-all active:scale-95"
              style={{ background: WHITE, border: `2px dashed ${GRAY2}`, color: NAVY3 }}
              onClick={() => {
                const copy = [...uploaded];
                copy[i] = true;
                setUploaded(copy);
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Invoice list */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: SLATE }}>
            Facturas cargadas
          </p>
          <div className="flex flex-col gap-3">
            {invoices.map((inv, i) => (
              <Card key={i}>
                <div className="flex items-center gap-3 p-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: uploaded[i] ? GREEN_LIGHT : GRAY }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                        stroke={uploaded[i] ? "#047857" : SLATE}
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="14 2 14 8 20 8"
                        stroke={uploaded[i] ? "#047857" : SLATE}
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: NAVY }}>
                      {inv.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: SLATE }}>
                      {inv.date} · {inv.items} productos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: NAVY, fontFamily: "JetBrains Mono, monospace" }}>
                      {inv.amount}
                    </p>
                    {uploaded[i] && <Badge color="green">Cargada</Badge>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-4" style={{ background: "#EEF2FF", borderColor: "#C7D2FE" }}>
          <div className="flex items-start gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10" stroke={NAVY3} strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke={NAVY3} strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke={NAVY3} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="text-xs" style={{ color: NAVY3 }}>
              En el prototipo, las facturas están pre-cargadas con los datos de ejemplo de Andrea.
            </p>
          </div>
        </Card>
      </div>

      <div className="px-6 pb-8 pt-2">
        <Btn onClick={onNext}>Continuar</Btn>
      </div>
    </div>
  );
}

// ─── Screen 3: Purchase History ───────────────────────────────────────────────
function HistoryScreen({ onNext }: { onNext: () => void }) {
  const rows = [
    { product: "Carne", unit: "kg", m1: 20, m2: 20, m3: 20, avg: 20, icon: "🥩" },
    { product: "Pollo", unit: "und.", m1: 5, m2: 5, m3: 5, avg: 5, icon: "🍗" },
    { product: "Embutidos", unit: "paq.", m1: 8, m2: 9, m3: 8, avg: 8.3, icon: "🌭" },
    { product: "Arroz", unit: "kg", m1: 10, m2: 10, m3: 10, avg: 10, icon: "🌾" },
  ];

  const patterns = [
    { icon: "📊", text: "Tu compra de carne se mantiene estable durante los últimos 3 meses." },
    { icon: "🔁", text: "Compras la misma cantidad de arroz todos los meses (10 kg)." },
    { icon: "📈", text: "Los embutidos variaron levemente: entre 8 y 9 paquetes." },
  ];

  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: GRAY }}>
      <ScreenHeader title="Historial de compras" subtitle="Resumen de tus últimos 3 meses." />

      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-4">
        {/* Table */}
        <Card>
          <div className="p-4">
            <div
              className="grid text-xs font-bold uppercase tracking-wider mb-3"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", color: SLATE }}
            >
              <span>Producto</span>
              <span className="text-center">Ene</span>
              <span className="text-center">Feb</span>
              <span className="text-center">Mar</span>
              <span className="text-center">Prom.</span>
            </div>
            {rows.map((r, i) => (
              <div key={i}>
                {i > 0 && <div className="h-px my-2" style={{ background: GRAY2 }} />}
                <div
                  className="grid items-center text-sm"
                  style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{r.icon}</span>
                    <span className="font-medium text-xs" style={{ color: NAVY }}>
                      {r.product}
                    </span>
                  </div>
                  {[r.m1, r.m2, r.m3].map((v, j) => (
                    <span
                      key={j}
                      className="text-center text-xs"
                      style={{ color: SLATE, fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {v} {r.unit}
                    </span>
                  ))}
                  <div className="flex justify-center">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-lg"
                      style={{ background: GREEN_LIGHT, color: "#047857", fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {r.avg}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Patterns */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: SLATE }}>
            Patrones detectados
          </p>
          <div className="flex flex-col gap-2.5">
            {patterns.map((p, i) => (
              <Card key={i}>
                <div className="flex items-start gap-3 p-4">
                  <span className="text-xl flex-shrink-0">{p.icon}</span>
                  <p className="text-sm leading-relaxed" style={{ color: NAVY }}>
                    {p.text}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-4" style={{ background: GREEN_LIGHT, borderColor: "#A7F3D0" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: GREEN }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "#047857" }}>
                FINOVA ha aprendido tus hábitos
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#065F46" }}>
                3 meses de historial analizado
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-6 pb-8 pt-2">
        <Btn onClick={onNext}>Actualizar inventario</Btn>
      </div>
    </div>
  );
}

// ─── Screen 4: Inventory ──────────────────────────────────────────────────────
function InventoryScreen({
  inventory,
  setInventory,
  onNext,
}: {
  inventory: Record<string, number>;
  setInventory: (v: Record<string, number>) => void;
  onNext: () => void;
}) {
  const items = [
    { key: "carne", label: "Carne", icon: "🥩", unit: "kg" },
    { key: "pollo", label: "Pollo", icon: "🍗", unit: "und." },
    { key: "embutidos", label: "Embutidos", icon: "🌭", unit: "paq." },
    { key: "arroz", label: "Arroz", icon: "🌾", unit: "kg" },
  ];

  const update = (key: string, v: number) => setInventory({ ...inventory, [key]: v });

  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: GRAY }}>
      <ScreenHeader
        title="¿Qué tienes en casa?"
        subtitle="Indica cuánto tienes disponible para evitar compras innecesarias."
      />

      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-3">
        <Card className="p-4" style={{ background: AMBER_LIGHT, borderColor: "#FDE68A" }}>
          <div className="flex items-start gap-2.5">
            <span className="text-lg">💡</span>
            <p className="text-xs" style={{ color: "#92400E" }}>
              Registra tu inventario actual para que FINOVA pueda recomendarte solo lo que realmente necesitas.
            </p>
          </div>
        </Card>

        {items.map((item) => (
          <Card key={item.key}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: GRAY }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: NAVY }}>
                    {item.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: SLATE }}>
                    Disponible en casa
                  </p>
                </div>
              </div>
              <QuantityControl
                value={inventory[item.key]}
                unit={item.unit}
                onChange={(v) => update(item.key, v)}
              />
            </div>
          </Card>
        ))}

        <p className="text-xs text-center" style={{ color: SLATE }}>
          Ajusta las cantidades con los controles + y −
        </p>
      </div>

      <div className="px-6 pb-8 pt-2">
        <Btn onClick={onNext}>Continuar</Btn>
      </div>
    </div>
  );
}

// ─── Screen 5: New Purchase ───────────────────────────────────────────────────
function NewPurchaseScreen({
  purchase,
  setPurchase,
  onNext,
}: {
  purchase: Record<string, number>;
  setPurchase: (v: Record<string, number>) => void;
  onNext: () => void;
}) {
  const items = [
    { key: "carne", label: "Carne", icon: "🥩", unit: "kg" },
    { key: "pollo", label: "Pollo", icon: "🍗", unit: "und." },
    { key: "embutidos", label: "Embutidos", icon: "🌭", unit: "paq." },
    { key: "arroz", label: "Arroz", icon: "🌾", unit: "kg" },
  ];

  const update = (key: string, v: number) => setPurchase({ ...purchase, [key]: v });

  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: GRAY }}>
      <ScreenHeader
        title="Prepara tu próxima compra"
        subtitle="Agrega lo que planeas comprar este mes."
      />

      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-3">
        {items.map((item) => (
          <Card key={item.key}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: GRAY }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: NAVY }}>
                    {item.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: SLATE }}>
                    Cantidad a comprar
                  </p>
                </div>
              </div>
              <QuantityControl
                value={purchase[item.key]}
                unit={item.unit}
                onChange={(v) => update(item.key, v)}
                step={item.key === "pollo" ? 1 : 0.5}
              />
            </div>
          </Card>
        ))}

        <Card className="p-4" style={{ background: "#EEF2FF", borderColor: "#C7D2FE" }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: NAVY3 }}>Total estimado</span>
            <span className="text-lg font-bold" style={{ color: NAVY, fontFamily: "JetBrains Mono, monospace" }}>
              $185.00
            </span>
          </div>
        </Card>
      </div>

      <div className="px-6 pb-8 pt-2">
        <GreenBtn onClick={onNext}>
          🔍 Analizar mi compra
        </GreenBtn>
      </div>
    </div>
  );
}

// ─── Screen 6: AI Analysis ────────────────────────────────────────────────────
function AnalysisScreen({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep(1), 600));
    timers.push(setTimeout(() => setStep(2), 1300));
    timers.push(setTimeout(() => setStep(3), 2000));
    timers.push(setTimeout(() => setStep(4), 2700));
    timers.push(setTimeout(() => { setStep(5); setDone(true); }, 3400));
    return () => timers.forEach(clearTimeout);
  }, []);

  const steps = [
    { label: "Historial de compras", icon: "📋" },
    { label: "Inventario actual", icon: "🏠" },
    { label: "Nueva compra", icon: "🛒" },
    { label: "FINOVA IA", icon: "🤖" },
    { label: "Recomendación", icon: "✅" },
  ];

  return (
    <div
      className="flex flex-col h-full screen-enter"
      style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY3} 100%)` }}
    >
      <div className="pt-16 px-8 pb-4">
        <FinovaLogo light size="md" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        <div className="text-center">
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {done ? "Análisis completado" : "Analizando tu compra..."}
          </h2>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            {done
              ? "FINOVA detectó posibles compras innecesarias"
              : "Comparando tus últimos 3 meses con tu inventario actual."}
          </p>
        </div>

        {/* Steps */}
        <div className="w-full flex flex-col gap-2">
          {steps.map((s, i) => {
            const isActive = step === i + 1;
            const isPast = step > i + 1;
            const opacity = step < i + 1 ? 0.3 : 1;
            return (
              <div key={i} className="flex items-center gap-3 transition-all duration-500" style={{ opacity }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all duration-300"
                  style={{
                    background: isPast
                      ? GREEN
                      : isActive
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.08)",
                  }}
                >
                  {isPast ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L20 7" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    s.icon
                  )}
                </div>
                <p
                  className="text-sm font-medium flex-1"
                  style={{ color: isPast || isActive ? WHITE : "rgba(255,255,255,0.5)" }}
                >
                  {s.label}
                </p>
                {isActive && !done && (
                  <div className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <div
                        key={d}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.6)",
                          animation: `pulse-ring 1s ${d * 0.2}s ease-out infinite`,
                        }}
                      />
                    ))}
                  </div>
                )}
                {i < steps.length - 1 && (
                  <div />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(step / steps.length) * 100}%`,
              background: `linear-gradient(90deg, ${GREEN}, #00D97E)`,
            }}
          />
        </div>
      </div>

      <div className="px-8 pb-12">
        {done ? (
          <GreenBtn onClick={onNext}>Ver recomendaciones →</GreenBtn>
        ) : (
          <div className="h-14 flex items-center justify-center">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Procesando...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Screen 7: Alerts ─────────────────────────────────────────────────────────
function AlertsScreen({ onNext }: { onNext: () => void }) {
  const alerts = [
    {
      product: "Carne",
      icon: "🥩",
      want: "20 kg",
      have: "10 kg",
      habitual: "20 kg",
      recommend: "10 kg",
      saving: "$32",
      severity: "high",
      reason: "Tienes aproximadamente 10 kg disponibles en casa. Comprando 20 kg adicionales tendrías un exceso estimado de 10 kg.",
    },
    {
      product: "Pollo",
      icon: "🍗",
      want: "5 und.",
      have: "2,5 und.",
      habitual: "5 und.",
      recommend: "3 und.",
      saving: "$18",
      severity: "medium",
      reason: "Según tu historial, consumes alrededor de 5 unidades al mes, pero ya tienes 2,5. Podrías reducir tu compra.",
    },
    {
      product: "Embutidos",
      icon: "🌭",
      want: "8 paq.",
      have: "5 paq.",
      habitual: "8,3 paq.",
      recommend: "3 paq.",
      saving: "$12",
      severity: "medium",
      reason: "Tienes 5 paquetes en casa. Tu consumo habitual es 8 paquetes al mes, así que podrías cubrir el mes con solo 3 adicionales.",
    },
    {
      product: "Arroz",
      icon: "🌾",
      want: "10 kg",
      have: "6 kg",
      habitual: "10 kg",
      recommend: "4 kg",
      saving: "$11",
      severity: "low",
      reason: "Ya tienes 6 kg disponibles. Comprando 4 kg adicionales llegarías a tu cantidad habitual mensual.",
    },
  ];

  const severityColor = (s: string) =>
    s === "high" ? { bg: RED_SOFT, border: "#FCA5A5", badge: "red" as const } :
    s === "medium" ? { bg: AMBER_LIGHT, border: "#FDE68A", badge: "amber" as const } :
    { bg: GREEN_LIGHT, border: "#A7F3D0", badge: "green" as const };

  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: GRAY }}>
      <div className="px-6 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: NAVY, fontFamily: "Outfit, sans-serif" }}>
            Compras repetitivas
          </h1>
          <Badge color="red">4 alertas</Badge>
        </div>
        <p className="mt-1 text-sm" style={{ color: SLATE }}>
          FINOVA detectó posibles excesos en tu lista.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-4">
        {alerts.map((a, i) => {
          const sc = severityColor(a.severity);
          return (
            <Card key={i} style={{ borderColor: sc.border }}>
              <div style={{ background: sc.bg, borderRadius: "16px 16px 0 0" }} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{a.icon}</span>
                    <span className="font-bold" style={{ color: NAVY, fontFamily: "Outfit, sans-serif" }}>
                      {a.product}
                    </span>
                  </div>
                  <Badge color={sc.badge}>Posible exceso</Badge>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Quieres comprar", value: a.want },
                    { label: "Tienes en casa", value: a.have },
                    { label: "Compra habitual", value: a.habitual },
                  ].map((col, j) => (
                    <div key={j} className="flex flex-col gap-0.5">
                      <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: SLATE }}>
                        {col.label}
                      </p>
                      <p className="text-sm font-bold" style={{ color: NAVY, fontFamily: "JetBrains Mono, monospace" }}>
                        {col.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="h-px" style={{ background: GRAY2 }} />

                <div>
                  <p className="text-xs leading-relaxed" style={{ color: SLATE }}>
                    {a.reason}
                  </p>
                </div>

                <div
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: GREEN_LIGHT }}
                >
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#047857" }}>
                      FINOVA recomienda
                    </p>
                    <p className="font-bold text-sm mt-0.5" style={{ color: NAVY }}>
                      Comprar {a.recommend}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: SLATE }}>Ahorro est.</p>
                    <p className="font-bold" style={{ color: GREEN, fontFamily: "JetBrains Mono, monospace" }}>
                      {a.saving}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="px-6 pb-8 pt-2">
        <GreenBtn onClick={onNext}>Optimizar mi compra</GreenBtn>
      </div>
    </div>
  );
}

// ─── Screen 8: Optimized Purchase ────────────────────────────────────────────
function OptimizedScreen({ onNext }: { onNext: () => void }) {
  const rows = [
    { product: "Carne", icon: "🥩", original: "20 kg", recommended: "10 kg", save: "$32" },
    { product: "Pollo", icon: "🍗", original: "5 und.", recommended: "3 und.", save: "$18" },
    { product: "Embutidos", icon: "🌭", original: "8 paq.", recommended: "3 paq.", save: "$12" },
    { product: "Arroz", icon: "🌾", original: "10 kg", recommended: "4 kg", save: "$11" },
  ];

  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: GRAY }}>
      <ScreenHeader title="Compra optimizada" />

      <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-xs font-medium" style={{ color: SLATE }}>Tu compra original</p>
            <p className="text-2xl font-bold mt-1" style={{ color: NAVY, fontFamily: "JetBrains Mono, monospace" }}>
              $185
            </p>
            <p className="text-xs mt-1 line-through" style={{ color: "#94A3B8" }}>Lista inicial</p>
          </Card>
          <Card className="p-4" style={{ background: GREEN_LIGHT, borderColor: "#A7F3D0" }}>
            <p className="text-xs font-medium" style={{ color: "#047857" }}>Compra optimizada</p>
            <p className="text-2xl font-bold mt-1" style={{ color: NAVY, fontFamily: "JetBrains Mono, monospace" }}>
              $112
            </p>
            <p className="text-xs mt-1" style={{ color: "#047857" }}>Recomendada</p>
          </Card>
        </div>

        {/* Savings banner */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY3} 100%)` }}
        >
          <div>
            <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              Ahorro estimado este mes
            </p>
            <p
              className="text-4xl font-bold mt-1"
              style={{ color: GREEN, fontFamily: "JetBrains Mono, monospace" }}
            >
              $73
            </p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              en compras innecesarias
            </p>
          </div>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,193,110,0.2)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" fill={GREEN}/>
            </svg>
          </div>
        </div>

        <p className="text-sm text-center font-medium" style={{ color: NAVY }}>
          Este mes podrías evitar <span style={{ color: GREEN, fontFamily: "JetBrains Mono, monospace" }}>$73</span> en compras innecesarias.
        </p>

        {/* Comparison table */}
        <Card>
          <div className="p-4">
            <p className="font-bold text-sm mb-3" style={{ color: NAVY }}>
              Comparación de cantidades
            </p>
            <div
              className="grid text-xs font-bold uppercase tracking-wider mb-2"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", color: SLATE }}
            >
              <span>Producto</span>
              <span className="text-center">Original</span>
              <span className="text-center">Recom.</span>
              <span className="text-center">Ahorro</span>
            </div>
            {rows.map((r, i) => (
              <div key={i}>
                {i > 0 && <div className="h-px my-2" style={{ background: GRAY2 }} />}
                <div
                  className="grid items-center text-sm"
                  style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
                >
                  <div className="flex items-center gap-1">
                    <span>{r.icon}</span>
                    <span className="text-xs font-medium" style={{ color: NAVY }}>
                      {r.product}
                    </span>
                  </div>
                  <span
                    className="text-center text-xs line-through"
                    style={{ color: "#94A3B8", fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {r.original}
                  </span>
                  <span
                    className="text-center text-xs font-bold"
                    style={{ color: "#047857", fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {r.recommended}
                  </span>
                  <span
                    className="text-center text-xs font-semibold"
                    style={{ color: GREEN, fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {r.save}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-3" style={{ background: "#EEF2FF", borderColor: "#C7D2FE" }}>
          <p className="text-xs text-center" style={{ color: NAVY3 }}>
            Estimación basada en tu historial y el inventario registrado. Las cantidades son aproximadas.
          </p>
        </Card>
      </div>

      <div className="px-6 pb-8 pt-2 flex flex-col gap-2.5">
        <GreenBtn onClick={onNext}>Aceptar recomendación</GreenBtn>
        <Btn variant="ghost" onClick={onNext}>Mantener mi lista</Btn>
      </div>
    </div>
  );
}

// ─── Screen 9: Dashboard ──────────────────────────────────────────────────────
function DashboardScreen({ onAnalyze }: { onAnalyze: () => void }) {
  const topProducts = [
    { icon: "🥩", label: "Carne", sub: "20 kg / mes", progress: 0.9 },
    { icon: "🍗", label: "Pollo", sub: "5 und. / mes", progress: 0.6 },
    { icon: "🌭", label: "Embutidos", sub: "8 paq. / mes", progress: 0.7 },
    { icon: "🌾", label: "Arroz", sub: "10 kg / mes", progress: 0.8 },
  ];

  const activity = [
    { icon: "🤖", text: "FINOVA optimizó tu lista de compras", time: "Hoy", color: GREEN_LIGHT, textColor: "#047857" },
    { icon: "📊", text: "Historial actualizado: 3 meses", time: "Hoy", color: "#EEF2FF", textColor: NAVY3 },
    { icon: "💡", text: "4 compras innecesarias detectadas", time: "Hoy", color: AMBER_LIGHT, textColor: "#92400E" },
  ];

  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: GRAY }}>
      {/* Header */}
      <div
        className="px-6 pt-14 pb-6"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY3} 100%)` }}
      >
        <div className="flex items-center justify-between mb-6">
          <FinovaLogo light size="sm" />
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
            style={{ background: GREEN }}
          >
            A
          </div>
        </div>
        <p className="text-base font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
          Hola, Andrea 👋
        </p>
        <p
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          Tu compra inteligente
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { label: "Próxima compra", value: "$112", icon: "🛒" },
            { label: "Ahorro estimado", value: "$73", icon: "💰", highlight: true },
            { label: "Alertas", value: "4", icon: "⚠️" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-3 text-center"
              style={{
                background: s.highlight
                  ? "rgba(0,193,110,0.2)"
                  : "rgba(255,255,255,0.1)",
                border: s.highlight
                  ? `1px solid rgba(0,193,110,0.3)`
                  : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p className="text-lg">{s.icon}</p>
              <p
                className="text-lg font-bold mt-0.5"
                style={{
                  color: s.highlight ? GREEN : WHITE,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {s.value}
              </p>
              <p
                className="text-[9px] leading-tight mt-0.5"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
        {/* Optimize CTA */}
        <GreenBtn onClick={onAnalyze}>✨ Optimizar mi compra</GreenBtn>

        {/* Top products */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: SLATE }}>
            Productos más comprados
          </p>
          <Card>
            <div className="divide-y" style={{ borderColor: GRAY2 }}>
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xl flex-shrink-0">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm" style={{ color: NAVY }}>
                        {p.label}
                      </p>
                      <p className="text-xs" style={{ color: SLATE, fontFamily: "JetBrains Mono, monospace" }}>
                        {p.sub}
                      </p>
                    </div>
                    <div
                      className="mt-1.5 h-1.5 rounded-full overflow-hidden"
                      style={{ background: GRAY2 }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${p.progress * 100}%`, background: GREEN }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent activity */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: SLATE }}>
            Actividad reciente
          </p>
          <div className="flex flex-col gap-2">
            {activity.map((a, i) => (
              <Card key={i}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: a.color }}
                  >
                    {a.icon}
                  </div>
                  <p className="flex-1 text-sm" style={{ color: NAVY }}>
                    {a.text}
                  </p>
                  <p className="text-[10px]" style={{ color: SLATE }}>
                    {a.time}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── Mobile Frame ─────────────────────────────────────────────────────────────
function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 390,
        height: 844,
        borderRadius: 50,
        boxShadow: "0 40px 80px rgba(10,22,40,0.35), 0 0 0 2px #1E293B, inset 0 0 0 1px rgba(255,255,255,0.05)",
        background: GRAY,
      }}
    >
      {/* Status bar */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
        style={{ height: 50, background: "transparent", pointerEvents: "none" }}
      >
        <span className="text-[12px] font-semibold" style={{ color: "transparent" }}>9:41</span>
        <div
          className="w-28 h-6 rounded-b-xl"
          style={{ background: "#0A0A0A" }}
        />
        <span className="text-[12px] font-semibold" style={{ color: "transparent" }}>●●●</span>
      </div>
      <div className="w-full h-full overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [navTab, setNavTab] = useState<NavTab>("inicio");
  const [key, setKey] = useState(0);

  const [inventory, setInventory] = useState({
    carne: 10,
    pollo: 2.5,
    embutidos: 5,
    arroz: 6,
  });

  const [purchase, setPurchase] = useState({
    carne: 20,
    pollo: 5,
    embutidos: 8,
    arroz: 10,
  });

  const go = (s: Screen) => {
    setScreen(s);
    setKey((k) => k + 1);
  };

  const handleNav = (tab: NavTab) => {
    setNavTab(tab);
    if (tab === "inicio") go("dashboard");
    else if (tab === "compras") go("history");
    else if (tab === "inventario") go("inventory");
  };

  const showNav = ["history", "inventory", "newpurchase", "dashboard"].includes(screen);

  const screenMap: Record<Screen, React.ReactNode> = {
    splash: <SplashScreen onNext={() => go("upload")} />,
    upload: <UploadScreen onNext={() => go("history")} />,
    history: <HistoryScreen onNext={() => go("inventory")} />,
    inventory: (
      <InventoryScreen
        inventory={inventory}
        setInventory={setInventory}
        onNext={() => go("newpurchase")}
      />
    ),
    newpurchase: (
      <NewPurchaseScreen
        purchase={purchase}
        setPurchase={setPurchase}
        onNext={() => go("analysis")}
      />
    ),
    analysis: <AnalysisScreen onNext={() => go("alerts")} />,
    alerts: <AlertsScreen onNext={() => go("optimized")} />,
    optimized: <OptimizedScreen onNext={() => go("dashboard")} />,
    dashboard: (
      <DashboardScreen
        onAnalyze={() => {
          go("newpurchase");
          setNavTab("compras");
        }}
      />
    ),
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "#E8EDF5", minHeight: "100vh" }}
    >
      <MobileFrame>
        <div className="w-full h-full flex flex-col overflow-hidden">
          <div key={key} className="flex-1 overflow-hidden flex flex-col">
            {screenMap[screen]}
          </div>
          {showNav && (
            <BottomNav
              active={navTab}
              onNav={handleNav}
            />
          )}
        </div>
      </MobileFrame>

      {/* Screen indicator outside frame */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 pointer-events-none">
        {(
          [
            "splash",
            "upload",
            "history",
            "inventory",
            "newpurchase",
            "analysis",
            "alerts",
            "optimized",
            "dashboard",
          ] as Screen[]
        ).map((s) => (
          <div
            key={s}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{
              background: screen === s ? NAVY3 : "#CBD5E1",
              transform: screen === s ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
