"use client"
import { useMemo } from "react";
import { useData } from "@/components/DataContext";

export const useDimensionData = () => {
  const { data } = useData();
  const dimensionProperties = ["country", "ad_network", "os", "campaign", "ad_group"] as const;

 

  
  const dimensionValues = useMemo(() => {
    const valuesMap: Record<string, Set<string>> = {};

    dimensionProperties.forEach((prop) => {
      valuesMap[prop] = new Set();
    });

    data.forEach((item) => {
      dimensionProperties.forEach((prop) => {
        if (item[prop]) {
          valuesMap[prop].add(item[prop]);
        }
      });
    });

    
    return Object.fromEntries(
      Object.entries(valuesMap).map(([key, valueSet]) => [key, Array.from(valueSet)])
    );
  }, [data]);

  
  const getDimensionValues = (selectedDimension: string) => {
    return dimensionValues[selectedDimension] || [];
  };

  return { dimensionProperties, getDimensionValues };
};
