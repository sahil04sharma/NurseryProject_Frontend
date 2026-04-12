import { useEffect, useState, useRef } from "react";
import TrackOrderModal from "../../../components/orders/TrackOrderModal";
import InvoiceModal from "../../../components/orders/InvoiceModal";
import { useOrder } from "../../../ContextApi/OrderContext";
import backend from "../../../network/backend";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import OrderCard from "../../../components/orders/OrderCard";

export default function MyOrders() {
  const {
    orders,
    totalOrders,
    setOrders,
    fetchOrders,
    page,
    hasMore,
    ordersLoading,
  } = useOrder();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([...orders]);
  const [cancelDialog, setCancelDialog] = useState(false);

  const bottomRef = useRef(null);

  const [seletectedStatus, setSelectedStatus] = useState("All Orders");
  const [seletectedDateFilter, setSelectedDateFilter] = useState("All Time");

  const filterByStatus = [
    "All Orders",
    "Processing",
    "Shipped",
    "Delivered",
    "Returned",
    "Cancelled",
  ];
  const filterByDate = [
    "All Time",
    "Last 1 Month",
    "Last 3 Months",
    "Last 6 Months",
    "Last 1 Year",
  ];

  useEffect(() => {
    fetchOrders(1);
  }, []);

  // Observer to load data on scroll
  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !ordersLoading) {
          fetchOrders(page + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "10px",
      }
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [page, hasMore, ordersLoading]);

  useEffect(() => {
    applyFilter();
  }, [seletectedStatus, seletectedDateFilter, orders]);

  const applyFilter = () => {
    if (!orders || orders.length === 0) {
      setFilteredOrders([]);
      return;
    }

    let filtered = [...orders];

    if (seletectedStatus !== "All Orders") {
      filtered = filtered.filter(
        (order) =>
          order.shipmentStatus &&
          order.shipmentStatus.toLowerCase() === seletectedStatus.toLowerCase()
      );
    }

    if (seletectedDateFilter !== "All Time") {
      const now = new Date();
      let pastDate = new Date();
      switch (seletectedDateFilter) {
        case "Last 1 Month":
          pastDate.setMonth(now.getMonth() - 1);
          break;
        case "Last 3 Months":
          pastDate.setMonth(now.getMonth() - 3);
          break;
        case "Last 6 Months":
          pastDate.setMonth(now.getMonth() - 6);
          break;
        case "Last 1 Year":
          pastDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= pastDate
      );
    }
    setFilteredOrders(filtered);
  };

  const CancelOrder = async (orderId) => {
    try {
      const { data } = await backend.post(`/order/cancel/${orderId}`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, shipmentStatus: "cancelled" }
            : order
        )
      );
    } catch (error) {
      console.log("Order Cancellation error ", error);
      toast.error("Cancel order Failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl lg:rounded-3xl p-4 lg:p-8 mx-4 lg:mx-0 mb-6">
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between md:mb-2 lg:mb-6 gap-4 mx-2 lg:mx-0"> */}
        <div className="sticky top-0 z-20 bg-white pb-4">
          <div>
            <h2 className="md:text-xl lg:text-2xl font-bold text-gray-700">
              My Orders
            </h2>
            <p className="text-sm md:text-lg">Total Orders: {totalOrders} </p>
          </div>

          <div className="grid grid-cols-2 gap-2 ">
            {/* Filter order by Dates */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 text-sm focus:outline-none transition-all duration-500 ease-in-out hover:shadow-md"
              onChange={(e) => setSelectedDateFilter(e.target.value)}
            >
              {filterByDate.map((range) => (
                <option key={range} className="cursor-pointer" value={range}>
                  {range}
                </option>
              ))}
            </select>

            {/* Filter by order status */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 text-sm focus:outline-none transition-all duration-500 ease-in-out hover:shadow-md"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {filterByStatus.map((status) => (
                <option key={status} className="cursor-pointer" value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm mt-1">Showing: {filteredOrders.length}</div>
        </div>

        <div className="space-y-4 mx-2 lg:mx-0 py-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              return (
                <OrderCard
                  key={order._id}
                  order={order}
                  setInvoiceOrder={setInvoiceOrder}
                  setSelectedOrder={setSelectedOrder}
                  setCancelDialog={setCancelDialog}
                />
              );
            })
          ) : (
            <p className="text-gray-500 text-center">No orders found.</p>
          )}
        </div>

        <div
          ref={bottomRef}
          className={`${hasMore && "h-14"} flex justify-center items-center`}
        >
          {ordersLoading && hasMore && (
            <div className="col-span-full flex justify-center items-center">
              <div className="loader w-8 h-8 border-4 border-green-600 border-t-[#1a4122] rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {invoiceOrder && (
        <InvoiceModal
          orderId={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
      {selectedOrder && (
        <TrackOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Order Cancel Dialog Box */}
      {cancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Cancel Order?
            </h3>
            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to cancel your order.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  CancelOrder(cancelDialog);
                  setCancelDialog(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setCancelDialog(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// // Virtulized List for displaying list virtually
// import { useEffect, useState, useRef } from "react";
// import TrackOrderModal from "../../../components/orders/TrackOrderModal";
// import InvoiceModal from "../../../components/orders/InvoiceModal";
// import { useOrder } from "../../../ContextApi/OrderContext";
// import backend from "../../../network/backend";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion";
// import OrderCard from "../../../components/orders/OrderCard";
// import { useVirtualizer } from "@tanstack/react-virtual";

// export default function MyOrders() {
//   const { orders, setOrders, fetchOrders, page, hasMore, ordersLoading } =
//     useOrder();
//   const parentRef = useRef();

//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [invoiceOrder, setInvoiceOrder] = useState(null);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [cancelDialog, setCancelDialog] = useState(false);

//   const bottomRef = useRef(null);

//   const [seletectedStatus, setSelectedStatus] = useState("All Orders");
//   const [seletectedDateFilter, setSelectedDateFilter] = useState("All Time");

//   const filterByStatus = [
//     "All Orders",
//     "Processing",
//     "Shipped",
//     "Delivered",
//     "Returned",
//     "Cancelled",
//   ];
//   const filterByDate = [
//     "All Time",
//     "Last 1 Month",
//     "Last 3 Months",
//     "Last 6 Months",
//     "Last 1 Year",
//   ];

//   const rowVirtualizer = useVirtualizer({
//     count: filteredOrders.length, // number of items
//     getScrollElement: () => parentRef.current, // scroll container
//     estimateSize: () => 200,
//     overscan: 5,
//   });

//   useEffect(() => {
//     fetchOrders(1);
//   }, []);

//   useEffect(() => {
//     if (!bottomRef.current) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && hasMore && !ordersLoading) {
//           fetchOrders(page + 1);
//         }
//       },
//       {
//         threshold: 0.1,
//         rootMargin: "10px",
//         root: parentRef.current,
//       }
//     );

//     observer.observe(bottomRef.current);

//     return () => observer.disconnect();
//   }, [page, hasMore, ordersLoading]);

//   useEffect(() => {
//     applyFilter();
//   }, [seletectedStatus, seletectedDateFilter, orders]);

//   const applyFilter = () => {
//     if (!orders || orders.length === 0) {
//       setFilteredOrders([]);
//       return;
//     }

//     let filtered = [...orders];

//     if (seletectedStatus !== "All Orders") {
//       filtered = filtered.filter(
//         (order) =>
//           order.shipmentStatus &&
//           order.shipmentStatus.toLowerCase() === seletectedStatus.toLowerCase()
//       );
//     }

//     if (seletectedDateFilter !== "All Time") {
//       const now = new Date();
//       let pastDate = new Date();
//       switch (seletectedDateFilter) {
//         case "Last 1 Month":
//           pastDate.setMonth(now.getMonth() - 1);
//           break;
//         case "Last 3 Months":
//           pastDate.setMonth(now.getMonth() - 3);
//           break;
//         case "Last 6 Months":
//           pastDate.setMonth(now.getMonth() - 6);
//           break;
//         case "Last 1 Year":
//           pastDate.setFullYear(now.getFullYear() - 1);
//           break;
//         default:
//           break;
//       }

//       filtered = filtered.filter(
//         (order) => new Date(order.createdAt) >= pastDate
//       );
//     }
//     setFilteredOrders(filtered);
//   };

//   const CancelOrder = async (orderId) => {
//     try {
//       const { data } = await backend.post(`/order/cancel/${orderId}`);
//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === orderId
//             ? { ...order, shipmentStatus: "cancelled" }
//             : order
//         )
//       );
//     } catch (error) {
//       console.log("Order Cancellation error ", error);
//       toast.error("Cancel order Failed");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white shadow-xl rounded-2xl lg:rounded-3xl p-4 lg:p-8 mx-4 lg:mx-0 mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between md:mb-2 lg:mb-6 gap-4 mx-2 lg:mx-0">
//           <div>
//             <h2 className="md:text-xl lg:text-2xl font-bold text-gray-700">
//               My Orders
//             </h2>
//             <p className="text-sm md:text-lg">
//               Total Orders: {filteredOrders.length}{" "}
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-2 ">
//             {/* Filter order by Dates */}
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 text-sm focus:outline-none transition-all duration-500 ease-in-out hover:shadow-md"
//               onChange={(e) => setSelectedDateFilter(e.target.value)}
//             >
//               {filterByDate.map((range) => (
//                 <option key={range} className="cursor-pointer" value={range}>
//                   {range}
//                 </option>
//               ))}
//             </select>

//             {/* Filter by order status */}
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 text-sm focus:outline-none transition-all duration-500 ease-in-out hover:shadow-md"
//               onChange={(e) => setSelectedStatus(e.target.value)}
//             >
//               {filterByStatus.map((status) => (
//                 <option key={status} className="cursor-pointer" value={status}>
//                   {status}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div
//           ref={parentRef}
//           className="overflow-auto"
//           style={{ height: "600px" }}
//         >
//           <div
//             style={{
//               height: `${rowVirtualizer.getTotalSize()}px`,
//               width: "100%",
//               position: "relative",
//             }}
//           >
//             {rowVirtualizer.getVirtualItems().map((virtualRow) => {
//               const order = filteredOrders[virtualRow.index];
//               if (!order) return null;

//               return (
//                 <div
//                   key={order._id}
//                   ref={virtualRow.measureRef} // this measures actual height
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     marginBottom: "5px",
//                     transform: `translateY(${virtualRow.start}px)`,
//                   }}
//                 >
//                   <OrderCard
//                     order={order}
//                     setInvoiceOrder={setInvoiceOrder}
//                     setSelectedOrder={setSelectedOrder}
//                     setCancelDialog={setCancelDialog}
//                   />
//                 </div>
//               );
//             })}

//             <div
//               ref={bottomRef}
//               style={{
//                 position: "absolute",
//                 top: `${rowVirtualizer.getTotalSize()}px`,
//                 height: "14vh",
//                 width: "100%",
//               }}
//             >
//               {ordersLoading && hasMore && (
//                 <div className="col-span-full flex justify-center items-center">
//                   <div className="loader w-8 h-8 border-4 border-green-600 border-t-[#1a4122] rounded-full animate-spin"></div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {invoiceOrder && (
//         <InvoiceModal
//           orderId={invoiceOrder}
//           onClose={() => setInvoiceOrder(null)}
//         />
//       )}
//       {selectedOrder && (
//         <TrackOrderModal
//           order={selectedOrder}
//           onClose={() => setSelectedOrder(null)}
//         />
//       )}

//       {/* Order Cancel Dialog Box */}
//       {cancelDialog && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
//           >
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//               Cancel Order?
//             </h3>
//             <p className="text-gray-600 text-sm mb-5">
//               Are you sure you want to cancel your order.
//             </p>

//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => {
//                   CancelOrder(cancelDialog);
//                   setCancelDialog(false);
//                 }}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//               >
//                 Yes, Cancel
//               </button>
//               <button
//                 onClick={() => setCancelDialog(false)}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// }
