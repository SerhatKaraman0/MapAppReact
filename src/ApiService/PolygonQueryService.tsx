import { WktResponse, WktData } from "@/components/MapFunctions/interfaces";
import { getOwnerIdFromToken } from "./tokenService";

const baseURL = "http://localhost:5160";

// Assuming you have a way to get the token
const token = localStorage.getItem("authToken"); // Replace with your method to get the token
const ownerId = token ? getOwnerIdFromToken(token) : null;

export async function getAllWkt() {
  console.log(token);
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/wkt/all`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()) as WktData[];
    console.log(json);
    return json;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function getWktById(id: number) {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/wkt/${id}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()) as WktData;
    console.log(json);
    return json;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function createWkt(
  name: string,
  description: string,
  wkt: string,
  photoLocation: string,
  color: string,
  date: string
) {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/wkt/create`;
  const payload: Partial<WktData> = {
    Name: name,
    Description: description,
    WKT: wkt,
    PhotoLocation: photoLocation,
    Color: color,
    Date: date,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()) as WktData;
    console.log(json);
    return json;
  } catch (error) {
    console.error("Error creating data:", error);
    throw error; // Optional: Re-throw the error to handle it in the calling function
  }
}

export async function updateWkt(
  id: number,
  name?: string,
  description?: string,
  wkt?: string,
  photoLocation?: string,
  color?: string,
  date?: string
) {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/wkt/update/${id}`;
  const updatedPolygonPayload = {
    Id: id,
    Name: name,
    Description: description,
    WKT: wkt,
    PhotoLocation: photoLocation,
    Color: color,
    Date: date,
  };

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPolygonPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Response status: ${response.status}, message: ${errorText}`
      );
    }

    const json = (await response.json()) as WktResponse;
    return json;
  } catch (error) {
    console.error("Error updating polygon:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
}

export async function deleteWkt(id: number) {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/wkt/delete/${id}`;

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = (await response.json()) as WktData;
    console.log(json);
    return json;
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}
