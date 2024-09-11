import { useState } from "react";
import { GiReturnArrow, GiPathDistance } from "react-icons/gi";
import { RiDragMove2Line } from "react-icons/ri";
import { PiPolygonLight, PiCodepenLogoFill } from "react-icons/pi";
import { TbCircleDashed } from "react-icons/tb";
import { CiLocationOn } from "react-icons/ci";
import { TbRulerMeasure } from "react-icons/tb";

import { SideBarIconProps } from "./MapFunctions/interfaces";
import {
  drawOnMap,
  disableDrawOnMap,
  disableDragAndDropAction,
  dragAndUpdate,
  enableMapClick,
  disableMapClick,
} from "./MapFunctions/map_functions";
import { toast } from "sonner";
import { map } from "./MapFunctions/layers";
import { Icon } from "ol/style";
import {
  activateLineStringDrawing,
  activatePolygonDrawing,
  disableInteraction,
} from "./MapFunctions/measurement_functions";

const ButtonsOnSide = () => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleIconClick = (iconName: string) => {
    setSelectedIcon((prevIcon) => (prevIcon === iconName ? null : iconName));
  };

  // Handle the "Return" button click separately
  const handleReturnClick = () => {
    const view = map.getView();
    const centerCoordinates = [3917151.932317253, 4770232.626187268];

    view.animate({
      center: centerCoordinates,
      zoom: 6.5,
      duration: 2000,
    });
    // Implement the return logic here, e.g., reset map state or navigate back
  };

  return (
    <div className="fixed flex flex-col justify-center items-start h-screen top-0 left-0 z-11">
      <div className="bg-white rounded-3xl p-1 shadow-2xl ml-2 border-2 border-dashed border-black">
        <SideBarIcon
          icon={<GiReturnArrow size="28" />}
          text="Return"
          iconName="return"
          selectedIcon={selectedIcon}
          onClick={handleReturnClick} // Use the separate handler
        />
        <SideBarIcon
          icon={<CiLocationOn size="32" />}
          text="Add Point"
          iconName="addPoint"
          selectedIcon={selectedIcon}
          onClick={async () => {
            if (selectedIcon === "addPoint") {
              disableMapClick();
              disableDrawOnMap();
              disableDragAndDropAction();
              setSelectedIcon(null);
            } else {
              toast.info(`Add Point Mode Activated`, {
                position: "top-right",
              });
              handleIconClick("addPoint");
              enableMapClick();
            }
          }}
        />
        <SideBarIcon
          icon={<RiDragMove2Line size="32" />}
          text="Drag And Update"
          iconName="dragAndUpdate"
          selectedIcon={selectedIcon}
          onClick={async () => {
            if (selectedIcon === "dragAndUpdate") {
              disableDrawOnMap();
              disableDragAndDropAction();
              setSelectedIcon(null);
            } else {
              toast.info(`Drag And Update Mode Activated`, {
                position: "top-right",
              });
              handleIconClick("dragAndUpdate");
              dragAndUpdate();
            }
          }}
        />
        <SideBarIcon
          icon={<PiPolygonLight size="28" />}
          text="Draw Polygon"
          iconName="polygon"
          selectedIcon={selectedIcon}
          onClick={async () => {
            if (selectedIcon === "polygon") {
              disableDrawOnMap();
              disableDragAndDropAction();
              setSelectedIcon(null);
            } else {
              toast.info(`Draw Polygon Mode Activated`, {
                position: "top-right",
              });
              handleIconClick("polygon");
              drawOnMap("Polygon");
            }
          }}
        />
        <SideBarIcon
          icon={<TbCircleDashed size="32" />}
          text="Draw Circle"
          iconName="circle"
          selectedIcon={selectedIcon}
          onClick={() => {
            if (selectedIcon === "circle") {
              disableDrawOnMap();
              disableDragAndDropAction();
              setSelectedIcon(null);
            } else {
              toast.info(`Draw Circle Mode Activated`, {
                position: "top-right",
              });
              handleIconClick("circle");
              drawOnMap("Circle");
            }
          }}
        />
        <SideBarIcon
          icon={<GiPathDistance size="32" />}
          text="Draw LineString"
          iconName="linestring"
          selectedIcon={selectedIcon}
          onClick={() => {
            if (selectedIcon === "linestring") {
              disableDrawOnMap();
              disableDragAndDropAction();
              setSelectedIcon(null);
            } else {
              toast.info(`Draw Line String Mode Activated`, {
                position: "top-right",
              });
              handleIconClick("linestring");
              drawOnMap("LineString");
            }
          }}
        />

        <SideBarIcon
          icon={<TbRulerMeasure size="32" />}
          text="Measure Distance"
          iconName="measureDistance"
          selectedIcon={selectedIcon}
          onClick={() => {
            if (selectedIcon === "measureDistance") {
              disableDrawOnMap();
              disableDragAndDropAction();
              disableInteraction();
              setSelectedIcon(null);
            } else {
              toast.info(`Distance Measure Mode Activated`, {
                position: "top-right",
              });
              handleIconClick("measureDistance");
              activateLineStringDrawing();
            }
          }}
        />

        <SideBarIcon
          icon={<PiCodepenLogoFill size="32" />}
          text="Measure Area"
          iconName="measureArea"
          selectedIcon={selectedIcon}
          onClick={() => {
            if (selectedIcon === "measureArea") {
              disableDrawOnMap();
              disableDragAndDropAction();
              disableInteraction();
              setSelectedIcon(null);
            } else {
              toast.info(`Measure Area Mode Activated`, {
                position: "top-right",
              });
              handleIconClick("measureArea");
              activatePolygonDrawing();
            }
          }}
        />
      </div>
    </div>
  );
};

const SideBarIcon = ({
  icon,
  text,
  iconName,
  selectedIcon,
  onClick,
}: SideBarIconProps) => (
  <div
    onClick={() => onClick(iconName)}
    className={`sidebar-icon group relative flex items-center justify-center mb-4 last:mb-0 cursor-pointer ${
      selectedIcon === iconName ? "bg-indigo-600" : ""
    }`}
  >
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100 absolute left-full ml-2 w-max transform scale-0 rounded bg-gray-800 p-2 text-white transition-all">
      {text}
    </span>
  </div>
);

export default ButtonsOnSide;
