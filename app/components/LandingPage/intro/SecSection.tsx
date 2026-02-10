import React from 'react'

const StatsSection = () => {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle green glow effect in the corner */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
              Built for <span className="text-primary italic text-shadow-glow">Scale.</span> <br />
              Trusted Across Nigeria.
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Our infrastructure is engineered to handle simultaneous tracking for hundreds of field
              agents without a second of latency. From Lagos to Kano, we provide constant,
              uninterrupted surveillance.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-4xl font-black text-primary">500+</div>
                <p className="text-xs uppercase tracking-widest opacity-50 mt-2 font-bold">
                  Concurrent Workers
                </p>
              </div>
              <div className="border-x border-white/10 px-8">
                <div className="text-4xl font-black text-primary">99.9%</div>
                <p className="text-xs uppercase tracking-widest opacity-50 mt-2 font-bold">
                  Uptime Promise
                </p>
              </div>
              <div>
                <div className="text-4xl font-black text-primary">24/7</div>
                <p className="text-xs uppercase tracking-widest opacity-50 mt-2 font-bold">
                  Live Monitoring
                </p>
              </div>
            </div>
          </div>

          {/* Visual representation of coverage */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Regional Coverage Status
            </h3>
            <div className="space-y-4">
              {['Lagos Hub', 'Abuja Central', 'Port Harcourt', 'Kano North'].map((city) => (
                <div
                  key={city}
                  className="flex justify-between items-center bg-black/20 p-3 rounded-lg"
                >
                  <span className="text-sm font-medium">{city}</span>
                  <span className="badge badge-success badge-sm text-[10px] font-bold">
                    OPTIMIZED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection