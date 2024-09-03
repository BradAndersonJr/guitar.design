import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Box, Star, SquareFunction } from "lucide-react";

type GuitarParam = {
  id: string;
  name: string;
  type: "group" | "param";
  level: number;
  expanded: boolean;
  unit?: string;
  value?: string;
  description?: string;
  starred: boolean;
  parentGroup: string;
  advanced: boolean;
};

const ParameterRow: React.FC<{ param: GuitarParam }> = ({ param }) => {
  const toggleExpanded = () => {
    if (param.type === "group") {
      param.expanded = !param.expanded;
      // In a real application, you'd update the data source here
    }
  };

  return (
    <div
      className={`flex items-center ${param.type === "group" ? "cursor-pointer font-semibold" : ""}`}
      style={{ paddingLeft: `${param.level * 20}px` }}
      onClick={param.type === "group" ? toggleExpanded : undefined}
    >
      {param.type === "group" && (
        <ChevronRight className={`h-4 w-4 mr-2 transition-transform ${param.expanded ? "transform rotate-90" : ""}`} />
      )}
      {param.type === "group" ? (
        <span className="flex items-center">
          <Box className="h-4 w-4 mr-2" />
          {param.name}
        </span>
      ) : (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              param.starred = !param.starred;
              // In a real application, you'd update the data source here
            }}
            className="p-0 h-auto mr-2"
          >
            <Star className={`h-4 w-4 ${param.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
            <span className="sr-only">{param.starred ? "Unstar" : "Star"} parameter</span>
          </Button>
          <SquareFunction className="h-4 w-4 mr-2" />
          <span>{param.name}</span>
        </div>
      )}
    </div>
  );
};

export default ParameterRow;