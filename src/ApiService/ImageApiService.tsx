import axios from "axios";

const accessToken =
  "pk.eyJ1IjoibWFzdGVyLW9mLW5vbmUiLCJhIjoiY2x6OHhiZWU3MDZsNzJscXY5ZW92djRmMyJ9.8T-Z5F_eolNTQw2RM5z9jQ";
const baseUrl =
  "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/geojson(";

export async function getStaticImage(geojson: object): Promise<string> {
  const geojsonString = encodeURIComponent(JSON.stringify(geojson));
  const url = `${baseUrl}${geojsonString})/auto/300x200?before_layer=admin-0-boundary-bg&access_token=${accessToken}`;

  // Return the URL directly since Mapbox provides the static image URL
  return url;
}
