import { isMobile } from "@/app/components/ismobile";
import LoginPage from "@/app/components/LandingPage/Login";
import MobileLoginPage from "@/app/components/LandingPage/MobileLogin";
import { headers } from "next/headers";

const page = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const mobileCheck = isMobile(userAgent);
  return mobileCheck ? <MobileLoginPage /> : <LoginPage />;
};

export default page;
