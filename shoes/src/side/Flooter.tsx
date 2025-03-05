
import { Facebook, Instagram, Twitter, Github, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0B1120] text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Links */}
        <div className="flex justify-center space-x-8 mb-8">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Blog</a>
          <a href="#" className="hover:text-white transition-colors">Jobs</a>
          <a href="#" className="hover:text-white transition-colors">Press</a>
          <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          <a href="#" className="hover:text-white transition-colors">Partners</a>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="hover:text-white transition-colors">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Github className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Youtube className="w-6 h-6" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm">
          <p>© 2024 Your Company, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;