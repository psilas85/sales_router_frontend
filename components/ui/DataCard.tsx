interface Props {
  title: string;
  children: React.ReactNode;
}

export default function DataCard({ title, children }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
