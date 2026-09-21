export default function Card({ title, action, children, className = '' }) {
  return (
    <div className={`bg-card border border-cborder rounded-xl shadow-card flex flex-col ${className}`}>
      {title && (
        <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-cborder shrink-0">
          <h3 className="text-[13px] font-semibold text-cink">{title}</h3>
          {action}
        </div>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}