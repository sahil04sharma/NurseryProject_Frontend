import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const SupportDetailsModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 sm:px-0 z-1000"
    >
      <div className="bg-white rounded-xl w-full max-w-md p-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h2 className="sm:text-xl font-semibold md:mb-2">{ticket.title}</h2>

        <p className="text-gray-600 text-sm md:mb-4">{ticket.description}</p>

        <div className="space-y-2 text-sm">
          <div>
            <strong>Status:</strong>{" "}
            <span className="capitalize">{ticket.requestStatus}</span>
          </div>

          <div>
            <strong>Priority:</strong>{" "}
            <span className="capitalize">{ticket.priority}</span>
          </div>

          <div>
            <strong>Type:</strong>{" "}
            <span className="capitalize">{ticket.requestType}</span>
          </div>

          {ticket.orderId && (
            <div>
              <strong>Order ID:</strong> {ticket.orderId}
            </div>
          )}

          <div>
            <strong>Created At:</strong>{" "}
            {new Date(ticket.createdAt).toLocaleString()}
          </div>

          <div>
            <strong>Last Updated:</strong>{" "}
            {new Date(ticket.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SupportDetailsModal;
