import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PiMagnifyingGlassBold, PiPenNib } from "react-icons/pi";
import { RiDeleteBin5Line } from "react-icons/ri";
import * as PointApi from "../ApiService/PointQueryService";
import { Point, PointResponse } from "./MapFunctions/interfaces";
import {
  viewButton,
  deleteButton,
  updatePointButton,
} from "./MapFunctions/map_functions";
import { refreshMap } from "./MapFunctions/layers";
import { toast } from "sonner";

export default function PointQueryTable() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = (await PointApi.getAllPoints()) as PointResponse; // will add user id
        if (response && response.success) {
          setPoints(response.point);
        } else {
          setPoints([]);
        }
      } catch (err) {
        setError("Error fetching points");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  if (loading) {
    return (
      <ScrollArea className="max-h-[850px] overflow-y-auto">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="w-[300px] h-[200px] rounded-lg m-5" />
          ))}
      </ScrollArea>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <ScrollArea className="max-h-[850px] overflow-y-auto">
      {points.map((point) => (
        <Card
          key={point.id}
          className="m-5 relative transition-transform transform hover:-translate-x-12 group"
        >
          <CardHeader>
            <CardTitle>{point.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              X Coordinate: {point.x_coordinate}
              <br />Y Coordinate: {point.y_coordinate}
            </p>
          </CardContent>

          {/* Hidden buttons that appear on hover */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              variant="outline"
              className="ml-2 w-12"
              onClick={() => viewButton(point.x_coordinate, point.y_coordinate)}
            >
              <PiMagnifyingGlassBold />
            </Button>
            <Button
              variant="outline"
              className="ml-2 w-12"
              onClick={async () => {
                await updatePointButton(point.id);
              }}
            >
              <PiPenNib />
            </Button>
            <Button
              variant="outline"
              className="ml-2 w-12"
              onClick={async () => {
                const response = await deleteButton(point.id);
                if (response.success) {
                  toast.info(`Point deleted successfully`, {
                    description: `${JSON.stringify(response)}`,
                    position: "bottom-left",
                  });
                } else {
                  toast.error(`Error deleting point`, {
                    description: `${JSON.stringify(response)}`,
                    position: "bottom-left",
                  });
                }
                await refreshMap();
              }}
            >
              <RiDeleteBin5Line />
            </Button>
          </div>
        </Card>
      ))}
    </ScrollArea>
  );
}
