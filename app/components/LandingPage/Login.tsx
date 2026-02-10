import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="card shrink-0 w-full max-w-md shadow-2xl bg-slate-900/40 backdrop-blur-md border border-white/20">
      <div className="card-body p-10 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Admin Login</h1>
          <p className="text-white/60 text-sm mt-2">Access the Command Center</p>
        </div>

        <form className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white/80 font-semibold">Email Address</span>
            </label>
            <input
              type="email"
              className="input bg-white/5 border-white/10 text-white focus:border-primary focus:outline-none"
              placeholder="admin@snametech.com"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-white/80 font-semibold">Password</span>
            </label>
            <input
              type="password"
              className="input bg-white/5 border-white/10 text-white focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button className="btn btn-primary btn-block shadow-lg shadow-primary/20 mt-4">
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-white/50">New organization? </span>
          <Link href="/signup" className="text-primary font-bold hover:underline italic">
            Register for v2.0
          </Link>
        </div>
      </div>
    </div>
  );
}
