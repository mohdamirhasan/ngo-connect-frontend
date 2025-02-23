import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useUserInfo from "@/hooks/useUserInfo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiUrl from "@/api/apiConfig";


const ProfilePage: React.FC = () => {

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [isloggedIn, SetisloggedIn] = useState(false);
  const { isLoggedIn } = useUserInfo(token);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    setUserType(localStorage.getItem('userType'));
  }, [isLoggedIn]);

  const fetchUser = async() => {
    try {
      const response = await fetch(`${apiUrl}/api/users/current`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
      },
      });

      const data = await response.json();
      if (response.ok) {
        setName(data.user.name);
        setEmail(data.user.email);
        SetisloggedIn(true);
      }
      else{
        console.error("Error: " + data.message); 
      }
      
      
    } catch (error) {
      console.error('Error fetching user data:' + error);
    }
  }

  const fetchNgo = async() => {
    try {
      const response = await fetch(`${apiUrl}/api/ngo/current`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok){
        setName(data.name);
        setEmail(data.email);
        SetisloggedIn(true);
      }
      else{
        console.error("No NGO found: " + data.message);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    if(!token){
      SetisloggedIn(false);
    }
  }, [token]);

  useEffect(() => {
    if (userType === "user"){
      fetchUser();
    }
    else if (userType === "ngo"){
      fetchNgo();
    }
  }, [userType])

  const handleLogin = (type: 'user' | 'ngo') => {
    navigate(`/login-${type}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user_id');
    logout();
  }


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-6">
      <Navbar />
      <div className=" mt-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center dark:text-gray-100 mt-4">Profile</h1>

        {/* Profile Settings Card */}
        <Card className="my-6">
                <CardHeader className="text-center">
                  <CardDescription className="text-gray-600">
                    {isloggedIn ? `Welcome back, ${Name}!` : 'Please register or login to continue.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isloggedIn ? (
                    <div className="max-w-md mx-auto">
                    <div className="space-y-4">
                      <div className="">
                        <p className="text-lg font-semibold text-gray-900 text-left">{Email}</p>
                        <p className="text-sm text-gray-900 text-left">
                          {userType === 'ngo' ? 'NGO' : 'User'}
                        </p>
                      </div>
                    </div>          
                      <Button
                        onClick={handleLogout}
                        className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
                      >
                        Logout
                      </Button>
                      <Button
                        onClick={handleLogout}
                        className="w-full mt-4"
                      >
                        Edit Profile
                      </Button>
                    </div>
                    
                  ) : (
                    <div className="space-y-4">
                      <Button
                        onClick={() => handleLogin('user')}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Login as User
                      </Button>
                      <Button
                        onClick={() => handleLogin('ngo')}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                      >
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
            <div className="space-y-4 space-x-2">
              <Button variant="destructive" className="w-full sm:w-auto">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;