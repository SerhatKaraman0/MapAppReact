import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile.js";
import OSM from "ol/source/OSM.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import Collection from "ol/Collection";
import WKT from "ol/format/WKT.js";
import * as PointApi from "@/ApiService/PointQueryService";
import * as PolygonApi from "@/ApiService/PolygonQueryService";
import { PointResponse, WktResponse } from "./interfaces";
import { Fill, Stroke, Icon, Style } from "ol/style";

export const markers = [];
export const featureCollection = new Collection(markers);

export const osmLayer = new TileLayer({
  preload: Infinity,
  source: new OSM(),
});

export const polygonLayer = new VectorLayer({
  source: new VectorSource({ wrapX: false }),
});

export const measureLayer = new VectorLayer({
  source: new VectorSource({ wrapX: false }),
});

export const markerLayer = new VectorLayer({
  source: new VectorSource({ wrapX: false }),
  style: new Style({
    image: new Icon({
      anchor: [0.5, 0.7],
      src: "/assets/pin.png",
      scale: 0.08,
      opacity: 0.8,
    }),
  }),
});

export const map = new Map({
  layers: [osmLayer, markerLayer, polygonLayer, measureLayer],
  view: new View({
    center: [3917151.932317253, 4770232.626187268],
    zoom: 6.5,
    minZoom: 6.5,
    maxZoom: 13,
    constrainResolution: true,
  }),
});

// handle map clicks

function hexToRgb(hex: string): string {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse the r, g, b values
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  // Return the rgb string
  return `${r}, ${g}, ${b}`;
}

export async function viewSelectedPoints(selectedPoints: PointResponse[]) {
  if (selectedPoints) {
    selectedPoints.map((point) => {
      const feature = new Feature({
        geometry: new Point([
          point.point.x_coordinate,
          point.point.y_coordinate,
        ]),
      });
      feature.setId(point.id);
      feature.set("name", point.name);
      feature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1], // Adjust anchor to position the icon correctly
            src: "../assets/location-pin.png", // Path relative to the public directory
            scale: 0.35, // Adjust scale as needed
          }),
        })
      );

      markers.push(feature);
      markerLayer.getSource()?.addFeature(feature);
      featureCollection.push(feature);
    });
  }
}
export async function createAllPolygonMarkers() {
  polygonLayer.getSource()?.clear(); // Clear existing features
  const format = new WKT();

  const response = (await PolygonApi.getAllWkt(5)) as WktResponse;
  const wktArr = [];

  response.wkt.map((shape) => {
    const feature = format.readFeature(shape.wkt, {
      dataProjection: "EPSG:3857",
      featureProjection: "EPSG:3857",
    });

    // Create a style with the polygon's color
    const color = shape.color || "#ff0000"; // Use a default colorPolygonApi. if none is provided
    const fillColor = `rgba(${hexToRgb(color)}, 0.5)`;
    feature.setStyle(
      new Style({
        fill: new Fill({
          color: fillColor, // Set fill color
        }),
        stroke: new Stroke({
          color: "#000000", // Outline color
          width: 2, // Outline width
        }),
      })
    );

    wktArr.push(feature);
  });

  polygonLayer.getSource().addFeatures(wktArr);
}

export async function createAllMarkers() {
  const response = (await PointApi.getAllPoints()) as PointResponse;
  console.log(response);

  // Clear existing features
  markerLayer.getSource()?.clear();
  markers.length = 0;
  featureCollection.clear();

  response.point.map((point) => {
    const feature = new Feature({
      geometry: new Point([point.x_coordinate, point.y_coordinate]),
    });

    feature.setId(point.id);
    feature.set("name", point.name);
    feature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1], // Adjust anchor to position the icon correctly
          src: "../assets/location-pin.png", // Path relative to the public directory
          scale: 0.35, // Adjust scale as needed
        }),
      })
    );

    markers.push(feature);
    markerLayer.getSource()?.addFeature(feature);
    featureCollection.push(feature);
  });
}

export async function refreshMap() {
  // Clear existing markers and polygons
  markerLayer.getSource().clear();
  polygonLayer.getSource().clear();
  featureCollection.clear(); // Clear the feature collection

  // Recreate all markers and polygons
  await createAllMarkers();
  await createAllPolygonMarkers();
}

await createAllMarkers();
await createAllPolygonMarkers();
