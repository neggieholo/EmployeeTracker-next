// app/page.tsx
export default function Hero() {
  return (
    <div
      className="hero min-h-[90vh] pt-[80px] relative overflow-hidden"
      style={{
        backgroundImage: "url('/hero_background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 1. LIGHTER OVERLAY: Using a gradient so the bottom stays dark for the footer, but the top stays clear */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-900/40 via-slate-900/60 to-black z-0"></div>

      <div className="hero-content flex-col lg:flex-row-reverse gap-12 lg:gap-24 px-8 z-10">
        {/* RIGHT SIDE: Semi-Transparent Slate Card (Not pure black) */}
        <div className="card shrink-0 w-full max-w-xl shadow-2xl bg-slate-900/40 backdrop-blur-md border border-white/20">
          <div className="card-body p-10 md:p-14">
            <h2 className="card-title text-3xl font-black mb-8 text-white">
              With <span className="text-primary italic text-shadow-glow">Employee Tracker</span>
            </h2>

            <div className="space-y-6">
              {[
                'Real-time Online Tracking',
                'Documented Employee Clockings',
                'Live Movement Notifications',
                'Daily Location History',
                'PDF/CSV Exporting',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  {/* Primary green checkbox */}
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox checkbox-primary checkbox-md pointer-events-none"
                  />
                  {/* Clean white text with high opacity */}
                  <span className="text-xl text-white font-semibold tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LEFT SIDE: The Hook */}
        <div className="text-left max-w-2xl">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-secondary drop-shadow-lg">
            Track your <br />
            <span className="text-primary">Employees</span> <br />
            with Precision.
          </h1>
          <p className="py-8 text-xl text-white/90 leading-relaxed font-medium">
            The ultimate field-force tracking management tool. Monitor live locations and streamline
            attendance without the manual paperwork.
          </p>
          <button className="btn btn-primary btn-lg px-12 shadow-xl shadow-primary/20">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}
