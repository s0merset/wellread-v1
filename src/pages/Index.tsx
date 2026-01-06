import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import PopularBooks from "@/components/landing/PopularBooks";
import CommunityReviews from "@/components/landing/CommunityReviews";
import Footer from "@/components/landing/Footer";
import Header from "@/components/Header";


const Index = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header variant="landing"/>
      <main className="flex-1">
        <Hero />
        <Features />
        <PopularBooks />
        <CommunityReviews />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
