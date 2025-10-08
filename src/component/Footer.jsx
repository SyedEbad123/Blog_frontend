// src/component/Footer.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Github, Globe } from 'lucide-react';
import AppContext from '../context/AppContext';

// --- SKELETON LOADER COMPONENT ---
const SkeletonBlock = ({ className }) => <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />;

const FooterSkeleton = () => (
    <>
        <section className="w-full py-16 border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="w-full md:w-1/2">
                        <SkeletonBlock className="h-8 w-3/4 mb-3" />
                        <SkeletonBlock className="h-8 w-1/2" />
                    </div>
                    <div className="w-full max-w-md md:w-auto">
                        <SkeletonBlock className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </section>
        <footer className="bg-gray-50 w-full border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-left items-start">
                    <div className="col-span-2 sm:col-span-3 lg:col-span-1 mb-4 lg:mb-0 lg:mr-12">
                        <SkeletonBlock className="h-10 w-48 -mt-2" />
                    </div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <SkeletonBlock className="h-5 w-2/3 mb-6" />
                            <div className="space-y-3">
                                <SkeletonBlock className="h-4 w-full" />
                                <SkeletonBlock className="h-4 w-5/6" />
                                <SkeletonBlock className="h-4 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <SkeletonBlock className="h-4 w-1/3 mb-4 sm:mb-0" />
                    <SkeletonBlock className="h-4 w-1/4" />
                </div>
            </div>
        </footer>
    </>
);


// --- MAIN FOOTER COMPONENT ---
const Footer = () => {
  const { domainDetails, isDomainLoading } = useContext(AppContext);
  const currentYear = new Date().getFullYear();

  if (isDomainLoading || !domainDetails) {
    return <FooterSkeleton />;
  }

  const title = domainDetails.site_title || "My Blog";
  const titleParts = title.split(/(?=[A-Z])/);
  const mainTitle = titleParts[0];
  const subTitle = titleParts.slice(1).join('');

  return (
    <>
      <section className="w-full py-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <h2 className="text-lg md:text-3xl font-bold text-gray-800 text-center md:text-left leading-tight">
              Stay up to date with our news,
              <br />
              ideas and updates
            </h2>
            <form className="flex w-full max-w-md md:w-auto">
              <input type="email" placeholder="Your email address" className="w-full px-4 py-3 border border-gray-300 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Email for newsletter" />
              <button type="submit" className="bg-blue-600 text-white font-medium text-xs px-5 rounded-r-md hover:bg-blue-700 transition-colors">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 w-full border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-left items-start">
            
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 mb-4 -mt-10 lg:mb-0 lg:mr-12">
              <Link to="/" className="flex items-baseline cursor-pointer whitespace-nowrap">
                <span className="text-4xl font-extrabold tracking-tighter text-gray-800 mr-1">{mainTitle}</span>
                <span className="text-2xl font-bold text-gray-500">{subTitle}</span>
              </Link>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
              <ul className="space-y-3 md:text-xs text-sm text-gray-600">
                <li><Link to="/category/hotel" className="hover:text-blue-600 transition-colors">Hotel</Link></li>
                <li><Link to="/category/solo-female-travel" className="hover:text-blue-600 transition-colors">Solo Female Travel</Link></li>
                <li><Link to="/category/budget-friendly-escapes" className="hover:text-blue-600 transition-colors">Budget-Friendly Escapes</Link></li>
                <li><Link to="/category/luxury-retreats" className="hover:text-blue-600 transition-colors">Luxury Retreats</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">More</h4>
              <ul className="space-y-3 md:text-xs text-sm text-gray-600">
                <li><Link to="/category/local-culinary-adventures" className="hover:text-blue-600 transition-colors">Local Culinary Adventures</Link></li>
                <li><Link to="/category/lodging" className="hover:text-blue-600 transition-colors">Lodging</Link></li>
                <li><Link to="/category/research" className="hover:text-blue-600 transition-colors">Research</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3 md:text-xs text-sm text-gray-600">
                <li><Link to="#" className="hover:text-blue-600 transition-colors">Terms of Use</Link></li>
                <li><Link to="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-blue-600 transition-colors">Site Map</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Connect With Us</h4>
              <ul className="space-y-3 md:text-xs text-sm text-gray-600">
                <li><a href="mailto:hello@yourdomain.com" className="hover:text-blue-600 transition-colors">hello@yourdomain.com</a></li>
                <li className="flex items-center gap-4 pt-2">
                  <a href="#" aria-label="Facebook"><Facebook className="hover:text-blue-600 transition-colors" size={20} /></a>
                  <a href="#" aria-label="Twitter"><Twitter className="hover:text-blue-600 transition-colors" size={20} /></a>
                  <a href="#" aria-label="Github"><Github className="hover:text-blue-600 transition-colors" size={20} /></a>
                  <a href="#" aria-label="Dribbble"><Globe className="hover:text-blue-600 transition-colors" size={20} /></a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left text-sm text-gray-500">
            <p className="mb-4 sm:mb-0">&copy; {currentYear} {domainDetails.site_title}. All Rights Reserved</p>
            <p>
              Made with <span role="img" aria-label="love">❤️</span> by <a href="#" className="hover:text-blue-600 font-semibold transition-colors">@SE</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;