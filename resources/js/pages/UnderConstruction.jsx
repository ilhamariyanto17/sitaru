import { useLocation } from 'react-router-dom';
import { HardHat } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { navItems } from '../data/dummyData';

function findLabel(pathname) {
  for (const item of navItems) {
    if (item.path === pathname) return item.label;
    if (item.children) {
      const child = item.children.find((c) => c.path === pathname);
      if (child) return `Kesesuaian - ${child.label}`;
    }
  }
  return 'Halaman';
}

export default function UnderConstruction() {
  const { pathname } = useLocation();
  const label = findLabel(pathname);

  return (
    <MainLayout title={label} subtitle="Kawasan Jetis">
      <div className="h-full min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-warn/15 text-warn flex items-center justify-center mx-auto mb-5">
            <HardHat size={30} />
          </div>
          <h2 className="text-lg font-semibold text-ink mb-2">{label}</h2>
          <p className="text-sm text-muted leading-relaxed">
            Halaman ini sedang dalam pengerjaan. Fitur akan tersedia pada pembaruan berikutnya.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
