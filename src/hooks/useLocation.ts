import { useState } from "react";

export const useLocation = () => {
  const [location, setLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setLocation(data.display_name);
      } else {
        setError("Failed to retrieve address.");
      }
    } catch (err) {
      console.error("Error fetching address:", err);
      setError("Error fetching address. Please try again.");
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        getAddressFromCoordinates(latitude, longitude);
        setLoading(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Failed to get location. Please enable location services.");
        setLoading(false);
      }
    );
  };

  return { location, setLocation, coordinates, loading, error, fetchCurrentLocation };
};
