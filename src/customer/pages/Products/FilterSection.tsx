import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState } from "react";
import { brands } from "../../../data/Filter/brand";
import { teal } from "@mui/material/colors";
import { colors } from "../../../data/Filter/color";
import { price } from "../../../data/Filter/price";
import { discount } from "../../../data/Filter/discount";
import { useSearchParams } from "react-router-dom";

const FilterSection = () => {
  const [expendColor, setExpendColor] = useState(false);
  const [expendBrand, setExpendBrand] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const handleExpendBrand = () => {
    setExpendBrand(!expendBrand);
  };
  const handleExpendColor = () => {
    setExpendColor(!expendColor);
  };

  // ✅ FIX: State updates should be immutable. Create a new URLSearchParams object.
  const updateFilterParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const newSearchParams = new URLSearchParams(searchParams); // Create a copy

    if (value) {
      newSearchParams.set(name, value);
    } else {
      newSearchParams.delete(name);
    }
    setSearchParams(newSearchParams); // Set the new copy
  };

  // ✅ FIX: The simplest and safest way to clear all params is to set a new, empty one.
  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="-z-50 space-y-5 bg-white">
      <div className="flex items-center justify-between h-[40px] px-9 lg:border-r">
        <p className="text-lg font-semibold">Filters</p>
        <Button
          onClick={clearAllFilters}
          size="small"
          className="text-teal-600 cursor-pointer font-semibold"
        >
          clear all
        </Button>
      </div>
      <Divider />
      <div className="px-9 space-y-6">
        {/* ✅ CHANGE: Restored the Brand filter section by uncommenting it. */}
        <section>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                pb: "14px",
                color: teal[600],
              }}
              className="text-2xl font-semibold"
              id="brand"
            >
              Brand
            </FormLabel>
            <RadioGroup
              onChange={updateFilterParams}
              aria-labelledby="brand"
              value={searchParams.get("brand") || ""}
              name="brand"
            >
              {brands
                .slice(0, expendBrand ? brands.length : 5)
                .map((item, _index) => (
                  <FormControlLabel
                    key={item.name}
                    value={item.value}
                    control={<Radio size="small" />}
                    label={item.name}
                  />
                ))}
            </RadioGroup>
          </FormControl>
          <div>
            <button
              onClick={handleExpendBrand}
              className="text-teal-600 cursor-pointer hover:text-teal-900 flex items-center"
            >
              {expendBrand ? "hide" : `+ ${brands.length - 5} more`}
            </button>
          </div>
        </section>
        <Divider />
        <section>
          <FormControl sx={{ zIndex: 0 }}>
            <FormLabel
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                pb: "14px",
                color: teal[600],
              }}
              className="text-2xl font-semibold"
              id="color"
            >
              Color
            </FormLabel>
            <RadioGroup
              onChange={updateFilterParams}
              aria-labelledby="color"
              value={searchParams.get("color") || ""}
              name="color"
            >
              {colors
                .slice(0, expendColor ? colors.length : 5)
                .map((item, _index) => (
                  <FormControlLabel
                    sx={{ fontSize: "12px" }}
                    key={item.name}
                    value={item.name}
                    control={<Radio size="small" />}
                    label={
                      <div className="flex items-center gap-3">
                        <p>{item.name}</p>
                        <span
                          style={{ backgroundColor: item.hex }}
                          // ✅ FIX: Simplified redundant class logic
                          className="h-5 w-5 rounded-full border"
                        ></span>
                      </div>
                    }
                  />
                ))}
            </RadioGroup>
          </FormControl>
          <div>
            <button
              onClick={handleExpendColor}
              className="text-teal-600 cursor-pointer hover:text-teal-900 flex items-center"
            >
              {expendColor ? "hide" : `+ ${colors.length - 5} more`}
            </button>
          </div>
        </section>
        <Divider />

        <section>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                pb: "14px",
                color: teal[600],
              }}
              className="text-2xl font-semibold"
              id="price"
            >
              Price
            </FormLabel>
            <RadioGroup
              name="price"
              onChange={updateFilterParams}
              aria-labelledby="price"
              value={searchParams.get("price") || ""}
            >
              {price.map((item, _index) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
        <Divider />
        <section>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                pb: "14px",
                color: teal[600],
              }}
              className="text-2xl font-semibold"
              // ✅ FIX: Corrected accessibility bug. Was "brand", now "discount".
              id="discount"
            >
              Discount
            </FormLabel>
            <RadioGroup
              name="discount"
              onChange={updateFilterParams}
              // ✅ FIX: Corrected accessibility bug. Was "brand", now "discount".
              aria-labelledby="discount"
              value={searchParams.get("discount") || ""}
            >
              {discount.map((item, _index) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
      </div>
    </div>
  );
};

export default FilterSection;