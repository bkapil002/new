import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0B1120] text-gray-300 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row justify-center md:space-x-8 space-y-4 md:space-y-0 mb-8">
          <a href="#" className="text-center hover:text-white transition-colors">Home</a>
          <a href="#" className="text-center hover:text-white transition-colors">Blog</a>
          <a href="#" className="text-center hover:text-white transition-colors">Shoes</a>

        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="hover:text-white transition-colors">
            <Facebook className="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Instagram className="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Twitter className="w-5 h-5 md:w-6 md:h-6" />
          </a>
          
        </div>

        {/* Copyright */}
        <div className="text-center text-xs md:text-sm">
          <p>© 2024 Your Company, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;