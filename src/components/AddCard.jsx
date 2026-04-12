import { CreditCard, User, Calendar, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddCard = () => {
  const navigate = useNavigate();

  const [card, setCard] = useState({
    type: "",
    cardNumber: "",
    cardHolderName: "",
    expiry: "",
  });

  const handleChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Card Saved:", card);
    navigate("/my-profile");
  };

  return (
    <div className="pt-24 px-4">
      {" "}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4 max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-white heading-2">Add New Card</h2>
            <p className="text-green-100">Enter your card details</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-white text-green-700 px-4 py-2 rounded-lg shadow hover:shadow-md flex items-center gap-2 text-body"
          >
            <CreditCard className="w-4 h-4" /> Save Card
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-4">
            <CreditCard className="w-6 h-6 text-green-600 mt-1" />

            <div className="flex-1">
              <label className="text-sm text-gray-500 block mb-2">
                Network Type
              </label>

              <div className="flex flex-col sm:flex-row gap-4">
                {["Visa", "MasterCard", "Rupay", "Amex"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="type"
                      value={option}
                      checked={card.type === option}
                      onChange={handleChange}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
            <Hash className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <label className="text-sm text-gray-500">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={card.cardNumber}
                onChange={handleChange}
                placeholder="XXXX XXXX XXXX XXXX"
                className="w-full  bg-transparent border-none focus:ring-0 focus:outline-none focus:border-gray-300"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
            <User className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <label className="text-sm text-gray-500">Card Holder</label>
              <input
                type="text"
                name="cardHolderName"
                value={card.cardHolderName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full  bg-transparent border-none focus:ring-0 focus:outline-none focus:border-gray-300"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <label className="text-sm text-gray-500">Expiry</label>
              <input
                type="text"
                name="expiry"
                value={card.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full  bg-transparent border-none focus:ring-0 focus:outline-none focus:border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCard;
