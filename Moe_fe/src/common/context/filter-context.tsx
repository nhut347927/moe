import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";

// Định nghĩa kiểu dữ liệu cho các bộ lọc
export type FilterType = {  // Export FilterType, not Filters
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  opacity: number;
  invert: number;
  grayscale: number;
  blur: number;
  sepia: number;
};

// Định nghĩa kiểu dữ liệu cho Context
export type FilterContextType = {
  filters: FilterType;
  setFilters: Dispatch<SetStateAction<FilterType>>;
  updateFilter: (type: keyof FilterType, value: number) => void;
};

// Khởi tạo context với kiểu dữ liệu ban đầu
export const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Kiểu dữ liệu cho props của Provider
type FilterProviderProps = {
  children: ReactNode;
};

// Tạo Provider để bao bọc các component khác
export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterType>(() => {
    const savedFilters = localStorage.getItem("filters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          brightness: 1,
          contrast: 1,
          saturate: 1,
          hueRotate: 0,
          opacity: 1,
          invert: 0,
          grayscale: 0,
          blur: 0,
          sepia: 0,
        };
  });

  const updateFilter = (type: keyof FilterType, value: number) => {
    setFilters((prevFilters) => {
      const newValue = Math.max(
        Math.min(value, getMaxValue(type)),
        getMinValue(type)
      );
      return { ...prevFilters, [type]: newValue };
    });
  };

  const getMaxValue = (type: keyof FilterType): number => {
    switch (type) {
      case "brightness":
      case "contrast":
      case "saturate":
        return 3;
      case "hueRotate":
        return 360;
      case "opacity":
      case "invert":
      case "grayscale":
      case "sepia":
        return 1;
      case "blur":
        return 10;
      default:
        return 1;
    }
  };

  const getMinValue = (type: keyof FilterType): number => {
    switch (type) {
      case "brightness":
      case "contrast":
      case "saturate":
      case "blur":
        return 0;
      case "hueRotate":
        return 0;
      case "opacity":
      case "invert":
      case "grayscale":
      case "sepia":
        return 0;
      default:
        return 0;
    }
  };

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  return (
    <FilterContext.Provider value={{ filters, setFilters, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
};
