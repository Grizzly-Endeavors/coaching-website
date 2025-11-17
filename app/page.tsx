export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-primary to-purple-hover bg-clip-text text-transparent">
          Overwatch Coaching
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary">
          Professional coaching services to help you rank up
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-8">
          <button className="btn-primary">
            Book a Session
          </button>
          <button className="btn-secondary">
            Submit Replay Code
          </button>
        </div>
        <p className="text-text-muted pt-8">
          Next.js 14 foundation successfully set up!
        </p>
      </div>
    </main>
  );
}
