import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { toast } from "react-toastify";
import backend from "../../network/backend";
import { useAuth } from "../../ContextApi/AuthContext";
import { useSearchParams } from "react-router-dom";

const ChatSupportForm = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("itemId");

  const [form, setForm] = useState({
    title: "",
    description: "",
    orderId: orderId || "",
    type: "query",
  });
  const [images, setImages] = useState([]);
  const { loading, setLoading } = useAuth();

  const handleOnChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.orderId) {
      toast.error("Order-ID is required");
      return;
    }

    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("type", form.type);
      formData.append("orderId", form.orderId);

      // append multiple images
      images.forEach((file) => {
        formData.append("banner", file);
      });

      const { data } = await backend.post("/request/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success(data.message || "Request created successfully");

        // reset form
        setForm({
          title: "",
          description: "",
          orderId: "",
          type: "query",
        });
        setImages([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full"
    >
      <div className="p-4 sm:p-8 bg-white shadow-md ">
        <h3 className="heading-3 mb-6 text-green-900">Support</h3>

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          <Input
            placeholder="Title- e.g. Delivery Status"
            name="title"
            value={form.title}
            onChange={handleOnChange}
          />

          <Input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
          />

          <Textarea
            rows={5}
            name="description"
            placeholder="Tell us more about your query..."
            value={form.description}
            onChange={handleOnChange}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg bg-green-900 text-white rounded-lg shadow hover:scale-95 active:scale-95 flex items-center justify-center disabled:opacity-60"
          >
            <Send className="w-5 h-5 mr-2" />
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatSupportForm;
