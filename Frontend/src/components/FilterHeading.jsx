import { Button } from "../components/ui/button";
// import { updateFilters } from "../context/projectFiltersSlice";

export default function FilterHeading({title, prop, def, dispatch, updateFilters, filters}) {
  return (
    <div className="flex justify-between items-center">
      <p className="font-bold">{title}</p>
      <Button
        variant="link"
        className="text-blue-600 bg-transparent border-none"
        onClick={() => {
            dispatch(updateFilters({...filters, [prop]: def}));
        }}
      >
        clear
      </Button>
    </div>
  );
}
