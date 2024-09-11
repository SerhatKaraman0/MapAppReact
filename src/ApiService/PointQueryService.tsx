import { getOwnerIdFromToken } from "./tokenService";

const baseURL = "http://localhost:5160";

// Interfaces for expected response types
export interface Point {
  id: number;
  X_coordinate: number;
  Y_coordinate: number;
  name: string;
  date: string;
  ownerId: number;
}

interface ApiResponse<T> {
  point: T;
}

interface CountResponse {
  count: number;
}

// Assuming you have a way to get the token
const token = localStorage.getItem("authToken"); // Replace with your method to get the token
const ownerId = token ? getOwnerIdFromToken(token) : null;

// GET Endpoints

export async function getAllPoints(): Promise<
  ApiResponse<Point[]> | undefined
> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/getAll`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()) as ApiResponse<Point[]>;

    return json;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

export async function generatePoints(): Promise<
  ApiResponse<Point[]> | undefined
> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/generate`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()) as ApiResponse<Point[]>;
    console.log(json.point);
    return json;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

export async function getPointById(
  id: number
): Promise<ApiResponse<Point> | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/point/${id}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()) as ApiResponse<Point>;
    console.log(json.point);
    return json;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

export async function getPointsInRadius(
  circleX: number,
  circleY: number,
  radius: number
): Promise<ApiResponse<Point[]> | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/pointsInRadius?circleX=${circleX}&circleY=${circleY}&radius=${radius}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${response.statusText}`
      );
    }
    const json = (await response.json()) as ApiResponse<Point[]>;
    console.log(json.point);
    return json;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function getNearestPoint(
  X_coordinate: number,
  Y_coordinate: number
): Promise<ApiResponse<Point> | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/getNearestPoint?X=${X_coordinate}&Y=${Y_coordinate}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()) as ApiResponse<Point>;
    console.log(json.point);
    return json;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

export async function search(
  X_coordinate: number,
  Y_coordinate: number,
  range: number
): Promise<ApiResponse<Point[]> | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/search?x=${X_coordinate}&y=${Y_coordinate}&range=${range}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()) as ApiResponse<Point[]>;
    console.log(json.point);
    return json;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

export async function count(): Promise<CountResponse | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/count`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()) as CountResponse;
    console.log(json);
    return json;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

export async function distance(
  pointName1: string,
  pointName2: string
): Promise<number | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/distance?pointName1=${pointName1}&pointName2=${pointName2}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = (await response.json()) as number;
    console.log(json);
    return json;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

// POST Endpoints

export async function createPoint(
  X: number,
  Y: number,
  name: string
): Promise<Point | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/add`;

  const payload = {
    X_coordinate: X,
    Y_coordinate: Y,
    Name: name,
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

    const json = (await response.json()) as Point;
    console.log(json);
    return json;
  } catch (error) {
    console.log("Error adding point:", error);
  }
}

// PUT Requests

export async function updatePoint(
  id: number,
  x: number,
  y: number,
  name: string
): Promise<Point | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/point/${id}`;
  const updatedPointPayload = {
    id: id,
    x_coordinate: x,
    y_coordinate: y,
    name: name,
    date: new Date().toISOString(),
  };

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPointPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Response status: ${response.status}, message: ${errorText}`
      );
    }
    const json = (await response.json()) as Point;
    console.log(json);
    return json;
  } catch (error) {
    console.error("Error updating point:", error);
  }
}

export async function updatePointByName(
  nameId: string,
  X: number,
  Y: number,
  name: string
): Promise<Point | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/updateByName/${nameId}`;

  const updatedPointPayload = {
    id: 0,
    x_coordinate: X,
    y_coordinate: Y,
    name: name,
  };

  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPointPayload),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const jsonResponse = (await response.json()) as Point;
    console.log("Point updated successfully:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error updating point:", error);
  }
}

// DELETE Requests

export async function deletePoint(id: number): Promise<Point | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/point/${id}`;

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

    const jsonResponse = (await response.json()) as Point;
    console.log("Point deleted successfully:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error deleting point:", error);
  }
}

export async function deletePointByName(
  name: string
): Promise<Point | undefined> {
  if (ownerId === null) return;

  const endpoint = `${baseURL}/api/Values/${ownerId}/name/${name}`;

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

    const jsonResponse = (await response.json()) as Point;
    console.log("Point deleted successfully:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error deleting point:", error);
  }
}


