import React, { useEffect } from "react";
import "ol/ol.css";
import { map } from "./MapFunctions/layers";
import { Button } from "@/components/ui/button"; // Adjust the import path as needed
import { useAuth } from "./AuthProvider";
import axios from "axios";

export default function MapComponent() {
  const { logout } = useAuth();

  useEffect(() => {
    const mapElement = document.getElementById("map");
    console.log("Map container dimensions:", mapElement?.offsetWidth, mapElement?.offsetHeight);

    map.setTarget("map");

    return () => map.setTarget(undefined);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5160/api/auth/logout"); // Ensure this matches your backend logout route
      logout(); // Clear token in frontend
      // Optionally, redirect to login page or handle after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full bg-gray-200" /> {/* Added background color for visibility */}
      <Button onClick={handleLogout} className="absolute top-4 right-4">
        Logout
      </Button>
    </div>
  );
}
