import React from 'react';
import {
  Cctv,
  ShieldAlert,
  MapPin,
  Users,
  BarChart3,
  PowerOff,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Radio,
  Cpu
} from 'lucide-react';

export type NavTab = 'vision' | 'incidents' | 'zones' | 'personnel' | 'analytics';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeBreachesCount: number;
  openEmergencyModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  activeBreachesCount,
  openEmergencyModal
}) => {
  const navItems = [
    {
      id: 'vision' as NavTab,
      label: 'Live Vision Matrix',
      sublabel: '6 Edge Streams Active',
      icon: Cctv,
      badge: null
    },
    {
      id: 'incidents' as NavTab,
      label: 'Incident Command',
      sublabel: 'Triage & Rapid Dispatch',
      icon: ShieldAlert,
      badge: activeBreachesCount > 0 ? activeBreachesCount : null,
      badgeColor: 'bg-[#EF4444] text-white'
    },
    {
      id: 'zones' as NavTab,
      label: 'Digital Twin & Zones',
      sublabel: 'CAD Geospatial Bounds',
      icon: MapPin,
      badge: null
    },
    {
      id: 'personnel' as NavTab,
      label: 'Personnel & Passports',
      sublabel: 'Inductions & PPE Roster',
      icon: Users,
      badge: null
    },
    {
      id: 'analytics' as NavTab,
      label: 'Safety Intelligence KPI',
      sublabel: 'OSHA / LTI Safe Hours',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0F172A] border-r border-[#1E293B] text-slate-200 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E293B]">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-white font-['Plus_Jakarta_Sans']">
                  KAVACH<span className="text-[#38BDF8]">360</span>
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1E293B] text-[#38BDF8] border border-blue-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                Safety Intelligence
              </p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#1E293B] transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Collapse Toggle for Collapsed Mode */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-auto mt-2 text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#1E293B] transition-colors"
          title="Expand Sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Active Project Banner */}
      {!collapsed && (
        <div className="p-3 mx-3 mt-3 rounded-lg bg-[#1E293B]/60 border border-[#334155]/60">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#38BDF8] uppercase tracking-wider font-mono">
            <Radio className="w-3 h-3 animate-pulse text-[#38BDF8]" />
            Site #4 · Active Feed
          </div>
          <p className="text-xs font-semibold text-white mt-0.5 truncate font-['Plus_Jakarta_Sans']">
            Metro Line 4 · Viaduct Pkg 08
          </p>
          <p className="text-[11px] text-slate-400 font-mono">Chainage: CH-14+200</p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <div className="flex-1 text-left truncate">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold tracking-tight">{item.label}</span>
                    {item.badge !== null && (
                      <span
                        className={`px-1.5 py-0.2 text-[10px] font-extrabold rounded-full font-mono animate-bounce ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] truncate font-normal ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.sublabel}
                  </p>
                </div>
              )}

              {collapsed && item.badge !== null && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#EF4444] border-2 border-[#0F172A]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Emergency Lockout Quick Action & Edge Node Telemetry */}
      <div className="p-3 border-t border-[#1E293B] space-y-2">
        <button
          onClick={openEmergencyModal}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold transition-all shadow-lg shadow-red-900/30 active:scale-98 ${
            collapsed ? 'p-2' : ''
          }`}
          title="Emergency Machinery Lockout"
        >
          <PowerOff className="w-4 h-4 shrink-0" />
          {!collapsed && <span>EMERGENCY LOCKOUT</span>}
        </button>

        {!collapsed && (
          <div className="p-2 rounded bg-[#0A0F1D] border border-[#1E293B] text-[10px] font-mono text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-400">
                <Cpu className="w-3 h-3" />
                YOLO-v11 CV
              </span>
              <span className="text-slate-300 font-semibold">98.4% Acc</span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-500">
              <span>Edge Nodes: 12 Sync</span>
              <span className="text-emerald-400">24ms Ping</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
