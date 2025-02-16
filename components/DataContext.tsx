"use client"
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import rawData from "../data/mock.json"

export interface DataItem {
    creative_id: string
    creative_name: string
    country: string
    ad_network: string
    campaign: string
    ad_group: string
    ipm: string
    ctr: string
    clicks: string
    cpm: string
    cost_per_click: string
    cost_per_install: string
    installs: string
    tags: string
    os: string
    spend: string
    impressions: string
  }
  



interface DataContextType {
    data: DataItem[];
    setData: Dispatch<SetStateAction<DataItem[]>>; 
  }
  

const DataContext = createContext<DataContextType | undefined>(undefined);


export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataItem[]>(rawData);
  


  return (
    <DataContext.Provider value={{ data,setData }}>
      {children}
    </DataContext.Provider>
  );
};


export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
};
