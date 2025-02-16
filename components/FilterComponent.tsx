"use client"
import {   useState } from "react";
import { Search, Plus,Trash2 } from "lucide-react";
import {useTagData} from "@/hooks/useTagData";
import { useDimensionData } from "@/hooks/useDimensionData";
import { DataItem, useData } from "./DataContext";
interface FilterItem {
  type: "Dimensions" | "Tags" | "Metrics";
  filter: string;
  condition:string;
  metricValue?: number ;
  value?:string[];
  join:"AND"|"OR";
}

export default function FilterComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof typeof menuItems>('Tags');
  const [searchText, setSearchText] = useState("");
  const [filters,setFilters] = useState<FilterItem[]>([])
  const [isFilter,setIsFilter] = useState(false)
  const [ selectedTagValues, setSelectedTagValues] = useState<string[]>([])
  const [ selectedDimValues, setSelectedDimValues] = useState<string[]>([])
  const [index,setIndex] = useState(-1)
  const {tagTypes, getTagValues} =useTagData()
  const {dimensionProperties, getDimensionValues } = useDimensionData()
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isCondition, setIsCondition] = useState(false)
 const [metricValue,setMetricValue] = useState('')
  const [isValueOpen,setIsValueOpen] = useState(false)
  const {setData,data} = useData()
  const handleCheckboxChange = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

 
  const tabs = ["Dimensions", "Tags", "Metrics"];
  const menuItems = {
    Dimensions: dimensionProperties,
    Tags: tagTypes,
    Metrics: ["ipm", "ctr", "spend","clicks","cpm"],
  };
  const metricsConditions = ["Lesser than", "Greater than","Equals"]
  const conditions = ["is","is not", "contains", "does not contain"]

  const filterData = ( ) => {
    return data.filter((item) => {
      return filters.every(({ type, filter: filterKey, condition, value, metricValue }) => {
        console.log(
          `Applying filter: Type=${type}, Filter=${filterKey}, Condition=${condition}, Values=${value}, MetricValue=${metricValue}`
        );
  
        if (type === "Tags") {
          const tagArray = item.tags.split(";").map(tag => tag.trim());
  
          if (!Array.isArray(value)) {
            console.error("Expected value to be an array but got:", value);
            return false;
          }
  
          if (condition === "is") {
            return value.some(val => tagArray.some(tag => tag.includes(`${filterKey}:${val}`)));
          }
  
          if (condition === "is not") {
            return !value.some(val => tagArray.some(tag => tag.includes(`${filterKey}:${val}`)));
          }
  
          if (condition === "contains") {
            return tagArray.some(tag => value.some(val => tag.includes(val)));
          }
  
          if (condition === "does not contain") {
            return !tagArray.some(tag => value.some(val => tag.includes(val)));
          }
        }
  
        if (type === "Dimensions") {
          return condition === "is"
            ? value?.includes(item[filterKey as keyof DataItem])
            : !value?.includes(item[filterKey as keyof DataItem]);
        }
  
        if (type === "Metrics") {
          const itemValue = parseFloat(item[filterKey as keyof DataItem] as string);
          const metricVal = metricValue !== undefined ? Number(metricValue) : null;
  
          if (metricVal === null || isNaN(itemValue)) return false;
  
          if (condition === "Lesser than") return itemValue < metricVal;
          if (condition === "Greater than") return itemValue > metricVal;
          if (condition === "Equals") return itemValue === metricVal;
        }
  
        return true; 
      });
    });
  };
  
  

  const AddFilter = (item: string) => {
    const filter: FilterItem = {
      type: activeTab as "Dimensions" | "Tags" | "Metrics",
      filter: item,
      condition: activeTab === "Metrics" ? metricsConditions[0] : conditions[0],
      join: "OR", 
      value: activeTab === "Tags" ? getTagValues(item) : activeTab === "Dimensions" ? getDimensionValues(item) : [],
  };
    
    const newFilters = [...filters, filter];
    setFilters(newFilters);
    setIsFilter(false);

    if (activeTab === "Tags") {
        const tagValues = getTagValues(item);
        if (tagValues.length > 0) {
            setSelectedTagValues(tagValues);
        }
    } else if (activeTab === "Dimensions") {
        const dimValues = getDimensionValues(item);
        if (dimValues.length > 0) {
            setSelectedDimValues(dimValues);
        }
    }
};

  const applyFilter = () => {
    
    setFilters((prevFilters) => {
      return prevFilters.map((filter, i) =>
        i === index
          ? { ...filter, value: selectedValues } 
          : filter
      );
    });
    setIndex(-1)
    setIsValueOpen(false)
    setSelectedValues([])
    setIsCondition(false)
    const filteredData = filterData()
    setData(filteredData)
  }

  const handleCondition = (condition:string) => {
   
    setFilters((prevFilters) => {
      return prevFilters.map((filter, i) => i === index
          ? { ...filter, condition: condition } 
          : filter
      );
    });
    setIsCondition(false)
  }

  
  const applyFilterMetric = () => {
  if (metricValue === "") return;

  const match = metricValue.match(/\d+/);
  const val = match ? parseInt(match[0], 10) : null;

  setFilters((prevFilters) =>
     prevFilters.map((filter, i) =>{

    return i === index ? { ...filter, metricValue: val as number } : filter}
  )

  

  );

  
 
    setIndex(-1);
    setIsCondition(false);
    setIsOpen(false);
    setMetricValue("");
 
    const filteredData = filterData()
    setData(filteredData)
};

const addJoin = (join:string) => {
  setFilters((prevFilters) =>
    prevFilters.map((filter, i) =>

    i === index ? { ...filter, join: join as "AND" | "OR"  } : filter
 )

 );
 const filteredData = filterData()
 setData(filteredData)
}







  return (
    <div className="border-2 border-dashed p-8 px-44 rounded-[16px]">
      <div className="border bg-[#F5F8FA] p-3 rounded-[16px] shadow-inner">
      
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-white gap-1 flex items-center border shadow-md p-2 rounded-md focus:outline-none ml-2"
          type="button"
        >
          <svg width="18" height="19" viewBox="0 0 18 19" fill="none">
            <path
              d="M16.5 2.29236H1.5L7.5 9.38736V14.2924L10.5 15.7924V9.38736L16.5 2.29236Z"
              stroke="#999999"
              strokeWidth="0.975"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Filters</p>
          {filters.length > 0 &&
          <p className="bg-[#E3FA99] rounded-3xl px-2 text-xs">0{filters.length}</p>
           }
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
            <path
              d="M11.9466 5.4957H7.79329H4.05329C3.41329 5.4957 3.09329 6.26903 3.54662 6.72236L6.99995 10.1757C7.55329 10.729 8.45329 10.729 9.00662 10.1757L10.32 8.86236L12.46 6.72236C12.9066 6.26903 12.5866 5.4957 11.9466 5.4957Z"
              fill="#999999"
            />
          </svg>
        </button>

       
        {isOpen && (
          <div className="mt-2 absolute flex flex-col items-center ml-2 z-50">
            <div className="bg-white rounded-[12px] p-3 border w-[360px]">
              <button
              onClick={()=>setIsFilter(prev=>!prev)}
                className="w-full text-gray-400 p-2 hover:bg-[#F6FDED] hover:text-green-600 border shadow-sm rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                <Plus size={20} />
                Add Filter
              </button>
              {
           
              <div className="mt-2 space-y-2 ">
                {
                  filters.map((filter,index) =>
                    <div key={index + filter.type}>
                   <div className="border p-2 rounded-lg text-gray-500 space-y-2" >
                      <div className="flex justify-between ">
                        <div className="flex justify-center items-center  gap-2">
                            <p>{filter.type}</p>
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g opacity="0.5">
                              <path d="M6.96875 12.6797L10.9687 8.67969L6.96875 4.67969" stroke="#333333" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                              </g>
                            </svg>
                            <p className="text-gray-600">
                              {filter.filter}
                            </p>
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.9154 6.13303H8.7621H5.0221C4.3821 6.13303 4.0621 6.90636 4.51543 7.35969L7.96877 10.813C8.5221 11.3664 9.4221 11.3664 9.97543 10.813L11.2888 9.49969L13.4288 7.35969C13.8754 6.90636 13.5554 6.13303 12.9154 6.13303Z" fill="#999999"/>
                            </svg>

                        </div>
                        <div
                        onClick={()=>setFilters((prevFilters) => prevFilters.filter((_, i) => i !== index))}
                         className="border border-white hover:border-gray-300 p-1 px-2 rounded-lg hover:text-red-400 text-gray-400">
                         <Trash2 className=" h-6 w-4" />
                        </div>

                      </div>
                     
                        <div className="flex gap-2">
                          <button 
                          onClick={()=>{
                          
                            setIndex(index)
                            setIsCondition(prev=>!prev)}}
                          className="flex items-center hover:bg-gray-100 rounded-md p-1 ">
                            {filter.condition}
                            <svg className="self-center" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.9154 6.13303H8.7621H5.0221C4.3821 6.13303 4.0621 6.90636 4.51543 7.35969L7.96877 10.813C8.5221 11.3664 9.4221 11.3664 9.97543 10.813L11.2888 9.49969L13.4288 7.35969C13.8754 6.90636 13.5554 6.13303 12.9154 6.13303Z" fill="#999999"/>
                            </svg>
                          </button>
                          <div className="flex-1  ">
                            {filter.type === "Metrics"?
                            <div>
                              {!filter.metricValue? 
                               <input
                               type="number"
                               placeholder="Enter Value"
                               value={metricValue}
                               onChange={(e) =>{
                                    setIndex(index)
                                    setMetricValue(e.target.value)
                                  }}
                                  className="w-full pl-2 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C0E656]"
                                  />
                                  :
                                  <div>
                                    {filter.metricValue}
                                  </div>
                                }
                                  </div>
                            :
                            <div>
                              {

                                filter?.value?.length && 
                                 filter.value?.length > 0 ? 
                                  <button

                                  onClick={()=>{
                                    setIsValueOpen(prev=>!prev)
                                    setIndex(index)}
                                  }
                                  >
                                    {

                                     filter.value?.length > 2 ? filter.value?.slice(0,2).join(", ") + ` or ${filter.value?.slice(2).length} others`
                                     :
                                     filter.value?.slice(0,2).join(", ")
                                    }
                                  </button> 
                                   :
                                   <button
                                   onClick={()=>{
                                    setIsValueOpen(prev=>!prev)
                                    setIndex(index)}
                                  }
                                    className="bg-[#F5F8FA] w-full py-1 rounded-md">
                                     Select Value
                                   </button>
                              }
                            </div>
                            }
                          </div>
                        </div>
                          {(filter.type === "Metrics" && !filter.metricValue) && 
                           <button 
                           onClick={applyFilterMetric}
                           className="w-full bg-black text-white py-2 mt-3 rounded-lg font-semibold hover:bg-gray-900 transition">
                             Apply ↩
                           </button>
                          }
                        
                  </div>
                 
                  { filters.length -1 > index &&  <div className="grid grid-cols-3 justify-center items-center gap-2">
                             <hr />
                            <div className="flex items-center border border-gray-300 rounded-md  p-1 bg-gray-100">
                                <button
                                  className={`px-3 py-1 text-sm rounded-lg ${
                                    filter.join === "AND" ? "bg-white shadow" : "text-gray-500"
                                  }`}
                                  onClick={() =>{
                                    setIndex(index)
                                    addJoin("AND")  
                                  }}
                                  >
                                  AND
                                </button>
                                <button
                                  className={`px-3 py-1 text-sm rounded-md ${
                                    filter.join === "OR" ? "bg-white shadow" : "text-gray-500"
                                  }`}
                                  onClick={() =>{
                                    setIndex(index)
                                    addJoin("OR")}}
                                >
                                  OR
                                </button>
                            </div>
                            <hr />
                        </div>}
                  </div>
                   )
                }
              </div>
            }
            </div>
          
           {
           (isOpen && isFilter) &&
           <div className="w-[330px] border rounded-[12px] relative -top-1 bg-white">
          
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-tl-lg rounded-tr-lg focus:outline-none focus:ring-2 focus:ring-[#C0E656]"
                />
              </div>

           
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as keyof typeof menuItems )}
                    className={`px-4 py-2 transition-colors duration-200 ${
                      activeTab === tab
                        ? "text-gray-800 border-b-2 border-gray-800"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

             
              <div className="space-y-2 p-2 h-[300px] overflow-y-scroll">
                {menuItems[activeTab]
                  .filter((item:string) =>
                    item.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((item:string) => (
                    <div
                      key={item}
                      onClick={()=>AddFilter(item)}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="text-gray-700">{item.split("_").map(word=>word.split("")[0]?.toUpperCase()+ word.slice(1)).join(" ")}</span>
                    </div>
                  ))}
              </div>

            </div>}
           
             {
              ( isValueOpen) && (
                <div className="dropdown w-[330px] border border-gray-200 rounded-[12px] bg-white shadow-lg p-2">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C0E656]"
                    />
                  </div>
          
              
                  <div className="options-list flex flex-col mt-2 space-y-2 max-h-[200px] overflow-y-auto">
                    

          
                 
                    {
                   activeTab === "Dimensions" ?  
                   <>
                    <label className="flex items-center gap-2 px-3 py-1 font-medium text-gray-700">
                      <input type="checkbox" 
                        checked={selectedValues.length === selectedDimValues.length}
                        onChange={() =>
                          setSelectedValues(selectedValues.length === selectedDimValues.length ? [] : [...selectedDimValues])
                        }
                        className="w-4 h-4"
                      />
                      Select all
                    </label>
                   {selectedDimValues
                   .filter((item) => item.toLowerCase().includes(searchText.toLowerCase()))
                      .map((option) => (
                        <label key={option} className="flex items-center gap-2 px-3 py-1 cursor-pointer text-gray-700">
                          <input
                            type="checkbox"
                            value={option}
                            checked={selectedValues.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                            className="w-4 h-4"
                            />
                          {option}
                        </label>
                      ))}
                            </> 
                   :
                   <>
                    <label className="flex items-center gap-2 px-3 py-1 font-medium text-gray-700">
                      <input type="checkbox" 
                        checked={selectedValues.length === selectedTagValues.length}
                        onChange={() =>
                          setSelectedValues(selectedValues.length === selectedTagValues.length ? [] : [...selectedTagValues])
                        }
                        className="w-4 h-4"
                      />
                      Select all
                    </label>
                   { selectedTagValues
                      .filter((item) => item.toLowerCase().includes(searchText.toLowerCase()))
                      .map((option) => (
                        <label key={option} className="flex items-center gap-2 px-3 py-1 cursor-pointer text-gray-700">
                          <input
                            type="checkbox"
                            value={option}
                            checked={selectedValues.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                            className="w-4 h-4"
                            />
                          {option}
                        </label>
                      ))}
                            </>
                      }
                  </div>
          
                
                  <button 
                  onClick={applyFilter}
                  className="w-full bg-black text-white py-2 mt-3 rounded-lg font-semibold hover:bg-gray-900 transition">
                    Apply ↩
                  </button>
                </div>
              )
             } 
           { (isCondition && !isValueOpen) &&
            
            <div className="bg-white border rounded-lg space-y-2 p-2 -left-24 -top-2 relative">
              { 
                activeTab === "Metrics" ?
                metricsConditions.map((condition,index)=>
                  <div
                onClick={()=>handleCondition(condition)}
                  className="hover:bg-[#F5F8FA] cursor-pointer p-1 rounded-md" key={index+condition}>
                    {condition}
                  </div>
                )
                :
                conditions.map((condition,index)=>
                  <div
                  onClick={()=>handleCondition(condition)}
                  className="hover:bg-[#F5F8FA] cursor-pointer p-1 rounded-md"  key={index+condition}>
                    {condition}
                  </div>
                  )
              }
            </div>}
          </div>
        )}
      </div>
    </div>
  );
}
