import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useUserInfo from "@/hooks/useUserInfo";
import useNGOInfo from "@/hooks/useNGOinfo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiUrl from "@/api/apiConfig";

const ProfilePage: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  
  const [userType, setUserType] = useState<string | null>(localStorage.getItem("userType"));
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const ngoInfo = useNGOInfo(token);
  const userInfo = useUserInfo(token);
  const isLoggedIn = userType === "ngo" ? ngoInfo?.isLoggedIn : userInfo?.isLoggedIn;

  useEffect(() => {
    if (!token) {
      setName("");
      setEmail("");
      return;
    }

    const fetchProfile = async () => {
      try {
        const endpoint = userType === "ngo" ? "/api/ngo/current" : "/api/users/current";
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setName(data.name);
          setEmail(data.email);
        } else {
          console.error("Error fetching data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [token, userType]);

  const handleLogin = (type: "user" | "ngo") => {
    navigate(`/login-${type}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-6">
      <Navbar />
      <div className="mt-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center dark:text-gray-100 mt-4">Profile</h1>

        {/* Profile Settings Card */}
        <Card className="my-6">
          <CardHeader className="text-center">
            <CardDescription className="text-gray-600">
              {isLoggedIn ? `Welcome back, ${name}!` : "Please register or login to continue."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoggedIn ? (
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900 text-left">{email}</p>
                  <p className="text-sm text-gray-900 text-left">{userType === "ngo" ? "NGO" : "User"}</p>
                </div>
                <Button onClick={handleLogout} className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white">
                  Logout
                </Button>
                <Button onClick={() => navigate("/edit-profile")} className="w-full mt-4">
                  Edit Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button onClick={() => handleLogin("user")} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Login as User
                </Button>
                <Button onClick={() => handleLogin("ngo")} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  Login as NGO
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Theme Settings Card */}
        <Card className="mb-6 text-center">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Customize your theme preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className="data-[state=checked]:bg-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings Card */}
        <Card className="mb-6 text-center">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                className="data-[state=checked]:bg-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone Card */}
        <Card className="border-red-500 text-center">
          <CardHeader>
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full sm:w-auto">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
