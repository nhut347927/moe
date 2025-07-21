import React, { useContext, useState, useEffect } from "react";
import { FilterContext } from "../../common/context/filter-context";

// Định nghĩa kiểu dữ liệu cho bộ lọc
type FilterType = {
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

// Định nghĩa kiểu cho context
interface FilterContextType {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}

const ColorControl: React.FC = () => {
  const { filters, setFilters } = useContext(FilterContext) as FilterContextType; // Kiểm tra và ép kiểu context
  const [localFilters, setLocalFilters] = useState<FilterType>(filters); // Lưu trữ giá trị tạm thời
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Giá trị mặc định của các bộ lọc
  const defaultFilters: FilterType = {
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

  // Danh sách các bộ lọc
  const filterOptions = [
    { label: "Contrast", type: "contrast", min: 0, max: 3, step: 0.1 },
    { label: "Saturation", type: "saturate", min: 0, max: 3, step: 0.1 },
    { label: "Opacity", type: "opacity", min: 0, max: 1, step: 0.1 },
    { label: "Invert", type: "invert", min: 0, max: 1, step: 0.1 },
    { label: "Hue Rotate", type: "hueRotate", min: 0, max: 360, step: 1 },
    { label: "Grayscale", type: "grayscale", min: 0, max: 1, step: 0.1 },
    { label: "Brightness", type: "brightness", min: 0, max: 3, step: 0.1 },
    { label: "Blur", type: "blur", min: 0, max: 10, step: 0.1 },
    { label: "Sepia", type: "sepia", min: 0, max: 1, step: 0.1 },
  ];

  // Hàm xử lý thay đổi giá trị tạm thời
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, filterType: keyof FilterType) => {
    const newValue = parseFloat(e.target.value);

    // Cập nhật giá trị tạm thời trước khi debounce
    setLocalFilters((prev) => ({
      ...prev,
      [filterType]: newValue,
    }));

    // Nếu đã có timeout thì xóa bỏ
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Tạo timeout mới để cập nhật context sau 400ms
    const id = setTimeout(() => {
      setFilters((prevFilters: FilterType) => ({
        ...prevFilters,
        [filterType]: newValue,
      }));
    }, 400);

    setTimeoutId(id);
  };

  // Hàm reset các bộ lọc về giá trị mặc định
  const handleReset = () => {
    setLocalFilters(defaultFilters); // Cập nhật giá trị tạm thời về mặc định
    setFilters(defaultFilters); // Cập nhật context về mặc định
  };

  // Cleanup timeout khi component bị hủy
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <div className="dropdown">
      <button
        className="btn moe-bg-color-black-39 text-light moe-shadow-1 p-2 pb-1"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="moe-f-s-24 bx bxs-edit"></i>
      </button>
      <div className="dropdown-menu p-3 moe-bg-color-black-1d moe-color-f5">
        {filterOptions.map(({ label, type, min, max, step }) => (
          <div className="d-flex mb-2" key={type}>
            <label htmlFor={`customRange${type}`} className="form-label moe-f-s-14">
              {label}
            </label>
            <input
              type="range"
              className="form-range moe-w-100 ms-auto"
              id={`customRange${type}`}
              min={min}
              max={max}
              step={step}
              value={localFilters[type as keyof FilterType] || min} // Áp dụng ép kiểu 'keyof FilterType'
              onChange={(e) => handleChange(e, type as keyof FilterType)} // Áp dụng kiểu chính xác
            />
          </div>
        ))}

        {/* Nút Reset */}
        <button
          className="btn btn-secondary w-100 mt-2"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ColorControl;
