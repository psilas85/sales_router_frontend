// sales_router_frontend/app/(auth)/layout.tsx

export const metadata = {
  title: "Login - SalesRouter",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen
        w-full
        flex
        items-center
        justify-center
        relative
        bg-[linear-gradient(135deg,#06245a_0%,#0b3b8c_40%,#0a4db3_70%,#06245a_100%)]
      "
    >
      {/* Vinheta MUITO suave (não escurece o card) */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),rgba(0,0,0,0.15))]
          pointer-events-none
        "
      />

      {children}
    </div>
  );
}


