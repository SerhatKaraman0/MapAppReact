import React, { useState, useEffect } from "react";
import jsPanel from "jspanel4";
import { refreshMap } from "./MapFunctions/map_functions";
import * as PointApi from "/Users/user/Desktop/react-map-app/src/ApiService/PointQueryService.tsx";
import { PointResponse } from "./interfaces";
import { toast } from "sonner";

interface PanelProps {
  id: number;
}

const UpdatePointPanel: React.FC<PanelProps> = ({ id }) => {
  const [xCoordinate, setXCoordinate] = useState<string>("");
  const [yCoordinate, setYCoordinate] = useState<string>("");
  const [name, setName] = useState<string>("");

  const handleUpdatePoint = async () => {
    try {
      const response = (await PointApi.updatePoint(
        id,
        xCoordinate,
        yCoordinate,
        name
      )) as PointResponse;

      if (response.success) {
        toast.info("Point Updated Successfully", {
          description: `${JSON.stringify(response)}`,
          position: "bottom-left",
        });
      } else {
        toast.error("Error occured updating point", {
          description: `${JSON.stringify(response)}`,
          position: "bottom-left",
        });
      }
      refreshMap();
    } catch (error) {
      console.error("Error updating point:", error);
    }
  };

  useEffect(() => {
    const panel = jsPanel.create({
      headerTitle: `Update Point: ${id}`,
      contentSize: "400 200",
      content: (
        <div style={{ padding: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label
              htmlFor="update-point-x-popup"
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              X Coordinate:
            </label>
            <input
              type="text"
              id="update-point-x-popup"
              style={{
                width: "100%",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
              value={xCoordinate}
              onChange={(e) => setXCoordinate(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label
              htmlFor="update-point-y-popup"
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Y Coordinate:
            </label>
            <input
              type="text"
              id="update-point-y-popup"
              style={{
                width: "100%",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
              value={yCoordinate}
              onChange={(e) => setYCoordinate(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label
              htmlFor="update-point-name-field-popup"
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Name:
            </label>
            <input
              type="text"
              id="update-point-name-field-popup"
              style={{
                width: "100%",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "3px",
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button
            className="btn save-btn"
            id="update-point-btn-popup"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
            onClick={handleUpdatePoint}
          >
            Apply
          </button>
        </div>
      ),
      position: "center-top 0 400",
      theme: "dark",
      panelSize: {
        width: "400px",
        height: "350px",
      },
    });

    return () => {
      panel.close();
    };
  }, [id]);

  return null;
};

export default UpdatePointPanel;
