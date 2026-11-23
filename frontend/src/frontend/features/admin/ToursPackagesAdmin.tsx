import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
  Search,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { createTourFn, updateTourFn, deleteTourFn } from '@/backend/features/tours';
import { createPackageFn, updatePackageFn, deletePackageFn } from '@/backend/features/packages';
import { uploadImageToCloudinary } from '@/backend/shared/cloudinary';

function slugify(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function ToursPackagesAdmin({
  token,
  packages = [],
  tours = [],
  loadData,
  setDeleteConfirm,
}: {
  token: string;
  packages: any[];
  tours: any[];
  loadData: () => Promise<void>;
  setDeleteConfirm?: any;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Unify packages and tours into a cohesive list
  const unifiedItems = useMemo(() => {
    const list: any[] = [];
    const visitedTourIds = new Set<string>();

    // 1. Process all packages and pair them with matching tours
    for (const pkg of packages) {
      const pkgSlug = slugify(pkg.title);
      const matchedTour = tours.find(
        (t) =>
          (t._id && pkg.tourId && t._id === pkg.tourId) ||
          (t.title && t.title.trim().toLowerCase() === pkg.title?.trim().toLowerCase()) ||
          (t.slug && (t.slug === pkgSlug || t.slug === pkg.slug))
      );

      if (matchedTour) {
        visitedTourIds.add(matchedTour._id);
      }

      const primaryImage =
        pkg.image ||
        (pkg.images && pkg.images[0]) ||
        matchedTour?.heroContent?.image ||
        '';

      const allImages = Array.from(
        new Set(
          [
            primaryImage,
            ...(Array.isArray(pkg.images) ? pkg.images : []),
            ...(matchedTour?.heroContent?.image ? [matchedTour.heroContent.image] : []),
          ].filter(Boolean)
        )
      );

      list.push({
        _packageId: pkg._id,
        _tourId: matchedTour?._id,
        title: pkg.title || matchedTour?.title || '',
        slug: matchedTour?.slug || pkg.slug || pkgSlug,
        subtitle: pkg.subtitle || matchedTour?.heroContent?.description || '',
        image: primaryImage,
        images: allImages,
        durationBadge: pkg.durationBadge || '3D / 2N',
        location: pkg.location || (matchedTour?.destinations ? matchedTour.destinations.join(', ') : ''),
        schedule: pkg.schedule || 'Daily Morning Departures',
        frequency: pkg.frequency || '',
        price: pkg.price || '₹9,999',
        route: pkg.route || matchedTour?.destinations || [],
        destinations: matchedTour?.destinations || pkg.route || [],
        tags: pkg.tags || [],
        includes: pkg.includes || [],
        itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : [],
        dates: (pkg.dates && pkg.dates.length > 0) ? pkg.dates : (matchedTour?.dates || []),
        highlights: matchedTour?.highlights || [],
        metaTitle: matchedTour?.metaTitle || '',
        metaDescription: matchedTour?.metaDescription || '',
        canonicalUrl: matchedTour?.canonicalUrl || '',
        heroContent: matchedTour?.heroContent || { image: primaryImage, description: pkg.subtitle || '' },
        overview: matchedTour?.overview || '',
      });
    }

    // 2. Add tours that do not have a corresponding package
    for (const tour of tours) {
      if (!visitedTourIds.has(tour._id)) {
        const primaryImage = tour.heroContent?.image || '';
        list.push({
          _packageId: undefined,
          _tourId: tour._id,
          title: tour.title,
          slug: tour.slug,
          subtitle: tour.heroContent?.description || '',
          image: primaryImage,
          images: primaryImage ? [primaryImage] : [],
          durationBadge: '3D / 2N',
          location: tour.destinations ? tour.destinations.join(', ') : '',
          schedule: 'Daily Morning Departures',
          frequency: '',
          price: '₹9,999',
          route: tour.destinations || [],
          destinations: tour.destinations || [],
          tags: [],
          includes: [],
          itinerary: [],
          dates: tour.dates || [],
          highlights: tour.highlights || [],
          metaTitle: tour.metaTitle || '',
          metaDescription: tour.metaDescription || '',
          canonicalUrl: tour.canonicalUrl || '',
          heroContent: tour.heroContent || { image: primaryImage, description: '' },
          overview: tour.overview || '',
        });
      }
    }

    return list;
  }, [packages, tours]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return unifiedItems;
    const q = searchTerm.toLowerCase().trim();
    return unifiedItems.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.slug?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        (Array.isArray(item.destinations) && item.destinations.some((d: string) => d.toLowerCase().includes(q))) ||
        (Array.isArray(item.route) && item.route.some((r: string) => r.toLowerCase().includes(q)))
    );
  }, [unifiedItems, searchTerm]);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (item: any) => {
    if (setDeleteConfirm) {
      setDeleteConfirm({
        isOpen: true,
        id: item._packageId || item._tourId,
        title: item.title,
        onConfirm: async () => {
          try {
            if (item._packageId) {
              await deletePackageFn({ data: { adminToken: token, id: item._packageId } });
            }
            if (item._tourId) {
              await deleteTourFn({ data: { adminToken: token, id: item._tourId } });
            }
            await loadData();
          } catch (e: any) {
            alert('Failed to delete tour/package: ' + e.message);
          }
        },
      });
    } else {
      if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
      try {
        if (item._packageId) {
          await deletePackageFn({ data: { adminToken: token, id: item._packageId } });
        }
        if (item._tourId) {
          await deleteTourFn({ data: { adminToken: token, id: item._tourId } });
        }
        await loadData();
      } catch (e: any) {
        alert('Failed to delete tour/package: ' + e.message);
      }
    }
  };

  if (isFormOpen) {
    return (
      <TourPackageForm
        token={token}
        initialData={editingItem}
        onClose={() => setIsFormOpen(false)}
        onSuccess={async () => {
          setIsFormOpen(false);
          await loadData();
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-reveal">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 sm:p-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-brand-blue-deep flex items-center gap-2">
            <span>Tours & Packages Management</span>
            <span className="text-xs bg-brand-blue/10 text-brand-blue-deep font-bold px-2.5 py-0.5 rounded-full">
              {unifiedItems.length} Total
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            All updates sync instantly across Homepage packages, Tours pages, and SEO pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNew}
            className="bg-brand-blue-deep hover:bg-brand-blue text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/20 text-sm cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Add Tour & Package</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 sm:px-6 bg-slate-50/50 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by tour name, slug, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
          />
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <p className="text-lg font-medium">No tours or packages found.</p>
          <p className="text-sm mt-1">
            {searchTerm ? 'Try a different search keyword.' : 'Click "Add Tour & Package" to create your first package.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 bg-slate-50 border-b border-slate-100 text-slate-500 text-[12px] uppercase tracking-wider font-bold px-6 py-4">
            <div className="col-span-1">Banner</div>
            <div className="col-span-4">Tour Title & Slug</div>
            <div className="col-span-3">Duration & Location</div>
            <div className="col-span-2">Price & Schedule</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* List items */}
          <div className="flex flex-col divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <div
                key={item._packageId || item._tourId || item.slug}
                className="flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-slate-50/60 transition-colors p-4 md:px-6 md:py-4"
              >
                {/* Banner Thumbnail */}
                <div className="flex items-center gap-4 md:col-span-1 mb-2 md:mb-0">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 shadow-sm relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title & Slug */}
                <div className="md:col-span-4 mb-2 md:mb-0">
                  <p className="font-bold text-brand-blue-deep text-base truncate" title={item.title}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-brand-green font-semibold truncate">
                      /{item.slug}
                    </span>
                    <a
                      href={`/tours/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-brand-blue transition-colors"
                      title="View live page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  {item.subtitle && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* Duration & Location */}
                <div className="md:col-span-3 text-sm text-slate-600 mb-2 md:mb-0">
                  <div className="flex items-center gap-1.5 font-bold text-brand-blue-deep text-xs">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{item.durationBadge || 'Custom Duration'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate" title={item.location}>
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location || 'Multiple Locations'}</span>
                  </div>
                </div>

                {/* Price & Schedule */}
                <div className="md:col-span-2 text-sm text-slate-600 mb-2 md:mb-0">
                  <div className="font-bold text-brand-blue-deep text-sm">
                    {item.price || 'Contact for price'}
                  </div>
                  {item.schedule && (
                    <div className="text-xs text-slate-500 mt-0.5 truncate" title={item.schedule}>
                      {item.schedule}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex justify-end gap-2 mt-2 md:mt-0 border-t border-slate-50 pt-3 md:border-t-0 md:pt-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 md:flex-none justify-center p-2 text-slate-600 hover:text-brand-blue bg-slate-50 hover:bg-brand-blue/5 md:bg-white rounded-xl border border-slate-200 shadow-sm transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                    title="Edit Tour & Package"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="md:hidden">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex-1 md:flex-none justify-center p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 md:bg-white rounded-xl border border-slate-200 shadow-sm transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                    title="Delete Tour & Package"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="md:hidden">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TourPackageForm({
  token,
  initialData,
  onClose,
  onSuccess,
}: {
  token: string;
  initialData: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'general' | 'media' | 'route' | 'itinerary' | 'dates' | 'seo'>('general');

  // Form states initialized with merged fields
  const [formData, setFormData] = useState<any>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    subtitle: initialData?.subtitle || '',
    location: initialData?.location || '',
    durationBadge: initialData?.durationBadge || '3D / 2N',
    price: initialData?.price || '₹9,999',
    schedule: initialData?.schedule || 'Daily Morning Departures (05:30 AM)',
    frequency: initialData?.frequency || 'Daily',
    image: initialData?.image || '',
    images: Array.isArray(initialData?.images) ? initialData.images : (initialData?.image ? [initialData.image] : []),
    route: Array.isArray(initialData?.route) ? initialData.route.join(', ') : (initialData?.route || ''),
    destinations: Array.isArray(initialData?.destinations) ? initialData.destinations.join(', ') : (initialData?.destinations || ''),
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
    includes: Array.isArray(initialData?.includes) ? initialData.includes.join(', ') : (initialData?.includes || ''),
    highlights: Array.isArray(initialData?.highlights) ? initialData.highlights.join(', ') : (initialData?.highlights || ''),
    dates: Array.isArray(initialData?.dates) ? initialData.dates.join(', ') : (initialData?.dates || ''),
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    canonicalUrl: initialData?.canonicalUrl || '',
    overview: initialData?.overview || '',
  });

  const [itinerary, setItinerary] = useState<{ day: string; title: string }[]>(
    Array.isArray(initialData?.itinerary) && initialData.itinerary.length > 0
      ? initialData.itinerary
      : [
          { day: 'Day 1', title: 'Depart from Pune/Mumbai, travel to destination and check into hotel' },
          { day: 'Day 2', title: 'Full day temple darshan, sightseeing and sacred rituals' },
          { day: 'Day 3', title: 'Morning darshan, shopping and safe return journey back to Pune/Mumbai' },
        ]
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const next = { ...prev, [name]: value };
      // Auto-generate slug from title if slug was untouched or matches previous auto-slug
      if (name === 'title' && (!prev.slug || prev.slug === slugify(prev.title))) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const cUrl = await uploadImageToCloudinary(base64, 'packages');
        uploadedUrls.push(cUrl);
      }
      const currentImages = Array.isArray(formData.images) ? [...formData.images] : [];
      const newImages = [...uploadedUrls, ...currentImages];
      setFormData((prev: any) => ({
        ...prev,
        images: newImages,
        image: prev.image || uploadedUrls[0] || newImages[0] || '',
      }));
    } catch (err: any) {
      alert('Image upload failed: ' + (err.message || 'Network error'));
    } finally {
      setUploadingImage(false);
      setUploadProgress('');
      if (e.target) e.target.value = '';
    }
  };

  const handleSetPrimaryImage = (imgUrl: string) => {
    setFormData((prev: any) => ({ ...prev, image: imgUrl }));
  };

  const handleRemoveImage = (imgUrl: string) => {
    const nextImages = (formData.images || []).filter((u: string) => u !== imgUrl);
    setFormData((prev: any) => ({
      ...prev,
      images: nextImages,
      image: prev.image === imgUrl ? (nextImages[0] || '') : prev.image,
    }));
  };

  const handleAddItineraryDay = () => {
    setItinerary((prev) => [...prev, { day: `Day ${prev.length + 1}`, title: '' }]);
  };

  const handleRemoveItineraryDay = (index: number) => {
    setItinerary((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItineraryChange = (index: number, field: 'day' | 'title', value: string) => {
    setItinerary((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Tour title is required.');
      return;
    }

    setLoading(true);

    const splitStringArray = (str: any) => {
      if (Array.isArray(str)) return str;
      if (typeof str === 'string') {
        return str
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    };

    const finalSlug = formData.slug?.trim() || slugify(formData.title);
    const routeArray = splitStringArray(formData.route);
    const destArray = splitStringArray(formData.destinations);
    const tagsArray = splitStringArray(formData.tags);
    const includesArray = splitStringArray(formData.includes);
    const highlightsArray = splitStringArray(formData.highlights);
    const datesArray = splitStringArray(formData.dates);
    const cleanItinerary = itinerary
      .map((item) => ({ day: item.day.trim(), title: item.title.trim() }))
      .filter((item) => item.day || item.title);

    const primaryImage =
      formData.image ||
      (formData.images && formData.images[0]) ||
      '';

    // 1. Package Payload
    const packagePayload: any = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      slug: finalSlug,
      durationBadge: formData.durationBadge.trim(),
      location: formData.location.trim(),
      schedule: formData.schedule.trim(),
      frequency: formData.frequency.trim(),
      price: formData.price.trim(),
      image: primaryImage,
      images: formData.images || (primaryImage ? [primaryImage] : []),
      route: routeArray,
      tags: tagsArray,
      includes: includesArray,
      itinerary: cleanItinerary,
      dates: datesArray,
    };

    // 2. Tour Payload
    const tourPayload: any = {
      title: formData.title.trim(),
      slug: finalSlug,
      metaTitle: formData.metaTitle?.trim() || `${formData.title.trim()} | Shailraj Travels Pune`,
      metaDescription:
        formData.metaDescription?.trim() ||
        formData.subtitle?.trim() ||
        `Book comfortable tour package for ${formData.title.trim()} with Shailraj Travels Pune.`,
      canonicalUrl:
        formData.canonicalUrl?.trim() || `https://www.shailrajtravels.com/tours/${finalSlug}`,
      heroContent: {
        image: primaryImage,
        description: formData.subtitle?.trim() || '',
      },
      overview:
        formData.overview?.trim() ||
        `<p>${formData.subtitle || formData.title} organized by Shailraj Travels with premium AC Force Urbania, verified hotels, and seamless darshan.</p>`,
      highlights: highlightsArray.length > 0 ? highlightsArray : tagsArray,
      destinations: destArray.length > 0 ? destArray : routeArray,
      dates: datesArray,
      packages: initialData?.packages || [],
      faq: initialData?.faq || [],
    };

    try {
      // Save / Update Package
      if (initialData?._packageId) {
        await updatePackageFn({
          data: { adminToken: token, id: initialData._packageId, data: packagePayload },
        });
      } else {
        await createPackageFn({
          data: { adminToken: token, data: packagePayload },
        });
      }

      // Save / Update Tour
      if (initialData?._tourId) {
        await updateTourFn({
          data: { adminToken: token, id: initialData._tourId, data: tourPayload },
        });
      } else {
        await createTourFn({
          data: { adminToken: token, data: tourPayload },
        });
      }

      onSuccess();
    } catch (err: any) {
      alert('Failed to save tour/package: ' + (err.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-reveal p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-brand-blue-deep">
              {initialData ? `Edit: ${initialData.title}` : 'Create New Tour & Package'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Syncs details across both Homepage Packages and Website Tour detail pages.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-brand-green hover:bg-brand-green-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-brand-green/20 text-sm cursor-pointer"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Save Tour & Package</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 my-6 p-1.5 bg-slate-100 rounded-xl text-xs sm:text-sm font-bold">
        {[
          { key: 'general', label: '1. General & Pricing' },
          { key: 'media', label: '2. Images & Media' },
          { key: 'route', label: '3. Route & Inclusions' },
          { key: 'itinerary', label: '4. Itinerary' },
          { key: 'dates', label: '5. Fixed Dates' },
          { key: 'seo', label: '6. SEO & Overview' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFormTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeFormTab === tab.key
                ? 'bg-white text-brand-blue-deep shadow-sm'
                : 'text-slate-600 hover:text-brand-blue-deep'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Tab 1: General & Pricing */}
        {activeFormTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <FormInput
              label="Tour Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Pune to Ujjain Tour Package"
              required
            />
            <FormInput
              label="URL Slug (Permanent Link) *"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. pune-to-ujjain-tour-package"
              required
            />
            <div className="md:col-span-2">
              <FormInput
                label="Subtitle / Catchy Tagline"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g. 3 Days / 2 Nights Sacred Jyotirlinga Darshan & Heritage Circuit"
              />
            </div>
            <FormInput
              label="Starting Location / Hub *"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Pune / Mumbai"
              required
            />
            <FormInput
              label="Duration Badge *"
              name="durationBadge"
              value={formData.durationBadge}
              onChange={handleChange}
              placeholder="e.g. 3D / 2N or 1 Day"
              required
            />
            <FormInput
              label="Starting Price *"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. ₹9,999"
              required
            />
            <FormInput
              label="Departure Schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="e.g. Daily Morning Departures (05:30 AM) or Every Friday"
            />
            <FormInput
              label="Frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              placeholder="e.g. Daily, Fixed Departures, Bi-Weekly"
            />
          </div>
        )}

        {/* Tab 2: Images & Media */}
        {activeFormTab === 'media' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Gallery & Card Images
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  {formData.images?.length || 0} images uploaded
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                The image marked with <span className="text-brand-green font-bold">PRIMARY</span> will appear as the main tour card banner on the homepage and hero background on the tour page.
              </p>

              {/* Grid of images */}
              {formData.images && formData.images.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-5">
                  {formData.images.map((imgUrl: string, idx: number) => {
                    const isPrimary = formData.image === imgUrl || (!formData.image && idx === 0);
                    return (
                      <div
                        key={idx}
                        className={`relative w-36 h-28 rounded-xl bg-slate-200 overflow-hidden shrink-0 border-2 transition-all ${
                          isPrimary
                            ? 'border-brand-green ring-2 ring-brand-green/30 shadow-md'
                            : 'border-slate-300'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Uploaded ${idx}`}
                          className="w-full h-full object-cover"
                        />
                        {isPrimary ? (
                          <span className="absolute bottom-1.5 left-1.5 bg-brand-green text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            PRIMARY
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(imgUrl)}
                            className="absolute bottom-1.5 left-1.5 bg-slate-900/80 hover:bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded shadow transition-colors cursor-pointer"
                          >
                            Set Main
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(imgUrl)}
                          className="absolute top-1.5 right-1.5 bg-slate-900/80 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow text-xs font-bold cursor-pointer"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Upload input */}
              {uploadingImage && (
                <div className="flex items-center gap-2 p-3 bg-brand-blue/5 border border-brand-blue/20 rounded-xl text-brand-blue-deep text-sm font-semibold animate-pulse mb-3">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                  <span>{uploadProgress || 'Uploading image to Cloudinary...'}</span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-brand-blue/10 file:text-brand-blue-deep hover:file:bg-brand-blue/20 cursor-pointer text-sm text-slate-500 disabled:opacity-50"
                />
                <p className="text-xs text-slate-400">
                  Select one or multiple images from your device. Images upload directly to Cloudinary and attach to this tour.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Route & Inclusions */}
        {activeFormTab === 'route' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <div className="md:col-span-2">
              <FormInput
                label="Tour Route (comma separated)"
                name="route"
                value={formData.route}
                onChange={handleChange}
                placeholder="e.g. Pune, Omkareshwar, Ujjain, Maheshwar, Pune"
              />
            </div>
            <div className="md:col-span-2">
              <FormInput
                label="Key Destinations Visited (comma separated)"
                name="destinations"
                value={formData.destinations}
                onChange={handleChange}
                placeholder="e.g. Mahakaleshwar, Omkareshwar, Kaal Bhairav, Harsiddhi Mata"
              />
            </div>
            <div className="md:col-span-2">
              <FormInput
                label="Package Tags (comma separated)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. Jyotirlinga, Bhasma Aarti, Family Tour, AC Bus"
              />
            </div>
            <div className="md:col-span-2">
              <FormInput
                label="Package Inclusions (comma separated)"
                name="includes"
                value={formData.includes}
                onChange={handleChange}
                placeholder="e.g. AC Force Urbania, 3-Star AC Hotel, Breakfast & Dinner, VIP Darshan Guide"
              />
            </div>
            <div className="md:col-span-2">
              <FormInput
                label="Tour Highlights (comma separated)"
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                placeholder="e.g. Early Morning Bhasma Aarti, Holy Narmada Boat Ride, Solah Dress Code Guidance"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Itinerary */}
        {activeFormTab === 'itinerary' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Day-by-Day Itinerary Planner
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clear day-by-day plan visible to pilgrims on the tour booking page.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddItineraryDay}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-green/10 hover:bg-brand-green/20 text-brand-green rounded-xl transition-colors font-bold text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Day</span>
              </button>
            </div>

            {itinerary.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">
                No itinerary days added yet. Click "Add Day" to add day 1.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {itinerary.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-brand-blue-deep uppercase tracking-wider">
                        Day {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItineraryDay(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Day"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-1">
                        <input
                          type="text"
                          placeholder="e.g. Day 1"
                          value={item.day}
                          onChange={(e) => handleItineraryChange(index, 'day', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-brand-blue-deep outline-none focus:ring-2 focus:ring-brand-green"
                          required
                        />
                      </div>
                      <div className="md:col-span-3">
                        <textarea
                          placeholder="Describe the plan for this day..."
                          value={item.title}
                          onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                          rows={2}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-green resize-y"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Dates */}
        {activeFormTab === 'dates' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div>
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Available Departure Dates
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Comma-separated list of upcoming tour dates shown in the booking selector.
              </p>
            </div>
            <FormInput
              label="Dates List (comma separated)"
              name="dates"
              value={formData.dates}
              onChange={handleChange}
              placeholder="e.g. Every Friday, 15 Dec 2026, 22 Dec 2026, 29 Dec 2026"
            />
          </div>
        )}

        {/* Tab 6: SEO & Overview */}
        {activeFormTab === 'seo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <FormInput
              label="Meta Title (Search Engine Title)"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              placeholder="e.g. Pune to Ujjain Tour Package | Best Travels in Pune"
            />
            <FormInput
              label="Canonical URL"
              name="canonicalUrl"
              value={formData.canonicalUrl}
              onChange={handleChange}
              placeholder="e.g. https://www.shailrajtravels.com/tours/pune-to-ujjain-tour-package"
            />
            <div className="md:col-span-2">
              <FormInput
                label="Meta Description (SERP Snippet)"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="e.g. Book our 3D/2N Pune to Ujjain tour package with luxury AC Force Urbania, Mahakal Bhasma Aarti..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Overview & Details (HTML allowed)
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-normal outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                placeholder="<p>Full tour description, highlights, tips, etc.</p>"
              />
            </div>
          </div>
        )}

        {/* Form Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 bg-brand-green hover:bg-brand-green-dark text-white font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-brand-green/20 cursor-pointer"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>Save Tour & Package</span>
          </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>
      <input
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-brand-blue-deep placeholder-slate-400 focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue focus:bg-white transition-all outline-none"
        {...props}
      />
    </div>
  );
}
