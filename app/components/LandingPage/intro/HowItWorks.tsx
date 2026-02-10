import React from 'react';

const PlatformShowcase = () => {
  return (
    <section className="py-24 bg-base-100" id="platform">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">One System, Two Experiences</h2>
          <p className="opacity-60">Powerful tools for managers, simple apps for the field.</p>
        </div>

        {/* DAISY UI TABS */}
        <div role="tablist" className="tabs tabs-lifted tabs-lg">
          {/* TAB 1: PRODUCT (The Admin Portal) */}
          <input
            type="radio"
            name="platform_tabs"
            role="tab"
            className="tab font-bold [--tab-bg:var(--fallback-b2,oklch(var(--b2)))]"
            aria-label="Admin Portal"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-200 border-base-300 rounded-box p-10 md:p-16"
          >
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="w-20 h-1 bg-primary mb-6"></div>
                <h2 className="text-4xl font-black mb-6 text-slate-800">Command Center</h2>
                <p className="text-lg opacity-70 mb-8">
                  The Admin Portal gives managers a &quot;God-eye view&quot; of the entire workforce. Track
                  movement in real-time, monitor entry/exit alerts, and generate historical reports
                  with a single click.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-base-100 p-4 rounded-xl shadow-sm">
                    <p className="font-bold text-primary">Live Maps</p>
                    <p className="text-xs opacity-60">Real-time GPS pin movement.</p>
                  </div>
                  <div className="bg-base-100 p-4 rounded-xl shadow-sm">
                    <p className="font-bold text-primary">Geo-Fencing</p>
                    <p className="text-xs opacity-60">Instant zone breach alerts.</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 bg-slate-900 rounded-2xl p-4 shadow-2xl border border-white/5">
                {/* Image of a dashboard with pins and maps */}
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center italic text-white/20"></div>
              </div>
            </div>
          </div>

          {/* TAB 2: HOW IT WORKS (The Worker App) */}
          <input
            type="radio"
            name="platform_tabs"
            role="tab"
            className="tab font-bold [--tab-bg:var(--fallback-b2,oklch(var(--b2)))]"
            aria-label="Worker App"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-200 border-base-300 rounded-box p-10 md:p-16"
          >
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="w-20 h-1 bg-primary mb-6"></div>
                <h2 className="text-4xl font-black mb-6">Seamless Field Integration</h2>
                <p className="text-lg opacity-70 mb-8">
                  We&apos;ve simplified the complex world of GPS telemetry. Your employees don&apos;t need to
                  be tech-savvy; they just need to press one button to sync with the central server.
                </p>
                <div className="flex gap-4">
                  <a href="/how-it-works" className="btn btn-primary px-8">
                    Step-by-Step Guide
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 grid grid-cols-2 gap-4">
                <div className="bg-base-100 p-6 rounded-2xl mt-8 shadow-md border border-primary/5">
                  <p className="font-bold text-primary mb-2">01. App</p>
                  <p className="text-sm opacity-60">
                    Lightweight Android APK optimized for low data usage.
                  </p>
                </div>
                <div className="bg-base-100 p-6 rounded-2xl shadow-md border border-primary/5">
                  <p className="font-bold text-primary mb-2">02. Sync</p>
                  <p className="text-sm opacity-60">
                    Automatic cloud syncing that works even on 3G networks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformShowcase;
