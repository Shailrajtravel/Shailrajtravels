import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  BookOpen,
  Eye,
  EyeOff,
  Search,
  Check,
  ExternalLink,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Sparkles,
  AlertCircle,
  Calendar,
  User,
  Tag,
  Globe,
  UploadCloud,
  FileText,
  Columns,
} from 'lucide-react';
import {
  createCustomBlogFn,
  updateCustomBlogFn,
  toggleBlogVisibilityFn,
} from '@/backend/features/custom-blogs';

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  authorName?: string;
  category?: string;
  featuredImage?: string;
  thumbnailUrl?: string;
  ogImage?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
  tags?: string[];
  isHidden?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tableOfContents?: any[];
  faqs?: any[];
}

interface BlogsAdminProps {
  token: string;
  blogs: BlogItem[];
  loadData: () => Promise<void>;
  setDeleteConfirm: (confirm: any) => void;
}

export function BlogsAdmin({ token, blogs, loadData, setDeleteConfirm }: BlogsAdminProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.authorName && blog.authorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.category && blog.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        categoryFilter === 'ALL' ||
        (blog.category && blog.category.toLowerCase() === categoryFilter.toLowerCase());

      return matchSearch && matchCategory;
    });
  }, [blogs, searchQuery, categoryFilter]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [blogs]);

  const handleAddNew = () => {
    setEditingBlog(null);
    setIsFormOpen(true);
  };

  const handleEdit = (blog: BlogItem) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const handleToggleVisibility = async (blog: BlogItem) => {
    try {
      setTogglingId(blog._id);
      await toggleBlogVisibilityFn({
        data: {
          adminToken: token,
          id: blog._id,
          isHidden: !blog.isHidden,
        },
      });
      await loadData();
    } catch (err) {
      console.error('Failed to toggle blog visibility', err);
      alert('Failed to change blog visibility. Please try again.');
    } finally {
      setTogglingId(null);
    }
  };

  if (isFormOpen) {
    return (
      <BlogEditorForm
        token={token}
        initialData={editingBlog}
        onClose={() => setIsFormOpen(false)}
        onSuccess={async () => {
          setIsFormOpen(false);
          await loadData();
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8 animate-reveal relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-brand-blue-deep">
              Travel Guides & SEO Blogs
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-blue/10 text-brand-blue">
              {blogs.length} {blogs.length === 1 ? 'Article' : 'Articles'}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Customize travel itineraries, update posters, edit rich story content, and manage live
            SEO rankings.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-[#0a192f] font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Write New Travel Guide
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6 shrink-0">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides by title, slug, author, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm outline-none bg-slate-50/50 transition-all"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm outline-none bg-white font-medium text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Categories ({blogs.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blogs Table / List */}
      <div className="flex-1 overflow-auto min-h-0 border border-slate-100 rounded-xl custom-scrollbar">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 px-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No Travel Guides Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
              {searchQuery
                ? `No articles match "${searchQuery}". Try clearing filters.`
                : 'No travel guide articles have been created yet.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('ALL');
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Clear Search & Filter
              </button>
            ) : (
              <button
                onClick={handleAddNew}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-blue text-white hover:bg-brand-blue-deep transition-colors"
              >
                Create First Guide
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredBlogs.map((blog) => {
              const poster =
                blog.featuredImage || blog.thumbnailUrl || '/images/blogs/default.jpg';
              return (
                <div
                  key={blog._id}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors ${
                    blog.isHidden ? 'bg-slate-50/50 opacity-65' : ''
                  }`}
                >
                  {/* Poster Thumbnail + Info */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    {/* Poster */}
                    <div className="w-24 sm:w-32 aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group shadow-sm">
                      <img
                        src={poster}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e: any) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1698223126743-3b10b78df025?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                      {blog.isHidden && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-white px-2 py-0.5 bg-slate-800 rounded">
                            Hidden
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2.5 py-0.5 bg-brand-blue/10 text-brand-blue-deep rounded-full text-xs font-semibold">
                          {blog.category || 'Travel Guides'}
                        </span>
                        {blog.isHidden ? (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-bold">
                            Draft / Hidden
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-brand-blue-deep leading-snug line-clamp-1 hover:text-brand-blue transition-colors">
                        {blog.title}
                      </h4>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          /blog/{blog.slug}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {blog.authorName || 'Shailraj Team'}
                        </span>
                        {blog.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
                    <a
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl text-slate-500 hover:text-brand-blue hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-medium"
                      title="View Live Guide"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </a>

                    <button
                      onClick={() => handleToggleVisibility(blog)}
                      disabled={togglingId === blog._id}
                      className="p-2 rounded-xl text-slate-500 hover:text-brand-blue hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-medium disabled:opacity-50"
                      title={blog.isHidden ? 'Publish / Make Live' : 'Hide from public'}
                    >
                      {togglingId === blog._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : blog.isHidden ? (
                        <>
                          <Eye className="w-4 h-4 text-emerald-600" />
                          <span className="hidden sm:inline text-emerald-600 font-semibold">Publish</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-slate-500" />
                          <span className="hidden sm:inline">Hide</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleEdit(blog)}
                      className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-brand-blue hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                      title="Edit Poster & Content"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() =>
                        setDeleteConfirm({ isOpen: true, id: blog._id, type: 'blog' })
                      }
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Guide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Full Travel Guide Editor Form
// --------------------------------------------------------------------------

interface BlogEditorFormProps {
  token: string;
  initialData: BlogItem | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

function BlogEditorForm({ token, initialData, onClose, onSuccess }: BlogEditorFormProps) {
  const isEditing = !!initialData;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || 'Travel Guides');
  const [customCategory, setCustomCategory] = useState('');
  const [authorName, setAuthorName] = useState(
    initialData?.authorName || 'Shailraj Travels Editorial Team'
  );
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tagsInput, setTagsInput] = useState((initialData?.tags || ['Travel Guide']).join(', '));
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || initialData?.title || '');
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || initialData?.excerpt || ''
  );

  // Poster Image state
  const initialPoster = initialData?.featuredImage || initialData?.thumbnailUrl || '';
  const [posterMode, setPosterMode] = useState<'url' | 'upload'>('url');
  const [posterUrl, setPosterUrl] = useState(initialPoster);
  const [thumbnailBase64, setThumbnailBase64] = useState<string>('');
  const [previewPoster, setPreviewPoster] = useState<string>(initialPoster);

  // View mode: write | preview | split
  const [viewMode, setViewMode] = useState<'write' | 'preview' | 'split'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSeoSettings, setShowSeoSettings] = useState(false);

  // Handle poster image upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 8MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        setThumbnailBase64(base64);
        setPreviewPoster(base64);
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Auto-slugify generator
  const generateSlugFromTitle = () => {
    if (!title) return;
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]+/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generated);
  };

  // Text formatting tool helper
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = textarea.value;
    const selectedText = previousText.substring(start, end);

    const replacement = before + (selectedText || 'text') + after;
    const newContent =
      previousText.substring(0, start) + replacement + previousText.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selectedText.length || 4));
    }, 50);
  };

  const handleInsertTemplate = (type: string) => {
    switch (type) {
      case 'h2':
        insertFormatting('\n<section id="section-id">\n<h2>', '</h2>\n<p>Write your detailed route or travel advice here...</p>\n</section>\n');
        break;
      case 'h3':
        insertFormatting('\n<h3>', '</h3>\n');
        break;
      case 'bold':
        insertFormatting('<strong>', '</strong>');
        break;
      case 'italic':
        insertFormatting('<em>', '</em>');
        break;
      case 'ul':
        insertFormatting('\n<ul>\n  <li>', '</li>\n  <li>Key travel detail 2</li>\n  <li>Key travel detail 3</li>\n</ul>\n');
        break;
      case 'ol':
        insertFormatting('\n<ol>\n  <li>', ' – Arrival and morning darshan</li>\n  <li>01:00 PM – Pure veg lunch break</li>\n  <li>05:00 PM – Evening Aarti and rest</li>\n</ol>\n');
        break;
      case 'quote':
        insertFormatting('\n<blockquote>', '</blockquote>\n');
        break;
      case 'snapshot':
        insertFormatting(
          `\n<div class="not-prose my-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-6 shadow-sm">\n<h3 class="text-xl font-bold text-orange-950 mb-3 flex items-center gap-2">⚡ Quick Trip Snapshot</h3>\n<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">\n<div><span class="text-slate-500 block">Total Distance</span><strong class="text-slate-900 text-base">~640 km</strong></div>\n<div><span class="text-slate-500 block">Ideal Duration</span><strong class="text-slate-900 text-base">2 Days / 1 Night</strong></div>\n<div><span class="text-slate-500 block">Route Highway</span><strong class="text-slate-900 text-base">NH 60, NH 52</strong></div>\n<div><span class="text-slate-500 block">Best Vehicle</span><strong class="text-slate-900 text-base">Force Urbania / Innova</strong></div>\n</div>\n</div>\n`
        );
        break;
      case 'callout':
        insertFormatting(
          `\n<div class="p-4 my-6 bg-blue-50 border-l-4 border-brand-blue rounded-r-xl text-slate-700">\n<strong>Important Traveler Tip:</strong> `,
          `\n</div>\n`
        );
        break;
      case 'image':
        insertFormatting(
          `\n<figure class="my-8">\n  <img src="https://images.unsplash.com/photo-1698223126743-3b10b78df025?q=80&w=1200&auto=format&fit=crop" alt="Darshan Image" class="w-full rounded-2xl shadow-md object-cover max-h-[450px]" />\n  <figcaption class="text-xs text-center text-slate-500 mt-2 italic">`,
          `</figcaption>\n</figure>\n`
        );
        break;
      case 'link':
        insertFormatting('<a href="https://www.shailrajtravels.com/" class="text-brand-blue underline font-semibold">', '</a>');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter an article title.');
      return;
    }

    if (!content.trim() || content.trim().length < 15) {
      setErrorMsg('Please enter detailed article content (at least 15 characters).');
      return;
    }

    const finalPoster = thumbnailBase64 || posterUrl.trim();
    if (!finalPoster) {
      setErrorMsg('Please provide a poster image (either upload a file or enter an image URL).');
      return;
    }

    setIsSubmitting(true);
    const finalCategory = category === 'CUSTOM' ? customCategory.trim() || 'Travel Guides' : category;
    const finalTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (isEditing && initialData) {
        await updateCustomBlogFn({
          data: {
            adminToken: token,
            id: initialData._id,
            title: title.trim(),
            slug: slug.trim() || undefined,
            content: content.trim(),
            authorName: authorName.trim(),
            category: finalCategory,
            thumbnailBase64: thumbnailBase64 || undefined,
            thumbnailUrl: !thumbnailBase64 && posterUrl.trim() ? posterUrl.trim() : undefined,
            excerpt: excerpt.trim() || undefined,
            metaTitle: metaTitle.trim() || title.trim(),
            metaDescription: metaDescription.trim() || excerpt.trim(),
            tags: finalTags,
          },
        });
      } else {
        await createCustomBlogFn({
          data: {
            adminToken: token,
            title: title.trim(),
            slug: slug.trim() || undefined,
            content: content.trim(),
            authorName: authorName.trim(),
            category: finalCategory,
            thumbnailBase64: thumbnailBase64 || undefined,
            thumbnailUrl: !thumbnailBase64 && posterUrl.trim() ? posterUrl.trim() : undefined,
            excerpt: excerpt.trim() || undefined,
            metaTitle: metaTitle.trim() || title.trim(),
            metaDescription: metaDescription.trim() || excerpt.trim(),
            tags: finalTags,
          },
        });
      }

      await onSuccess();
    } catch (err: any) {
      console.error('Save blog error:', err);
      setErrorMsg(err.message || 'Failed to save travel guide. Please verify details.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 animate-reveal">
      {/* Top Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur z-20 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Back to Guides List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-brand-blue-deep">
              {isEditing ? 'Edit Travel Guide' : 'Create New Travel Guide'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEditing ? `Updating: ${initialData.title}` : 'Draft an authoritative spiritual guide for yatris'}
            </p>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'write' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Write
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'preview' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden lg:flex px-3 py-1.5 rounded-lg transition-all items-center gap-1.5 cursor-pointer ${
                viewMode === 'split' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> Split View
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="blogEditorForm"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-brand-green hover:bg-brand-green-dark text-[#0a192f] font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Guide...
              </>
            ) : isEditing ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" /> Save Changes
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" /> Publish Travel Guide
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mx-6 mt-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
        </div>
      )}

      {/* Main Form Body */}
      <form id="blogEditorForm" onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-8">
        {/* =========================================================================
            SECTION 1: Poster / Cover Image (Top priority for user)
           ========================================================================= */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-brand-blue-deep flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-blue" />
                Cover Poster & Thumbnail Image
              </h3>
              <p className="text-xs text-slate-500">
                This hero image displays across article headers, cards, and social share previews. (16:9 widescreen recommended).
              </p>
            </div>

            {/* Poster Upload vs URL Mode Selector */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPosterMode('url')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  posterMode === 'url' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paste Image URL
              </button>
              <button
                type="button"
                onClick={() => setPosterMode('upload')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  posterMode === 'upload' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload File (Cloudinary)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Side */}
            <div className="lg:col-span-6 space-y-3">
              {posterMode === 'url' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Direct Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                    value={posterUrl}
                    onChange={(e) => {
                      setPosterUrl(e.target.value);
                      setPreviewPoster(e.target.value);
                      setThumbnailBase64('');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm outline-none bg-white font-mono text-xs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Paste any image URL from Unsplash, Cloudinary, or your web CDN.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Upload From Computer
                  </label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-brand-blue rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white transition-all group">
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-brand-blue group-hover:scale-110 transition-all" />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue">
                      Click to choose image file
                    </span>
                    <span className="text-xs text-slate-400">JPG, PNG, WebP up to 8MB (Auto-hosted on Cloudinary)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Quick sample recommendations */}
              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block">💡 Pro Poster Tip:</span>
                Use high-resolution 16:9 images (e.g. 1200×675 px) showing the main temple ghats, road journey, or destination landmark for optimal click-through rates.
              </div>
            </div>

            {/* Poster 16:9 Preview Card */}
            <div className="lg:col-span-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Live 16:9 Poster Preview
              </label>
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md group">
                {previewPoster ? (
                  <img
                    src={previewPoster}
                    alt="Poster Preview"
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1698223126743-3b10b78df025?q=80&w=1200&auto=format&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                    <ImageIcon className="w-12 h-12 stroke-[1.5] mb-2 opacity-50" />
                    <span className="text-sm font-medium">No poster selected</span>
                    <span className="text-xs text-slate-500 mt-1">Upload a file or paste an image URL to preview</span>
                  </div>
                )}

                {/* Simulated Article Card Overlay */}
                {previewPoster && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 sm:p-6 flex flex-col justify-end">
                    <span className="px-2.5 py-1 rounded-full bg-brand-green text-[#0a192f] text-xs font-extrabold self-start mb-2 shadow-sm">
                      {category === 'CUSTOM' ? customCategory || 'Travel Guide' : category}
                    </span>
                    <h4 className="text-white text-base sm:text-lg font-bold font-display line-clamp-2 drop-shadow-md">
                      {title || 'Your Travel Guide Title Preview'}
                    </h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: Essential Guide Details (Title, Slug, Category, Author)
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Title */}
          <div className="md:col-span-8">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-slate-700">
                Article Title <span className="text-red-500">*</span>
              </label>
              <span className={`text-xs ${title.length > 70 ? 'text-amber-600' : 'text-slate-400'}`}>
                {title.length}/70 chars
              </span>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Pune to Ujjain Road Trip: Ultimate 2-Day Itinerary via Maheshwar & Omkareshwar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-base font-semibold outline-none transition-all"
            />
          </div>

          {/* Category */}
          <div className="md:col-span-4">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm font-medium outline-none bg-white transition-all cursor-pointer"
            >
              <option value="Travel Guides">Travel Guides</option>
              <option value="Temple Guides">Temple Guides</option>
              <option value="Pilgrimage Planning">Pilgrimage Planning</option>
              <option value="Spiritual Tourism">Spiritual Tourism</option>
              <option value="Experiences">Experiences</option>
              <option value="Tips & Tricks">Tips & Tricks</option>
              <option value="News">News</option>
              <option value="CUSTOM">+ Custom Category</option>
            </select>
            {category === 'CUSTOM' && (
              <input
                type="text"
                placeholder="Enter custom category name"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
              />
            )}
          </div>

          {/* Slug URL */}
          <div className="md:col-span-8">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-400" />
                URL Slug <span className="text-xs text-slate-400 font-normal">(permanent link)</span>
              </label>
              <button
                type="button"
                onClick={generateSlugFromTitle}
                className="text-xs text-brand-blue hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> Auto-generate from Title
              </button>
            </div>
            <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 bg-slate-50/50 overflow-hidden text-sm">
              <span className="pl-3.5 pr-1 text-slate-400 text-xs font-mono select-none">
                /blog/
              </span>
              <input
                type="text"
                placeholder="pune-to-ujjain-tour-guide-mahakal-darshan-itinerary"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-2 py-3 bg-transparent outline-none font-mono text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Author Name */}
          <div className="md:col-span-4">
            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              Author Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm outline-none transition-all"
            />
          </div>

          {/* Excerpt / Summary */}
          <div className="md:col-span-8">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-slate-700">
                Short Excerpt / Summary <span className="text-xs text-slate-400 font-normal">(displayed on cards)</span>
              </label>
              <span className={`text-xs ${excerpt.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                {excerpt.length}/160 chars
              </span>
            </div>
            <textarea
              rows={2}
              placeholder="Brief summary highlighting the key route highlights, temples covered, and timing tips for yatris..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm outline-none resize-y transition-all"
            />
          </div>

          {/* Tags */}
          <div className="md:col-span-4">
            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-slate-400" />
              Tags <span className="text-xs text-slate-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              placeholder="Pune to Ujjain, Mahakal, Road Trip"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* =========================================================================
            SECTION 3: Content Editor with Rich Toolbar & Live Preview
           ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <label className="block text-base font-bold text-brand-blue-deep">
                Article Content & Detailed Itinerary <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Format your travel guide using rich HTML sections, headings, lists, callout boxes, and photos.
              </p>
            </div>

            {/* Quick Word & Heading Counters */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{content.split(/\s+/).filter(Boolean).length} Words</span>
              <span>•</span>
              <span>~{Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))} Min Read</span>
            </div>
          </div>

          {/* Formatting Quick Toolbar */}
          <div className="bg-slate-100 p-2 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5 text-xs text-slate-700 select-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Format:</span>

            <button
              type="button"
              onClick={() => handleInsertTemplate('h2')}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Insert H2 Section"
            >
              <Heading2 className="w-3.5 h-3.5 text-brand-blue" /> Section H2
            </button>

            <button
              type="button"
              onClick={() => handleInsertTemplate('h3')}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Insert H3 Subheading"
            >
              <Heading3 className="w-3.5 h-3.5 text-brand-blue" /> Subheading H3
            </button>

            <div className="w-[1px] h-5 bg-slate-300 mx-1"></div>

            <button
              type="button"
              onClick={() => handleInsertTemplate('bold')}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Bold Text"
            >
              <Bold className="w-3.5 h-3.5" /> Bold
            </button>

            <button
              type="button"
              onClick={() => handleInsertTemplate('italic')}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Italic Text"
            >
              <Italic className="w-3.5 h-3.5" /> Italic
            </button>

            <button
              type="button"
              onClick={() => handleInsertTemplate('ul')}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Bullet Points"
            >
              <List className="w-3.5 h-3.5" /> Bullet List
            </button>

            <button
              type="button"
              onClick={() => handleInsertTemplate('ol')}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Day-wise / Numbered Schedule"
            >
              <ListOrdered className="w-3.5 h-3.5" /> Numbered List
            </button>

            <div className="w-[1px] h-5 bg-slate-300 mx-1"></div>

            <button
              type="button"
              onClick={() => handleInsertTemplate('snapshot')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center gap-1 transition-colors border border-amber-300 cursor-pointer"
              title="Insert Quick Trip Snapshot Grid"
            >
              ⚡ Trip Snapshot Box
            </button>

            <button
              type="button"
              onClick={() => handleInsertTemplate('callout')}
              className="px-2.5 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold flex items-center gap-1 transition-colors border border-blue-300 cursor-pointer"
              title="Insert Important Tip Callout"
            >
              💡 Traveler Tip Box
            </button>

            <button
              type="button"
              onClick={() => handleInsertTemplate('quote')}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Quote Block"
            >
              <Quote className="w-3.5 h-3.5" /> Quote
            </button>

            <button
              type="button"
              onClick={() => handleInsertTemplate('image')}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Insert Photo with Caption"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Image Figure
            </button>
          </div>

          {/* Editor / Preview Area */}
          <div
            className={`grid gap-4 items-stretch ${
              viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {/* WRITE TEXTAREA */}
            {(viewMode === 'write' || viewMode === 'split') && (
              <div className="flex flex-col min-h-[480px]">
                {viewMode === 'split' && (
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Source HTML & Content
                  </span>
                )}
                <textarea
                  ref={textareaRef}
                  required
                  rows={20}
                  placeholder="<h2>Trip Overview</h2><p>Write your travel guide details here...</p>"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full flex-1 p-4 rounded-2xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 font-mono text-xs leading-relaxed outline-none resize-y bg-slate-900 text-slate-100 custom-scrollbar selection:bg-brand-green selection:text-black"
                />
              </div>
            )}

            {/* LIVE PREVIEW */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="flex flex-col min-h-[480px]">
                {viewMode === 'split' && (
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Article View (Exact Frontend Styling)
                  </span>
                )}
                <div className="w-full flex-1 p-6 md:p-8 rounded-2xl border border-slate-200 bg-white overflow-y-auto max-h-[700px] shadow-inner custom-scrollbar">
                  {/* Mock Article Container */}
                  <div className="max-w-[750px] mx-auto">
                    {/* Poster */}
                    {previewPoster && (
                      <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 shadow-sm bg-slate-100">
                        <img
                          src={previewPoster}
                          alt="Hero Poster"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-blue-deep mb-4">
                      {title || 'Untitled Travel Guide Article'}
                    </h1>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pb-4 mb-6 border-b border-slate-100">
                      <span>By {authorName || 'Editorial Team'}</span>
                      <span>•</span>
                      <span>Category: {category}</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {/* Styled Content Area */}
                    <div
                      className="prose prose-slate prose-base max-w-none 
                        prose-headings:font-display prose-headings:font-bold prose-headings:text-brand-blue-deep
                        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
                        prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-slate-800 prose-strong:font-bold
                        prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4 prose-li:text-slate-600 prose-li:mb-1.5
                        prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-4
                        prose-img:rounded-xl prose-img:shadow-md
                        prose-blockquote:border-l-4 prose-blockquote:border-brand-green prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-700"
                      dangerouslySetInnerHTML={{
                        __html: content || '<p class="text-slate-400 italic">No content typed yet. Type in the editor to see real-time preview.</p>',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            SECTION 4: SEO Metadata Settings & Google Search Snippet Preview
           ========================================================================= */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowSeoSettings(!showSeoSettings)}
            className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-blue" />
              <span className="font-bold text-sm text-brand-blue-deep">
                Google Search & SEO Meta Tags Settings
              </span>
              <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                (Click to customize title tag & meta description)
              </span>
            </div>
            <span className="text-xs font-bold text-brand-blue">
              {showSeoSettings ? '▲ Hide' : '▼ Expand'}
            </span>
          </button>

          {showSeoSettings && (
            <div className="p-5 sm:p-6 space-y-6 bg-white border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      SEO Title Tag
                    </label>
                    <span className={`text-xs ${metaTitle.length > 60 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {metaTitle.length}/60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter SEO meta title"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand-blue"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Recommended length: 50–60 characters.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      SEO Meta Description
                    </label>
                    <span className={`text-xs ${metaDescription.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {metaDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Enter SEO meta description"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand-blue resize-y"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Recommended length: 120–160 characters.</p>
                </div>
              </div>

              {/* Google Search Snippet Simulation */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Google Search Result Preview:
                </span>
                <div className="font-sans max-w-xl">
                  <div className="flex items-center gap-1.5 text-xs text-[#202124] mb-1">
                    <span className="w-4 h-4 rounded-full bg-brand-blue-deep flex items-center justify-center text-[9px] text-white font-bold">
                      S
                    </span>
                    <span className="text-slate-700">shailrajtravels.com</span>
                    <span className="text-slate-400">› blog › {slug || 'guide'}</span>
                  </div>
                  <h5 className="text-[#1a0dab] hover:underline text-lg font-medium leading-snug cursor-pointer line-clamp-1">
                    {metaTitle || title || 'Pune to Ujjain Road Trip Guide | Shailraj Travels'}
                  </h5>
                  <p className="text-xs text-[#4d5156] leading-normal line-clamp-2 mt-1">
                    {metaDescription || excerpt || 'Complete road trip itinerary and temple darshan guide from Pune with exact timings, highway details, and vehicle recommendations.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-sm transition-colors cursor-pointer"
          >
            ← Back to Articles List
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-[#0a192f] font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
              </>
            ) : isEditing ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" /> Save Travel Guide
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" /> Publish Travel Guide
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
