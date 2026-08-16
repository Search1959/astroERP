/**
 * Comprehensive SEO Head & Schema.org JSON-LD Structured Data Component
 * Provides real-time dynamic meta tags, OpenGraph, Twitter cards, canonical URLs,
 * and rich snippets for Search Engines (Google, Bing, Yahoo, Yandex).
 */

import React, { useEffect } from 'react';
import { AstrologyChartData } from '../../types';

interface SEOHeadProps {
  activeTab: string;
  chartData?: AstrologyChartData | null;
  pageTitle?: string;
  pageDescription?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  activeTab,
  chartData,
  pageTitle,
  pageDescription,
}) => {
  useEffect(() => {
    // Determine dynamic title and description based on current context
    let title = 'AstroERP — Online Vedic & Western Natal Chart Calculator, Jyotish Astrology & Certified Gemstones';
    let description =
      'Free precision Swiss Ephemeris natal birth chart calculator, Kundli generation, weekly & monthly astrological predictions, and certified natural Jyotish gemstones management system.';
    let keywords =
      'astrology calculator, kundli online, vedic birth chart, natal chart wheel, swiss ephemeris, horoscope predictions, weekly horoscope, monthly horoscope, yearly horoscope, jyotish gemstones, pukhraj, neelam, panna, manik, astrological consultation';

    if (chartData && activeTab === 'astrology') {
      const asc = chartData.interpretations?.coreAscendant?.sign || 'Aries';
      const sun = chartData.planets.find(p => p.name === 'Sun')?.sign || 'Leo';
      const moon = chartData.planets.find(p => p.name === 'Moon')?.sign || 'Cancer';
      title = `${chartData.subjectName}'s Natal Chart & Kundli (${asc} Lagna, Sun in ${sun}, Moon in ${moon}) — AstroERP`;
      description = `Personalized astrological analysis for ${chartData.subjectName}. Ascendant in ${asc}, Moon in ${moon}, Planetary transits, gemstone remedies, and life predictions calculated with astronomical precision.`;
    } else if (activeTab === 'inventory') {
      title = 'Certified Natural Vedic Gemstones Catalog — 100% Lab Tested & Astrologically Energized';
      description = 'Explore certified Jyotish gemstones: Yellow Sapphire (Pukhraj), Blue Sapphire (Neelam), Emerald (Panna), Ruby (Manik), Red Coral (Moonga), and Pearl (Moti) with origin certificates.';
    } else if (activeTab === 'appointments') {
      title = 'Book Astrological Consultation — Expert Vedic & Western Astrologers';
      description = 'Schedule private 1-on-1 consultations for horoscope analysis, career forecasting, matchmaking, and gemstone recommendations.';
    } else if (activeTab === 'dashboard' || activeTab === 'crm') {
      title = 'Astrology Studio CRM & Practice Management ERP';
      description = 'Unified platform for professional astrologers, gemstone merchants, and Vedic consultants.';
    }

    if (pageTitle) title = pageTitle;
    if (pageDescription) description = pageDescription;

    // Update document title
    document.title = title;

    // Helper to safely set meta tags
    const setMeta = (selector: string, attr: string, value: string) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const name = selector.replace('meta[name="', '').replace('"]', '');
          meta.setAttribute('name', name);
        } else if (selector.startsWith('meta[property=')) {
          const prop = selector.replace('meta[property="', '').replace('"]', '');
          meta.setAttribute('property', prop);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[name="keywords"]', 'content', keywords);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', window.location.href);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;

    // Inject Rich JSON-LD Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          '@id': `${window.location.origin}/#webapp`,
          name: 'AstroERP Astrology & Kundli Engine',
          url: window.location.origin,
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'All',
          description:
            'Astronomically accurate Natal Chart Kundli calculations, planetary ephemeris, Gochara transits, life predictions, and natural gemstone recommendations.',
          offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
          },
          featureList: [
            'Swiss Ephemeris Astronomical Planetary Positions',
            'Placidus, Koch, Whole Sign, Equal House Systems',
            'Weekly, Monthly, and Yearly Astrological Predictions',
            'Certified Vedic Gemstone (Ratna) Recommendations',
            'Multi-Language Support across 12 Indian Languages',
            'Printable High-Resolution PDF Kundli Reports',
            'Real-Time Cloud Persistence via Firebase Firestore',
          ],
        },
        {
          '@type': 'ProfessionalService',
          '@id': `${window.location.origin}/#organization`,
          name: 'AstroERP Jyotish & Gemstones Studio',
          url: window.location.origin,
          telephone: '+1 (800) 555-ASTRO',
          email: 'consult@vedicastro.com',
          priceRange: '$$',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Suite 408, Celestial Tower',
            addressLocality: 'Bangalore & New York',
            addressCountry: 'IN/US',
          },
          serviceType: [
            'Natal Birth Chart Calculation',
            'Horoscope & Planetary Transit Forecasting',
            'Certified Vedic Gemstone Recommendation & Sourcing',
            'Kundali Matchmaking Consultation',
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How accurate is the birth chart calculated on AstroERP?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'AstroERP uses high-precision astronomical algorithms (Swiss Ephemeris formulas) accurate to arc-minutes, computing the exact planetary longitudes, house cusps, and planetary speeds at your exact local coordinates and Universal Time.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is the difference between Vedic (Sidereal) and Western (Tropical) systems?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Tropical zodiac aligns with the seasons and the vernal equinox, commonly used in Western astrology. The Sidereal (Vedic) system accounts for the precession of equinoxes (Ayanamsha such as Lahiri or Krishnamurti) referencing actual celestial constellations.',
              },
            },
            {
              '@type': 'Question',
              name: 'How are astrological gemstone recommendations determined?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Gemstones (Ratnas) are prescribed based on the functional benefic planets in your Ascendant chart (Lagna), reinforcing weak favorable planets like Jupiter (Yellow Sapphire), Mercury (Emerald), or Saturn (Blue Sapphire) while avoiding stones of malefic houses.',
              },
            },
            {
              '@type': 'Question',
              name: 'Are calculations available in different Indian languages?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, AstroERP natively supports 12 Indian languages including Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Urdu, and English.',
              },
            },
          ],
        },
      ],
    };

    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }, [activeTab, chartData, pageTitle, pageDescription]);

  return null;
};
