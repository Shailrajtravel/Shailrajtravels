import React, { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Car,
  Sparkles,
  Users,
  Check,
  Loader2,
  Tag,
  ShieldCheck,
  Eye,
  Info,
} from "lucide-react";
import {
  getRecommendedVehiclesFn,
  saveRecommendedVehiclesFn,
  DEFAULT_RECOMMENDED_VEHICLES,
  type VehicleItem,
} from "@/backend/shared/recommended-vehicles";

interface VehiclesAdminProps {
  token: string;
}

const COMMON_AMENITY_PRESETS = [
  "Dual AC with Individual Vents",
  "Push-back Luxury Reclining Seats",
  "Verified Expert Highway Chauffeur",
  "Massive Luggage Boot Space",
  "Fuel, Tolls & Parking Included",
  "USB Mobile Charging at Every Row",
  "Clean & Sanitised Cab",
  "Aircraft-style Push-back Seats",
  "Commercial Chauffeur Included",
  "Captain Push-back Seats",
  "Luggage Carrier Available",
  "Smooth Expressway Ride",
];

const PRESET_VEHICLE_IMAGES = [
  { name: "Force Urbania 15S", url: "/images/vehicles/force-urbania-15-seater.jpg" },
  { name: "Force Urbania 12S", url: "/images/vehicles/force-urbania-12-seater.jpg" },
  { name: "Innova Crysta", url: "/images/vehicles/innova-crysta.jpg" },
  { name: "Maruti Ertiga", url: "/images/vehicles/maruti-ertiga.jpg" },
  { name: "Swift Dzire", url: "/images/vehicles/swift-dzire.jpg" },
];

export function RecommendedVehiclesAdmin({ token }: VehiclesAdminProps) {
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [compressingIdx, setCompressingIdx] = useState<number | null>(null);
  const [newAmenityInputs, setNewAmenityInputs] = useState<Record<number, string>>({});
  const [imageModes, setImageModes] = useState<Record<number, "url" | "upload">>({});

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecommendedVehiclesFn();
      if (data && data.length > 0) {
        setVehicles(data);
      } else {
        setVehicles(DEFAULT_RECOMMENDED_VEHICLES);
      }
    } catch (e: any) {
      console.error("Failed to load vehicles:", e);
      setError("Failed to fetch vehicles from database, loaded default Shailraj fleet.");
      setVehicles(DEFAULT_RECOMMENDED_VEHICLES);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Sanitize order & IDs
      const sanitized = vehicles.map((v, i) => ({
        ...v,
        id: v.id?.trim() || `vehicle-${i + 1}`,
        name: v.name?.trim() || `Vehicle ${i + 1}`,
        capacityStr: v.capacityStr?.trim() || `${v.minCap || 1}–${v.maxCap || 4} Travelers`,
        minCap: Number(v.minCap) || 1,
        maxCap: Number(v.maxCap) || 4,
        description: v.description?.trim() || "",
        amenities: Array.isArray(v.amenities) ? v.amenities.filter(Boolean) : [],
        image: v.image?.trim() || "/images/vehicles/force-urbania-15-seater.jpg",
        badge: v.badge?.trim() || undefined,
        order: i,
      }));

      await saveRecommendedVehiclesFn({ data: { adminToken: token, vehicles: sanitized } });
      setVehicles(sanitized);
      setSuccess("Vehicle Fleet updated and published successfully to the website!");
      setTimeout(() => setSuccess(null), 4000);
    } catch (e: any) {
      console.error("Failed to save vehicles:", e);
      setError(e.message || "Failed to save vehicles to database.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (index: number, field: keyof VehicleItem, value: any) => {
    setVehicles((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Move vehicle up or down in display order
  const handleMove = (index: number, direction: "up" | "down") => {
    setVehicles((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next.map((v, i) => ({ ...v, order: i }));
    });
  };

  // Add Amenity to Vehicle
  const handleAddAmenity = (index: number, text?: string) => {
    const amenityToAdd = (text || newAmenityInputs[index] || "").trim();
    if (!amenityToAdd) return;

    setVehicles((prev) => {
      const next = [...prev];
      const currentAmenities = next[index].amenities || [];
      if (!currentAmenities.includes(amenityToAdd)) {
        next[index] = { ...next[index], amenities: [...currentAmenities, amenityToAdd] };
      }
      return next;
    });

    setNewAmenityInputs((prev) => ({ ...prev, [index]: "" }));
  };

  // Remove Amenity
  const handleRemoveAmenity = (vehicleIndex: number, amenityIndex: number) => {
    setVehicles((prev) => {
      const next = [...prev];
      const currentAmenities = next[vehicleIndex].amenities || [];
      next[vehicleIndex] = {
        ...next[vehicleIndex],
        amenities: currentAmenities.filter((_, i) => i !== amenityIndex),
      };
      return next;
    });
  };

  // Client-side image compression for device upload
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
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
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          resolve(compressed);
        };
        img.onerror = () => reject(new Error("Failed to load image for processing"));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file from disk"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError("Image file exceeds 15MB limit. Please choose a smaller photo.");
      return;
    }

    setCompressingIdx(index);
    setError(null);
    try {
      const optimizedBase64 = await compressImage(file);
      handleChange(index, "image", optimizedBase64);
      setSuccess(`Vehicle photo optimized and attached to ${vehicles[index].name}!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Compression error:", err);
      setError(err.message || "Failed to process image file.");
    } finally {
      setCompressingIdx(null);
    }
  };

  // Add New Vehicle Slot
  const handleAddNewVehicle = () => {
    const newIdx = vehicles.length + 1;
    const newVehicle: VehicleItem = {
      id: `vehicle-custom-${Date.now()}`,
      name: "Force Urbania 15 Seater",
      capacityStr: "10–15 Travelers",
      minCap: 10,
      maxCap: 15,
      badge: "Luxury Choice",
      description: "Comfortable and spacious commercial passenger vehicle for group tours & outstation darshan.",
      amenities: [
        "Dual AC with Individual Vents",
        "Push-back Luxury Reclining Seats",
        "Verified Expert Highway Chauffeur",
        "Massive Luggage Boot Space",
        "Fuel, Tolls & Parking Included",
      ],
      image: "/images/vehicles/force-urbania-15-seater.jpg",
      order: vehicles.length,
    };
    setVehicles([...vehicles, newVehicle]);
    setSuccess("New vehicle slot added! Customize the details and click Save Changes.");
    setTimeout(() => setSuccess(null), 3500);
  };

  // Reset to default fleet
  const handleResetToDefaultFleet = () => {
    if (window.confirm("Reset all vehicles to the authentic Shailraj Travels fleet (Force Urbania 15 Seater, Innova Crysta, Ertiga, Swift Dzire, Urbania 12 Seater)?")) {
      setVehicles(DEFAULT_RECOMMENDED_VEHICLES);
      setSuccess("Reset to default Shailraj fleet. Remember to click 'Save All Changes' to apply.");
      setTimeout(() => setSuccess(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-blue-deep mb-4" />
        <p className="text-slate-600 font-bold">Loading Vehicle Fleet configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-reveal">
      {/* Top Banner & Action Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-blue-deep/10 text-brand-blue-deep rounded-2xl">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-black text-slate-900">
                  Vehicle Fleet & Car Management
                </h2>
                <span className="px-2.5 py-0.5 bg-brand-blue-deep text-white text-xs font-black rounded-full">
                  {vehicles.length} Vehicles
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Customize vehicle names, posters/photos, traveler capacity, promotional badges, and amenities shown across tour pages.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefaultFleet}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors flex items-center gap-1.5 border border-slate-200"
            title="Restore default Shailraj Fleet (Force Urbania 15S, Innova Crysta, Ertiga, Swift Dzire, Urbania 12S)"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Fleet</span>
          </button>

          <button
            type="button"
            onClick={handleAddNewVehicle}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-brand-orange/20 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Fleet...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Vehicle Cards Grid */}
      <div className="space-y-6">
        {vehicles.map((v, idx) => {
          const mode = imageModes[idx] || (v.image?.startsWith("data:") ? "upload" : "url");

          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:border-brand-blue-deep/30"
            >
              {/* Card Header Bar */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-blue-deep text-white flex items-center justify-center font-black text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span>{v.name || "Untitled Vehicle"}</span>
                      {v.badge && (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                          {v.badge}
                        </span>
                      )}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      Capacity: {v.capacityStr} ({v.minCap} to {v.maxCap} persons)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-xl transition-colors disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === vehicles.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-xl transition-colors disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  {vehicles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete "${v.name}" from fleet?`)) {
                          setVehicles(vehicles.filter((_, i) => i !== idx));
                        }
                      }}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors ml-2"
                      title="Remove Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body: 2 Columns */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Vehicle Details & Text (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Vehicle Name
                      </label>
                      <input
                        type="text"
                        value={v.name || ""}
                        onChange={(e) => handleChange(idx, "name", e.target.value)}
                        placeholder="e.g. Force Urbania 15 Seater"
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue-deep/20 focus:border-brand-blue-deep outline-none text-sm font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Unique Slug / ID
                      </label>
                      <input
                        type="text"
                        value={v.id || ""}
                        onChange={(e) => handleChange(idx, "id", e.target.value)}
                        placeholder="e.g. force-urbania-15"
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue-deep/20 focus:border-brand-blue-deep outline-none text-sm font-mono text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Capacity Label
                      </label>
                      <input
                        type="text"
                        value={v.capacityStr || ""}
                        onChange={(e) => handleChange(idx, "capacityStr", e.target.value)}
                        placeholder="e.g. 10–15 Travelers"
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue-deep/20 focus:border-brand-blue-deep outline-none text-sm font-semibold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Min Travelers
                      </label>
                      <input
                        type="number"
                        value={v.minCap || 1}
                        onChange={(e) => handleChange(idx, "minCap", parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue-deep/20 focus:border-brand-blue-deep outline-none text-sm font-semibold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Max Travelers
                      </label>
                      <input
                        type="number"
                        value={v.maxCap || 4}
                        onChange={(e) => handleChange(idx, "maxCap", parseInt(e.target.value) || 4)}
                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue-deep/20 focus:border-brand-blue-deep outline-none text-sm font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Promotional Badge (optional)
                      </label>
                      <div className="flex gap-1.5">
                        {["Most Popular", "Premium Choice", "Best Value", "Luxury Choice"].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => handleChange(idx, "badge", b)}
                            className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-semibold transition-colors"
                          >
                            +{b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={v.badge || ""}
                      onChange={(e) => handleChange(idx, "badge", e.target.value)}
                      placeholder="e.g. Most Popular • Luxury Van"
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue-deep/20 focus:border-brand-blue-deep outline-none text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={v.description || ""}
                      onChange={(e) => handleChange(idx, "description", e.target.value)}
                      placeholder="Describe seating comfort, AC quality, and suitable tour types..."
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue-deep/20 focus:border-brand-blue-deep outline-none text-sm text-slate-700 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Amenities / Features List */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Vehicle Features & Amenities ({v.amenities?.length || 0})
                    </label>

                    {/* Active Chips */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(v.amenities || []).map((amenity, aIdx) => (
                        <span
                          key={aIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{amenity}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAmenity(idx, aIdx)}
                            className="text-emerald-500 hover:text-rose-600 transition-colors ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add Custom Amenity */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newAmenityInputs[idx] || ""}
                        onChange={(e) =>
                          setNewAmenityInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddAmenity(idx);
                          }
                        }}
                        placeholder="Add custom feature (e.g. WiFi on-board, 2x2 Reclining)..."
                        className="flex-1 px-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue-deep/20 focus:border-brand-blue-deep outline-none text-xs text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddAmenity(idx)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        + Add
                      </button>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Add:</span>
                      {COMMON_AMENITY_PRESETS.map((preset) => {
                        const hasIt = (v.amenities || []).includes(preset);
                        if (hasIt) return null;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleAddAmenity(idx, preset)}
                            className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-brand-blue-deep/10 hover:text-brand-blue-deep text-slate-600 rounded-lg font-semibold transition-colors"
                          >
                            +{preset}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Car Poster / Image Controller & Live Preview (5 Cols) */}
                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-brand-blue-deep" />
                        Car Poster & Live Preview
                      </span>

                      {/* Mode Toggle: URL vs Upload */}
                      <div className="flex p-0.5 bg-slate-200/70 rounded-lg text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setImageModes((prev) => ({ ...prev, [idx]: "url" }))}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            mode === "url" ? "bg-white text-brand-blue-deep shadow-sm" : "text-slate-500"
                          }`}
                        >
                          URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageModes((prev) => ({ ...prev, [idx]: "upload" }))}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            mode === "upload" ? "bg-white text-brand-blue-deep shadow-sm" : "text-slate-500"
                          }`}
                        >
                          Upload File
                        </button>
                      </div>
                    </div>

                    {/* Live Preview Card */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-100 border border-slate-200 shadow-sm mb-3 group p-3 flex items-center justify-center">
                      {v.image ? (
                        <img
                          src={v.image}
                          alt={v.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/vehicles/force-urbania-15-seater.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                          <Car className="w-12 h-12 mb-2 stroke-1" />
                          <span className="text-xs font-bold">No Image Configured</span>
                        </div>
                      )}

                      {/* Floating Badges Bar (Non-overlapping) */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2 z-10 pointer-events-none">
                        {v.badge ? (
                          <div className="bg-gray-900/90 backdrop-blur text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm max-w-[62%] truncate">
                            {v.badge}
                          </div>
                        ) : <div />}
                        <div className="bg-white/95 backdrop-blur text-brand-blue-deep text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm border border-slate-200/80 shrink-0">
                          {v.capacityStr}
                        </div>
                      </div>

                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                        <div className="text-sm font-black">{v.name}</div>
                        <div className="text-[11px] text-white/80 line-clamp-1">{v.description}</div>
                      </div>
                    </div>

                    {/* Input Controls */}
                    {mode === "url" ? (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">
                          Image URL or Local Path
                        </label>
                        <input
                          type="text"
                          value={v.image || ""}
                          onChange={(e) => handleChange(idx, "image", e.target.value)}
                          placeholder="/images/vehicles/force-urbania-15-seater.jpg"
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue-deep/20 text-xs font-mono text-slate-700 outline-none"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase">
                          Upload Car Photo from Device
                        </label>
                        <label
                          className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            compressingIdx === idx
                              ? "border-brand-orange bg-brand-orange/5 cursor-wait"
                              : "border-slate-300 hover:border-brand-blue-deep bg-white hover:bg-slate-50"
                          }`}
                        >
                          {compressingIdx === idx ? (
                            <>
                              <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
                              <span className="text-xs font-bold text-brand-orange">
                                Compressing & attaching photo...
                              </span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-brand-blue-deep" />
                              <span className="text-xs font-bold text-slate-700">
                                Click to select vehicle photo
                              </span>
                              <span className="text-[10px] text-slate-400">
                                JPG, PNG up to 15MB (automatically optimized)
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(idx, e)}
                            disabled={compressingIdx === idx}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Fast Image Presets */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 mb-1.5">
                      Fast Shailraj Fleet Photo Presets:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_VEHICLE_IMAGES.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleChange(idx, "image", preset.url)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all ${
                            v.image === preset.url
                              ? "bg-brand-blue-deep text-white border-brand-blue-deep shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Add & Save Bar */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm font-semibold text-slate-500">
          Showing <strong className="text-slate-800">{vehicles.length}</strong> vehicles in active fleet. Tour pages automatically recommend the best vehicle based on travelers joining.
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAddNewVehicle}
            className="flex-1 sm:flex-none px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Vehicle</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none px-7 py-3 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-brand-orange/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Fleet...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
