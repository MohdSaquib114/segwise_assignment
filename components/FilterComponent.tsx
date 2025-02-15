import { Filter } from "lucide-react"

export default function FilterComponent() {
  return (
    <div className="border-2 border-dashed p-10 rounded-md ">
      <div className="border bg-[#F5F8FA]  p-3 rounded-md shadow-inner">
       <button className="gap-1 flex  items-center border shadow-md p-1 rounded-md text-">
              <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5 2.29236H1.5L7.5 9.38736V14.2924L10.5 15.7924V9.38736L16.5 2.29236Z" stroke="#999999" stroke-width="0.975" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                 <p>Filters</p>
                 <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M11.9466 5.4957H7.79329H4.05329C3.41329 5.4957 3.09329 6.26903 3.54662 6.72236L6.99995 10.1757C7.55329 10.729 8.45329 10.729 9.00662 10.1757L10.32 8.86236L12.46 6.72236C12.9066 6.26903 12.5866 5.4957 11.9466 5.4957Z" fill="#999999"/>
                 </svg>

            </button>
      </div>
    </div>
  )
}
