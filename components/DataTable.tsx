"use client"
import { Minus,Maximize2, Search } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { DataItem, useData } from "./DataContext"




const calculateScore = (value: string): number => {
  const num = Number.parseFloat(value)
  if (isNaN(num)) return 0
  return Math.min(Math.max(num * 10, 0), 100)
}

const getScoreColor = (score: number): string => {
  if (score < 33) return "bg-red-500"
  if (score < 66) return "bg-yellow-500"
  return "bg-green-500"
}

const ScoreBar: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const score = calculateScore(value)
  const colorClass = getScoreColor(score)

  return (
    <div className="relative">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm font-bold text-gray-800">{value}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div 
          className={`h-2 rounded-full  ${colorClass}`} 
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

const ITEMS_PER_PAGE = 10;

const AdPerformanceDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<"table" | "card">("table")
  const [selectedAd, setSelectedAd] = useState<DataItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSideModal, setIsSideModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataItem | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })
 const {data,setData} = useData()
  const toggleViewMode = () => {
    setViewMode(viewMode === "table" ? "card" : "table")
  }
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const handleAdClick = (ad: DataItem) => {
    setSelectedAd(ad)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }
  const handleAdSideClick = () => {
    
    setIsSideModal(true)
  }

  const closeSideModal = () => {
    setIsSideModal(false)
  }

  const handleSort = (key: keyof DataItem) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    
    if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
      return sortConfig.direction === 'asc' 
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue)
    }

   
    return sortConfig.direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

  const getSortIcon = (key: keyof DataItem) => {
    if (sortConfig.key !== key) return  "↑↓"
      return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  const paginatedData = sortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setQuery(searchTerm);

    const filtered = data.filter((item) =>
      item.creative_name.toLowerCase().includes(searchTerm) ||
      item.tags.toLowerCase().includes(searchTerm) ||
      item.ad_network.toLowerCase().includes(searchTerm) ||
      item.country.toLowerCase().includes(searchTerm)
    );

    setData(filtered);
  };

  const renderTable = () => (
    <div className="overflow-x-auto rounded-lg ">
  <table className="w-full border-collapse rounded-lg shadow-md">
    <thead>
      <tr className="bg-gray-100 text-gray-800   text-sm font-semibold">
        {[
          "Creative Name",
          "Country",
          "Ad Network",
          "CTR",
          "IPM",
          "Clicks",
          "CPM",
          "CPC",
          "CPI",
          "Installs",
        ].map((header, index) => (
          <th
            key={index}
            className="p-3 border text-left cursor-pointer hover:bg-gray-200  "
            onClick={() => handleSort(header.toLowerCase().replace(/ /g, "_")  as keyof DataItem)}
          >
            {header} {getSortIcon(header.toLowerCase().replace(/ /g, "_")  as keyof DataItem)}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {paginatedData.map((ad, index) => (
        <tr
          key={ad.creative_id + index}
          className="hover:bg-slate-100 cursor-pointer"
          onClick={() => handleAdClick(ad)}
        >
          <td className="p-2 border break-words max-w-xs">{ad.creative_name}</td>
          <td className="p-2 border break-words">{ad.country}</td>
          <td className="p-2 border">
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-lg">
              {ad.ad_network}
            </span>
          </td>
          <td className="p-3 border">{ad.ctr}</td>
          <td className="p-3 border">{ad.ipm}</td>
          <td className="p-3 border">{ad.clicks}</td>
          <td className="p-3 border">{ad.cpm}</td>
          <td className="p-3 border">{ad.cost_per_click}</td>
          <td className="p-3 border">{ad.cost_per_install}</td>
          <td className="p-3 border">{ad.installs}</td>
        </tr>
      ))}
    </tbody>
  </table>

  
  <div className="flex justify-between items-center mt-4">
    <button
      onClick={prevPage}
      disabled={currentPage === 1}
      className="px-4 py-2 border rounded disabled:opacity-50  hover:bg-gray-100"
    >
      Previous
    </button>
    <span className="text-gray-700 font-medium">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={nextPage}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100   "
    >
      Next
    </button>
  </div>
</div>

  )

  const renderCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedData.map((ad,index) => (
 <div
 key={ad.creative_id + index}
 className="group bg-white p-6 cursor-pointer border border-gray-200 rounded-xl hover:shadow-xl hover:border-green-500 relative overflow-hidden"
 onClick={() => handleAdClick(ad)}
>

 

 <div className="mb-4">
   <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-600 ">
     {ad.creative_name}
   </h3>
   <div className="flex flex-wrap gap-2 mb-3">
     <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
       {ad.country}
     </span>
     <span className="px-3 py-1 bg-blue-50 rounded-full text-sm font-medium text-blue-600">
       {ad.ad_network}
     </span>
   </div>
 </div>

 
 <div className="grid grid-cols-2 gap-4 mb-6">
   <div className="bg-gray-50 p-3 rounded-lg">
     <div className="text-sm text-gray-500 mb-1">Total Clicks</div>
     <div className="text-xl font-bold text-gray-800">{ad.clicks}</div>
   </div>
   <div className="bg-gray-50 p-3 rounded-lg">
     <div className="text-sm text-gray-500 mb-1">Installs</div>
     <div className="text-xl font-bold text-gray-800">{ad.installs}</div>
   </div>
 </div>


 <div className="space-y-4">
   <div className="text-sm font-semibold text-gray-700 mb-2">Performance Metrics</div>
   <ScoreBar label="CTR" value={ad.ctr} />
   <ScoreBar label="IPM" value={ad.ipm} />
   <ScoreBar label="CPM" value={ad.cpm} />
   <ScoreBar label="CPC" value={ad.cost_per_click} />
   <ScoreBar label="CPI" value={ad.cost_per_install} />
 </div>

 
 <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-purple-500 " />
</div>
      ))}
    </div>
  )

  const renderModal = () => {
    if (!selectedAd || !isSideModal) return null
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-6 backdrop-blur-lg animate-fadeIn">
        <div className="relative bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl max-h-[85vh] overflow-y-auto ">
          
          
          <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-5">
            <h2 className="text-xl font-semibold text-gray-900 tracking-wide">
              {selectedAd.creative_name}
            </h2>
            <button
              onClick={closeSideModal}
              className="text-gray-400 text-sm font-thin
              "
            >
              ✖
            </button>
          </div>
      
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(selectedAd).map(([key, value]) => (
              <div 
                key={key} 
                className="p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200 "
              >
                <p className="text-gray-500 uppercase text-sm font-medium tracking-wide">
                  {key}
                </p>
                <p className="text-gray-900 font-semibold text-md">
                  {value}
                </p>
              </div>
            ))}
          </div>
      
       
          <div className="mt-8 flex justify-end">
            <button
              className="relative  text-gray-400 font-semibold py-3 px-6 rounded-lg shadow-md "
              onClick={closeSideModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      

    )
  }

  const renderSideModal = () => {
    if (!selectedAd || !isModalOpen) return null
    const importantKeys = ['creative_name', 'status', 'campaign_name', 'spend', 'impressions', 'clicks'];

    return (
        <div className="fixed bottom-2 right-2">
        <div className="bg-white shadow-lg rounded-2xl w-96 border border-gray-200">
          
         
          <div className="flex items-center justify-between px-5 py-2 border-b border-gray-200  rounded-t-2xl">
            <h2 className="text-base font-semibold text-gray-700 truncate">
              {selectedAd.creative_name}
            </h2>
            <div className="flex items-center space-x-2">
              <button 
                title="Expand" 
                onClick={handleAdSideClick}
                className="p-1 rounded-lg bg-gray-100 text-gray-600"
              >
                <Maximize2 size={18} />
              </button>
              <button 
                title="Close" 
                onClick={closeModal}
                className="p-1 rounded-lg bg-gray-100 text-gray-600"
              >
                <Minus size={18} />
              </button>
            </div>
          </div>
      
         
          <div className="p-5 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {Object.entries(selectedAd)
                .filter(([key]) => importantKeys.includes(key))
                .map(([key, value], index) => (
                  <div 
                    key={key + index} 
                    className="p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm text-gray-800 font-medium block">
                      {value}
                    </span>
                  </div>
                ))
              }
            </div>
      
            
            <button 
              onClick={handleAdSideClick}
              className="mt-5 w-full py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl"
            >
              Show More Details
            </button>
          </div>
        </div>
      </div>
      
    )
  }

  return (
    <div className="container mx-auto p-4">
    <div className="flex w-1/2  gap-2">

      <button
        className=" text-gray-400 p-1 border-2 shadow-sm rounded-lg  font-bold py-2 px-4  mb-4 hover:bg-gray-100"
        onClick={toggleViewMode}
        >
        
     {viewMode === "table" ? 
                   <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-kanban"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/></svg>

                   : 
                   <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-table-of-contents"><path d="M16 12H3"/><path d="M16 18H3"/><path d="M16 6H3"/><path d="M21 12h.01"/><path d="M21 18h.01"/><path d="M21 6h.01"/></svg>
    
                } 
      </button>
      <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/3 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                            type="text"
                            placeholder="Search creatives..."
                            value={query}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C0E656]"
                            />
                        </div>
        </div>
      {viewMode === "table" ? renderTable() : renderCards()}
      {renderSideModal()}
      {renderModal()}
    </div>
  )
}

export default AdPerformanceDashboard