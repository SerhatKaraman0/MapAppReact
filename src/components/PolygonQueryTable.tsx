import { React, useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PiMagnifyingGlassBold, PiPenNib } from "react-icons/pi";
import * as PolygonApi from "../ApiService/PolygonQueryService";
import { Wkt, WktResponse } from "./MapFunctions/interfaces";
import { Button } from "./ui/button";
import { RiDeleteBin5Line } from "react-icons/ri";
import { refreshMap } from "./MapFunctions/layers";
import { updatePolygonButton } from "./MapFunctions/map_functions";

import {
  viewPolygonButton,
  deletePolygonButton,
} from "./MapFunctions/map_functions";
import { toast } from "sonner";

export default function PolygonQueryTable() {
  const [wktData, setWktData] = useState<Wkt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = (await PolygonApi.getAllWkt()) as WktResponse; // will add owner id
        if (response && response.success) {
          setWktData(response.wkt);
        } else {
          setError(response.responseMessage || "Failed to fetch data");
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
      {wktData.map((wkt) => (
        <Card
          key={wkt.id}
          className="m-5 relative transition-transform transform hover:-translate-x-12 group"
        >
          <AspectRatio ratio={16 / 9}>
            <img
              src={wkt.photoLocation}
              alt="Polygon Image"
              className="rounded-t-md object-cover"
            />
          </AspectRatio>
          <CardHeader>
            <CardTitle className="mt-2">{wkt.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{wkt.description}</p>
          </CardContent>

          {/* Hidden buttons that appear on hover */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              variant="outline"
              className="ml-2 w-12"
              onClick={() => {
                viewPolygonButton(wkt.id);
              }}
            >
              <PiMagnifyingGlassBold />
            </Button>
            <Button
              variant="outline"
              className="ml-2 w-12"
              onClick={async () => {
                await updatePolygonButton(wkt.id);
              }}
            >
              <PiPenNib />
            </Button>
            <Button
              variant="outline"
              className="ml-2 w-12"
              onClick={async () => {
                const response = await deletePolygonButton(wkt.id);
                if (response.success) {
                  toast.info(`Shape deleted successfully`, {
                    description: `${JSON.stringify(response)}`,
                    position: "bottom-left",
                  });
                } else {
                  toast.error(`Error deleting shape`, {
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
