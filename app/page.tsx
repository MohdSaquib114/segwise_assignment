import DataTable from "@/components/DataTable";
import FilterComponent from "@/components/FilterComponent";



export default function Home() {
  return (
   <div className="md:px-32 px-10 flex  flex-col gap-10 pt-10">
    <FilterComponent />
    <DataTable />
   </div>
  );
}
