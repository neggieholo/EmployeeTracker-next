import { redirect } from 'next/navigation';

export default function HomePage() {
  // This will immediately move the user to /home/dashboard
  redirect('/home/dashboard');

  // This return is technically never reached, but required for the component structure
  return null;
}
