import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "react-toastify";
import useApp from "../ContextApi/AppContext";

export default function Contact() {
  const { contact } = useApp();
  const [sending, setSending] = useState(false);

  const infoCards = [
    {
      icon: MapPin,
      title: "Address",
      lines: contact.address ? [String(contact.address)] : ["—"],
    },
    {
      icon: Phone,
      title: "Phone",
      lines: [
        contact.phoneNumber !== "" ? String(contact.phoneNumber) : null,
        contact.alternateNumber !== "" ? String(contact.alternateNumber) : null,
      ].filter(Boolean),
    },
    {
      icon: Mail,
      title: "Email",
      lines: [
        contact.email ? String(contact.email) : null,
        contact.supportEmail ? String(contact.supportEmail) : null,
      ].filter(Boolean),
    },
    {
      icon: Clock,
      title: "Business Hours",
      lines: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
      ],
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!data.get("email") || !data.get("message")) {
      toast.error("Please fill out email and message");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("https://formspree.io/f/xdkwedlw", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = await res.json();
      if (res.ok && json?.ok !== false) {
        toast.success("Message sent successfully");
        form.reset();
      } else {
        const msg = json?.errors?.[0]?.message || "Failed to send message";
        toast.error(msg);
      }
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="bg-gray-50 pb-6">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3 }}
          className=" text-center pt-30 sm:pt-6 md:pt-2 mb-4 lg:mb-8"
        >
          <h2 className="text-xl gideon-roman font-semibold sm:text-2xl md:text-3xl text-green-900">
            Get In Touch
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              {(!contact
                ? [
                    { icon: MapPin, title: "Address", lines: ["Loading..."] },
                    { icon: Phone, title: "Phone", lines: ["Loading..."] },
                    { icon: Mail, title: "Email", lines: ["Loading..."] },
                    {
                      icon: Clock,
                      title: "Business Hours",
                      lines: ["Loading..."],
                    },
                  ]
                : infoCards
              ).map((item) => (
                <motion.div
                  key={item.title}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center bg-green-50">
                    <item.icon className="w-6 h-6 text-green-900" />
                  </div>
                  <div>
                    <h4 className=" mb-2 text-md sm:text-xl md:text-2xl text-green-900">
                      {item.title}
                    </h4>
                    {item.lines.length ? (
                      item.lines.map((line, idx) => (
                        <p key={idx} className="text-gray-600 text-body">
                          {line}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-400 text-body">—</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="p-8 bg-white shadow-md">
              <h3 className="heading-3 mb-6 text-green-900">Contact Us</h3>

              {/* Controlled submit: no action/method */}
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full"
                  />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full"
                  />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  className="w-full"
                />
                <Input
                  id="subject"
                  name="subject"
                  placeholder="How can we help you?"
                  className="w-full"
                />
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full"
                />

                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 text-lg bg-green-900 text-white rounded-lg cursor-pointer shadow hover:shadow-md transition-transform transform hover:scale-95 active:scale-95 flex items-center justify-center disabled:opacity-60"
                >
                  <Send className="w-5 h-5 mr-2 text-white" />
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <div className="rounded-2xl bg-white shadow-md">
            <a
              href="https://www.google.com/maps/place/C-87,+2nd+floor,+MetaBulls+Media,+C+Block,+Sector+63,+Noida,+UP"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition-transform transform"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.123456789!2d77.3839695!3d28.6177901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef65b246cc35%3A0x2bf91631a8d9eee9!2sC-87,+2nd+floor,+MetaBulls+Media,+C+Block,+Sector+63,+Noida,+UP!5e0!3m2!1sen!2sin!4v1696047600000!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MetaBulls Media Location"
              ></iframe>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
