import { Select } from "@mantine/core";
import { YearFilterProps } from "./year-filter.types";

export const YearFilter = ({setSelectedYear}: YearFilterProps) => {
  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 16 }, (_, index) => {
    const year = currentYear - index;

    return {
      value: year.toString(),
      label: year.toString(),
    };
  });

  return (
    <Select
      label="Year"
      placeholder="Select year"
      data={years}
      onChange = {(v)=> setSelectedYear(Number(v))}
      defaultValue={currentYear.toString()}
      clearable
    />
  );
};