import Point from "ol/geom/Point.js";
import { Modify } from "ol/interaction.js";
import Draw from "ol/interaction/Draw.js";
import WKT from "ol/format/WKT.js";
import {
  map,
  markerLayer,
  polygonLayer,
  featureCollection,
  markers,
  refreshMap,
} from "./layers";
import * as PointApi from "/Users/user/Desktop/react-map-app/src/ApiService/PointQueryService.tsx";
import * as PolygonApi from "/Users/user/Desktop/react-map-app/src/ApiService/PolygonQueryService.tsx";
import { Feature } from "ol";
import { Style, Icon } from "ol/style";
import { PointResponse, WktResponse } from "./interfaces";
import { toast } from "sonner";
import { getStaticImage } from "/Users/user/Desktop/react-map-app/src/ApiService/ImageApiService.tsx";
import { jsPanel } from "jspanel4";


let draw, snap;
let modify, modifyInteraction;

let mapClickHandler;

export function dragAndUpdate() {
  modify = new Modify({
    // The source where features are added or modified
    source: markerLayer.getSource(),
    // Optional: Use this to define how to handle the hit detection
    hitDetection: markerLayer,
  });

  // Add the modify interaction to the map
  map.addInteraction(modify);

  modifyInteraction = new Modify({
    features: featureCollection, // Pass the Collection instance here
  });

  map.addInteraction(modifyInteraction);

  if (modifyInteraction) {
    map.removeInteraction(modifyInteraction); // Remove existing interaction if any
  }

  modify.on("modifystart", () => {
    map.getTargetElement().style.cursor = "grabbing";
  });

  modify.on("modifyend", async (event) => {
    console.log("Modify end event fired");
    const features = event.features.getArray();
    console.log("Features modified:", features);
    for (const feature of features) {
      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        const pointId = feature.getId(); // Get the feature ID
        const updatedX = coordinates[0];
        const updatedY = coordinates[1];
        const name = feature.get("name"); // Preserve the name of the point
        const date = "";
        console.log(
          `Updating point ID ${pointId} to coordinates [${updatedX}, ${updatedY}]`
        );

        // Call the API to update the point
        try {
          const response = await PointApi.updatePoint(
            pointId,
            updatedX,
            updatedY,
            name,
            date
          );
          toast.success("Successfully updated the point", {
            description: `${JSON.stringify(response)}`,
            position: "bottom-left",
          });
        } catch (error) {
          toast.error("An Error occured updating the point", {
            description: error,
            position: "bottom-left",
          });
        }
      }
    }
  });
}

export function disableDragAndDropAction() {
  map.getTargetElement().style.cursor = "";
  if (modify) {
    map.removeInteraction(modify);
    modify = null; // Clear the reference
  }

  // Remove the modify interaction for the feature collection
  if (modifyInteraction) {
    map.removeInteraction(modifyInteraction);
    modifyInteraction = null; // Clear the reference
  }
}

export function onMapClick(coordinate) {
  drawMarker(coordinate);
}

// Function to enable map click
export function enableMapClick() {
  if (mapClickHandler) return; // Prevent multiple listeners
  mapClickHandler = (e) => {
    console.log("Map clicked at coordinate: ", e.coordinate); // Add debug info
    onMapClick(e.coordinate);
  };
  map.on("click", mapClickHandler);
}
// Function to disable map click
export function disableMapClick() {
  if (mapClickHandler) {
    map.un("click", mapClickHandler);
    mapClickHandler = null;
  }
}

export function drawMarker(coordinates) {
  const feature = new Feature({
    geometry: new Point(coordinates),
  });

  feature.setStyle(
    new Style({
      image: new Icon({
        anchor: [0.5, 0.7],
        src: "/assets/location-pin.png",
        scale: 0.39,
        opacity: 0.8,
      }),
    })
  );

  markers.push(feature);
  markerLayer.getSource().addFeature(feature);
  featureCollection.push(feature);
  return feature;
}

function getGeoJson(coordinates) {
  function mercatorToLatLon(x, y) {
    const lon = (x * 180) / 20037508.34;
    let lat = (y * 180) / 20037508.34;
    lat =
      (180 / Math.PI) *
      (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
    return [parseFloat(lon.toFixed(2)), parseFloat(lat.toFixed(2))];
  }

  const latLonCoordinates = [];

  coordinates.forEach((coordinate) => {
    latLonCoordinates.push(mercatorToLatLon(coordinate[0], coordinate[1]));
  });

  const geoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [latLonCoordinates],
        },
        properties: {
          prop0: "value0",
          prop1: { this: "that" },
          fill: "#ffffff",
          "fill-opacity": 0.5,
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: latLonCoordinates,
        },
        properties: {
          stroke: "#ff0000",
          "stroke-width": 2,
        },
      },
    ],
  };

  return geoJson;
}

export function drawOnMap(shape) {
  modify = new Modify({
    source: polygonLayer.getSource(),
  });
  map.addInteraction(modify);

  draw = new Draw({
    source: polygonLayer.getSource(),
    type: shape,
  });

  map.addInteraction(draw);

  draw.on("drawend", async (event) => {
    const feature = event.feature;
    const geometry = feature.getGeometry();

    if (geometry.getType() === "Circle") {
      console.log("in override");
      console.log("CIRCLE(" + geometry.getCenter().join(" ") + ")");
    } else {
      try {
        const format = new WKT();
        const wkt = format.writeGeometry(geometry);

        if (
          geometry.getType() === "Polygon" ||
          geometry.getType() === "MultiPolygon"
        ) {
          let coordinates = geometry.getCoordinates();

          const geojson = getGeoJson(coordinates[0]);

          if (geometry.getType() === "MultiPolygon") {
            coordinates = coordinates.flat(); // Flatten if needed
          }

          const response = await getStaticImage(geojson);
          const shapeName = "deneme";
          const shapeDescription = "This is a shape";
          const shapeWkt = wkt;
          const shapeImage = response;
          const shapeColor = "";
          const date = "";

          const wktResponse = (await PolygonApi.createWkt(
            shapeName,
            shapeDescription,
            shapeWkt,
            shapeImage,
            shapeColor,
            date
          )) as WktResponse;
          console.log(wktResponse);

          if (wktResponse && wktResponse.success) {
            feature.set("name", shapeName);
            feature.set("description", shapeDescription);
            feature.set("shapeWkt", shapeWkt);
            feature.set("shapeImage", shapeImage);
            feature.set("shapeColor", shapeColor);
            console.log(feature);

            toast.success("Wkt created Successfully", {
              description: `{
                wkt: Wkt(...),
                responseMessage: ${wktResponse.responseMessage},
                success: ${wktResponse.success},
              }`,
              position: "bottom-left",
            });
          } else {
            toast.error("Error creating wkt", {
              description: `{
                wkt: null,
                responseMessage: ${wktResponse.responseMessage},
                success: ${wktResponse.success},
              }`,
              position: "bottom-left",
            });
          }
        } else {
          toast.error(`Unsupported geometry type: ${geometry.getType()}`);
        }
      } catch (error) {
        console.error("Error processing the geometry:", error);
        toast.error("An error occurred while processing the geometry.", {
          position: "bottom-left",
        });
      }
    }
  });
}

export function disableDrawOnMap() {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  map.removeInteraction(modify);
  map.removeInteraction(modifyInteraction);
}

export function viewButton(x_coordinate: number, y_coordinate: number) {
  const view = map.getView();

  try {
    if (
      !(
        x_coordinate === 3917151.932317253 && y_coordinate === 4770232.626187268
      )
    ) {
      const centerCoordinates = [3917151.932317253, 4770232.626187268];
      const location = [x_coordinate, y_coordinate];

      // Animate to initial center
      view.animate(
        {
          center: centerCoordinates,
          zoom: 6.5,
          duration: 2000,
        },
        function () {
          view.animate({
            center: location,
            zoom: 14,
            duration: 2000,
          });
        }
      );
    } else {
      const location = [x_coordinate, y_coordinate];

      view.animate({
        center: location,
        zoom: 14,
        duration: 2000,
      });
    }
  } catch (error) {
    console.error("Error fetching point data:", error);
  }
}

export async function deleteButton(id: number) {
  const response = (await PointApi.deletePoint(id)) as Point;
  return response;
}

export async function viewPolygonButton(id: number) {
  const view = map.getView();

  const polygon = (await PolygonApi.getWktById(id)) as WktResponse;
  const format = new WKT();
  const polygonGeometry = format.readFeature(polygon.wkt[0].wkt).getGeometry();
  const extent = polygonGeometry.getExtent();

  view.fit(extent, {
    size: map.getSize(),
    duration: 2000,
    maxZoom: 14,
  });
}

export async function deletePolygonButton(id: number) {
  const response = (await PolygonApi.deleteWkt(id)) as WktResponse;
  return response;
}

export async function updatePointButton(id: number) {
  const point = (await PointApi.getPointById(id)) as PointResponse;

  viewButton(point.point[0].x_coordinate, point.point[0].y_coordinate);

  if (window.currentPanel) {
    window.currentPanel.close();
  }

  const view = map.getView();

  const createPanel = () => {
    window.currentPanel = jsPanel.create({
      headerTitle: `Update Point: ${id}`,
      contentSize: "400 200",
      content: `
        <div style="padding: 10px;">
          <button id="close-panel-btn" style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Close</button>
          <div style="margin-bottom: 10px;">
            <label for="update-point-x-popup" style="display: block; font-weight: bold; margin-bottom: 5px;">X Coordinate:</label>
            <input type="text" id="update-point-x-popup" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px;" value=${point.point[0].x_coordinate} />
          </div>
          <div style="margin-bottom: 10px;">
            <label for="update-point-y-popup" style="display: block; font-weight: bold; margin-bottom: 5px;">Y Coordinate:</label>
            <input type="text" id="update-point-y-popup" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px;" value=${point.point[0].y_coordinate} />
          </div>
          <div style="margin-bottom: 10px;">
            <label for="update-point-name-field-popup" style="display: block; font-weight: bold; margin-bottom: 5px;">Name:</label>
            <input type="text" id="update-point-name-field-popup" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px;" value=${point.point[0].name} />
          </div>
          <button class="btn save-btn" id="update-point-btn-popup" style="width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Apply</button>
        </div>
      `,
      position: "center-top 0 400",
      theme: "light",
      panelSize: {
        width: "400px",
        height: "350px",
      },
      callback: function (panel) {
        const updateBtn = panel.querySelector<HTMLButtonElement>(
          "#update-point-btn-popup"
        );
        const closeBtn =
          panel.querySelector<HTMLButtonElement>("#close-panel-btn");

        // Close button functionality
        closeBtn.addEventListener("click", () => {
          window.currentPanel?.close();
        });

        // Apply button functionality
        updateBtn.addEventListener("click", async () => {
          const pointXInput = panel.querySelector<HTMLInputElement>(
            "#update-point-x-popup"
          );
          const pointYInput = panel.querySelector<HTMLInputElement>(
            "#update-point-y-popup"
          );
          const pointNameInput = panel.querySelector<HTMLInputElement>(
            "#update-point-name-field-popup"
          );

          const point_x_coordinate = pointXInput?.value || "";
          const point_y_coordinate = pointYInput?.value || "";
          const point_name = pointNameInput?.value || "";

          const response = await PointApi.updatePoint(
            id,
            point_x_coordinate,
            point_y_coordinate,
            point_name
          );

          if (response.success) {
            toast.success("Point updated successfully", {
              description: `${JSON.stringify(response)}`,
              position: "bottom-left",
            });
          } else {
            toast.error("Error updating point", {
              description: `${JSON.stringify(response)}`,
              position: "bottom-left",
            });
          }
          refreshMap();
        });
      },
    });
  };

  const onAnimationEnd = () => {
    createPanel();
    view.un("change:center", onAnimationEnd);
    view.un("change:resolution", onAnimationEnd);
  };

  view.on("change:center", onAnimationEnd);
  view.on("change:resolution", onAnimationEnd);
}

type Feature = {
  id: number;
  name: string;
  description: string;
  color: string;
  geometry: string; // or another type based on your geometry data
};

export async function updatePolygonButton(id: number): Promise<void> {
  try {
    // Fetch polygon details
    const polygon = (await PolygonApi.getWktById(id)) as WktResponse;
    await viewPolygonButton(id);

    if (!polygon || !polygon.wkt.length) {
      throw new Error("Polygon data is undefined or empty");
    }

    // Create a WKT format object to read the feature
    const format = new WKT();
    const polygonData = polygon.wkt[0];

    // Read the feature from WKT
    const feature = format.readFeature(polygonData.wkt, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:4326",
    });

    // Assign an ID to the feature
    feature.setId(polygonData.id);

    // Get the source and clear existing features with the same ID
    const source = polygonLayer.getSource();
    const existingFeatures = source.getFeatures();
    existingFeatures.forEach((existingFeature) => {
      if (existingFeature.getId() === id) {
        source.removeFeature(existingFeature);
      }
    });

    // Add the new or updated feature
    source.addFeature(feature);

    // Create and add the Modify interaction
    const modify = new Modify({
      source: source,
    });

    // Add the modify interaction to the map
    map.addInteraction(modify);

    // Track the updated feature
    let updatedFeature: Feature | null = null;

    // Update the polygon on modification end
    modify.on("modifyend", async (event) => {
      const features = event.features.getArray();
      updatedFeature = features.find((f) => f.getId() === id) || null;

      if (updatedFeature) {
        const geometry = updatedFeature.getGeometry();
        const updatedWkt = format.writeGeometry(geometry);

        // Update the WKT data locally
        polygonData.wkt = updatedWkt;
        const newCoordinates = geometry.getCoordinates();
        const geojson = getGeoJson(newCoordinates[0]);
        const response = await getStaticImage(geojson);
        polygonData.photoLocation = response;
      }
    });

    // View change logic
    const view = map.getView();

    const createPanel = () => {
      window.currentPanel = jsPanel.create({
        headerTitle: `Update Polygon: ${id}`,
        contentSize: "400 350",
        content: `
          <div style="padding: 10px;">
          <button id="close-panel-btn" style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Close</button>
            <div style="margin-bottom: 10px;">
              <label for="update-polygon-name" style="display: block; font-weight: bold; margin-bottom: 5px;">Name:</label>
              <input type="text" id="update-polygon-name" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px;" value="${
                polygonData.name || ""
              }" />
            </div>
            <div style="margin-bottom: 10px;">
              <label for="update-polygon-description" style="display: block; font-weight: bold; margin-bottom: 5px;">Description:</label>
              <input type="text" id="update-polygon-description" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px;" value="${
                polygonData.description || ""
              }" />
            </div>
            <div style="margin-bottom: 10px;">
              <label for="update-polygon-color" style="display: block; font-weight: bold; margin-bottom: 5px;">Choose color:</label>
              <input type="color" id="update-polygon-color" value="${
                polygonData.color || "#ff0000"
              }" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 3px;" />
            </div>
            <button class="btn save-btn" id="update-polygon-btn-popup" style="width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Apply</button>
          </div>
        `,
        position: "center-top 0 400",
        theme: "light",
        callback: function (panel: HTMLElement) {
          const closeBtn =
            panel.querySelector<HTMLButtonElement>("#close-panel-btn");

          // Close button functionality
          closeBtn.addEventListener("click", () => {
            window.currentPanel?.close();
          });

          const updateBtn = panel.querySelector<HTMLButtonElement>(
            "#update-polygon-btn-popup"
          );
          const nameInput = panel.querySelector<HTMLInputElement>(
            "#update-polygon-name"
          );
          const descriptionInput = panel.querySelector<HTMLInputElement>(
            "#update-polygon-description"
          );
          const colorInput = panel.querySelector<HTMLInputElement>(
            "#update-polygon-color"
          );

          if (!updateBtn || !nameInput || !descriptionInput || !colorInput) {
            throw new Error("One or more elements are missing in the panel");
          }

          updateBtn.addEventListener("click", async () => {
            const polygonName = nameInput.value ?? polygonData.name;
            const polygonDescription =
              descriptionInput.value ?? polygonData.description;
            const polygonColor = colorInput.value ?? polygonData.color;

            try {
              // If the feature was updated, use the updatedWkt
              const response = await PolygonApi.updateWkt(
                id,
                polygonName,
                polygonDescription,
                polygonData.wkt,
                polygonData.photoLocation,
                polygonColor,
                ""
              );

              if (response.success) {
                toast.success("Polygon updated successfully", {
                  description: `{
                    wkt: 'POLYGON(...)',
                    responseMessage: ${response.responseMessage},
                    success: true
                  }`,
                  position: "bottom-left",
                });
                await refreshMap();
              } else {
                toast.error("Error updating polygon", {
                  description: `{
                    wkt: 'Error',
                    responseMessage: ${response.responseMessage},
                    success: false
                  }`,
                  position: "bottom-left",
                });
              }
            } catch (error) {
              toast.error("Error updating polygon", {
                description: `{
                  wkt: 'Error',
                  responseMessage: ${error},
                  success: false
                }`,
                position: "bottom-left",
              });
            }
          });
        },
      });
    };

    function onAnimationEnd() {
      createPanel();
      view.un("change:center", onAnimationEnd);
      view.un("change:resolution", onAnimationEnd);
    }

    view.on("change:center", onAnimationEnd);
    view.on("change:resolution", onAnimationEnd);
  } catch (error) {
    toast.error("Error fetching polygon data", {
      description: `Error: ${error instanceof Error ? error.message : error}`,
      position: "bottom-left",
    });
  }
}
