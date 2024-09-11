import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  createUser,
  getUserByEmailAndPwd,
} from "@/ApiService/UserApiService";
import { useAuth } from "./AuthProvider"; // Import Auth Context
import { toast } from "sonner"; // Import toast from sonner

export function LoginSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { setToken } = useAuth(); // Get setToken from the context

  // Handle login
  const handleLogin = async () => {
    try {
      const user = await getUserByEmailAndPwd(email, password);

      if (user && user.data.userName) {
        const response = await loginUser(email, password);
        if (response.success) {
          setToken(response.token);
          localStorage.setItem("authToken", response.token);
          navigate(`/${user.data.userName}/main`);
          toast.success("Login successful!");
        }
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login failed:", error);
    }
  };

  // Handle signup
  const handleSignup = async () => {
    try {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format. Please enter a valid email.");
        return;
      }

      // Check if email or username already exists
      const existingUser = await getUserByEmailAndPwd(email, password);
      if (existingUser && existingUser.data.userName) {
        toast.error("Email or username already exists.");
        return;
      }

      const response = await createUser(username, email, password);
      const user = await getUserByEmailAndPwd(email, password);

      if (response.success && user && user.data.userName) {
        const loginResponse = await loginUser(email, password);
        if (loginResponse.success) {
          setToken(loginResponse.token);
          localStorage.setItem("authToken", loginResponse.token);
          navigate(`/${user.data.userName}/main`);
          toast.success("Signup and login successful!");
        }
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <nav className="bg-white absolute top-0 left-0 w-full z-20">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3">
            <img
              src="./src/assets/map-icon.png"
              className="h-8"
              alt="Map Icon"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              MapApplication
            </span>
          </a>
        </div>
      </nav>

      <div className="flex h-full">
        <div className="w-1/2 h-full">
          <img
            src="./assets/staticmap.jpeg"
            alt="map-image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/2 h-full bg-white flex items-center justify-center">
          <Tabs defaultValue="login" className="w-[400px] mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="w-full h-full">
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Access your maps!!!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2">
                  <Button className="w-full" onClick={handleLogin}>
                    Login
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card className="w-full h-full">
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>Create your map account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="myusername"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2">
                  <Button className="w-full" onClick={() => handleSignup}>
                    Sign Up
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
