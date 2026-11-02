import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";

export default function Home() {
  return (
    <main className="relative isolate min-h-dvh bg-white">
      <Navbar />
      <Hero />
      <Features />
    </main>
  );
}
