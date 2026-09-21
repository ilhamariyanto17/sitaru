import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Menu, Home, Box, CheckSquare, Building2, LayoutGrid, Trees, Waves,
  FileText, Settings, Info, ChevronDown, Gauge,
} from 'lucide-react';
import { navItems } from '../data/dummyData';
import FilterPanel from './FilterPanel';

const ICONS = {
  home: Home,
  box: Box,
  'check-square': CheckSquare,
  'building-2': Building2,
  'layout-grid': LayoutGrid,
  trees: Trees,
  waves: Waves,
  'file-text': FileText,
  settings: Settings,
  info: Info,
  gauge: Gauge,
};

function isChildActive(item, pathname) {
  return item.children?.some((c) => c.path === pathname);
}

export default function Sidebar({ collapsed, onToggle }) {
  const { pathname } = useLocation();
  const [openKey, setOpenKey] = useState('kesesuaian');

  return (
    <aside
      className={`h-full bg-panel border-r border-border flex flex-col transition-all duration-200 ${
        collapsed ? 'w-[64px]' : 'w-[248px]'
      }`}
    >
      <div className="h-14 flex items-center px-3 border-b border-border shrink-0">
        <button
          onClick={onToggle}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-panel2 text-muted hover:text-ink"
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = ICONS[item.icon] || Home;

          if (item.children) {
            const open = openKey === item.key;
            const active = isChildActive(item, pathname);
            return (
              <div key={item.key}>
                <button
                  onClick={() => setOpenKey(open ? '' : item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active ? 'text-ink' : 'text-muted hover:text-ink hover:bg-panel2'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${open ? 'rotate-180' : ''}`}
                      />
                    </>
                  )}
                </button>
                {!collapsed && open && (
                  <div className="ml-[30px] mt-0.5 mb-1 space-y-0.5 border-l border-border pl-3">
                    {item.children.map((c) => (
                      <NavLink
                        key={c.key}
                        to={c.path}
                        className={({ isActive }) =>
                          `block px-2.5 py-2 rounded-md text-[13px] ${
                            isActive
                              ? 'bg-accent/15 text-accent font-medium'
                              : 'text-muted hover:text-ink hover:bg-panel2'
                          }`
                        }
                      >
                        {c.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/15 text-accent font-medium'
                    : 'text-muted hover:text-ink hover:bg-panel2'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-2 border-t border-border shrink-0 max-h-[420px] overflow-y-auto">
          {/* <FilterPanel /> */}
        </div>
      )}
    </aside>
  );
}