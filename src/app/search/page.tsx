import { Suspense } from "react";
import SearchComponent from "./SearchComponent";

export default function SearchPageWrapper() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading search...</div>}
    >
      <SearchComponent />
    </Suspense>
  );
}
