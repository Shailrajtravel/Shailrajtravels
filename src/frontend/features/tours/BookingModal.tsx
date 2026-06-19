import React, { useState, useEffect } from "react";
import { X, User, Phone, MapPin, Users, Calendar, Minus, Plus, Loader2, ShieldCheck } from "lucide-react";
import { TourData } from "./TourCard";
import { createBookingFn } from "../../../backend/lib/bookings";

interface BookingModalProps {
  tour: TourData;
  onClose: () => void;
  t: any;
  lang: "en" | "mr";
}

export function BookingModal({ tour, onClose, t, lang }: BookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [persons, setPersons] = useState(2);
  const [travelDate, setTravelDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prevent background scrolling when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const isUpcomingDate = (dateStr: string) => {
    if (typeof dateStr !== 'string') return false;
    const match = dateStr.match(/(\d+)\s+([a-zA-Z]+)(?:\s+(\d{4}))?/);
    if (!match) return true;
    const now = new Date();
    const year = match[3] || now.getFullYear();
    const parsedDate = new Date(`${match[1]} ${match[2]} ${year}`);
    if (isNaN(parsedDate.getTime())) return true;
    now.setHours(0, 0, 0, 0);
    return parsedDate >= now;
  };

  // Extract valid dates if present
  const validDates = Array.isArray(tour.dates)
    ? tour.dates.filter(isUpcomingDate)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bookingData = {
        name: name.trim(),
        phone: phone.trim(),
        pickupLocation: pickupLocation.trim(),
        tripName: tour.title,
        persons: Number(persons),
        travelDate: travelDate,
      };

      await createBookingFn({ data: bookingData });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6 bg-[#112233]/45 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-[500px] max-h-[95vh] bg-white rounded-[28px] sm:rounded-[36px] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-250">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-[#112233] font-bold text-2xl leading-tight">
              {t.bookingModalTitle || "Book Seat"}
            </h3>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              {t.bookingModalDesc || `Reserving seats for ${tour.title}`}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#112233] mb-3">
                {t.bookingModalSuccessTitle || "Booking Received!"}
              </h3>
              <p className="text-slate-600 text-sm max-w-sm mb-8 leading-relaxed">
                {t.bookingModalSuccessDesc || "We have received your booking request for this tour and will contact you shortly to confirm the details."}
              </p>
              <button 
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 bg-[#F59E0B] hover:bg-[#E5910A] text-[#112233] font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                {lang === "mr" ? "बंद करा" : "Close"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.formName || "Full Name"} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 h-[56px] transition focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/15">
                  <User className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.formNamePlace || "Enter your name"}
                    className="w-full bg-transparent text-[15px] font-semibold text-brand-blue-deep placeholder:text-slate-400 placeholder:font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.formContact || "Contact Number"} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 h-[56px] transition focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/15">
                  <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 00000 00000"
                    className="w-full bg-transparent text-[15px] font-semibold text-brand-blue-deep placeholder:text-slate-400 placeholder:font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.formPickupLocation || "Pickup Location"} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 h-[56px] transition focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/15">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder={t.formPickupLocationPlace || "Enter pickup point / address"}
                    className="w-full bg-transparent text-[15px] font-semibold text-brand-blue-deep placeholder:text-slate-400 placeholder:font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Persons counter */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.formPersons || "Persons"}
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 h-[56px] transition focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/15">
                  <Users className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="flex items-center justify-between flex-grow">
                    <button
                      type="button"
                      onClick={() => setPersons(p => Math.max(1, p - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-[15px] font-semibold text-brand-blue-deep">
                      {persons} {persons === 1 ? t.formPerson || "Person" : t.formPersonsPlural || "Persons"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPersons(p => Math.min(16, p + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-[#F59E0B] hover:bg-amber-100 transition cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Date selector */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.formDate || "Travel Date"} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 h-[56px] transition focus-within:border-[#F59E0B] focus-within:ring-2 focus-within:ring-[#F59E0B]/15">
                  <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="relative flex items-center w-full">
                    {validDates.length > 0 ? (
                      <select
                        name="travelDate"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full appearance-none bg-transparent text-[15px] font-semibold text-[#112233] focus:outline-none cursor-pointer pr-6"
                      >
                        <option value="">{t.tourSelectDate || "Select a date"}</option>
                        {validDates.map((date: string) => (
                          <option key={date} value={date}>{date}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        type="date"
                        name="travelDate"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full bg-transparent text-[15px] font-semibold text-[#112233] focus:outline-none cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 bg-[#F59E0B] hover:bg-[#E5910A] text-[#112233] font-bold text-base rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {lang === "mr" ? "पाठवत आहे..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    {t.formBook || "Book Now"}
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
