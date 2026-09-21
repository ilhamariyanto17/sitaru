import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

const FIELDS = [
  { key: 'kecamatan', label: 'Kecamatan', options: ['Jetis', 'Gondokusuman', 'Danurejan', 'Tegalrejo'], value: 'Jetis' },
  { key: 'kelurahan', label: 'Kelurahan', options: ['Semua', 'Cokrodiningratan', 'Gowongan', 'Bumijo'], value: 'Semua' },
  { key: 'batas', label: 'Batas Administrasi', options: ['Kawasan Jetis', 'Kecamatan', 'Kota'], value: 'Kawasan Jetis' },
  { key: 'zona', label: 'Tipe Zona RDTR', options: ['Semua', 'Perumahan', 'Perdagangan & Jasa', 'Perkantoran'], value: 'Semua' },
];

export default function FilterPanel() {
  const [values, setValues] = useState(Object.fromEntries(FIELDS.map((f) => [f.key, f.value])));

  const reset = () => setValues(Object.fromEntries(FIELDS.map((f) => [f.key, f.value])));

  return (
    <div className="bg-panel border border-border rounded-xl shadow-card p-4">
      <h3 className="text-[13px] font-semibold text-ink mb-3">Filter Kawasan</h3>
      <div className="space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-[11.5px] text-muted mb-1">{f.label}</label>
            <select
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              className="w-full bg-panel2 border border-border rounded-lg px-2.5 py-2 text-[12.5px] text-ink outline-none focus:border-accent"
            >
              {f.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={reset}
        className="w-full mt-4 flex items-center justify-center gap-2 text-[12.5px] text-muted hover:text-ink border border-border rounded-lg py-2 hover:bg-panel2 transition-colors"
      >
        <RotateCcw size={13} />
        Reset Filter
      </button>
    </div>
  );
}
