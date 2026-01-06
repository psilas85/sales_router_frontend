//sales_router_frontend/components/ui/PageHeader.tsx

interface Props {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-gray-800">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}
