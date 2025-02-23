import { UserCircle, LayoutDashboard, Menu, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUserInfo from "@/hooks/useUserInfo";
import { useAuth } from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const { token } = useAuth();
  const { isLoggedIn } = useUserInfo(token);
  const [isngo, setIsngo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setUserType(localStorage.getItem("userType"));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (userType === "ngo") {
      setIsngo(true);
    } else {
      setIsngo(false);
    }
  }, [userType]);

  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 w-full bg-white shadow-md z-50">
      <Link to="/">
        <h1 className="text-xl font-bold text-gray-800">NGO Connect</h1>
      </Link>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        <Menu className="h-6 w-6 text-gray-800" />
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-center items-center gap-4 md:gap-10">
        {isngo && (
          <Link
            to="/dashboard"
            className="flex items-center space-x-1 md:space-x-2 group">
            <LayoutDashboard className="hover:cursor-pointer h-3 w-3 md:h-7 md:w-8 text-gray-800 group-hover:text-gray-600 transition-colors duration-300" />
            <h3 className="font-semibold text-xs md:text-sm text-gray-800 group-hover:text-gray-600 transition-colors duration-300">
              Dashboard
            </h3>
          </Link>
        )}

        {userType === "user" && (
          <Link
            to="/dashboard"
            className="flex items-center space-x-1 md:space-x-2 group">
            <LayoutDashboard className="hover:cursor-pointer h-3 w-3 md:h-7 md:w-8 text-gray-800 group-hover:text-gray-600 transition-colors duration-300" />
            <h3 className="font-semibold text-xs md:text-sm text-gray-800 group-hover:text-gray-600 transition-colors duration-300">
              Reports
            </h3>
          </Link>
        )}

        <Link
          to="/report"
          className="flex items-center space-x-1 md:space-x-2 group">
          <ClipboardList className="hover:cursor-pointer h-3 w-3 md:h-7 md:w-8 text-gray-800 group-hover:text-gray-600 transition-colors duration-300" />
          <h3 className="font-semibold text-xs md:text-sm text-gray-800 group-hover:text-gray-600 transition-colors duration-300">
            Raise a request
          </h3>
        </Link>

        <Link
          to="/profile"
          className="flex items-center space-x-1 md:space-x-2 group">
          <UserCircle className="hover:cursor-pointer h-3 w-3 md:h-8 md:w-8 text-gray-800 group-hover:text-gray-600 transition-colors duration-300" />
          <h3 className="font-semibold text-xs md:text-sm text-gray-800 group-hover:text-gray-600 transition-colors duration-300">
            Profile
          </h3>
        </Link>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white shadow-md md:hidden flex flex-col items-left p-6 py-4 space-y-6">
          {isngo && (
            <Link
              to="/dashboard"
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(false)}>
              <LayoutDashboard className="h-8 w-8 text-gray-800" />

              <h3 className="font-semibold text-sm text-gray-800">Dashboard</h3>
            </Link>
          )}

          {userType === "user" && (
            <Link
              to="/dashboard"
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(false)}>
              <LayoutDashboard className="h-8 w-8 text-gray-800" />
              <h3 className="font-semibold text-sm text-gray-800">Reports</h3>
            </Link>
          )}

          <Link
            to="/report"
            className="flex items-center space-x-1 md:space-x-2 group">
            <ClipboardList className="hover:cursor-pointer h-8 w-8 md:h-7 md:w-8 text-gray-800 group-hover:text-gray-600 transition-colors duration-300" />

            <h3 className="font-semibold text-sm md:text-lg text-gray-800 group-hover:text-gray-600 transition-colors duration-300">
              Raise a request
            </h3>
          </Link>

          <Link
            to="/profile"
            className="flex items-center space-x-2"
            onClick={() => setIsOpen(false)}>
            <UserCircle className="h-8 w-8 text-gray-800" />
            <h3 className="font-semibold text-sm text-ray-800">Profile</h3>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
