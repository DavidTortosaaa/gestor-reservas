export default function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
      <div className="max-w-6xl mx-auto p-4 text-black">
        {children}
      </div>
    )
  }