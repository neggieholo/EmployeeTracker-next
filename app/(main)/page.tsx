import { isMobile } from "../components/ismobile";
import LandingPage from "../components/LandingPage/LandingPage";
import { headers } from "next/headers";
import MobileLandingPage from "../components/LandingPage/MobileLandingPage";

// app/page.tsx
export default async function Hero() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);

  return (
    mobileCheck ? <MobileLandingPage /> : <LandingPage />
  );
}