import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { visitedCountries } from '../data/visitedCountries';
import { alpha3ToNumeric } from '../data/countryCodeMapping';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatVisitDate } from "../lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from '../components/ui/drawer';
import { travelStats } from '../data/travelStats';

// Aggregate visit counts per country
const getCountryData = () => {
  const countryMap = new Map<string, { name: string; visits: typeof visitedCountries[0]['visits']; count: number }>();

  visitedCountries.forEach(country => {
    const existing = countryMap.get(country.id);
    if (existing) {
      existing.visits.push(...country.visits);
      existing.count = existing.visits.length;
    } else {
      countryMap.set(country.id, {
        name: country.name,
        visits: [...country.visits],
        count: country.visits.length
      });
    }
  });

  return countryMap;
};

const numericToAlpha3 = new Map<string, string>(
  Object.entries(alpha3ToNumeric).map(([alpha3, numeric]) => [String(Number(numeric)), alpha3])
);

const getAlpha3FromFeature = (feature: maptilersdk.GeoJSONFeature): string | undefined => {
  const props = (feature.properties ?? {}) as Record<string, unknown>;
  const alpha3Candidates = [
    props.iso_a3,
    props.iso3,
    props.adm0_a3,
    props.iso_a3_eh
  ];

  for (const candidate of alpha3Candidates) {
    if (typeof candidate === 'string' && candidate.length === 3) {
      return candidate;
    }
  }

  const numericCandidate = props.iso_n3 ?? feature.id;
  if (numericCandidate !== undefined && numericCandidate !== null) {
    return numericToAlpha3.get(String(Number(numericCandidate)));
  }

  return undefined;
};
const GlobePage = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const navigate = useNavigate();
  const stats = travelStats;
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    visits: typeof visitedCountries[0]['visits'];
  } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    const map = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
      center: [13.39, 30], // Centered on Europe/Mediterranean
      zoom: 1.5,
      minZoom: 1,
    });

    mapRef.current = map;

    map.on('load', function () {
      // Add the Countries dataset as a vector source
      map.addSource('countriesData', {
        type: 'vector',
        url: `https://api.maptiler.com/tiles/countries/tiles.json?key=${maptilersdk.config.apiKey}`
      });

      // Find the first symbol layer to place our layer below labels
      const layers = map.getStyle().layers;
      const firstSymbolId = layers?.find(layer => layer.type === 'symbol')?.id;

      // Add the countries layer with choropleth styling
      map.addLayer(
        {
          id: 'countries',
          source: 'countriesData',
          'source-layer': 'administrative',
          type: 'fill',
          filter: ['==', 'level', 0], // Only show country-level data
          paint: {
            'fill-color': [
              'case',
              ['==', ['id'], 208], // Denmark (home country)
              'rgba(156, 163, 175, 1)', // Gray-400 for home
              ['==', ['to-number', ['feature-state', 'visitCount']], 1],
              'rgba(219, 234, 254, 1)', // Slightly darker blue for 1 visit
              ['==', ['to-number', ['feature-state', 'visitCount']], 2],
              'rgba(191, 219, 254, 1)', // Adjusted blue for 2 visits
              ['==', ['to-number', ['feature-state', 'visitCount']], 3],
              'rgba(147, 197, 253, 1)', // Adjusted blue for 3 visits
              ['all', ['>=', ['to-number', ['feature-state', 'visitCount']], 4], ['<=', ['to-number', ['feature-state', 'visitCount']], 6]],
              'rgba(96, 165, 250, 1)', // Adjusted blue for 4-6 visits
              ['all', ['>=', ['to-number', ['feature-state', 'visitCount']], 7], ['<=', ['to-number', ['feature-state', 'visitCount']], 10]],
              'rgba(59, 130, 246, 1)', // Adjusted blue for 7-10 visits
              ['>=', ['to-number', ['feature-state', 'visitCount']], 11],
              'rgba(37, 99, 235, 1)', // Adjusted blue for 11+ visits
              'rgba(243, 244, 246, 1)' // Light gray for unvisited
            ],
            'fill-opacity': 0.8,
            'fill-outline-color': 'rgba(0, 0, 0, 0.2)'
          }
        },
        firstSymbolId
      );

      // Function to set feature states with visit count data
      function setCountryStates() {
        const countries = map.querySourceFeatures('countriesData', {
          sourceLayer: 'administrative',
          filter: ['all', ['==', 'level', 0]],
        });

        const countryData = getCountryData();

        countries.forEach(country => {
          if (country.id) {
            const alpha3Code = getAlpha3FromFeature(country);

            if (alpha3Code && countryData.has(alpha3Code)) {
              const data = countryData.get(alpha3Code)!;
              map.setFeatureState(
                {
                  source: 'countriesData',
                  sourceLayer: 'administrative',
                  id: country.id
                },
                {
                  visitCount: data.count
                }
              );
            }
          }
        });
      }

      // Keep states updated as new tiles load (important for small countries like Malta).
      function afterLoad() {
        if (map.getSource('countriesData') && map.isSourceLoaded('countriesData')) {
          setCountryStates();
        }
      }

      map.on('sourcedata', afterLoad);

      map.on('click', 'countries', function (e) {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const alpha3Code = getAlpha3FromFeature(feature);

          if (alpha3Code) {
            const countryData = getCountryData();
            const data = countryData.get(alpha3Code);

            if (data) {
              setSelectedCountry({
                name: data.name,
                visits: data.visits
              });
            }
          }
        }
      });

      // Change cursor on hover for visited countries
      map.on('mouseenter', 'countries', function (e) {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const visitCount = (feature.state as any)?.visitCount;

          if (visitCount && visitCount > 0) {
            map.getCanvas().style.cursor = 'pointer';
          }
        }
      });

      map.on('mouseleave', 'countries', function () {
        map.getCanvas().style.cursor = '';
      });
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/globe"
            className="flex items-center gap-2 text-slate-700 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Portfolio</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Travel Map</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-screen pt-16" />

      {/* Legend */}
      <div className="fixed bottom-8 right-8 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Visit Frequency</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: 'rgba(29, 78, 216, 1)' }} />
            <span className="text-xs text-gray-600">10+ visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 1)' }} />
            <span className="text-xs text-gray-600">7-10 visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: 'rgba(147, 197, 253, 1)' }} />
            <span className="text-xs text-gray-600">4-6 visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: 'rgba(191, 219, 254, 1)' }} />
            <span className="text-xs text-gray-600">3 visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: 'rgba(219, 234, 254, 1)' }} />
            <span className="text-xs text-gray-600">2 visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded" style={{ backgroundColor: 'rgba(239, 246, 255, 1)' }} />
            <span className="text-xs text-gray-600">1 visit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded border border-gray-300" style={{ backgroundColor: 'rgba(243, 244, 246, 1)' }} />
            <span className="text-xs text-gray-600">Not visited</span>
          </div>
        </div>
      </div>

      <Drawer shouldScaleBackground={false}>
        <DrawerTrigger asChild>
          <button className="fixed bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 border-2 border-white">
            <ChevronUp size={18} />
            Travel Stats
          </button>
        </DrawerTrigger>
        <DrawerContent className="border-slate-200 bg-white/95 backdrop-blur after:content-none">
          <DrawerTrigger asChild>
            <button className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow cursor-pointer">
              <ChevronDown size={18} />
            </button>
          </DrawerTrigger>
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Quick Travel Stats</h2>
                <p className="text-sm text-slate-500">A snapshot of your travel footprint.</p>
              </div>
              <Link to="/stats"
                className="flex items-center gap-1 rounded-full border-2 border-slate-200 px-4 py-2 text-md font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 bg-white hover:bg-gray-200"
              >
                View full stats page
                <ArrowLeft size={20} className="rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-xl border border-slate-200 bg-white p-2 text-center shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Countries</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{stats.totalCountries}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-2 text-center shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Trips</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{stats.totalVisits}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-2 text-center shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Regions</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{stats.totalRegions}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-2 text-center shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">Continents</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{stats.totalContinents}</p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-slate-900">Visits by Year</h3>
                  <p className="text-sm text-slate-500">Travel frequency at a glance.</p>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.visitsByYear} margin={{ left: 8, right: 8 }}>
                      <XAxis dataKey="year" tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                      <Tooltip
                        cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
                        contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }}
                      />
                      <Bar dataKey="visits" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hidden sm:block">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Coverage</h3>
                  <p className="text-sm text-slate-500">Visited vs total countries.</p>
                </div>
                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  {stats.worldCoverage.visited}/{stats.worldCoverage.total} · {stats.worldCoverage.percent}%
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stats.continentCoverage.map((continent) => (
                  <div key={continent.continent} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{continent.continent}</span>
                      <span className="font-semibold text-slate-900">{continent.percent}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-slate-900"
                        style={{ width: `${continent.percent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {continent.visited}/{continent.total} {continent.visited === 1 ? 'country' : 'countries'} visited
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Country Details Dialog */}
      <Dialog open={!!selectedCountry} onOpenChange={(open) => !open && setSelectedCountry(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedCountry?.name}
            </DialogTitle>
            {selectedCountry?.name !== 'Denmark' && (
              <DialogDescription>
              {selectedCountry?.visits.length} {selectedCountry?.visits.length === 1 ? 'visit' : 'visits'} to this country
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedCountry?.visits.map((visit, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900">{visit.region}</h4>
                  <span className="text-sm text-gray-500">{formatVisitDate(visit.date)}</span>
                </div>
                <hr className="border-t border-gray-200" />
                <p className="text-gray-600 text-sm">{visit.description}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobePage;
