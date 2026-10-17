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
  User, 
  Star, 
  Bed, 
  Bath, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Building,
  Key,
  FileCheck2,
  SlidersHorizontal,
  Flame,
  ArrowRight
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
  category: "all" | "apartment" | "shared" | "lakefront" | "penthouse";
}

const FEATURED_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "DAMAC Majestine Residence",
    location: "Dhanmondi Road 8A, Dhaka",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
    bedrooms: 5,
    bathrooms: 4,
    wc: 4,
    originalPrice: 45000,
    discountedPrice: 38500,
    rating: 4.8,
    reviewsCount: 142,
    verified: true,
    category: "apartment",
  },
  {
    id: "prop-2",
    title: "The Glass Penthouse Suite",
    location: "Block C, Bashundhara R/A, Dhaka",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop",
    bedrooms: 4,
    bathrooms: 4,
    wc: 4,
    originalPrice: 32000,
    discountedPrice: 27000,
    rating: 4.9,
    reviewsCount: 98,
    verified: true,
    category: "shared",
  },
  {
    id: "prop-3",
    title: "Nordic Terrace Lakeview Flat",
    location: "Road 71, Gulshan-2, Dhaka",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1000&auto=format&fit=crop",
    bedrooms: 5,
    bathrooms: 4,
    wc: 4,
    originalPrice: 72000,
    discountedPrice: 64000,
    rating: 4.9,
    reviewsCount: 215,
    verified: true,
    category: "lakefront",
  },
  {
    id: "prop-4",
    title: "Rosewood Courtyard Villa",
    location: "Avenue 3, Mirpur DOHS, Dhaka",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1000&auto=format&fit=crop",
    bedrooms: 5,
    bathrooms: 4,
    wc: 4,
    originalPrice: 36000,
    discountedPrice: 31000,
    rating: 4.7,
    reviewsCount: 84,
    verified: true,
    category: "apartment",
  },
  {
    id: "prop-5",
    title: "The Diplomatic Skyline Studio",
    location: "Road 11, Banani, Dhaka",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop",
    bedrooms: 2,
    bathrooms: 2,
    wc: 2,
    originalPrice: 28000,
    discountedPrice: 23500,
    rating: 4.9,
    reviewsCount: 112,
    verified: true,
    category: "penthouse",
  },
  {
    id: "prop-6",
    title: "Botanical Garden Corner Flat",
    location: "Sector 4, Uttara, Dhaka",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
    bedrooms: 4,
    bathrooms: 3,
    wc: 3,
    originalPrice: 34000,
    discountedPrice: 29500,
    rating: 4.8,
    reviewsCount: 76,
    verified: true,
    category: "apartment",
  },
  {
    id: "prop-7",
    title: "The University Courtyard Seat",
    location: "Block D, Bashundhara R/A, Dhaka",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1000&auto=format&fit=crop",
    bedrooms: 1,
    bathrooms: 1,
    wc: 1,
    originalPrice: 15000,
    discountedPrice: 12500,
    rating: 4.9,
    reviewsCount: 63,
    verified: true,
    category: "shared",
  },
  {
    id: "prop-8",
    title: "Lakefront Sunset Penthouse",
    location: "Baridhara Diplomatic Zone, Dhaka",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
    bedrooms: 5,
    bathrooms: 5,
    wc: 5,
    originalPrice: 95000,
    discountedPrice: 84000,
    rating: 5.0,
    reviewsCount: 52,
    verified: true,
    category: "lakefront",
  },
];

const NEIGHBORHOODS = [
  {
    name: "Dhanmondi",
    listingsCount: "148 Verified Homes",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=800&auto=format&fit=crop",
    commute: "Near University Clusters",
  },
  {
    name: "Gulshan & Banani",
    listingsCount: "215 Premium Flats",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    commute: "Commercial District Hub",
  },
  {
    name: "Bashundhara R/A",
    listingsCount: "192 Student & Bachelor Flats",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=800&auto=format&fit=crop",
    commute: "NSU / IUB / AIUB Radius",
  },
  {
    name: "Mirpur DOHS",
    listingsCount: "110 Gated Family Flats",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
    commute: "Secure Residential Gated",
  },
];

export default function HomePage() {
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredProperties = selectedCategory === "all"
    ? FEATURED_PROPERTIES
    : FEATURED_PROPERTIES.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans antialiased selection:bg-forest selection:text-white">
      {/* =========================================================================
          HERO BANNER SECTION (Full-Width Cinematic Photography at Dusk)
         ========================================================================= */}
      <section className="relative w-full min-h-[820px] sm:min-h-[760px] lg:h-[840px] bg-canvas overflow-hidden flex flex-col justify-between">
        {/* Full-width High-Res Background Image with Natural Low-Mist Dissolve */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 65%, rgba(0,0,0,0.85) 78%, rgba(0,0,0,0.4) 88%, rgba(0,0,0,0.08) 96%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 65%, rgba(0,0,0,0.85) 78%, rgba(0,0,0,0.4) 88%, rgba(0,0,0,0.08) 96%, transparent 100%)",
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=2600&auto=format&fit=crop"
            alt="Modern luxury house at dusk"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Subtle cinematic gradient vignette for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/25" />
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent" />
        </div>

        {/* Ethereal misty gradient overlay concentrated at bottom transition */}
        <div 
          className="absolute inset-x-0 bottom-0 h-72 sm:h-88 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(250, 248, 245, 0.12) 28%, rgba(250, 248, 245, 0.45) 55%, rgba(250, 248, 245, 0.82) 80%, rgba(250, 248, 245, 0.98) 95%, #FAF8F5 100%)"
          }}
        />

        {/* 1. TOP NAVIGATION OVERLAY (Edge-to-Edge with Generous Width) */}
        <header className="relative z-20 w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 pt-7 flex items-center justify-between text-white">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="RentPulse Logo" 
                width={32} 
                height={32} 
                className="object-contain w-8 h-8"
              />
            </div>
            <span className="font-editorial text-2xl lg:text-3xl font-bold tracking-tight text-white group-hover:text-amber-100 transition-colors">
              RentPulse
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-medium text-white/90">
            <Link href="#rentals" className="hover:text-amber-100 transition-colors duration-200">
              Explore Properties
            </Link>
            <Link href="#neighborhoods" className="hover:text-amber-100 transition-colors duration-200">
              Search by Map
            </Link>
            <Link href="#why-rentpulse" className="hover:text-amber-100 transition-colors duration-200">
              List Your Property
            </Link>
            <Link href="#why-rentpulse" className="hover:text-amber-100 transition-colors duration-200">
              About Us
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <Link 
              href="#" 
              className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-amber-100 transition-colors duration-200 group shrink-0"
            >
              <User className="w-4 h-4 transition-colors duration-200 group-hover:text-amber-100 shrink-0" />
              <span className="hidden sm:inline">Register / Login</span>
            </Link>

            <Link
              href="#"
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#0084FF] hover:bg-[#0073E6] text-white text-xs font-semibold shadow-lg transition-all active:scale-[0.98] shrink-0 whitespace-nowrap"
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>List Property</span>
            </Link>
          </div>
        </header>

        {/* 2. HERO HEADLINE & TEXT */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 flex-1 flex flex-col justify-center py-10 sm:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wide mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Dhaka Residential Collection • Verified Listings
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] mb-4 sm:mb-5 drop-shadow-md">
              Find your next stay
            </h1>
            <p className="text-sm sm:text-lg text-white/90 font-normal leading-relaxed drop-shadow max-w-xl">
              Discover Your Dream Property with Us Where Perfect Meets Possible in Every Home.
            </p>
          </div>
        </div>

        {/* 3. FLOATING GLASS SEARCH BAR (Wide & Immersive) */}
        <div className="relative z-30 w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 pb-8 sm:pb-12">
          <div className="w-full max-w-[1400px] mx-auto bg-neutral-900/55 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl p-3 sm:p-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              
              {/* Where to Input */}
              <div className="sm:col-span-1 lg:col-span-4 bg-white rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm min-w-0">
                <MapPin className="w-4 h-4 text-ink-secondary shrink-0" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none min-w-0"
                />
              </div>

              {/* Check in / Check out Date Dropdown */}
              <div className="sm:col-span-1 lg:col-span-3 bg-white rounded-xl px-4 py-3.5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-white/95 transition-colors min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 truncate">
                  <Calendar className="w-4 h-4 text-ink-secondary shrink-0" />
                  <span className="text-xs xl:text-sm text-ink-secondary truncate">
                    Check in — Check out
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-ink-tertiary shrink-0 ml-1.5" />
              </div>

              {/* Guests / Rooms Selector */}
              <div className="sm:col-span-1 lg:col-span-3 bg-white rounded-xl px-4 py-3.5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-white/95 transition-colors min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 truncate">
                  <Users className="w-4 h-4 text-ink-secondary shrink-0" />
                  <span className="text-xs xl:text-sm text-ink-secondary truncate">
                    2 Adults • 0 Children • 1 Room
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-ink-tertiary shrink-0 ml-1.5" />
              </div>

              {/* Search Button */}
              <div className="sm:col-span-1 lg:col-span-2">
                <button
                  type="button"
                  className="w-full h-12 bg-[#0084FF] hover:bg-[#0073E6] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.97] cursor-pointer whitespace-nowrap"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Search</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: RENTALS WITH RENT SPECIALS (Wide Full-Canvas Grid)
         ========================================================================= */}
      <section id="rentals" className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-16">
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-terracotta tracking-wider uppercase mb-1">
              <Flame className="w-4 h-4 shrink-0" />
              <span>Limited-Time Lease Discounts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary font-editorial">
              Rentals with rent specials
            </h2>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full shrink min-w-0 pr-2">
            {[
              { id: "all", label: "All Properties" },
              { id: "apartment", label: "Family Apartments" },
              { id: "shared", label: "Student & Bachelor Seats" },
              { id: "lakefront", label: "Lakefront & Terraces" },
              { id: "penthouse", label: "Penthouses" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-ink-primary text-white shadow-sm"
                    : "bg-surface border border-hairline text-ink-secondary hover:text-ink-primary hover:border-ink-tertiary"
                }`}
              >
                {cat.label}
              </button>
            ))}

            <Link 
              href="#" 
              className="flex items-center gap-1 text-sm font-semibold text-[#0084FF] hover:underline pl-3 whitespace-nowrap shrink-0"
            >
              <span>View all</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </div>

        {/* Responsive Grid with Optimal Card Proportions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProperties.map((property) => {
            const isSaved = savedIds.includes(property.id);
            return (
              <div
                key={property.id}
                className="group bg-surface rounded-2xl border border-hairline overflow-hidden hover:shadow-hover transition-all duration-300 flex flex-col"
              >
                {/* Property Image Container (4:3 ratio with rich zoom) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted-sand">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Verified Badge */}
                  {property.verified && (
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-forest flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                      <span>Verified Deed</span>
                    </div>
                  )}

                  {/* Top-Right Heart Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleSave(property.id, e)}
                    aria-label="Save to Wishlist"
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-ink-secondary hover:text-terracotta shadow-sm transition-all cursor-pointer"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors shrink-0 ${
                        isSaved ? "fill-terracotta text-terracotta" : ""
                      }`} 
                    />
                  </button>
                </div>

                {/* Card Info Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Property Title & Location */}
                    <h3 className="font-semibold text-base text-ink-primary group-hover:text-[#0084FF] transition-colors truncate">
                      {property.title}
                    </h3>
                    <p className="text-xs text-ink-tertiary mt-1 truncate flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-ink-tertiary shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </p>

                    {/* Bedroom & Bathroom Specs */}
                    <div className="flex items-center flex-wrap gap-x-3.5 gap-y-1 mt-3.5 text-xs text-ink-secondary">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Bed className="w-4 h-4 text-ink-tertiary shrink-0" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Bath className="w-4 h-4 text-ink-tertiary shrink-0" />
                        <span>{property.bathrooms} Bath • {property.wc} WC</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Rating Footer */}
                  <div className="mt-4 pt-3.5 border-t border-hairline flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-baseline gap-1.5 shrink-0">
                      <span className="text-xs text-ink-tertiary line-through tabular-nums">
                        ৳ {property.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-ink-primary tabular-nums">
                        ৳ {property.discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-ink-secondary font-medium">/ mo</span>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-ink-primary shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
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
          SECTION: EXPLORE DHAKA RESIDENTIAL CLUSTERS (Full Width Tiles)
         ========================================================================= */}
      <section id="neighborhoods" className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-12 border-t border-hairline">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-bold text-forest uppercase tracking-widest block mb-1">
              Geospatial Commute Search
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary font-editorial">
              Explore Popular Dhaka Neighborhoods
            </h2>
          </div>
          <Link href="#" className="text-sm font-semibold text-ink-secondary hover:text-ink-primary flex items-center gap-1 shrink-0 whitespace-nowrap">
            <span>View all 18 areas</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {NEIGHBORHOODS.map((item) => (
            <div
              key={item.name}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-hairline"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[11px] font-semibold text-amber-300 tracking-wider uppercase block mb-1 truncate">
                  {item.commute}
                </span>
                <h3 className="font-editorial text-xl font-bold truncate">{item.name}</h3>
                <p className="text-xs text-white/80 mt-0.5 truncate">{item.listingsCount}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION: WHY RENTPULSE (Value Pillars)
         ========================================================================= */}
      <section id="why-rentpulse" className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-14">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-hairline shadow-card">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-forest uppercase tracking-widest block mb-2">
              Enterprise Trust & Verification
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary font-editorial">
              How RentPulse Solves Dhaka&apos;s Rental Chaos
            </h2>
            <p className="text-sm text-ink-secondary mt-2">
              Moving past unverified Facebook groups and torn street notices with cryptographic document integrity and algorithmic roommate synergy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center text-forest">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-ink-primary">Verified Landlords & Deeds</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Every listing is cross-referenced against official ownership records using SHA-256 document hashing. Zero ghost listings.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-terracotta-light flex items-center justify-center text-terracotta">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-ink-primary">Roommate Synergy Engine</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                5-vector living habit compatibility (sleep chronotypes, study noise, cleanliness, guest policy) cuts shared flat conflicts.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-ink-primary">1-Click Tenancy Dossier</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Pre-screened tenant verification bundle (NID badge, student/corporate proof) submitted securely with one click.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0084FF]">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-ink-primary">DMP CIMS Police Gateway</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Automated one-click export formatted strictly for the Dhaka Metropolitan Police Citizen Information Management System.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FULL-WIDTH FOOTER
         ========================================================================= */}
      <footer className="bg-surface pt-14 pb-12 text-ink-secondary border-t border-hairline">
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 text-xs">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 group mb-3 shrink-0">
                <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                  <Image 
                    src="/logo.png" 
                    alt="RentPulse Logo" 
                    width={28} 
                    height={28} 
                    className="object-contain w-7 h-7"
                  />
                </div>
                <span className="font-editorial text-2xl font-bold text-ink-primary group-hover:text-forest transition-colors">
                  RentPulse
                </span>
              </Link>
              <p className="text-ink-tertiary max-w-sm leading-relaxed mb-4">
                An intelligent multi-persona house rental discovery, cohabitation compatibility, and tenancy lifecycle management platform for urban renters and verified property owners.
              </p>
              <div className="text-[11px] text-ink-tertiary">
                Operating across Dhaka Metropolitan Area, Bangladesh.
              </div>
            </div>

            <div>
              <h4 className="font-bold text-ink-primary uppercase tracking-wider text-[11px] mb-3">
                For Renters
              </h4>
              <ul className="space-y-2 text-ink-secondary">
                <li><Link href="#" className="hover:text-ink-primary">Entire Family Flats</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Student & Bachelor Seats</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Roommate Compatibility Quiz</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Digital Tenancy Dossier</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Inspection Booking</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-ink-primary uppercase tracking-wider text-[11px] mb-3">
                For Property Owners
              </h4>
              <ul className="space-y-2 text-ink-secondary">
                <li><Link href="#" className="hover:text-ink-primary">List a Residential Unit</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Title Deed Verification</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Pre-Screened Tenant Pipeline</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Bilingual Digital Leases</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">DMP CIMS Police Filing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-ink-primary uppercase tracking-wider text-[11px] mb-3">
                Legal & Compliance
              </h4>
              <ul className="space-y-2 text-ink-secondary">
                <li><Link href="#" className="hover:text-ink-primary">DMP CIMS Guidelines</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Tenancy Agreement Standards</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Data Privacy & Security</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-ink-primary">Dispute Arbitration</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between text-xs text-ink-tertiary gap-4">
            <p>© {new Date().getFullYear()} RentPulse. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-ink-primary">Privacy Policy</Link>
              <Link href="#" className="hover:text-ink-primary">Terms & Conditions</Link>
              <Link href="#" className="hover:text-ink-primary">Security Architecture</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
