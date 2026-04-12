import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import useApp from "../../ContextApi/AppContext";

const Footer = () => {
  const { contact } = useApp();

  return (
    <footer className="bg-[#E5E1DA] text-[#2C3E2F] mt-auto">
      {/* Main Footer Content */}
      <div className="lg:mx-20 max-w-8xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-start mb-2 md:text-2xl font-semibold text-md">
              <h3 className="heading-3">GreenNest</h3>
            </div>
            <p className="text-body pb-6 text-gray-600 max-w-xs leading-relaxed">
              The event specialists at our Southern California headquarters are
              available to help with every aspect of your event.
            </p>

            <div className="space-y-4 md:space-y-6 border-t border-gray-400 pt-6">
              <div className="flex items-start gap-3">
                <p className="text-body uppercase tracking-wide text-gray-800 min-w-20">
                  CALL US
                </p>
                <div className="text-sm">
                  <p>
                    {contact?.phoneNumber}
                    {contact?.alternateNumber && " |"}{" "}
                    {contact?.alternateNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <p className="text-body uppercase tracking-wide text-gray-800 min-w-20">
                  EMAIL US
                </p>
                <a
                  href={`mailto:${contact.email || contact.supportEmail}`}
                  className="text-sm hover:text-[#0A6041] transition-colors"
                >
                  {contact.email || contact.supportEmail}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <p className="text-body uppercase tracking-wide text-gray-800 min-w-20">
                  FIND US
                </p>
                <p className="text-body">{contact.address}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 lg:col-span-4">
            {/* Store Location Section */}
            <div>
              <h3 className="heading-3 mb-6 flex items-center gap-2">
                Location
                <p className="text-[#FF6B35] text-body">→</p>
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a
                    href="/about-us"
                    className="hover:text-[#0A6041] transition-colors"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    href="/blogs"
                    className="hover:text-[#0A6041] transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Information Section */}
            <div>
              <h3 className="heading-3 mb-6 flex items-center gap-2">
                Information
                <p className="text-[#FF6B35] text-body">→</p>
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a
                    href="/Contact-us"
                    className="hover:text-[#0A6041] transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0A6041] transition-colors"
                  >
                    Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Venues Section */}
            <div>
              <h3 className="heading-3 mb-6 flex items-center gap-2">
                Venues
                <p className="text-[#FF6B35] text-body">→</p>
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a
                    href="/my-profile"
                    className="hover:text-[#0A6041] transition-colors"
                  >
                    My Account
                  </a>
                </li>
                <li>
                  <a
                    href="my-profile/my-orders"
                    className="hover:text-[#0A6041] transition-colors"
                  >
                    My Orders
                  </a>
                </li>
                <li>
                  <a
                    href="/ViewAll-Item"
                    className="hover:text-[#0A6041] transition-colors"
                  >
                    Shop
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us Section */}
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

      {/* Footer Bottom */}
      <div className="max-w-8xl lg:mx-20 px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-400">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          {/* Left Side */}
          <p className="text-body">
            © {new Date().getFullYear()} GreenNest. All rights reserved.
          </p>

          {/* Right Side */}
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0A6041] transition-colors">
              ADA Accessibility Policy
            </a>
            <a href="#" className="hover:text-[#0A6041] transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
