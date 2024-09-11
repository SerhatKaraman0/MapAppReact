import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PolygonQueryTable from "./PolygonQueryTable";
import PointQueryTable from "./PointQueryTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import { AreaChartComponent } from "./StatCharts";
import { useAuth } from "./AuthProvider"; // Make sure this import path is correct

export default function NavbarComponent() {
  const { isLoggedIn, logout } = useAuth(); // Assuming useAuth provides isLoggedIn and logout
  const navigate = useNavigate();

  // State to manage sheet visibility and selected point details
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: "", y: "" });
  const [pointName, setPointName] = useState("");

  // Handle logout function
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5160/api/Auth/logout"); // Ensure this matches your backend logout route
      logout(); // Clear token in frontend
      navigate("/login"); // Optionally, redirect to login page or handle after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  return (
    <nav className="bg-white dark:bg-white absolute top-0 left-0 w-full z-10">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://flowbite.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="../assets/map-icon.png" className="h-8" alt="Map Icon" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            MapApplication
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent dark:bg-transparent dark:border-gray-700">
            <li>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setIsSheetOpen(true)}
                  >
                    Add Point
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[1200px] sm:w-[1200px]">
                  <SheetHeader>
                    <SheetTitle>Add Point</SheetTitle>
                    <SheetDescription>
                      Change coordinates and submit a new point
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="x_coordinate" className="text-right">
                        X Coordinate
                      </Label>
                      <Input
                        id="x_coordinate"
                        value={coordinates.x}
                        onChange={(e) =>
                          setCoordinates({ ...coordinates, x: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="y_coordinate" className="text-right">
                        Y Coordinate
                      </Label>
                      <Input
                        id="y_coordinate"
                        value={coordinates.y}
                        onChange={(e) =>
                          setCoordinates({ ...coordinates, y: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="point_name" className="text-right">
                        Point Name
                      </Label>
                      <Input
                        id="point_name"
                        value={pointName}
                        onChange={(e) => setPointName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit">Save changes</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </li>
            <li>
              <Sheet>
                <SheetTrigger>
                  <Button variant="outline">Query</Button>
                </SheetTrigger>
                <SheetContent className="w-[800px]">
                  <SheetHeader>
                    <SheetTitle>Point and Shape Details</SheetTitle>
                    <SheetDescription>
                      Here you can manage Points and Shapes easily
                    </SheetDescription>
                  </SheetHeader>

                  <Tabs defaultValue="point" className="w-[400px] mx-auto">
                    <TabsList className="flex justify-center w-80">
                      <TabsTrigger value="point">Point</TabsTrigger>
                      <TabsTrigger value="shape">Shape</TabsTrigger>
                    </TabsList>
                    <TabsContent value="point" className="w-80">
                      <PointQueryTable />
                    </TabsContent>
                    <TabsContent value="shape" className="w-80">
                      <PolygonQueryTable />
                    </TabsContent>
                  </Tabs>
                </SheetContent>
              </Sheet>
            </li>
            <li>
              <Drawer>
                <DrawerTrigger>
                  <Button variant="outline">Stats</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>
                      <AreaChartComponent />
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </li>
            {isLoggedIn && (
              <li>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="destructive">Logout</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will log you out of website are you absolutely
                        sure??
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>
                        Yes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
