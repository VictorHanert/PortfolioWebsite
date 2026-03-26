import { ArrowLeft, BarChart3, Compass, Crown, Globe2, History, MapPin, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { travelStats } from "../data/travelStats";
import { formatVisitDate } from "../lib/utils";

const continentColors = ["#3e92ed", "#16a34a", "#ea580c", "#9333ea", "#e11d48", "#d7e915"];

const StatsPage = () => {
  const stats = travelStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link
            to="/globe"
            className="flex items-center gap-2 text-slate-700 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Globe</span>
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <MapPin size={22} className="text-slate-700" />
            Travel Stats
          </h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 shadow-sm">
            <p className="text-xs sm:text-sm text-slate-500">Countries visited</p>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">{stats.totalCountries}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 shadow-sm">
            <p className="text-xs sm:text-sm text-slate-500">Total trips logged</p>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">{stats.totalVisits}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 shadow-sm">
            <p className="text-xs sm:text-sm text-slate-500">Regions/Cities explored</p>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">{stats.totalRegions}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 shadow-sm">
            <p className="text-xs sm:text-sm text-slate-500">Continents covered</p>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">{stats.totalContinents}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Globe2 size={18} className="text-slate-600" />
                World Coverage
              </h2>
              <p className="text-sm text-slate-500">Visited countries compared to global totals.</p>
            </div>
            <div className="text-sm font-medium text-slate-900">
              <p><b>{stats.worldCoverage.visited}/{stats.worldCoverage.total}</b> countries visited</p>
              <p><b>{stats.worldCoverage.percent}%</b> coverage</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.continentCoverage.map((continent) => (
              <div key={continent.continent} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">{continent.continent}</span>
                  <span className="text-sm text-slate-600">{continent.percent}%</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-slate-900"
                    style={{ width: `${continent.percent}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  {continent.visited}/{continent.total} countries visited
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <BarChart3 size={18} className="text-slate-600" />
                  Visits by Year
                </h2>
                <p className="text-sm text-slate-500">How travel frequency changed over time.</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.visitsByYear} margin={{ left: 8, right: 8 }}>
                  <XAxis dataKey="year" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "rgba(37, 99, 235, 0.1)" }} contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                  <Bar dataKey="visits" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Sparkles size={18} className="text-slate-600" />
              Highlights
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 px-3 py-1">
                <p className="text-slate-500">Most visited country</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {stats.mostVisitedCountry?.flag} {stats.mostVisitedCountry?.country} ({stats.mostVisitedCountry?.visits})
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-1">
                <p className="text-slate-500">Most repeated region</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {stats.mostVisitedRegion?.region} ({stats.mostVisitedRegion?.visits})
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-1">
                <p className="text-slate-500">Busiest year</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {stats.mostVisitedYear?.year} ({stats.mostVisitedYear?.visits})
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-1">
                <p className="text-slate-500">Slowest year</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {stats.leastVisitedYear?.year} ({stats.leastVisitedYear?.visits})
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Compass size={18} className="text-slate-600" />
              Visits by Continent
            </h2>
            <p className="text-sm text-slate-500">Trips distributed across continents.</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.visitsByContinent}
                    dataKey="visits"
                    nameKey="continent"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {stats.visitsByContinent.map((entry, index) => (
                      <Cell key={entry.continent} fill={continentColors[index % continentColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              {stats.visitsByContinent.map((continent) => (
                <div key={continent.continent} className="flex items-center justify-between">
                  <span>{continent.continent}</span>
                  <span className="font-medium text-slate-900">
                    {continent.visits} visit{continent.visits === 1 ? " " : "s "} / {continent.countries} countries
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Star size={18} className="text-slate-600" />
              Top Countries
            </h2>
            <p className="text-sm text-slate-500">Where you return most often.</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topCountries} layout="vertical" margin={{ left: 10, right: 10, top: 2, bottom: 2 }}>
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis
                    dataKey="label"
                    type="category"
                    width={140}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => String(value).replace(/ /g, "\u00A0")}
                  />
                  <Tooltip cursor={{ fill: "rgba(15, 23, 42, 0.08)" }} contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                  <Bar dataKey="visits" fill="#0f172a" radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Crown size={18} className="text-slate-600" />
              Top Regions/Cities
            </h2>
            <p className="text-sm text-slate-500">Most repeated cities or areas.</p>
            <div className="mt-4 space-y-3">
              {stats.topRegions.map((region, index) => (
                <div key={`${region.region}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="text-md text-slate-700">{region.region}</span>
                  <div><span className="text-sm font-semibold text-slate-900">{region.visits}</span> visits</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <History size={18} className="text-slate-600" />
              Recent Trips
            </h2>
            <p className="text-sm text-slate-500">Latest logged visits.</p>
            <div className="mt-4 space-y-3">
              {stats.recentVisits.map((visit, index) => (
                <div key={`${visit.country}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{visit.region}</span>
                    <span className="text-xs text-slate-500">{formatVisitDate(visit.date)}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {visit.flag} {visit.country}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatsPage;
