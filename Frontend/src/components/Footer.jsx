import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Brand Section */}
        <div>
          <h3 className="text-xl font-semibold">P4 Freelancing</h3>
          <p className="text-gray-400 mt-2">Empowering freelancers & businesses worldwide.</p>
        </div>

        {/* Freelancers Section */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Freelancers</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Find Work</a></li>
            <li><a href="#" className="hover:text-white">Membership</a></li>
            <li><a href="#" className="hover:text-white">Resources</a></li>
            <li><a href="#" className="hover:text-white">Get Verified</a></li>
          </ul>
        </div>

        {/* Clients Section */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Clients</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Post a Job</a></li>
            <li><a href="#" className="hover:text-white">Hire Talent</a></li>
            <li><a href="#" className="hover:text-white">Project Management</a></li>
            <li><a href="#" className="hover:text-white">Enterprise Solutions</a></li>
          </ul>
        </div>

        {/* Company Section */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Press & Media</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Legal Section */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Copyright Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mx-auto px-6 md:px-12 mt-10 flex flex-col md:flex-row justify-between items-center text-gray-400">
        <p>© 2025 P4 Freelancing. All rights reserved.</p>

        {/* Social Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white"><Facebook size={20} /></a>
          <a href="#" className="hover:text-white"><Twitter size={20} /></a>
          <a href="#" className="hover:text-white"><Youtube size={20} /></a>
          <a href="#" className="hover:text-white"><Instagram size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
