// src/page/HomePage.jsx

import React, { useRef, useContext } from 'react';
import AppContext from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';

// --- CONSTANTS ---
const IMAGE_BASE_URL = 'https://www.thatgirlmags.com';
const PLACEHOLDER_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';

// --- HELPER SVG COMPONENTS ---
const QuoteIcon = () => ( <svg className="w-8 h-8 text-gray-400 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14"> <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/> </svg> );
const ArrowIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-4 w-4"> <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /> </svg> );

// --- SKELETON LOADER COMPONENTS (FOR LOADING STATE) ---

// A generic, reusable block for the pulsing skeleton effect
const SkeletonBlock = ({ className }) => <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />;

// A skeleton that mimics the layout of a single BlogCard
const BlogCardSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
        <SkeletonBlock className="w-full h-48" />
        <div className="p-6">
            <SkeletonBlock className="h-3 w-1/4 mb-4" />
            <SkeletonBlock className="h-5 w-3/4 mb-3" />
            <SkeletonBlock className="h-5 w-full mb-4" />
            <SkeletonBlock className="h-3 w-1/2" />
        </div>
    </div>
);

// A skeleton that mimics the layout of a single HorizontalCard
const HorizontalCardSkeleton = () => (
    <div className="w-full flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
        <SkeletonBlock className="md:w-2/5 md:shrink-0 h-64 md:h-auto" />
        <div className="p-8 flex flex-col justify-center w-full">
            <SkeletonBlock className="h-4 w-1/4 mb-6" />
            <SkeletonBlock className="h-6 w-3/4 mb-4" />
            <SkeletonBlock className="h-4 w-full mb-3" />
            <SkeletonBlock className="h-4 w-5/6 mb-8" />
            <SkeletonBlock className="h-5 w-1/3 mt-auto" />
        </div>
    </div>
);

// The main skeleton component that replicates the entire HomePage layout
const HomePageSkeleton = () => (
    <div className="bg-white">
        <main className="max-w-7xl mx-auto px-2 md:px-2 pt-6">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                <div className="lg:col-span-2">
                    <SkeletonBlock className="h-[30rem] md:h-[40rem] rounded-3xl" />
                    <div className="mt-8">
                        <SkeletonBlock className="h-6 w-1/4 mb-4" />
                        <SkeletonBlock className="h-4 w-full" />
                        <SkeletonBlock className="h-4 w-3/4 mt-2" />
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <BlogCardSkeleton />
                    <BlogCardSkeleton />
                </div>
            </section>
            <section className="mb-16 relative">
                <SkeletonBlock className="h-8 w-1/4 mb-8" />
                <div className="flex gap-6 overflow-hidden">
                    <div className="w-80 md:w-96 flex-shrink-0"><BlogCardSkeleton /></div>
                    <div className="w-80 md:w-96 flex-shrink-0"><BlogCardSkeleton /></div>
                    <div className="w-80 md:w-96 flex-shrink-0 hidden md:block"><BlogCardSkeleton /></div>
                </div>
            </section>
            <section className="mb-16"><HorizontalCardSkeleton /></section>
            <section className="mb-16"><div className="flex flex-col gap-8"><HorizontalCardSkeleton /></div></section>
            <section className="mb-12">
                <SkeletonBlock className="h-8 w-1/4 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <BlogCardSkeleton />
                    <BlogCardSkeleton />
                    <BlogCardSkeleton />
                </div>
            </section>
        </main>
    </div>
);


// --- REUSABLE DESIGN COMPONENTS (FOR LOADED STATE) ---
const ImagesSlider = ({ images, children }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };
    React.useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [images, children]);
    const currentChild = React.Children.toArray(children)[currentIndex];
    return (
        <div className="h-[30rem] md:h-[40rem] rounded-3xl relative overflow-hidden">
            <AnimatePresence>
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="w-full h-full object-cover absolute inset-0"
                    alt="Featured post background"
                />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
            <div className="relative z-20 h-full">{currentChild}</div>
        </div>
    );
};

const BlogCard = ({ cat_id, title, blog_img_lg, sub_date, url_title, author_name }) => {
    const imageUrl = blog_img_lg ? `${IMAGE_BASE_URL}/${blog_img_lg}` : PLACEHOLDER_IMAGE;
    return (
        <Link to={`/post/${url_title}`} className="block bg-white rounded-xl overflow-hidden shadow-md transition-transform duration-300 ease-in-out cursor-pointer hover:-translate-y-2">
            <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <p className="text-xs font-semibold text-blue-500 uppercase mb-2">Category {cat_id}</p>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
                <p className="text-xs text-gray-400">By {author_name || 'Admin'} | {new Date(sub_date).toLocaleDateString()}</p>
            </div>
        </Link>
    );
};

const InfiniteMovingCards = ({ items, direction = 'left', speed = 'slow' }) => {
    const containerRef = useRef(null);
    const scrollerRef = useRef(null);
    React.useEffect(() => { addAnimation(); }, []);
    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);
            scrollerRef.current.innerHTML = '';
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) scrollerRef.current.appendChild(duplicatedItem);
            });
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute('aria-hidden', true);
                if (scrollerRef.current) scrollerRef.current.appendChild(duplicatedItem);
            });
            getDirection();
            getSpeed();
        }
    }
    const getDirection = () => { if (containerRef.current) { containerRef.current.style.setProperty("--animation-direction", direction === "left" ? "forwards" : "reverse"); } };
    const getSpeed = () => { if (containerRef.current) { if (speed === "fast") { containerRef.current.style.setProperty("--animation-duration", "40s"); } else if (speed === "normal") { containerRef.current.style.setProperty("--animation-duration", "80s"); } else { containerRef.current.style.setProperty("--animation-duration", "150s"); } } };
    return (
        <div ref={containerRef} className="scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_90%,transparent)]">
            <style>{`.scroller{--animation-duration:150s;--animation-direction:forwards}.scroller-inner{animation:infinite-scroll var(--animation-duration) linear infinite var(--animation-direction)}@keyframes infinite-scroll{from{transform:translateX(0)}to{transform:translateX(calc(-50% - 0.75rem))}}`}</style>
            <ul ref={scrollerRef} className="scroller-inner flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap">
                {items.map((item, index) => (<li key={`${item.id}-${index}`} className="w-80 md:w-96 flex-shrink-0"><BlogCard {...item} /></li>))}
            </ul>
        </div>
    );
};

const HorizontalCard = ({ cat_id, title, short_des, blog_img_lg, url_title }) => {
    const imageUrl = blog_img_lg ? `${IMAGE_BASE_URL}/${blog_img_lg}` : PLACEHOLDER_IMAGE;
    return (
        <div className="w-full flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:w-2/5 md:shrink-0 h-64 md:h-auto">
                <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-center">
                <p className="text-sm font-semibold text-gray-500 mb-4 uppercase">Category {cat_id}</p>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-8 font-normal">{short_des}</p>
                <Link to={`/post/${url_title}`} className="inline-block mt-auto">
                    <button className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        Learn More <ArrowIcon />
                    </button>
                </Link>
            </div>
        </div>
    );
};

const StoriesSlider = ({ items }) => {
    const [page, setPage] = React.useState(0);
    const cardsPerPage = 3;
    const totalPages = Math.ceil(items.length / cardsPerPage);
    const paginate = (newPage) => { setPage((newPage + totalPages) % totalPages); };
    const currentItems = items.slice(page * cardsPerPage, (page + 1) * cardsPerPage);
    return (
        <section className="mb-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">All Stories ›</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => paginate(page - 1)} className="w-16 h-16 m-0 flex justify-center items-center cursor-pointer text-gray-900" aria-label="Previous story page">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => paginate(page + 1)} className="w-16 h-16 flex justify-center items-center cursor-pointer text-gray-900" aria-label="Next story page">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={page}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {currentItems.map(post => <BlogCard key={post.id} {...post} />)}
                </motion.div>
            </AnimatePresence>
        </section>
    );
};

const FeaturedHorizontalCard = ({ cat_id, title, short_des, blog_img_lg, url_title, sub_date, author_name }) => {
    const imageUrl = blog_img_lg ? `${IMAGE_BASE_URL}/${blog_img_lg}` : PLACEHOLDER_IMAGE;
    return (
        <div className="w-full flex flex-col md:flex-row bg-[#2B3A4A] text-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center order-2 md:order-1">
                <p className="text-sm font-semibold text-blue-400 mb-4 uppercase">Category {cat_id}</p>
                <h3 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    <Link to={`/post/${url_title}`} className="hover:underline">{title}</Link>
                </h3>
                <p className="text-gray-300 mb-8 font-normal">{short_des}</p>
                <p className="text-sm text-gray-400 mt-auto">By {author_name || 'Admin'} | {new Date(sub_date).toLocaleDateString()}</p>
            </div>
            <div className="md:w-1/2 md:shrink-0 h-64 md:h-auto order-1 md:order-2">
                <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
            </div>
        </div>
    );
};


// --- MAIN HOMEPAGE COMPONENT ---
const HomePage = () => {
  const { homepageData, isHomepageLoading } = useContext(AppContext);

  // If data is still loading, show the beautiful skeleton UI.
  if (isHomepageLoading || !homepageData) {
    return <HomePageSkeleton />;
  }

  // Once data arrives, destructure it for easier use.
  const {
    featuredPosts,
    secondaryPosts,
    latestNews,
    featuredHorizontalPost,
    horizontalCardData,
    allStories
  } = homepageData;

  // Render the real page content.
  return (
    <div className="bg-white text-left text-gray-800 font-sans">
      <main className="max-w-7xl mx-auto px-2 md:px-2 pt-6">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            <div className="lg:col-span-2">
                {featuredPosts && featuredPosts.length > 0 && (
                  <ImagesSlider images={featuredPosts.map(p => p.blog_img_lg ? `${IMAGE_BASE_URL}/${p.blog_img_lg}` : PLACEHOLDER_IMAGE)}>
                    {featuredPosts.map((post) => (
                      <Link to={`/post/${post.url_title}`} key={post.id} className="block z-50 w-full h-full">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="w-full h-full flex flex-col justify-end items-start p-6 md:p-12 text-left"
                          >
                              <p className="text-sm font-semibold text-blue-400 uppercase mb-2 md:mb-4">Category {post.cat_id}</p>
                              <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 max-w-4xl">{post.title}</h2>
                              <p className="text-xs md:text-base text-gray-200 mb-4 max-w-3xl">{post.short_des}</p>
                              <p className="text-xs md:text-sm text-gray-400">By {post.author_name || 'Admin'} | {new Date(post.sub_date).toLocaleDateString()}</p>
                          </motion.div>
                      </Link>
                    ))}
                  </ImagesSlider>
                )}
                <div className="mt-8">
                    <blockquote className="text-xl italic font-semibold text-gray-900">
                        <QuoteIcon />
                        <p>"Crave your way through town with our favorite local eats—from sizzling street food to family-run diners. Skip the tourist traps and savor the soul of a place."</p>
                    </blockquote>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                {secondaryPosts && secondaryPosts.map(post => <BlogCard key={post.id} {...post} />)}
            </div>
            </section>

            {latestNews && latestNews.length > 0 && (
              <section className="mb-16 relative">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Latest News ›</h2>
                    <InfiniteMovingCards items={latestNews} />
                </div>
              </section>
            )}

            {featuredHorizontalPost && (
              <section className="mb-16">
                <FeaturedHorizontalCard {...featuredHorizontalPost} />
              </section>
            )}

            {horizontalCardData && horizontalCardData.length > 0 && (
              <section className="mb-16">
                <div className="flex flex-col gap-8">
                    {horizontalCardData.map(card => ( <HorizontalCard key={card.id} {...card} /> ))}
                </div>
              </section>
            )}

            {allStories && allStories.length > 0 && (
              <StoriesSlider items={allStories} />
            )}
      </main>
    </div>
  );
};

export default HomePage;