"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Heart, 
  ChevronRight, 
  Home, 
  Building2, 
  User, 
  Star, 
  Bed, 
  Bath, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  ChevronDown
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  location: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  wc: number;
  originalPrice: number;
  discountedPrice: number;
  rating: number;
  reviewsCount: number;
  isSpecial?: boolean;
  verified?: boolean;
  category?: string;
}

const FEATURED_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "DAMAC Majestine Suite",
    location: "Dhanmondi Road 8A, Dhaka",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    bedrooms: 5,
    bathrooms: 4,
    wc: 4,
    originalPrice: 45000,
    discountedPrice: 38500,
    rating: 4.8,
    reviewsCount: 142,
    verified: true,
  },
  {
    id: "prop-2",
    title: "The Glass Penthouse",
    location: "Block C, Bashundhara R/A, Dhaka",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
    bedrooms: 4,
    bathrooms: 4,
    wc: 4,
    originalPrice: 32000,
    discountedPrice: 27000,
    rating: 4.9,
    reviewsCount: 98,
    verified: true,
  },
  {
    id: "prop-3",
    title: "Nordic Terrace Flat",
    location: "Road 71, Gulshan-2, Dhaka",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop",
    bedrooms: 5,
    bathrooms: 4,
    wc: 4,
    originalPrice: 72000,
    discountedPrice: 64000,
    rating: 4.9,
    reviewsCount: 215,
    verified: true,
  },
  {
    id: "prop-4",
    title: "Rosewood Courtyard Villa",
    location: "Avenue 3, Mirpur DOHS, Dhaka",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop",
    bedrooms: 5,
    bathrooms: 4,
    wc: 4,
    originalPrice: 36000,
    discountedPrice: 31000,
    rating: 4.7,
    reviewsCount: 84,
    verified: true,
  },
];

export default function HomePage() {
  const [locationQuery, setLocationQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans antialiased">
      {/* =========================================================================
          HERO BANNER SECTION (Full-Bleed Modern Architecture at Dusk)
         ========================================================================= */}
      <section className="relative w-full h-[640px] lg:h-[720px] overflow-hidden">
        {/* Full-width High-Res Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=2400&auto=format&fit=crop"
            alt="Modern luxury house at dusk"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Subtle cinematic gradient vignette to keep text ultra crisp */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* 1. TOP NAVIGATION OVERLAY */}
        <header className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 pt-6 flex items-center justify-between text-white">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-editorial text-2xl lg:text-3xl font-bold tracking-tight text-white group-hover:text-amber-100 transition-colors">
              RentPulse
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
            <Link href="#" className="hover:text-white transition-colors">
              Explore Properties
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Search by Map
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              List Your Property
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              About Us
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href="#" 
              className="flex items-center gap-2 text-sm font-medium text-white hover:text-amber-100 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Register / Login</span>
            </Link>

            <Link
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0084FF] hover:bg-[#0073E6] text-white text-xs font-semibold shadow-lg transition-all active:scale-[0.98]"
            >
              <Home className="w-3.5 h-3.5" />
              <span>List Property</span>
            </Link>
          </div>
        </header>

        {/* 2. HERO HEADLINE & TEXT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full flex flex-col justify-center pb-24">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-4 drop-shadow-md">
              Find your next stay
            </h1>
            <p className="text-base sm:text-lg text-white/90 font-normal leading-relaxed drop-shadow">
              Discover Your Dream Property with Us Where Perfect Meets Possible in Every Home.
            </p>
          </div>
        </div>

        {/* 3. FLOATING GLASS SEARCH BAR (Docked at bottom of Hero) */}
        <div className="absolute inset-x-0 bottom-8 z-30 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto bg-white/25 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-3 sm:p-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
              
              {/* Where to Input */}
              <div className="sm:col-span-4 bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
                <MapPin className="w-4 h-4 text-ink-secondary shrink-0" />
                <input
                  type="text"
                  placeholder="where to?"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none"
                />
              </div>

              {/* Check in / Check out Date Dropdown */}
              <div className="sm:col-span-4 bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm cursor-pointer hover:bg-white/95 transition-colors">
                <div className="flex items-center gap-3 truncate">
                  <Calendar className="w-4 h-4 text-ink-secondary shrink-0" />
                  <span className="text-xs sm:text-sm text-ink-secondary truncate">
                    Check in Date _ Check out Date
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-ink-tertiary shrink-0" />
              </div>

              {/* Guests / Rooms Selector */}
              <div className="sm:col-span-3 bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-white/95 transition-colors">
                <Users className="w-4 h-4 text-ink-secondary shrink-0" />
                <span className="text-xs sm:text-sm text-ink-secondary truncate">
                  2 adults _ 0 Children _ 1 room
                </span>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-1">
                <button
                  type="button"
                  className="w-full h-11 bg-[#0084FF] hover:bg-[#0073E6] text-white rounded-xl font-semibold text-sm flex items-center justify-center shadow-md transition-all active:scale-[0.97]"
                >
                  <Search className="w-4 h-4 sm:hidden mr-2" />
                  <span>Search</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: RENTALS WITH RENT SPECIALS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary">
            Rentals with rent specials
          </h2>
          <Link 
            href="#" 
            className="flex items-center gap-1 text-sm font-semibold text-ink-secondary hover:text-ink-primary transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Card Grid Exactly Matching Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PROPERTIES.map((property) => {
            const isSaved = savedIds.includes(property.id);
            return (
              <div
                key={property.id}
                className="group bg-surface rounded-2xl border border-hairline overflow-hidden hover:shadow-hover transition-all duration-300 flex flex-col"
              >
                {/* Property Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted-sand">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Top-Right Heart Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleSave(property.id, e)}
                    aria-label="Save to Wishlist"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-ink-secondary hover:text-terracotta shadow-sm transition-all"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        isSaved ? "fill-terracotta text-terracotta" : ""
                      }`} 
                    />
                  </button>
                </div>

                {/* Card Info Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Property Title & Location */}
                    <h3 className="font-semibold text-sm text-ink-primary group-hover:text-[#0084FF] transition-colors truncate">
                      {property.title}
                    </h3>
                    <p className="text-xs text-ink-tertiary mt-0.5 truncate">
                      {property.location}
                    </p>

                    {/* Bedroom & Bathroom Specs */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-ink-secondary">
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-ink-tertiary" />
                        <span>{property.bedrooms} Bedrooms</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-ink-tertiary" />
                        <span>{property.bathrooms} Bath, {property.wc} WC</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Rating Footer */}
                  <div className="mt-4 pt-3 border-t border-hairline flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-ink-tertiary line-through tabular-nums">
                        ৳ {property.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-base font-bold text-ink-primary tabular-nums">
                        ৳ {property.discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-ink-secondary">month</span>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-ink-primary">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{property.rating}</span>
                      <span className="text-ink-tertiary font-normal">({property.reviewsCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION: EXPLORE POPULAR URBAN CLUSTERS (DHAKA RESIDENTIAL)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="p-8 rounded-3xl bg-muted-sand/50 border border-hairline flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              Verified Tenancy Protection
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink-primary">
              All properties verified against legal ownership deeds & DMP CIMS.
            </h3>
            <p className="text-sm text-ink-secondary mt-1 max-w-xl">
              Zero ghost listings, pre-screened flatmates, transparent itemized utility breakdowns, and one-click digital tenancy dossiers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="#"
              className="px-5 py-2.5 rounded-xl bg-ink-primary hover:bg-black text-white text-xs font-semibold transition-all shadow-sm"
            >
              Browse Verified Homes
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
         ========================================================================= */}
      <footer className="border-t border-hairline bg-surface py-10 px-6 lg:px-12 text-xs text-ink-tertiary">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-lg font-bold text-ink-primary">RentPulse</span>
            <span>• Curated Urban House Rental & Tenancy Management</span>
          </div>
          <div>
            © {new Date().getFullYear()} RentPulse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
