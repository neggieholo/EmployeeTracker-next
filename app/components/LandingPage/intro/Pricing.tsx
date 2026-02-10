import React from 'react'

const Pricing = () => {
  return (
    <section className="py-24 bg-base-200">
      <div className="max-w-4xl mx-auto text-center px-8">
        <h2 className="text-4xl font-black mb-6">Simple, Scalable Pricing</h2>
        <p className="text-lg opacity-70 mb-10">
          Whether you are tracking 10 staff or 1,000, our per-user licensing grows with your
          business. No hidden setup fees.
        </p>
        <div className="card bg-base-100 shadow-xl p-8 border border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left">
              <p className="text-sm font-bold text-primary uppercase tracking-widest">
                Starting from
              </p>
              <h3 className="text-3xl font-black">Flexible Enterprise Plans</h3>
            </div>
            <a href="/pricing" className="btn btn-primary btn-lg px-12">
              View All Plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing