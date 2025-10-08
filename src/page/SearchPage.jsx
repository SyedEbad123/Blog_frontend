// src/page/SearchPage.jsx

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { getSearchResults } from '../Api/blogData';

// --- Re-using constants for consistency ---
const IMAGE_BASE_URL = 'https://www.thatgirlmags.com';
const PLACEHOLDER_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';

// --- (Animation Components from CategoryPage - can be collapsed for brevity) ---
const Explosion = ({ className, ...props }) => { const spans = Array.from({ length: 20 }, (_, index) => ({ id: index, directionX: Math.floor(Math.random() * 80 - 40), directionY: Math.floor(Math.random() * -50 - 10), })); return ( <div {...props} className={`absolute z-50 h-2 w-2 ${className}`}> <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute -inset-x-10 top-0 m-auto h-4 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" ></motion.div> {spans.map((span) => ( <motion.span key={span.id} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: span.directionX, y: span.directionY, opacity: 0 }} transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }} className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" /> ))} </div> ); };
const CollisionMechanism = React.forwardRef((props, ref) => { const { parentRef, containerRef, beamOptions = {} } = props; const beamRef = useRef(null); const [collision, setCollision] = useState({ detected: false, coordinates: null }); const [beamKey, setBeamKey] = useState(0); const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false); useEffect(() => { const checkCollision = () => { if (beamRef.current && containerRef.current && parentRef.current && !cycleCollisionDetected) { const beamRect = beamRef.current.getBoundingClientRect(); const containerRect = containerRef.current.getBoundingClientRect(); const parentRect = parentRef.current.getBoundingClientRect(); if (beamRect.bottom >= containerRect.top) { const relativeX = beamRect.left - parentRect.left + beamRect.width / 2; const relativeY = beamRect.bottom - parentRect.top; setCollision({ detected: true, coordinates: { x: relativeX, y: relativeY } }); setCycleCollisionDetected(true); } } }; const animationInterval = setInterval(checkCollision, 50); return () => clearInterval(animationInterval); }, [cycleCollisionDetected, containerRef, parentRef]); useEffect(() => { if (collision.detected && collision.coordinates) { const timeoutId = setTimeout(() => { setCollision({ detected: false, coordinates: null }); setCycleCollisionDetected(false); setBeamKey((prevKey) => prevKey + 1); }, 2000); return () => clearTimeout(timeoutId); } }, [collision]); return ( <> <motion.div key={beamKey} ref={beamRef} animate="animate" initial={{ translateY: beamOptions.initialY || "-200px", translateX: beamOptions.initialX || "0px", rotate: beamOptions.rotate || 0 }} variants={{ animate: { translateY: beamOptions.translateY || "1800px", translateX: beamOptions.translateX || "0px", rotate: beamOptions.rotate || 0 } }} transition={{ duration: beamOptions.duration || 8, repeat: Infinity, repeatType: "loop", ease: "linear", delay: beamOptions.delay || 0, repeatDelay: beamOptions.repeatDelay || 0 }} className={`absolute left-0 top-20 m-auto h-14 w-px ml-60 rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent ${beamOptions.className || ''}`} /> <AnimatePresence> {collision.detected && collision.coordinates && ( <Explosion key={`${collision.coordinates.x}-${collision.coordinates.y}`} style={{ left: `${collision.coordinates.x}px`, top: `${collision.coordinates.y}px`, transform: "translate(-50%, -50%)" }} /> )} </AnimatePresence> </> ); });
CollisionMechanism.displayName = "CollisionMechanism";
export const BackgroundBeamsWithCollision = ({ children, className }) => { const containerRef = useRef(null); const parentRef = useRef(null); const beams = [ { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 }, { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 }, { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7, className: "h-6" }, { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 }, { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2, className: "h-20" }, { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2, className: "h-12" }, { initialX: 1200, translateX: 1200, duration: 6, repeatDelay: 4, delay: 2, className: "h-6" }, ]; return ( <div ref={parentRef} className={`h-96 md:h-[15rem] bg-gradient-to-b from-white to-neutral-100 relative flex items-center w-full justify-center overflow-hidden ${className}`}> {beams.map((beam, index) => ( <CollisionMechanism key={index} beamOptions={beam} containerRef={containerRef} parentRef={parentRef} /> ))} {children} <div ref={containerRef} className="absolute bottom-0 bg-neutral-100 w-full inset-x-0 pointer-events-none" style={{ boxShadow: "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset" }} ></div> </div> ); };


// --- Other Design Components from CategoryPage ---
const ArticleCard = ({ article }) => {
    const imageUrl = article.blog_img_lg ? `${IMAGE_BASE_URL}/${article.blog_img_lg}` : PLACEHOLDER_IMAGE;
    const authorAvatar = 'https://randomuser.me/api/portraits/men/1.jpg'; // Placeholder
    return (
        <Link to={`/post/${article.url_title}`} className="group cursor-pointer block">
            <div className="relative overflow-hidden rounded-xl mb-6">
                <img src={imageUrl} alt={article.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out" />
                <div className="absolute top-4 left-4"><span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md">Category {article.cat_id}</span></div>
            </div>
            <div className="px-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors">{article.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <img src={authorAvatar} alt={article.author_name || 'Admin'} className="w-7 h-7 rounded-full mr-2" />
                    <span>By {article.author_name || 'Admin'}</span><span className="mx-2">•</span><span>{new Date(article.sub_date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 leading-relaxed line-clamp-3">{article.short_des}</p>
            </div>
        </Link>
    );
};

const PopularPostCard = ({ post }) => {
    const imageUrl = post.blog_img_lg ? `${IMAGE_BASE_URL}/${post.blog_img_lg}` : PLACEHOLDER_IMAGE;
    return (
        <Link to={`/post/${post.url_title}`} className="flex items-center gap-4 group cursor-pointer">
            <div className="w-20 h-20 shrink-0"><img src={imageUrl} alt={post.title} className="w-full h-full object-cover rounded-lg" /></div>
            <div>
                <h4 className="text-base font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">{post.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{new Date(post.sub_date).toLocaleDateString()}</p>
            </div>
        </Link>
    );
};

const PopularPostsSection = ({ posts }) => ( <div className="bg-white p-6 rounded-2xl border border-gray-200"><h3 className="text-xl font-bold mb-6">Related Results</h3><div className="space-y-5">{posts.map(post => ( <PopularPostCard key={post.id} post={post} /> ))}</div></div> );

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => { if (currentPage > 1) onPageChange(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) onPageChange(currentPage + 1); };
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <button onClick={handlePrev} disabled={currentPage === 1} className="flex items-center justify-center p-3 border rounded-full text-gray-600 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={20} /></button>
      <span className="font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
      <button onClick={handleNext} disabled={currentPage === totalPages} className="flex items-center justify-center p-3 border rounded-full text-gray-600 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight size={20} /></button>
    </div>
  );
};

// --- THE MAIN SEARCH PAGE TEMPLATE (NEW DESIGN) ---
const SearchPage = () => {
    const { searchTerm } = useParams();
    const [searchResults, setSearchResults] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 6;

    useEffect(() => {
        const loadData = async () => {
            setSearchResults(null); 
            setCurrentPage(1); // Reset page to 1 for each new search
            const data = await getSearchResults(searchTerm);
            setSearchResults(data);
        };
        loadData();
    }, [searchTerm]);

    if (!searchResults) {
        return <main className="max-w-7xl mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-bold">Searching for "{searchTerm.replace(/-/g, ' ')}"...</h1></main>;
    }

    if (searchResults.posts.length === 0) {
        return ( <main className="max-w-7xl mx-auto px-4 py-16 text-center"> <h1 className="text-4xl font-bold">No Articles Found for "{searchResults.term}"</h1> <p className="mt-4">Sorry, we couldn't find any articles matching your search. Please try a different keyword.</p> </main> );
    }
    
    // --- Data Handling for the New Layout ---
    const { posts, term } = searchResults;
    const featuredArticle = posts[0];
    const postsForGrid = posts.slice(1);
    const popularPosts = posts.slice(1, 6); // First 5 results for the sidebar
    
    // --- Pagination Logic ---
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentGridPosts = postsForGrid.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(postsForGrid.length / POSTS_PER_PAGE);

    const featuredImageUrl = featuredArticle.blog_img_lg ? `${IMAGE_BASE_URL}/${featuredArticle.blog_img_lg}` : PLACEHOLDER_IMAGE;

    return (
        <div className="bg-gray-50 text-left text-gray-800">
            <BackgroundBeamsWithCollision>
                <div className="relative z-20 text-center ">
                    <p className="text-lg text-gray-500">Search Results</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 font-sans tracking-tight">"{term}"</h1>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">{posts.length} articles found.</p>
                    <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                        <Link to="/" className="hover:underline">Home</Link>
                        <ChevronRight size={16} className="mx-2" />
                        <span>Search</span>
                    </div>
                </div>
            </BackgroundBeamsWithCollision>

            <main className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        {/* --- Featured Article --- */}
                        {featuredArticle && (
                            <article>
                                <img src={featuredImageUrl} alt={featuredArticle.title} className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-8 shadow-lg" />
                                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                                    <span>By {featuredArticle.author_name || 'Admin'}</span><span className="mx-2">|</span><span>{new Date(featuredArticle.sub_date).toLocaleDateString()}</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{featuredArticle.title}</h2>
                                <div className="prose lg:prose-xl max-w-none text-gray-700 leading-relaxed">
                                    <p>{featuredArticle.short_des}</p>
                                    <Link to={`/post/${featuredArticle.url_title}`} className="text-blue-600 hover:underline font-semibold">Read More...</Link>
                                </div>
                            </article>
                        )}

                        {/* --- PAGINATED POSTS GRID --- */}
                        {currentGridPosts.length > 0 && (
                            <section className="mt-16">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {currentGridPosts.map(article => (
                                        <ArticleCard key={article.id} article={article} />
                                    ))}
                                </div>
                                <PaginationControls
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </section>
                        )}
                    </div>

                    {/* --- SIDEBAR --- */}
                    <aside>
                        <div className="sticky top-28">
                            {popularPosts.length > 0 && <PopularPostsSection posts={popularPosts} />}
                        </div>
                    </aside>
                </div>
            </main>

            {/* --- NEWSLETTER SECTION --- */}
            <section className="bg-white border-t mt-16">
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-3xl font-bold mb-2">Get More Budget Travel Tips</h2>
                    <p className="text-gray-600 mb-6">Join our newsletter to receive the latest articles and deals straight to your inbox.</p>
                    <form className="flex w-full max-w-lg mx-auto">
                        <input type="email" placeholder="Your email address" className="w-full px-4 py-3 rounded-l-md text-black border-gray-300 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <button type="submit" className="bg-gray-800 text-white font-semibold px-6 py-3 rounded-r-md hover:bg-black transition-colors">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default SearchPage;