// utils/tokenUtils.ts
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  ownerId: number;
  // Add other fields if needed based on your token's structure
}

export function getOwnerIdFromToken(token: string): number | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return parseInt(decoded.UserId);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export default getOwnerIdFromToken;
