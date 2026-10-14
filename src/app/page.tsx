import CategoryMenu from "@/components/home/CategoryMenu";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";
import RecommendedRestaurants from "@/components/home/RecommendedRestaurants";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white font-display">
      <div className="relative">
        <Navbar variant="home" />
        <Hero />
      </div>

      <CategoryMenu />

      <RecommendedRestaurants />

      <Footer />
    </main>
  );
}
