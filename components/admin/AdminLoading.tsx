export function AdminLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#2a2a40] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#8b5cf6] rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-[#9ca3af] text-sm">{message}</p>
    </div>
  );
}
