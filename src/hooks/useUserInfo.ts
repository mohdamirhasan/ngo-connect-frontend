import { useState, useEffect } from "react";
import apiUrl from "@/api/apiConfig";

const useUserInfo = (Token: any) => {
  const [userType, setUserType] = useState<string | null>(null);
  const [user_id, setUser_id] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users/current`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        const data = await response.json();

        if (response.ok){
          setUserType("user");
          setUser_id(data.id);
        }
        else{
          console.error("Error: " + data.message);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (Token) {
      setIsLoggedIn(true);
      fetchUserInfo();
    } else {
      setIsLoggedIn(false);
    }
  }, [Token]);

  useEffect(() => {
    if (userType && user_id) {
      localStorage.setItem("userType", userType);
      localStorage.setItem("user_id", user_id);
    }
  }, [userType, user_id, Token]);

  return { isLoggedIn };
};

export default useUserInfo;
