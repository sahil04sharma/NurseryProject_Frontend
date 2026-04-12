import React, { useState } from "react";
import { Plus, CreditCard, Trash2, Star } from "lucide-react";

export default function Wallet() {
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Suraj Chaudhary",
      number: "**** **** **** 4829",
      expiry: "08/27",
      isDefault: true,
    },
    {
      id: 2,
      name: "Suraj Chaudhary",
      number: "**** **** **** 1123",
      expiry: "12/25",
      isDefault: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCard, setNewCard] = useState({
    name: "",
    number: "",
    expiry: "",
  });

  const handleAddCard = () => {
    if (!newCard.name || !newCard.number || !newCard.expiry) return;
    setCards([
      ...cards,
      { ...newCard, id: Date.now(), number: maskNumber(newCard.number) },
    ]);
    setNewCard({ name: "", number: "", expiry: "" });
    setShowModal(false);
  };

  const maskNumber = (num) => {
    const clean = num.replace(/\s+/g, "");
    return "**** **** **** " + clean.slice(-4);
  };

  const handleDelete = (id) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleSetDefault = (id) => {
    setCards(cards.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="text-green-600" /> My Wallet
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all"
          >
            <Plus size={16} /> Add Card
          </button>
        </div>

        {/* Saved Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl p-5 py-8 shadow-md transition-transform`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">Visa</h3>
              </div>

              <p className="mt-6 text-lg tracking-widest">{card.number}</p>
              <div className="flex justify-between items-center mt-4 text-sm">
                <div>
                  <p className="uppercase opacity-80 text-xs">Card Holder</p>
                  <p className="font-medium">{card.name}</p>
                </div>
                <div>
                  <p className="uppercase opacity-80 text-xs">Expires</p>
                  <p className="font-medium">{card.expiry}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                {!card.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    className="bg-white/20 hover:bg-white/30 p-1 rounded-md text-xs"
                  >
                    Set Default
                  </button>
                ) : (
                  <span className="flex items-center text-xs bg-white/20 px-2 py-1 rounded-md">
                    <Star size={12} className="text-yellow-300 mr-1" />
                    Default
                  </span>
                )}
                <button
                  onClick={() => handleDelete(card.id)}
                  className="bg-white/20 hover:bg-white/30 p-1 rounded-md"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {cards.length === 0 && (
          <p className="text-center text-gray-500 py-8">No cards saved yet.</p>
        )}
      </div>

      {/* Add Card Modal */}
      {showModal && (
        <div className="fixed mt-12 inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Card
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Card Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCard.name}
                  onChange={(e) =>
                    setNewCard({ ...newCard, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCard.number}
                  onChange={(e) =>
                    setNewCard({ ...newCard, number: e.target.value })
                  }
                  placeholder="1234 5678 9123 4567"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date (MM/YY) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCard.expiry}
                  onChange={(e) =>
                    setNewCard({ ...newCard, expiry: e.target.value })
                  }
                  placeholder="08/27"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <button
                onClick={handleAddCard}
                className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
              >
                Save Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
