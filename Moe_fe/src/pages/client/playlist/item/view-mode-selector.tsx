import React from "react";
import { Check, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/common/utils/utils";

interface SortOption {
  label: string;
  id: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface GridListOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface LayoutOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ViewModeSelectorProps {
  searchQuery: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  selectedGridList: string;
  handleGridListChange: (id: string) => void;
  gridListOptions: GridListOption[];

  selectedSort: string;
  handleSortChange: (id: string) => void;
  sortOptions: SortOption[];

  layoutOptions: LayoutOption[];
  handleLayoutChange: (id: string) => void;
  selectedLayout: string;

  getSelectedIcon: (
    selectedId: string,
    options: (SortOption | GridListOption | LayoutOption)[]
  ) => React.ReactNode;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  searchQuery,
  handleSearchChange,

  selectedGridList,
  handleGridListChange,
  gridListOptions,

  selectedSort,
  handleSortChange,
  sortOptions,

  layoutOptions,
  handleLayoutChange,
  selectedLayout,

  getSelectedIcon,
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative me-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search post..."
          className="w-full pl-10 pr-4 py-1.5 rounded-xl bg-zinc-700/50 text-sm text-white placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
      </div>

      <div className="space-x-3">
        {/* Sort Options */}
        <Popover>
          <PopoverTrigger>
            {getSelectedIcon(selectedSort, sortOptions)}
          </PopoverTrigger>
          <PopoverContent className="p-2 w-auto bg-zinc-800 text-white rounded-lg">
            <ul className="space-y-1">
              {sortOptions.map((option) => (
                <li key={option.id}>
                  <button
                    id={option.id}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-700 transition text-sm",
                      selectedSort === option.id && "text-green-400 font-medium"
                    )}
                    onClick={() => handleSortChange(option.id)}
                  >
                    <option.icon className="w-4 h-4" />
                    <span>{option.label}</span>
                    {selectedSort === option.id && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        {/* Grid/List Options */}
        <Popover>
          <PopoverTrigger>
            {getSelectedIcon(selectedGridList, gridListOptions)}
          </PopoverTrigger>
          <PopoverContent className="p-2 w-auto bg-zinc-800 text-white rounded-lg">
            <ul className="space-y-1">
              {gridListOptions.map((option) => (
                <li key={option.id}>
                  <button
                    id={option.id}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-700 transition text-sm",
                      selectedGridList === option.id &&
                        "text-green-400 font-medium"
                    )}
                    onClick={() => handleGridListChange(option.id)}
                  >
                    <option.icon className="w-4 h-4" />
                    <span>{option.label}</span>
                    {selectedGridList === option.id && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        {/* Layout Options */}
        <Popover>
          <PopoverTrigger>
            {getSelectedIcon(selectedLayout, layoutOptions)}
          </PopoverTrigger>
          <PopoverContent className="p-2 w-auto bg-zinc-800 text-white rounded-lg">
            <ul className="space-y-1">
              {layoutOptions.map((option) => (
                <li key={option.id}>
                  <button
                    id={option.id}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-700 transition text-sm",
                      selectedLayout === option.id &&
                        "text-green-400 font-medium"
                    )}
                    onClick={() => handleLayoutChange(option.id)}
                  >
                    <option.icon className="w-4 h-4" />
                    <span>{option.label}</span>
                    {selectedLayout === option.id && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ViewModeSelector;
