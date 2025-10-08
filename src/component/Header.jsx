// src/component/Header.jsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';

// --- SEARCH OVERLAY COMPONENT ---
const SearchOverlay = ({ onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value;
    if (searchTerm) {
      const searchSlug = searchTerm.trim().toLowerCase().replace(/\s+/g, '-');
      navigate(`/search/post/${searchSlug}`);
      onClose();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl">
        <form onSubmit={handleSearchSubmit}>
          <input ref={inputRef} type="search" name="search" placeholder="Search keyword here..." className="w-full bg-transparent border-b-2 border-gray-300 focus:border-gray-900 text-3xl md:text-5xl text-center text-gray-800 placeholder-gray-400 focus:outline-none py-4 transition-colors" autoComplete="off" />
        </form>
      </div>
      <button onClick={onClose} aria-label="Close search" className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 transition-colors">
        <X size={32} />
      </button>
    </motion.div>
  );
};

// --- SKELETON LOADER COMPONENTS ---
const SkeletonBlock = ({ className }) => <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />;

const HeaderSkeleton = () => (
    <header className="w-full py-5 sticky top-0 z-40 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <SkeletonBlock className="h-8 w-48" />
            <div className="hidden md:flex items-center space-x-8">
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-4 w-28" />
            </div>
            <div className="flex items-center gap-4">
                <SkeletonBlock className="h-6 w-6 rounded-full" />
                <SkeletonBlock className="h-6 w-6 rounded-full md:hidden" />
            </div>
        </div>
    </header>
);


// --- MAIN HEADER COMPONENT ---
const Header = () => {
  const { domainDetails, isDomainLoading } = useContext(AppContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleDropdownToggle = (dropdownId) => setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  const handleMobileDropdownToggle = (dropdownId) => setMobileOpenDropdown(mobileOpenDropdown === dropdownId ? null : dropdownId);
  const handleKeyDown = (event, dropdownId) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleDropdownToggle(dropdownId); } };
  const linkStyles = (scrolled) => `font-semibold transition-colors duration-300 ${scrolled ? 'text-gray-800 hover:text-blue-600' : 'text-gray-600 hover:text-black'}`;
  
  const navLinks = [
    { id: 'home', text: 'Home', href: '/' },
    { id: 'hotel', text: 'Hotel', href: '/category/hotel' },
    { id: 'solo-travel', text: 'Solo Female Travel', href: '/category/solo-female-travel' },
    { id: 'budget-escapes', text: 'Budget-Friendly Escapes', href: '/category/budgetfriendly-escapes' },
    { 
      id: 'more', 
      text: 'More Categories', 
      subLinks: [ 
        { text: 'Motel', href: '/category/motel' },
        { text: 'Lodging', href: '/category/lodging' },
        { text: 'Research', href: '/category/research' },
        { text: 'Local Culinary Adventures', href: '/category/local-culinary-adventures' },
        { text: 'Luxury Retreats', href: '/category/luxury-retreats' },
      ]
    },
  ];

  if (isDomainLoading || !domainDetails) {
    return <HeaderSkeleton />;
  }

  const title = domainDetails.site_title || "My Blog";
  const titleParts = title.split(/(?=[A-Z])/);
  const mainTitle = titleParts[0];
  const subTitle = titleParts.slice(1).join('');

  return (
    <>
      <header className={`w-full py-5 sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 shadow-lg backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          <Link to="/" className="flex items-baseline cursor-pointer whitespace-nowrap">
            <span className="text-4xl font-extrabold tracking-tighter text-gray-800 mr-1">{mainTitle}</span>
            <span className="text-2xl font-bold text-gray-500">{subTitle}</span>
          </Link>

          <nav className="hidden md:flex font-sans items-center space-x-8 text-sm">
            <ul className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <li key={link.id} className="relative text-left" ref={openDropdown === link.id ? dropdownRef : null}>
                  {link.subLinks ? (
                    <div onClick={() => handleDropdownToggle(link.id)} onKeyDown={(e) => handleKeyDown(e, link.id)} className={`${linkStyles(isScrolled)} flex items-center cursor-pointer`} role="button" tabIndex="0" aria-haspopup="true" aria-expanded={openDropdown === link.id}>
                      {link.text}
                      <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${openDropdown === link.id ? 'rotate-180' : ''}`} />
                    </div>
                  ) : (
                    <Link to={link.href} className={linkStyles(isScrolled)}>{link.text}</Link>
                  )}
                  <AnimatePresence>
                    {link.subLinks && openDropdown === link.id && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                        <ul className="py-1">
                          {link.subLinks.map((subLink, index) => ( <li key={index}><Link to={subLink.href} onClick={() => setOpenDropdown(null)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{subLink.text}</Link></li> ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Open search" onClick={() => setIsSearchOpen(true)} className={`${linkStyles(isScrolled)} text-sm`}>
              <Search size={22} />
            </button>
            <button aria-label="Open menu" onClick={() => setIsMenuOpen(true)} className={`${linkStyles(isScrolled)} md:hidden`}>
                <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>{isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}</AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-12">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-baseline cursor-pointer whitespace-nowrap">
                  <span className="text-4xl font-extrabold tracking-tighter text-gray-800 mr-1">{mainTitle}</span>
                  <span className="text-2xl font-bold text-gray-500">{subTitle}</span>
                </Link>
                <button aria-label="Close menu" onClick={() => setIsMenuOpen(false)}>
                  <X size={28} className="text-gray-800" />
                </button>
              </div>
              <nav className="flex-grow">
                <ul className="flex flex-col text-left space-y-8">
                  {navLinks.map((link, index) => (
                    <li key={`${link.id}-${index}`}>
                      {link.subLinks ? (
                        <div>
                          <div onClick={() => handleMobileDropdownToggle(link.id)} className="text-lg text-gray-800 flex items-center w-full cursor-pointer">
                            <span>{link.text}</span>
                            <ChevronDown size={20} className={`ml-1 transition-transform duration-300 ${mobileOpenDropdown === link.id ? 'rotate-180' : ''}`} />
                          </div>
                          <AnimatePresence>
                            {mobileOpenDropdown === link.id && (
                              <motion.ul initial={{ height: 0, opacity: 0, marginTop: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: '0.75rem' }} exit={{ height: 0, opacity: 0, marginTop: 0 }} className="overflow-hidden pl-4 space-y-3">
                                {link.subLinks.map((subLink, index) => (
                                  <li key={index}>
                                    <Link to={subLink.href} onClick={() => setIsMenuOpen(false)} className="text-base text-gray-600 hover:text-blue-600">{subLink.text}</Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link to={link.href} onClick={() => setIsMenuOpen(false)} className="text-lg text-gray-800 hover:text-blue-600">{link.text}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;