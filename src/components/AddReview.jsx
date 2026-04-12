import { useState } from "react";
import backend from "../network/backend";
import { useAuth } from "../ContextApi/AuthContext";
import { toast } from "react-toastify";
import ProcessingLoader from "./Loader/ProcessingLoader";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { convertSingleToWebP } from "../helper/convertToWebP";
import useApp from "../ContextApi/AppContext";

export default function ReviewContactSection() {
  const [form, setForm] = useState({
    reviewText: "",
    rating: 5,
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { contact } = useApp();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0] || null;

    const webpImage = await convertSingleToWebP(file); // Converting in WebP to reduce size

    setForm((prev) => ({
      ...prev,
      imageFile: webpImage,
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to submit a review.");
      return;
    }
    if (!form.reviewText || !form.rating || !form.imageFile) {
      toast.error("All fields are required.");
      return;
    }

    if (form.reviewText.trim().length < 10) {
      toast.error("Message must be at least 10 characters.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("reviewText", form.reviewText.trim());
      fd.append("rating", String(form.rating));
      if (form.imageFile) fd.append("image", form.imageFile);

      const { data } = await backend.post("/review/add-review", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Review added successfully.");
        setForm({
          reviewText: "",
          rating: 5,
          imageFile: null,
        });
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#f2eee9] text-[#3b3a38]">
      <div className="w-full h-[220px] md:h-[280px] overflow-hidden">
        <img
          src="https://i.pinimg.com/1200x/66/38/70/6638701f0d7d3697824d46cc71bccaa4.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <p className="text-center text-body tracking-wide text-[#7d7b78]">
          Add Review
        </p>

        <h2 className="mt-6 text-center heading-2 tracking-[0.08em] uppercase">
          Tell Us About Your Experience
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_auto_1.3fr] gap-8">
          {/* Left Column */}
          <div className="text-sm space-y-6">
            <div>
              <div className="uppercase tracking-[0.2em] text-[11px] text-[#9a978f]">
                Email
              </div>
              <div className="mt-1">{contact?.email}</div>
            </div>
            <div>
              <div className="uppercase tracking-[0.2em] text-[11px] text-[#9a978f]">
                Phone
              </div>
              <div className="mt-1">
                {contact?.phoneNumber}{" "}
                {contact?.alternateNumber ? `, ${contact.alternateNumber}` : ""}{" "}
              </div>
            </div>
            <div>
              <div className="uppercase tracking-[0.2em] text-[11px] text-[#9a978f]">
                Address
              </div>
              <div className="mt-1">{contact?.address}</div>
            </div>
            <div>
              <div className="uppercase tracking-[0.2em] text-[11px] text-[#9a978f]">
                Social
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div>
                  <h3 className="heading-3 mb-6">Follow Us</h3>
                  <div className="space-y-3">
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0f68e3] transition-colors"
                    >
                      <FaFacebook className="w-4 h-4 text-body" />
                      <p>Facebook</p>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#cc26b0] transition-colors"
                    >
                      <FaInstagram className="w-4 h-4 text-body" />
                      <p>Instagram</p>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0f68e3] transition-colors"
                    >
                      <FaTwitter className="w-4 h-4 text-body" />
                      <p>Twitter</p>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0f68e3] transition-colors"
                    >
                      <FaLinkedin className="w-4 h-4 text-body" />
                      <p>LinkedIn</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-[#dcd7d0] mx-2" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              aria-label="Upload file"
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={!!form.emotionImage}
              className="block w-full text-xs text-[#3b3a38] border border-[#bfb8ae] bg-transparent file:mr-4 file:py-3 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#e5ded5] file:text-[#3b3a38] hover:file:bg-[#d8d0c6] disabled:opacity-60"
            />

            <p className="text-body text-[#7d7b78]">
              Upload an image or paste a URL above. Only one is required.
            </p>

            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="h-10 w-full border border-[#bfb8ae] bg-transparent px-3 text-sm tracking-wide outline-none focus:ring-1 focus:ring-[#bfb8ae]"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <textarea
              name="reviewText"
              value={form.reviewText}
              onChange={handleChange}
              placeholder="MESSAGE"
              className="h-32 w-full border border-[#bfb8ae] bg-transparent px-3 py-2 text-sm tracking-wide outline-none resize-none focus:ring-1 focus:ring-[#bfb8ae]"
              minLength={10}
              maxLength={1000}
              required
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="relative mx-auto block w-[120px] h-9 rounded-full bg-[#1a4122] text-white tracking-[0.15em] text-xs hover:bg-[#2c6536] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? <ProcessingLoader /> : "SUBMIT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
