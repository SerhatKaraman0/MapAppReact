// FeaturePopup.tsx
import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Adjust import path if needed

interface FeaturePopupProps {
  feature: unknown; // Adjust type based on your feature structure
  onClose: () => void;
}

const FeaturePopup: React.FC<FeaturePopupProps> = ({ feature, onClose }) => {
  if (!feature) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <button>Show Details</button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <h3 className="font-medium">Feature Info</h3>
          <p>ID: {feature.getId()}</p>
          <p>Type: {feature.getGeometry().getType()}</p>
          <p>Name: {feature.get("name")}</p>
          <button
            onClick={onClose}
            className="mt-2 bg-red-500 text-white p-2 rounded"
          >
            Close
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FeaturePopup;
