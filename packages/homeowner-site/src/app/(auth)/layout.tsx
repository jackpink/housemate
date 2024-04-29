export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full items-center">
      <div className="flex w-full justify-center">{children}</div>
    </div>
  );
}
