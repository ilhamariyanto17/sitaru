import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function MainLayout({ title, subtitle, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen w-screen flex bg-base overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 bg-surface text-cink">{children}</main>
      </div>
    </div>
  );
}