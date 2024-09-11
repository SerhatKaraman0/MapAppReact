import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "./components/AuthProvider";
import MapComponent from "./components/MapComponent";
import NavbarComponent from "./components/NavbarComponent";
import ButtonsOnSide from "./components/ButtonsOnSide";
import { Toaster } from "@/components/ui/sonner";
import TabsOnBottom from "./components/TabsOnBottom";
import { LoginSignupPage } from "./components/LoginSignupPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import NotFound from "./components/NotFound"; // You need to create this component
import CommandComponent from "./components/CommandComponent";

const App = () => {
  const { token } = useAuth();

  const routesForPublic = [{ path: "/login", element: <LoginSignupPage /> }];

  const routesForAuthenticatedOnly = [
    {
      path: "/:username/main", // Parent route for main app area
      element: <ProtectedRoute />, // This checks the token
      children: [
        {
          path: "", // Matches `/main` when authenticated
          element: (
            <div className="relative w-screen h-screen flex">
              <NavbarComponent />
              <MapComponent />
              <ButtonsOnSide />
              <Toaster richColors />
              <CommandComponent />
            </div>
          ),
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: (
        <>
          <LoginSignupPage />
          <Toaster richColors />
        </>
      ),
    },
    { path: "*", element: <NotFound /> }, // 404 route for unauthenticated users
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...(token ? routesForAuthenticatedOnly : []),
    { path: "*", element: <NotFound /> }, // Catch-all route for authenticated users
  ]);

  return <RouterProvider router={router} />;
};

export default App;
