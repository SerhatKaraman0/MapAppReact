import React, { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Search, ChevronsLeftRightEllipsis, BadgePlus } from "lucide-react";
import {
  search,
  getNearestPoint,
  generatePoints,
} from "../ApiService/PointQueryService"; // Ensure API functions are correctly imported
import { viewSelectedPoints } from "../components/MapFunctions/layers";

export function CommandComponent() {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDialog, setSelectedDialog] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [nearestPoint, setNearestPoint] = useState<any>(null);

  // Form state for search and nearest point
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, range: 0 });

  // Toggle CommandDialog with Command + K or Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev); // Toggle the Command Dialog
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleDialogOpen = (dialogType: string) => {
    setSelectedDialog(dialogType);
    setDialogOpen(true);
    setOpen(false); // Close the Command Dialog when opening a specific dialog
  };

  const generatePoints = async () => {
    const result = await generatePoints();
    viewSelectedPoints(result);
  };

  const handleSearch = async () => {
    const result = await search(
      coordinates.x,
      coordinates.y,
      coordinates.range
    );
    setSearchResult(result);
  };

  const handleFindNearestPoint = async () => {
    const result = await getNearestPoint(coordinates.x, coordinates.y);
    setNearestPoint(result);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoordinates((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => generatePoints()}>
              <BadgePlus className="mr-2 h-4 w-4" />
              <span>Generate Ten Points</span>
            </CommandItem>
            <CommandItem onSelect={() => handleDialogOpen("search")}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search</span>
            </CommandItem>
            <CommandItem onSelect={() => handleDialogOpen("findNearestPoint")}>
              <ChevronsLeftRightEllipsis className="mr-2 h-4 w-4" />
              <span>Find Nearest Point</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Dialog for Search and Find Nearest Point */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white p-6">
          <DialogHeader>
            <DialogTitle>
              {selectedDialog === "search" && "Search Points in Range"}
              {selectedDialog === "findNearestPoint" && "Find Nearest Point"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {selectedDialog === "search" && (
              <>
                <p>Enter X, Y coordinates and Range to search:</p>
                <br />
                <label>X Coordinate: </label>
                <input
                  type="number"
                  name="x"
                  placeholder="X Coordinate"
                  onChange={handleInputChange}
                  className="border p-2 rounded mb-2"
                />
                <br />
                <label>Y Coordinate: </label>
                <input
                  type="number"
                  name="y"
                  placeholder="Y Coordinate"
                  onChange={handleInputChange}
                  className="border p-2 rounded mb-2"
                />
                <br />
                <label>Range: </label>
                <input
                  type="number"
                  name="range"
                  placeholder="Range"
                  onChange={handleInputChange}
                  className="border p-2 rounded mb-2"
                />
                <br />
                <button
                  onClick={handleSearch}
                  className="bg-blue-500 text-white p-2 rounded mt-2"
                >
                  Search
                </button>
              </>
            )}

            {selectedDialog === "findNearestPoint" && (
              <>
                <p>Enter X, Y coordinates to find the nearest point:</p>
                <br></br>
                <label>X Coordinate: </label>
                <input
                  type="number"
                  name="x"
                  placeholder="X Coordinate"
                  onChange={handleInputChange}
                  className="border p-2 rounded mb-2"
                />
                <br></br>
                <label>Y Coordinate: </label>
                <input
                  type="number"
                  name="y"
                  placeholder="Y Coordinate"
                  onChange={handleInputChange}
                  className="border p-2 rounded mb-2"
                />
                <br></br>
                <button
                  onClick={handleFindNearestPoint}
                  className="bg-blue-500 text-white p-2 rounded mt-2"
                >
                  Find Nearest Point
                </button>
              </>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CommandComponent;
