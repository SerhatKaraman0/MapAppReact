export interface WktData {
  id: number;
  name: string;
  description: string;
  wkt: string;
  photoLocation: string;
  color: string;
  date: string;
  ownerId: number;
}

export interface WktResponse {
  wkt: Wkt[];
  responseMessage: string;
  success: boolean;
}

export interface Point {
  id: number;
  x_coordinate: number;
  y_coordinate: number;
  name: string;
  date: string;
  ownerId: number;
}

export interface PointResponse {
  point: Point[];
  responseMessage: string;
  success: boolean;
}

export interface SideBarIconProps {
  icon: React.ReactNode;
  text: string;
  iconName: string;
  selectedIcon: string | null;
  onClick: (iconName: string) => void;
}

export interface Tab {
  tabId: number;
  tabName: string;
  tabColor: string;
  ownerId: number;
  createdDate: string;
}

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  userPassword: string;
  createdDate: string;
  UserShapes: Wkt[];
  UserPoints: Point[];
  UserTabs: Tab[];
}

export interface UserResponse {
  user: User[];
  responseMessage: string;
  success: boolean;
}

interface Tab {
  id: string;
  label: string;
  tabColor: string;
}

interface TabsOnBottomProps {
  onTabChange?: (activeTab: string) => void;
}
