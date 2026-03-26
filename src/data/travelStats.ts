import {
  CONTINENT_TOTALS,
  WORLD_TOTAL_COUNTRIES,
  getContinentForCountryId,
  visitedCountries
} from "./visitedCountries";

export type VisitPoint = {
  countryId: string;
  country: string;
  flag: string;
  region: string;
  date: string;
};

export type YearVisits = { year: string; visits: number };
export type CountryVisits = { country: string; flag: string; label: string; visits: number };
export type ContinentVisits = { continent: string; visits: number; countries: number };
export type RegionVisits = { region: string; visits: number };
export type RecentVisit = { country: string; flag: string; region: string; date: string };
export type ContinentCoverage = { continent: string; visited: number; total: number; percent: number };
export type WorldCoverage = { visited: number; total: number; percent: number };

const allVisits: VisitPoint[] = visitedCountries.flatMap((country) =>
  country.visits.map((visit) => ({
    countryId: country.id,
    country: country.name,
    flag: country.flag,
    region: visit.region,
    date: visit.date
  }))
);

const splitRegions = (region: string): string[] => {
  return region
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
};

const getYearFromDate = (dateStr: string): number | null => {
  const match = /^\d{4}/.exec(dateStr);
  if (!match) return null;
  return Number(match[0]);
};

const parseDateToNumber = (dateStr: string): number | null => {
  const year = getYearFromDate(dateStr);
  if (year === null) return null;
  const parts = dateStr.split("-").map((p) => Number(p));
  const month = parts[1] ? parts[1] - 1 : 0;
  const day = parts[2] || 1;
  return new Date(year, month, day).getTime();
};

const toSortedArray = <T>(map: Map<string, number>, key: "country" | "region" | "continent"): T[] => {
  return Array.from(map.entries())
    .map(([label, visits]) => ({ [key]: label, visits }) as T)
    .sort((a: any, b: any) => b.visits - a.visits);
};

export const travelStats = (() => {
  const totalCountries = visitedCountries.length;
  const totalVisits = allVisits.length;

  const regions = new Set(allVisits.flatMap((visit) => splitRegions(visit.region)));
  const totalRegions = regions.size;

  const continentCounts = new Map<string, number>();
  const continentCountryCounts = new Map<string, number>();
  const visitedCountriesByContinent = new Map<string, number>();

  visitedCountries.forEach((country) => {
    const continent = getContinentForCountryId(country.id) ?? "Unknown";
    continentCountryCounts.set(
      continent,
      (continentCountryCounts.get(continent) || 0) + 1
    );

    continentCounts.set(
      continent,
      (continentCounts.get(continent) || 0) + country.visits.length
    );

    visitedCountriesByContinent.set(
      continent,
      (visitedCountriesByContinent.get(continent) || 0) + 1
    );
  });

  const totalContinents = continentCountryCounts.size;

  const visitsByYear = new Map<string, number>();
  allVisits.forEach((visit) => {
    const year = getYearFromDate(visit.date);
    if (!year) return;
    const key = String(year);
    visitsByYear.set(key, (visitsByYear.get(key) || 0) + 1);
  });

  const sortedVisitsByCountry: CountryVisits[] = visitedCountries
    .map((country) => ({
      country: country.name,
      flag: country.flag,
      label: `${country.flag} ${country.name}`,
      visits: country.visits.length
    }))
    .sort((a, b) => b.visits - a.visits);

  const visitsByRegion = new Map<string, number>();
  allVisits.forEach((visit) => {
    splitRegions(visit.region).forEach((region) => {
      visitsByRegion.set(region, (visitsByRegion.get(region) || 0) + 1);
    });
  });

  const sortedVisitsByYear: YearVisits[] = Array.from(visitsByYear.entries())
    .map(([year, visits]) => ({ year, visits }))
    .sort((a, b) => Number(a.year) - Number(b.year));

  const sortedVisitsByRegion = toSortedArray<RegionVisits>(visitsByRegion, "region");

  const visitsByContinent: ContinentVisits[] = Array.from(continentCounts.entries())
    .map(([continent, visits]) => ({
      continent,
      visits,
      countries: continentCountryCounts.get(continent) || 0
    }))
    .sort((a, b) => b.visits - a.visits);

  const continentCoverage: ContinentCoverage[] = Object.entries(CONTINENT_TOTALS)
    .map(([continent, total]) => {
      const visited = visitedCountriesByContinent.get(continent) || 0;
      const percent = total > 0 ? Math.round((visited / total) * 100) : 0;
      return {
        continent,
        visited,
        total,
        percent
      };
    })
    .sort((a, b) => b.percent - a.percent);

  const worldCoverage: WorldCoverage = {
    visited: totalCountries,
    total: WORLD_TOTAL_COUNTRIES,
    percent: Math.round((totalCountries / WORLD_TOTAL_COUNTRIES) * 100)
  };

  const mostVisitedCountry = sortedVisitsByCountry[0];
  const mostVisitedRegion = sortedVisitsByRegion[0];
  const mostVisitedYear = sortedVisitsByYear.slice().sort((a, b) => b.visits - a.visits)[0];

  const recentVisits: RecentVisit[] = allVisits
    .map((visit) => ({
      country: visit.country,
      flag: visit.flag,
      region: visit.region,
      date: visit.date,
      order: parseDateToNumber(visit.date)
    }))
    .filter((visit) => visit.order !== null)
    .sort((a, b) => (b.order || 0) - (a.order || 0))
    .slice(0, 10)
    .map(({ country, flag, region, date }) => ({ country, flag, region, date }));

  return {
    totalCountries,
    totalVisits,
    totalRegions,
    totalContinents,
    visitsByYear: sortedVisitsByYear,
    visitsByCountry: sortedVisitsByCountry,
    visitsByContinent,
    worldCoverage,
    continentCoverage,
    topRegions: sortedVisitsByRegion.slice(0, 12),
    topCountries: sortedVisitsByCountry.slice(0, 10),
    mostVisitedCountry,
    mostVisitedRegion,
    mostVisitedYear,
    recentVisits
  };
})();
