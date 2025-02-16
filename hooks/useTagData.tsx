import { useMemo } from "react";

import { useData } from "@/components/DataContext";

export const useTagData = () => {
  const { data } = useData();

 
  const tagTypes = useMemo(() => {
    const types = new Set<string>();

    data.forEach((item) => {
      const tagsArray = item.tags.split(";").map((tag) => tag.trim());
      tagsArray.forEach((tag) => {
        const [key] = tag.split(":");
        types.add(key);
      });
    });

    return Array.from(types);
  }, [data]);

 
  const getTagValues = (selectedType: string) => {
    const values = new Set<string>();

    data.forEach((item) => {
      const tagsArray = item.tags.split(";").map((tag) => tag.trim());
      tagsArray.forEach((tag) => {
        const [key, value] = tag.split(":");
        if (key === selectedType) {
          values.add(value);
        }
      });
    });

    return Array.from(values);
  };

  return { tagTypes, getTagValues };
};
