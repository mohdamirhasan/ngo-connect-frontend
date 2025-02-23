import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
// import CommunityPage from "./CommunityPage";
import { Card } from "@/components/ui/card";
import ngoCategories from "@/assets/ngoCategories.json";
import { Link } from "react-router-dom";


function HomePage() {

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen w-full m-0 flex flex-col">
      <Navbar />

      <div className="flex-grow mt-4 p-4 sm:mt-8 sm:p-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
        Welcome to Our NGO Community!
      </h1>
      <p className="text-base sm:text-lg text-center text-gray-600 mb-6 sm:mb-8">
        Join hands with us in making a difference and supporting causes that matter.
      </p>
      <div className="cursor-pointer flex gap-2 sm:gap-4 flex-wrap justify-center">
        {ngoCategories.map((category, index) => (
        <Link key={index} to={`/category/${category.category}`}>
          <Card className="border rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 bg-white flex flex-col h-48 w-48 gap-1 max-[700px]:h-40 max-[700px]:w-40">
          <img
            src={category.image}
            className="h-full max-[500px]:h-36 object-cover flex items-center"
          />
          <div className="text-sm max-[700px]:text-[13px] font-bold mb-2 text-gray-800 p-1 leading-tight">
            {category.category}
          </div>
          </Card>
        </Link>
        ))}
      </div>
      </div>
      {/* <CommunityPage /> */}
      <Footer />
    </div>
  );
}

export default HomePage;
