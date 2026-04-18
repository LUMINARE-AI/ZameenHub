export default function PropertyCard({ property }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">

      {/* Image */}
      <img
  src={property.image || "https://via.placeholder.com/400"}
  className="w-full h-48 object-cover"
/>

      <div className="p-4">
        <h2 className="text-lg font-semibold">{property.title}</h2>

        <p className="text-gray-500">{property.location}</p>

        <p className="text-blue-600 font-bold mt-2">
          ₹ {property.price}
        </p>
      </div>
    </div>
  );
}

// export default function PropertyCard({ property }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
      
//       <img
//         src={property.images?.[0] || "https://via.placeholder.com/400"}
//         className="h-48 w-full object-cover"
//       />

//       <div className="p-4">
//         <h2 className="text-lg font-semibold">{property.title}</h2>

//         <p className="text-gray-500 text-sm">{property.location}</p>

//         <p className="text-blue-600 font-bold text-lg mt-1">
//           ₹ {property.price}
//         </p>

//         <p className="text-sm text-gray-600 mt-2 line-clamp-2">
//           {property.description}
//         </p>

//         <div className="mt-3 text-sm text-gray-700">
//           📞 {property.contact}
//         </div>
//       </div>
//     </div>
//   );
// }