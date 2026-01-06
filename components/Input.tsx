//sales_router_frontend/components/Input.tsx

export default function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="border p-2 rounded-lg bg-white shadow-sm"
      />
    </div>
  );
}
