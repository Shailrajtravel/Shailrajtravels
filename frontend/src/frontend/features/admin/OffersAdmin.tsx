import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
  Check,
  UploadCloud,
  Image as ImageIcon,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  Bus,
  Eye,
  EyeOff,
  AlertCircle,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import {
  getOffersFn,
  saveOfferFn,
  toggleOfferStatusFn,
  deleteOfferFn,
  DEFAULT_OFFER,
  type PromotionalOffer,
  type ScheduleItem,
} from '@/backend/features/offers';

interface OffersAdminProps {
  token: string;
}

export function OffersAdmin({ token }: OffersAdminProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [offer, setOffer] = useState<PromotionalOffer>(DEFAULT_OFFER);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [newPickupPoint, setNewPickupPoint] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');

  // Load active offer
  const loadOffer = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const offers = await getOffersFn({ data: { adminToken: token } });
      if (offers && offers.length > 0) {
        setOffer({
          ...DEFAULT_OFFER,
          ...offers[0],
        });
      } else {
        setOffer(DEFAULT_OFFER);
      }
    } catch (err: any) {
      console.error("Failed to load offer in admin:", err);
      setErrorMsg("Failed to load offers from database, loaded default settings.");
      setOffer(DEFAULT_OFFER);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffer();
  }, [token]);

  // Handle Quick Toggle Status
  const handleToggleStatus = async () => {
    const nextStatus = !offer.isActive;
    try {
      await toggleOfferStatusFn({
        data: {
          adminToken: token,
          slug: offer.slug,
          isActive: nextStatus,
        },
      });
      setOffer((prev) => ({ ...prev, isActive: nextStatus }));
      setSuccessMsg(nextStatus ? "Special Offer Banner is now LIVE on website!" : "Offer Banner is now HIDDEN from website.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      let msg = err.message || "Failed to toggle offer visibility.";
      if (msg.toLowerCase().includes('aborted') || msg.toLowerCase().includes('timed out')) {
        msg = "The request timed out while updating status. Please try again.";
      }
      setErrorMsg(msg);
    }
  };

  const handleDeleteOffer = async () => {
    if (!window.confirm(`Are you sure you want to completely delete the offer "${offer.title}"?`)) {
      return;
    }
    setSaving(true);
    try {
      await deleteOfferFn({
        data: {
          adminToken: token,
          slug: offer.slug,
        }
      });
      setSuccessMsg("Offer deleted successfully. Reverted to default.");
      setTimeout(() => setSuccessMsg(null), 4000);
      setOffer(DEFAULT_OFFER);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete offer.");
    } finally {
      setSaving(false);
    }
  };

  // Helper to resize & compress uploaded images client-side to prevent network aborts / payload bloat
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressed);
        };
        img.onerror = () => reject(new Error('Failed to load image for processing'));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file from disk'));
      reader.readAsDataURL(file);
    });
  };

  // Handle Local Image Upload to Base64 with automatic optimization
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("Image exceeds 15MB limit. Please choose a smaller image file.");
      return;
    }

    setIsCompressingImage(true);
    setErrorMsg(null);
    try {
      const optimizedBase64 = await compressImage(file);
      setOffer((prev) => ({ ...prev, bannerImageUrl: optimizedBase64 }));
      setSuccessMsg("Poster image optimized and loaded ready to save!");
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error("Image processing error:", err);
      setErrorMsg(err.message || "Failed to process image file.");
    } finally {
      setIsCompressingImage(false);
    }
  };

  // Schedule Timeline Handlers
  const handleAddScheduleItem = () => {
    setOffer((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        {
          time: "New Milestone Time",
          title: "Milestone Title",
          description: "Milestone description...",
        },
      ],
    }));
  };

  const handleUpdateScheduleItem = (index: number, field: keyof ScheduleItem, val: string) => {
    setOffer((prev) => {
      const nextSchedule = [...prev.schedule];
      nextSchedule[index] = { ...nextSchedule[index], [field]: val };
      return { ...prev, schedule: nextSchedule };
    });
  };

  const handleRemoveScheduleItem = (index: number) => {
    setOffer((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };

  const handleMoveScheduleItem = (index: number, direction: 'up' | 'down') => {
    setOffer((prev) => {
      const next = [...prev.schedule];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return { ...prev, schedule: next };
    });
  };

  // Pickup Points Handlers
  const handleAddPickupPoint = () => {
    if (!newPickupPoint.trim()) return;
    setOffer((prev) => ({
      ...prev,
      pickupPoints: [...(prev.pickupPoints || []), newPickupPoint.trim()],
    }));
    setNewPickupPoint('');
  };

  const handleRemovePickupPoint = (index: number) => {
    setOffer((prev) => ({
      ...prev,
      pickupPoints: prev.pickupPoints.filter((_, i) => i !== index),
    }));
  };

  // Highlights Handlers
  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setOffer((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), newHighlight.trim()],
    }));
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number) => {
    setOffer((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  // Inclusions & Exclusions Handlers
  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;
    setOffer((prev) => ({
      ...prev,
      inclusions: [...(prev.inclusions || []), newInclusion.trim()],
    }));
    setNewInclusion('');
  };

  const handleRemoveInclusion = (index: number) => {
    setOffer((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index),
    }));
  };

  const handleAddExclusion = () => {
    if (!newExclusion.trim()) return;
    setOffer((prev) => ({
      ...prev,
      exclusions: [...(prev.exclusions || []), newExclusion.trim()],
    }));
    setNewExclusion('');
  };

  const handleRemoveExclusion = (index: number) => {
    setOffer((prev) => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index),
    }));
  };

  // Save All Changes
  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const saved = await saveOfferFn({
        data: {
          adminToken: token,
          offer: {
            ...offer,
            updatedAt: new Date().toISOString(),
          },
        },
      });
      setOffer((prev) => ({ ...prev, ...saved }));
      setSuccessMsg("Special Offer successfully updated and published to the website!");
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error("Save offer error:", err);
      let msg = err.message || "Failed to save promotional offer.";
      if (msg.toLowerCase().includes('aborted') || msg.toLowerCase().includes('timed out')) {
        msg = "The request timed out while saving to server. Please try again in a few moments.";
      }
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading Special Offers configuration...</p>
      </div>
    );
  }

  const testWhatsAppUrl = `https://wa.me/919764413556?text=${encodeURIComponent(
    offer.whatsappMessage || ""
  )}`;

  return (
    <div className="space-y-8 pb-20 animate-reveal">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Special Offer & Banner Management
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Configure the homepage spotlight banner, pricing, Force Urbania amenities, itinerary milestones, and WhatsApp booking automation for the Pune to Lalbag Raja Darshan trip.
          </p>
        </div>

        {/* Visibility Toggle & Save Quick Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm ${
              offer.isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
            }`}
          >
            {offer.isActive ? (
              <>
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>BANNER IS LIVE</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-slate-500" />
                <span>BANNER IS HIDDEN</span>
              </>
            )}
          </button>

          <a
            href={`/offers/${offer.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Page</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md hover:shadow-lg shadow-orange-600/20 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleDeleteOffer}
            disabled={saving}
            className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs sm:text-sm rounded-2xl transition-colors border border-red-200 flex items-center gap-1.5 disabled:opacity-50"
            title="Delete Offer"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Columns: Form Controls */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Poster Image Management */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-orange-600" />
                  Trip Poster / Banner Image
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  16:9 high-resolution promotional artwork displayed on the homepage and modal.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    imageMode === 'url' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    imageMode === 'upload' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {imageMode === 'url' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Poster Image Path / URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={offer.bannerImageUrl}
                    onChange={(e) => setOffer((prev) => ({ ...prev, bannerImageUrl: e.target.value }))}
                    placeholder="/images/offers/lalbag-raja-pune-offer.jpg"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm outline-none font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setOffer((prev) => ({
                        ...prev,
                        bannerImageUrl: "/images/offers/lalbag-raja-pune-offer.jpg",
                      }))
                    }
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                    title="Reset to default Lalbag Raja poster"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Upload Image File from Device
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setOffer((prev) => ({
                        ...prev,
                        bannerImageUrl: "/images/offers/lalbag-raja-pune-offer.jpg",
                      }))
                    }
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    title="Reset to default Lalbag Raja poster"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Default Poster
                  </button>
                </div>
                <label className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group ${
                  isCompressingImage 
                    ? 'border-orange-400 bg-orange-50/50 cursor-wait' 
                    : 'border-slate-300 hover:border-orange-500 bg-slate-50/50 hover:bg-orange-50/30'
                }`}>
                  {isCompressingImage ? (
                    <>
                      <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                      <span className="text-sm font-bold text-orange-600">
                        Optimizing & compressing image...
                      </span>
                      <span className="text-xs text-slate-400">Scaling down high-resolution file</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-orange-600 group-hover:scale-110 transition-all" />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600">
                        Click to select poster image file
                      </span>
                      <span className="text-xs text-slate-400">JPG, PNG, WebP up to 15MB (automatically optimized)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isCompressingImage}
                    className="hidden"
                  />
                </label>
                {offer.bannerImageUrl?.startsWith('data:') && (
                  <div className="flex items-center justify-between text-xs px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl">
                    <span>Custom image loaded. Click <strong>Save All Changes</strong> above to publish.</span>
                    <button
                      type="button"
                      onClick={() =>
                        setOffer((prev) => ({
                          ...prev,
                          bannerImageUrl: "/images/offers/lalbag-raja-pune-offer.jpg",
                        }))
                      }
                      className="text-amber-900 underline font-bold hover:text-amber-700"
                    >
                      Cancel / Reset
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pricing & Badging */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-orange-600" />
              Titles, Badging & Pricing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Offer Title
                </label>
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => setOffer((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Pune to Lalbag Raja Darshan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-bold outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Subtitle / Slogan
                </label>
                <input
                  type="text"
                  value={offer.subtitle}
                  onChange={(e) => setOffer((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Faith | Travel | Blessings - Special One Day Trip"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={offer.badge}
                  onChange={(e) => setOffer((prev) => ({ ...prev, badge: e.target.value }))}
                  placeholder="ONE DAY TRIP"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Vehicle Type / Name
                </label>
                <input
                  type="text"
                  value={offer.vehicleName}
                  onChange={(e) => setOffer((prev) => ({ ...prev, vehicleName: e.target.value }))}
                  placeholder="Luxury AC Force Urbania"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Offer Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="text"
                    value={offer.offerPrice}
                    onChange={(e) => setOffer((prev) => ({ ...prev, offerPrice: e.target.value }))}
                    placeholder="999"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-black text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Original Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="text"
                    value={offer.originalPrice}
                    onChange={(e) => setOffer((prev) => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="1,499"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm outline-none text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Price Unit
                </label>
                <input
                  type="text"
                  value={offer.priceUnit}
                  onChange={(e) => setOffer((prev) => ({ ...prev, priceUnit: e.target.value }))}
                  placeholder="per person"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Urgency / Departure Notice
                </label>
                <input
                  type="text"
                  value={offer.urgencyText}
                  onChange={(e) => setOffer((prev) => ({ ...prev, urgencyText: e.target.value }))}
                  placeholder="Limited Seats in Luxury Force Urbania! 14th Sep Late Night Departure"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Schedule & Milestones Editor */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Trip Schedule Timeline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add departure, arrival, and darshan milestones.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddScheduleItem}
                className="px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 border border-orange-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Milestone
              </button>
            </div>

            <div className="space-y-3">
              {offer.schedule &&
                offer.schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider">
                        Milestone {idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveScheduleItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveScheduleItem(idx, 'down')}
                          disabled={idx === offer.schedule.length - 1}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveScheduleItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600"
                          title="Delete Milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => handleUpdateScheduleItem(idx, 'time', e.target.value)}
                        placeholder="e.g. 14th Sep (Late Night)"
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                      />
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateScheduleItem(idx, 'title', e.target.value)}
                        placeholder="e.g. Departure from Pune"
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => handleUpdateScheduleItem(idx, 'description', e.target.value)}
                      placeholder="Brief description of this milestone..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white resize-none"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Route & Pune Pickup Points */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-orange-600" />
              Highway Route & Pune Pickup Locations
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Route Description
              </label>
              <input
                type="text"
                value={offer.route}
                onChange={(e) => setOffer((prev) => ({ ...prev, route: e.target.value }))}
                placeholder="Pune ➔ Mumbai-Pune Expressway ➔ Mumbai (Lalbag Raja) ➔ Pune"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Pickup Locations
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {offer.pickupPoints &&
                  offer.pickupPoints.map((pt, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-200"
                    >
                      <span>{pt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePickupPoint(i)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPickupPoint}
                  onChange={(e) => setNewPickupPoint(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPickupPoint();
                    }
                  }}
                  placeholder="Type pickup point and press Add (e.g. Wakad, Chandani Chowk)..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPickupPoint}
                  className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900"
                >
                  Add Point
                </button>
              </div>
            </div>
          </div>

          {/* Highlights, Inclusions & Exclusions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Bus className="w-5 h-5 text-orange-600" />
              Amenities, Inclusions & Exclusions
            </h3>

            {/* Highlights Chips */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Features & Amenities Chips
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {offer.highlights &&
                  offer.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-orange-200"
                    >
                      <span>{h}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(i)}
                        className="text-orange-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                  placeholder="Add amenity (e.g. Spacious Push-Back Seats)..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
                  Inclusions (What's Covered)
                </label>
                <div className="space-y-1.5 mb-2">
                  {offer.inclusions &&
                    offer.inclusions.map((inc, i) => (
                      <div
                        key={i}
                        className="p-2 bg-emerald-50 text-emerald-950 text-xs font-semibold rounded-lg flex items-center justify-between gap-2 border border-emerald-100"
                      >
                        <span className="truncate">{inc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInclusion(i)}
                          className="text-emerald-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    placeholder="New inclusion..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-800 mb-1.5">
                  Exclusions
                </label>
                <div className="space-y-1.5 mb-2">
                  {offer.exclusions &&
                    offer.exclusions.map((exc, i) => (
                      <div
                        key={i}
                        className="p-2 bg-rose-50 text-rose-950 text-xs font-semibold rounded-lg flex items-center justify-between gap-2 border border-rose-100"
                      >
                        <span className="truncate">{exc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExclusion(i)}
                          className="text-rose-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    placeholder="New exclusion..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddExclusion}
                    className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Automation & Booking Message */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  WhatsApp Direct Booking Message
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  When customers tap "Book Your Seat Now", this message is auto-filled in WhatsApp to +91 97644 13556.
                </p>
              </div>

              <a
                href={testWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Test Link
              </a>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Pre-filled Customer Message
              </label>
              <textarea
                rows={3}
                value={offer.whatsappMessage}
                onChange={(e) => setOffer((prev) => ({ ...prev, whatsappMessage: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Button Call-to-Action Text
                </label>
                <input
                  type="text"
                  value={offer.ctaText}
                  onChange={(e) => setOffer((prev) => ({ ...prev, ctaText: e.target.value }))}
                  placeholder="Book Your Seat Now"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Payment / Advance Terms Note
                </label>
                <input
                  type="text"
                  value={offer.terms || ""}
                  onChange={(e) => setOffer((prev) => ({ ...prev, terms: e.target.value }))}
                  placeholder="Advance booking of 50% required..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Live Homepage & Modal Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6 space-y-6">
            
            {/* Live Banner Preview Card */}
            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-lg shadow-amber-900/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Live Homepage Banner Preview
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  offer.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {offer.isActive ? "Live" : "Inactive"}
                </span>
              </div>

              {/* Mini Preview Component */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shadow-inner">
                {/* Poster 16:9 */}
                <div className="relative aspect-video bg-slate-900">
                  <img
                    src={offer.bannerImageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                    <span className="bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs font-bold">
                      {offer.badge}
                    </span>
                    <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                      ₹{offer.offerPrice}
                    </span>
                  </div>
                </div>

                {/* Body Details Preview */}
                <div className="p-4 bg-white space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base leading-snug">
                      {offer.title}
                    </h4>
                    <p className="text-xs text-orange-600 font-semibold mt-0.5">
                      {offer.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                    <span className="text-slate-500 font-medium">Pricing:</span>
                    <div className="flex items-baseline gap-1.5">
                      {offer.originalPrice && (
                        <span className="line-through text-slate-400 text-[11px]">
                          ₹{offer.originalPrice}
                        </span>
                      )}
                      <span className="font-black text-slate-900 text-base">
                        ₹{offer.offerPrice}
                      </span>
                      <span className="text-slate-400 text-[10px]">{offer.priceUnit}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="truncate">{offer.route}</span>
                  </div>

                  {/* Action Preview */}
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{offer.ctaText}</span>
                    </button>
                    <button
                      type="button"
                      className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">⚡ Instant Edge Invalidation:</span>
                When you click "Save All Changes", the cache is automatically invalidated and the updated banner appears live across all devices instantly.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
