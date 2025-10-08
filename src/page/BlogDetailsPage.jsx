// src/page/BlogDetailsPage.jsx

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from 'react-router-dom';
import { getPostPageData } from '../Api/blogData';
import { ChevronRight, Search, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

// --- SKELETON LOADER COMPONENTS ---
const SkeletonBlock = ({ className }) => <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />;

const SidebarWidgetSkeleton = ({ children }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
        <SkeletonBlock className="h-5 w-1/3 mb-6" />
        {children}
    </div>
);

const BlogDetailsPageSkeleton = () => (
    <div className="bg-gray-50">
        <div className="h-96 md:h-[15rem] bg-gradient-to-b from-white to-neutral-100 flex items-center justify-center">
            <div className="text-center px-4">
                <SkeletonBlock className="h-10 md:h-14 w-80 md:w-[600px] mb-6 mx-auto" />
                <SkeletonBlock className="h-4 w-48 mx-auto" />
            </div>
        </div>
        <div className="py-12">
            <main className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    <div className="lg:col-span-2 bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200">
                        <SkeletonBlock className="w-full h-auto min-h-[300px] max-h-[500px] rounded-lg mb-6" />
                        <div className="flex items-center gap-x-6 mb-6">
                            <SkeletonBlock className="h-4 w-32" />
                            <SkeletonBlock className="h-4 w-24" />
                        </div>
                        <div className="space-y-3">
                            <SkeletonBlock className="h-4 w-full" />
                            <SkeletonBlock className="h-4 w-full" />
                            <SkeletonBlock className="h-4 w-5/6" />
                            <SkeletonBlock className="h-4 w-full mt-6" />
                            <SkeletonBlock className="h-4 w-3/4" />
                        </div>
                        <div className="mt-12 flex items-center gap-6 bg-gray-50 p-6 rounded-lg">
                            <SkeletonBlock className="w-24 h-24 rounded-full flex-shrink-0" />
                            <div className="w-full space-y-3">
                                <SkeletonBlock className="h-5 w-1/3" />
                                <SkeletonBlock className="h-4 w-full" />
                                <SkeletonBlock className="h-4 w-4/5" />
                            </div>
                        </div>
                    </div>
                    <aside className="space-y-8">
                        <SidebarWidgetSkeleton>
                            <div className="flex flex-col items-center">
                                <SkeletonBlock className="w-24 h-24 rounded-full mx-auto mb-4" />
                                <SkeletonBlock className="h-5 w-1/2 mb-3" />
                                <SkeletonBlock className="h-4 w-full" />
                                <SkeletonBlock className="h-4 w-3/4 mt-1" />
                            </div>
                        </SidebarWidgetSkeleton>
                        <SidebarWidgetSkeleton><SkeletonBlock className="h-10 w-full" /></SidebarWidgetSkeleton>
                        <SidebarWidgetSkeleton>
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <SkeletonBlock className="w-16 h-16 rounded-md flex-shrink-0" />
                                        <div className="w-full space-y-2">
                                            <SkeletonBlock className="h-4 w-full" />
                                            <SkeletonBlock className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SidebarWidgetSkeleton>
                    </aside>
                </div>
            </main>
        </div>
    </div>
);


// --- CONSTANTS ---
const IMAGE_BASE_URL = 'https://www.thatgirlmags.com';
const PLACEHOLDER_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';
const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';

// --- (Animation Components can be collapsed for brevity) ---
const Explosion = ({ className, style }) => { const spans = Array.from({ length: 20 }, (_, i) => ({ id: i, dX: Math.floor(Math.random() * 80 - 40), dY: Math.floor(Math.random() * -50 - 10) })); return ( <div className={`absolute z-50 h-2 w-2 ${className}`} style={style}> <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute -inset-x-10 top-0 m-auto h-4 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" /> {spans.map((s) => ( <motion.span key={s.id} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: s.dX, y: s.dY, opacity: 0 }} transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }} className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" /> ))} </div> ); };
const CollisionMechanism = React.forwardRef(({ parentRef, containerRef, beamOptions = {} }, ref) => { const beamRef = ref || useRef(null); const [collision, setCollision] = useState({ detected: false, coordinates: null }); const [beamKey, setBeamKey] = useState(0); const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false); useEffect(() => { const checkCollision = () => { if (beamRef.current && containerRef.current && parentRef.current && !cycleCollisionDetected) { const beamRect = beamRef.current.getBoundingClientRect(); const containerRect = containerRef.current.getBoundingClientRect(); const parentRect = parentRef.current.getBoundingClientRect(); if (beamRect.bottom >= containerRect.top) { const relativeX = beamRect.left - parentRect.left + beamRect.width / 2; const relativeY = beamRect.bottom - parentRect.top; setCollision({ detected: true, coordinates: { x: relativeX, y: relativeY } }); setCycleCollisionDetected(true); } } }; const intervalId = setInterval(checkCollision, 50); return () => clearInterval(intervalId); }, [cycleCollisionDetected, containerRef, parentRef]); useEffect(() => { if (collision.detected && collision.coordinates) { const timeoutId = setTimeout(() => { setCollision({ detected: false, coordinates: null }); setCycleCollisionDetected(false); setBeamKey((prev) => prev + 1); }, 2000); return () => clearTimeout(timeoutId); } }, [collision]); return ( <> <motion.div key={`beam-${beamKey}`} ref={beamRef} animate="animate" initial={{ translateY: beamOptions.initialY || "-200px", translateX: beamOptions.initialX || "0px", rotate: beamOptions.rotate || 0, }} variants={{ animate: { translateY: beamOptions.translateY || "1800px", translateX: beamOptions.translateX || "0px", rotate: beamOptions.rotate || 0, }, }} transition={{ duration: beamOptions.duration || 8, repeat: Infinity, repeatType: "loop", ease: "linear", delay: beamOptions.delay || 0, repeatDelay: beamOptions.repeatDelay || 0, }} className={`absolute left-0 top-20 m-auto h-14 w-px ml-60 rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent ${beamOptions.className || ''}`} /> <AnimatePresence> {collision.detected && collision.coordinates && ( <Explosion key={`explosion-${collision.coordinates.x}-${collision.coordinates.y}`} style={{ left: `${collision.coordinates.x}px`, top: `${collision.coordinates.y}px`, transform: "translate(-50%, -50%)", }} /> )} </AnimatePresence> </> ); });
CollisionMechanism.displayName = "CollisionMechanism";
export const BackgroundBeamsWithCollision = ({ children, className }) => { const containerRef = useRef(null); const parentRef = useRef(null); const beams = [ { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 }, { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 }, { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7, className: "h-6" }, { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 }, { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2, className: "h-20" }, { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2, className: "h-12" }, { initialX: 1200, translateX: 1200, duration: 6, repeatDelay: 4, delay: 2, className: "h-6" }, ]; return ( <div ref={parentRef} className={`h-96 md:h-[15rem] bg-gradient-to-b from-white to-neutral-100 relative flex items-center w-full justify-center overflow-hidden ${className}`}> {beams.map((beam, index) => ( <CollisionMechanism key={`beam-${index}`} beamOptions={beam} containerRef={containerRef} parentRef={parentRef} /> ))} {children} <div ref={containerRef} className="absolute bottom-0 bg-neutral-100 w-full inset-x-0 pointer-events-none" style={{ boxShadow: "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset", }} ></div> </div> ); };

// --- NEW COMPONENT FOR "SEE MORE" FUNCTIONALITY ---
const ExpandableText = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= maxLength) {
    return <p className="text-lg md:text-xl leading-relaxed">{text}</p>;
  }

  return (
    <>
      <div className="md:hidden">
        <p className="text-lg leading-relaxed">
          {isExpanded ? text : `${text.substring(0, maxLength)}...`}
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-blue-600 font-semibold ml-2 hover:underline focus:outline-none"
          >
            {isExpanded ? 'See Less' : 'See More'}
          </button>
        </p>
      </div>
      <div className="hidden md:block">
        <p className="text-xl leading-relaxed">{text}</p>
      </div>
    </>
  );
};

// --- SIDEBAR WIDGETS ---
const AboutMeWidget = ({ author }) => {
  const authorAvatarUrl = author.author_avatar ? `${IMAGE_BASE_URL}/${author.author_avatar}` : DEFAULT_AVATAR;
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
      <img src={authorAvatarUrl} alt={author.author_name || 'Admin'} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
      <h4 className="font-bold text-lg mb-2">{author.author_name || 'Admin'}</h4>
      <p className="text-sm text-gray-600 mb-4">{author.author_bio || 'A passionate traveler and writer, sharing stories and tips from around the globe.'}</p>
      <div className="flex justify-center gap-4">
        <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-blue-600"><Facebook size={18} /></a>
        <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-blue-500"><Twitter size={18} /></a>
        <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-pink-600"><Instagram size={18} /></a>
      </div>
    </div>
  );
};
const SearchWidget = () => ( <div className="bg-white p-6 rounded-lg border border-gray-200"> <h4 className="font-semibold mb-4 text-gray-800">Search Here</h4> <div className="relative"> <input type="text" placeholder="Search Post..." className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" /> <button aria-label="Search" className="absolute right-0 top-0 h-full px-4 text-white bg-blue-600 rounded-r hover:bg-blue-700 transition-colors" > <Search size={18} /> </button> </div> </div> );
const CategoriesWidget = () => ( <div className="bg-white p-6 rounded-lg border border-gray-200"> <h4 className="font-semibold mb-4 text-gray-800">Post Categories</h4> <ul className="space-y-3"><li><Link to="#" className="flex justify-between items-center text-gray-600 hover:text-blue-600 transition-colors"><span className="flex items-center"><ChevronRight size={14} className="mr-2" />All Categories</span></Link></li></ul></div> );
const RelatedPostsWidget = ({ posts }) => ( <div className="bg-white p-6 rounded-lg border border-gray-200"> <h4 className="font-semibold mb-4 text-gray-800">Related Posts</h4> <div className="space-y-4"> {posts.map((post) => { const imageUrl = post.blog_img_sm ? `${IMAGE_BASE_URL}/${post.blog_img_sm}` : PLACEHOLDER_IMAGE; return ( <Link to={`/post/${post.url_title}`} key={post.id} className="flex items-center gap-4 group" > <img src={imageUrl} alt={post.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" /> <div> <p className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">{post.title}</p> <p className="text-xs text-gray-500 mt-1">{new Date(post.sub_date).toLocaleDateString()}</p> </div> </Link> )})} </div> </div> );
const TagsWidget = () => { const tags = ["Travel", "Food", "Lifestyle", "Business"]; return ( <div className="bg-white p-6 rounded-lg border border-gray-200"> <h4 className="font-semibold mb-4 text-gray-800">Tags</h4> <div className="flex flex-wrap gap-2"> {tags.map((tag) => ( <a key={tag} href="#" className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition-colors">{tag}</a> ))} </div> </div> ); };
const HelpWidget = () => ( <div className="bg-blue-600 text-white p-8 rounded-lg text-center"> <h3 className="text-xl md:text-2xl font-bold mb-2">How We Can Help You!</h3> <p className="text-blue-200 mb-6 text-sm">Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p> <a href="#" className="inline-flex items-center justify-center bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition-colors">Contact Us <ChevronRight size={16} className="ml-2" /></a> </div> );

// --- MAIN CONTENT COMPONENTS ---
const QuoteIcon = () => ( <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14" > <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" /> </svg> );
const PostQuote = () => ( <figure className="max-w-screen-md mx-auto text-center my-12"> <QuoteIcon /> <blockquote> <p className="text-xl italic font-medium text-gray-900"> "The world is a book and those who do not travel read only one page." </p> </blockquote> </figure> );
const PostImageGrid = ({ post, secondImage }) => { const imageUrl1 = post.blog_img_lg ? `${IMAGE_BASE_URL}/${post.blog_img_lg}` : PLACEHOLDER_IMAGE; const imageUrl2 = secondImage ? `${IMAGE_BASE_URL}/${secondImage.image_name}` : PLACEHOLDER_IMAGE; return ( <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8"> <img className="w-full h-96 object-cover rounded-lg" src={imageUrl1} alt={`${post.title} primary image`} /> <img className="w-full h-96 object-cover rounded-lg" src={imageUrl2} alt={`${post.title} secondary image`} /> </div> ); };
const ShareSection = () => ( <div className="space-y-4 my-8 py-6 border-t border-b border-gray-200"><div className="flex items-center gap-4"><span className="font-semibold text-gray-800">SHARE:</span><div className="flex flex-wrap gap-2"><a href="#" className="text-sm ...">TRAVELS</a><a href="#" className="text-sm ...">LIFESTYLE</a></div></div><div className="flex items-center gap-4"><span className="font-semibold text-gray-800">SHARE:</span><div className="flex flex-wrap gap-4 text-sm"><a href="#" className="text-gray-600 ...">Facebook</a><a href="#" className="text-gray-600 ...">Twitter</a></div></div></div> );
const AuthorBio = ({ author }) => { const authorAvatarUrl = author.author_avatar ? `${IMAGE_BASE_URL}/${author.author_avatar}` : DEFAULT_AVATAR; return ( <div className="mt-12 flex items-center gap-6 bg-gray-50 p-6 rounded-lg"> <img src={authorAvatarUrl} alt={author.author_name || 'Admin'} className="w-24 h-24 rounded-full flex-shrink-0 object-cover" /> <div> <h4 className="font-bold text-lg mb-1">Author: {author.author_name || 'Admin'}</h4> <p className="text-gray-600 mb-2 text-sm">{author.author_bio || 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem...'}</p> <div className="flex items-center gap-4"> <a href="#" aria-label="Facebook"><Facebook size={18} /></a><a href="#" aria-label="Twitter"><Twitter size={18} /></a><a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a><a href="#" aria-label="Instagram"><Instagram size={18} /></a> </div> </div> </div> ); };
const CommentList = () => { /* ... (hardcoded for now) ... */ };
const CommentForm = () => { /* ... (hardcoded for now) ... */ };

// --- MAIN PAGE COMPONENT ---
const BlogDetailsPage = () => {
  const { postSlug } = useParams();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setPageData(null);
      const data = await getPostPageData(postSlug);
      setPageData(data);
    };
    loadData();
  }, [postSlug]);

  if (!pageData) {
    return <BlogDetailsPageSkeleton />;
  }
  
  const { post, relatedPosts, category, secondImage } = pageData;

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Post not found!</h1>
        <Link to="/" className="text-blue-600 mt-4 inline-block">← Back to Home</Link>
      </div>
    );
  }

  const mainImageUrl = post.blog_img_lg ? `${IMAGE_BASE_URL}/${post.blog_img_lg}` : PLACEHOLDER_IMAGE;

  return (
    <div className="bg-gray-50">
      <BackgroundBeamsWithCollision>
        <div className="relative z-20 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-xl md:text-5xl font-bold text-gray-800 tracking-tight">{post.title}</h1>
          <div className="flex items-center justify-center text-sm text-gray-500 mt-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight size={16} className="mx-2" />
            {category ? (
              <Link to={`/category/${category.cat_url_title}`} className="hover:text-blue-600">
                {category.cat_display_title || category.title}
              </Link>
            ) : (
              <span>Category</span>
            )}
          </div>
        </div>
      </BackgroundBeamsWithCollision>

      <div className="py-12 text-left">
        <main className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200">
              <img src={mainImageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-6" />
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-6 gap-y-2 mb-4">
                <span>By <a href="#" className="text-gray-800 hover:text-blue-600">{post.author_name || 'Admin'}</a></span>
                <span>{new Date(post.sub_date).toLocaleDateString()}</span>
              </div>
              <article className="prose lg:prose-lg max-w-none text-gray-700">
                
                <ExpandableText text={post.short_des} maxLength={150} />

                <div dangerouslySetInnerHTML={{ __html: post.des }} />
                <PostQuote />
                <PostImageGrid post={post} secondImage={secondImage} />
              </article>
              <ShareSection />
              <AuthorBio author={post} />
              <CommentList />
              <CommentForm />
            </div>

            <aside className="space-y-8">
              <AboutMeWidget author={post} />
              <SearchWidget />
              <CategoriesWidget />
              {relatedPosts && relatedPosts.length > 0 && <RelatedPostsWidget posts={relatedPosts} />}
              <TagsWidget />
              <HelpWidget />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogDetailsPage;