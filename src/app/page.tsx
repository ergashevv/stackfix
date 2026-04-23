import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Demo from "@/components/Demo";
import UseCases from "@/components/UseCases";
import Differentiation from "@/components/Differentiation";
import Team from "@/components/Team";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <Demo />
        <UseCases />
        <Differentiation />
        <Team />
      </main>
      <Footer />
    </div>
  );
}

