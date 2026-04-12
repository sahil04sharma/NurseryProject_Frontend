import React, { useEffect, useMemo, useState } from "react";
import backend from "../network/backend";
import SupportDetailsModal from "../components/support/SupportDetailsModal";
import PageLoader from "../components/Loader/PageLoader";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const filters = [
    "All",
    "pending",
    "in_review",
    "approved",
    "rejected",
    "resolved",
  ];

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    in_review: "bg-blue-100 text-blue-800",
    approved: "bg-emerald-100 text-emerald-800",
    resolved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await backend.cachedGet("/request/by-user");
      setTickets(data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    let data = [...tickets];

    if (statusFilter !== "All") {
      data = data.filter((ticket) => ticket.requestStatus === statusFilter);
    }

    // Latest first
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tickets, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="md:text-2xl font-semibold">My Support Tickets</h2>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-4 py-2 text-left text-sm"
          >
            {filters.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {!filteredTickets.length ? (
          <div className="text-center text-gray-500">No tickets found</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className="cursor-pointer border border-gray-400 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-sm md:text-sm font-semibold">
                  {ticket.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                  {ticket.description}
                </p>

                <div className="mt-1 md:mt-3 flex justify-between items-center text-xs">
                  <p
                    className={`px-2 py-1 rounded-full font-semibold ${
                      statusStyles[ticket.requestStatus] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {ticket.requestStatus.replace("_", " ")}
                  </p>

                  <p
                    className={`px-2 py-1 rounded-xl font-semibold ${
                      ticket.priority.toLowerCase() === "low"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    } `}
                  >
                    {ticket.priority}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedTicket && (
        <SupportDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </>
  );
};

export default Support;
