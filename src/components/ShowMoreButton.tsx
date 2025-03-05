
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type ShowMoreButtonProps = {
  showAll: boolean;
  totalCount: number;
  onToggle: () => void;
};

export const ShowMoreButton = ({ showAll, totalCount, onToggle }: ShowMoreButtonProps) => {
  return (
    <div className="mt-8 flex justify-center">
      <Button 
        onClick={onToggle} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        {showAll ? (
          <>
            Show Less <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            Show All ({totalCount}) <ChevronDown className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};