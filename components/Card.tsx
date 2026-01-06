export default function Card({ title, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-20 p-6">
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}
