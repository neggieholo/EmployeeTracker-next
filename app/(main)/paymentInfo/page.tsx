'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

const PaymentInfo = () => {
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const getPaymentInfoParams = () => {
         const status = searchParams.get('success');
         if (status === 'true') {
           setIsSuccess(true);
         } else if (status === 'false') {
           setIsSuccess(false);
         }
    }

    getPaymentInfoParams();
   
  }, [searchParams]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950">
      <div className="card w-full max-w-lg shadow-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 text-white animate-in zoom-in duration-500">
        <div className="card-body items-center text-center p-10">
          {isSuccess === true ? (
            <>
              <div className="bg-success/20 p-4 rounded-full mb-4">
                <CheckCircle className="w-16 h-16 text-success" />
              </div>
              <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                Payment Success!
              </h1>
              <p className="text-white/60 mb-8">
                Your enterprise account has been provisioned. We&apos;ve sent your login details and
                setup guide to your official email.
              </p>

              <div className="flex flex-col w-full gap-3">
                <Link
                  href="/login"
                  className="btn btn-primary btn-block shadow-lg shadow-primary/20"
                >
                  Go to Login <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </>
          ) : isSuccess === false ? (
            <>
              <div className="bg-error/20 p-4 rounded-full mb-4">
                <XCircle className="w-16 h-16 text-error" />
              </div>
              <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                Payment Failed
              </h1>
              <p className="text-white/60 mb-8">
                We couldn&apos;t verify your transaction. This might be due to insufficient funds or a
                bank timeout. No worries, your details are still safe.
              </p>

              <div className="flex flex-col w-full gap-3">
                <Link
                  href="/plans"
                  className="btn btn-outline btn-block border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
                </Link>
                <Link href="/contact" className="btn btn-ghost btn-sm text-white/40">
                  Contact Support
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-white/50 italic">Verifying transaction status...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
