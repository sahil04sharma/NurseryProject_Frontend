// src/components/products/ProductSkeleton.jsx

// export default function ProductSkeleton() {
//   return (
//     <div className="shrink-0 w-[46%] sm:w-1/3 md:w-1/4 lg:w-1/4 rounded-lg p-2">
//       <div className="relative mb-3 sm:mb-4">
//         <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
//       </div>
//       <div className="space-y-2 px-0.5 sm:px-1 pb-2">
//         <div className="h-5 bg-gray-200 rounded animate-pulse" />  
//         <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
//         <div className="h-3 bg-gray-200 rounded animate-pulse" />
//         <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
//         <div className="h-10 bg-gray-200 rounded animate-pulse mt-3" />
//       </div>
//     </div>
//   );
// }


export default function ProductSkeleton() {
  return (
    <div className="rounded-lg p-2">
      <div className="relative mb-3 sm:mb-4">
        <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
      </div>

      <div className="space-y-2 px-0.5 sm:px-1 pb-2">
        <div className="h-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="h-3 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-10 bg-gray-200 rounded animate-pulse mt-3" />
      </div>
    </div>
  );
}
