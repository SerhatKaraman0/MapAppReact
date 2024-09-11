interface UserShape {
  id: number;
  name: string;
  description: string;
  wkt: string;
  photoLocation: string;
  color: string;
  date: string;
  ownerId: number;
}

interface UserPoint {
  id: number;
  x_coordinate: number;
  y_coordinate: number;
  name: string;
  date: string;
  ownerId: number;
}

interface UserTab {
  tabId: number;
  tabName: string;
  tabColor: string;
  ownerId: number;
  createdDate: string;
}

interface CreateUserPayload {
  userId: number;
  userName: string;
  userEmail: string;
  userPassword: string;
  createdDate: string;
  userShapes: UserShape[];
  userPoints: UserPoint[];
  userTabs: UserTab[];
}

export async function createUser(
  user_name,
  user_email,
  user_password
): Promise<void> {
  const userPayload: CreateUserPayload = {
    userId: 0,
    userName: user_name,
    userEmail: user_email,
    userPassword: user_password,
    createdDate: "string",
    userShapes: [
      {
        id: 0,
        name: "string",
        description: "string",
        wkt: "POINT(0 0)",
        photoLocation: "string",
        color: "string",
        date: "string",
        ownerId: 0,
      },
    ],
    userPoints: [
      {
        id: 0,
        x_coordinate: 0,
        y_coordinate: 0,
        name: "string",
        date: "string",
        ownerId: 0,
      },
    ],
    userTabs: [
      {
        tabId: 0,
        tabName: "string",
        tabColor: "string",
        ownerId: 0,
        createdDate: "string",
      },
    ],
  };

  try {
    const response = await fetch("http://localhost:5160/api/Users/create", {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // or response.json() if the response is JSON
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

import axios from "axios";

const API_URL = "http://localhost:5160/api/Auth"; // Base URL for your API

export const loginUser = async (email, password) => {
  try {
    const userPayload: CreateUserPayload = {
      userId: 0,
      userName: "string",
      userEmail: email,
      userPassword: password,
      createdDate: "string",
      userShapes: [
        {
          id: 0,
          name: "string",
          description: "string",
          wkt: "POINT(0 0)",
          photoLocation: "string",
          color: "string",
          date: "string",
          ownerId: 0,
        },
      ],
      userPoints: [
        {
          id: 0,
          x_coordinate: 0,
          y_coordinate: 0,
          name: "string",
          date: "string",
          ownerId: 0,
        },
      ],
      userTabs: [
        {
          tabId: 0,
          tabName: "string",
          tabColor: "string",
          ownerId: 0,
          createdDate: "string",
        },
      ],
    };

    const response = await axios.post(`${API_URL}/login`, userPayload);
    console.log(localStorage.getItem("authToken"));
    return response.data; // Assuming the response contains the token and success flag
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed"); // Handle error
  }
};

export async function getUserByEmailAndPwd(email, pwd) {
  const response = await axios.get(
    `http://localhost:5160/api/Users/email/${email}/pwd/${pwd}`
  );
  return response;
}
