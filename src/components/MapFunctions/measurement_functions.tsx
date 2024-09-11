import Map from "ol/Map.js";
import View from "ol/View.js";
import {
  Circle as CircleStyle,
  Fill,
  RegularShape,
  Stroke,
  Style,
  Text,
} from "ol/style.js";
import { Draw, Modify } from "ol/interaction.js";
import { LineString, Point, Polygon } from "ol/geom.js";
import { OSM, Vector as VectorSource } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { getArea, getLength } from "ol/sphere.js";
import { map, polygonLayer, measureLayer } from "./layers"; // Import from layers file

const style = new Style({
  fill: new Fill({
    color: "rgba(255, 255, 255, 0.2)",
  }),
  stroke: new Stroke({
    color: "rgba(0, 0, 0, 0.5)",
    lineDash: [10, 10],
    width: 2,
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
  }),
});

const labelStyle = new Style({
  text: new Text({
    font: "14px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    padding: [3, 3, 3, 3],
    textBaseline: "bottom",
    offsetY: -15,
  }),
  image: new RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
  }),
});

const tipStyle = new Style({
  text: new Text({
    font: "12px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
    padding: [2, 2, 2, 2],
    textAlign: "left",
    offsetX: 15,
  }),
});

const modifyStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
  }),
  text: new Text({
    text: "Drag to modify",
    font: "12px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    padding: [2, 2, 2, 2],
    textAlign: "left",
    offsetX: 15,
  }),
});

const segmentStyle = new Style({
  text: new Text({
    font: "12px Calibri,sans-serif",
    fill: new Fill({
      color: "rgba(255, 255, 255, 1)",
    }),
    backgroundFill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
    padding: [2, 2, 2, 2],
    textBaseline: "bottom",
    offsetY: -12,
  }),
  image: new RegularShape({
    radius: 6,
    points: 3,
    angle: Math.PI,
    displacement: [0, 8],
    fill: new Fill({
      color: "rgba(0, 0, 0, 0.4)",
    }),
  }),
});

const segmentStyles = [segmentStyle];

const formatLength = (line: LineString) => {
  const length = getLength(line);
  return length > 100
    ? `${(length / 1000).toFixed(2)} km`
    : `${length.toFixed(2)} m`;
};

const formatArea = (polygon: Polygon) => {
  const area = getArea(polygon);
  return area > 10000
    ? `${(area / 1000000).toFixed(2)} km²`
    : `${area.toFixed(2)} m²`;
};

const source = measureLayer.getSource();

const modify = new Modify({ source, style: modifyStyle });

let tipPoint: Point | undefined;

function styleFunction(
  feature: any,
  segments: boolean,
  drawType: string,
  tip?: string
) {
  const styles = [];
  const geometry = feature.getGeometry();
  const type = geometry.getType();
  let point, label, line;

  if (!drawType || drawType === type || type === "Point") {
    styles.push(style);
    if (type === "Polygon") {
      point = geometry.getInteriorPoint();
      label = formatArea(geometry);
      line = new LineString(geometry.getCoordinates()[0]);
    } else if (type === "LineString") {
      point = new Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    }
  }

  if (segments && line) {
    let count = 0;
    line.forEachSegment((a, b) => {
      const segment = new LineString([a, b]);
      const label = formatLength(segment);
      if (segmentStyles.length - 1 < count) {
        segmentStyles.push(segmentStyle.clone());
      }
      const segmentPoint = new Point(segment.getCoordinateAt(0.5));
      segmentStyles[count].setGeometry(segmentPoint);
      segmentStyles[count].getText().setText(label);
      styles.push(segmentStyles[count]);
      count++;
    });
  }

  if (label) {
    labelStyle.setGeometry(point);
    labelStyle.getText().setText(label);
    styles.push(labelStyle);
  }

  if (
    tip &&
    type === "Point" &&
    !modify.getOverlay().getSource().getFeatures().length
  ) {
    tipPoint = geometry;
    tipStyle.getText().setText(tip);
    styles.push(tipStyle);
  }

  return styles;
}

const vector = new VectorLayer({
  source,
  style: (feature) => styleFunction(feature, true), // Default to Polygon
});

map.addLayer(vector);
map.addInteraction(modify);

let draw: Draw | undefined;

function addInteraction(drawType: "Polygon" | "LineString") {
  const activeTip = `Click to continue drawing the ${drawType.toLowerCase()}`;
  const idleTip = "Click to start measuring";
  let tip = idleTip;

  draw = new Draw({
    source,
    type: drawType,
    style: (feature) => styleFunction(feature, true, drawType, tip),
  });

  draw.on("drawstart", () => {
    modify.setActive(false);
    tip = activeTip;
  });

  draw.on("drawend", () => {
    modifyStyle.setGeometry(tipPoint);
    modify.setActive(true);
    map.once("pointermove", () => {
      modifyStyle.setGeometry();
    });
    tip = idleTip;
  });

  map.addInteraction(draw);
}

export function activatePolygonDrawing() {
  if (draw) {
    map.removeInteraction(draw);
  }
  addInteraction("Polygon");
}

export function activateLineStringDrawing() {
  if (draw) {
    map.removeInteraction(draw);
  }
  addInteraction("LineString");
}

export function disableInteraction() {
  if (draw) {
    map.removeInteraction(draw);
    draw = undefined; // Clear the reference to the removed interaction
  }
  if (modify) {
    map.removeInteraction(modify);
    modify = undefined; // Clear the reference to the removed interaction
  }
}

// Example usage
// activatePolygonDrawing();
// activateLineStringDrawing();
