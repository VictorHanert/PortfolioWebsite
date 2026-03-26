export interface VisitedCountry {
    id: string;
    name: string;
    visits: {
        date: string;
        region: string;
        description: string;
    }[];
}

// Normalize, dedupe and sort automatically when exporting visitedCountries
export const RAW_VISITED_COUNTRIES: VisitedCountry[] = [
    { id: 'AUT', name: 'Austria', visits: [ { date: '2018-02', region: 'Wagrain', description: 'Alpine skiing and winter sports paradise' } ] },
    { id: 'CYP', name: 'Cyprus', visits: [ { date: '?', region: 'Cyprus', description: 'Mediterranean island with beaches and mountains' } ] },
    {
        id: 'DNK',
        name: 'Denmark',
        visits: [
            { date: 'Home 🇩🇰', region: 'Denmark', description: 'Born and raised in Denmark. The home where it all started!' }
        ]
    },
    { id: 'FRA', name: 'France', 
        visits: [ 
            { date: '?', region: 'Nice', description: 'Local city house' }, 
            { date: '?', region: 'Nice', description: 'Local city house back for second time' }, 
            { date: '2015-10', region: 'Nice', description: 'Fall getaway - Beautiful Mediterranean coast with stunning architecture' }, 
            { date: '2016-06', region: 'Paris', description: 'The city of lights - perfect for inspiration' }, 
            { date: '2017-07', region: 'Vidauban', description: 'Family house with pool, relax and fun' } 
        ] 
    },
    { id: 'DEU', name: 'Germany', visits: [ { date: '2015-09', region: 'Berlin', description: 'Cultural and historical monuments with my grandparents' } ] },
    { id: 'GRC', name: 'Greece', 
        visits: [ 
            { date: '?', region: 'Crete', description: 'The largest Greek island with stunning beaches and ancient ruins' }, 
            { date: '?', region: 'Serifos, Naxos, Sifnos', description: 'Charming Greek island hopping with beautiful beaches and traditional villages' },
            { date: '2015-07', region: 'Thassos', description: 'Beautiful Greek island with crystal-clear waters and charming villages' }, 
            { date: '2022-07', region: 'Sarti', description: 'Relaxing beach vacation in Greek mainland, staying at luxury camping resort with father and brother' },
            { date: '2023-02', region: 'Athens, Kos, Rhodes, Simi, Nisiros', description: 'Island hopping adventure with stunning landscapes and rich history' } 
        ] 
    },
    { id: 'HUN', name: 'Hungary', visits: [ { date: '2024-05', region: 'Budapest', description: 'Thermal baths and vibrant city culture and night life with the boys.' } ] },
    { id: 'ISL', name: 'Iceland', visits: [ { date: '2016-09', region: 'Reykjavik', description: 'Northern lights, geysers, and volcanic landscapes with my mother.' } ] },
    { id: 'IDN', name: 'Indonesia', visits: [ { date: '2015-02', region: 'Bali, Lombok', description: 'Island paradise with rice terraces and beaches' } ] },
    {
        id: 'ITA', name: 'Italy',
        visits: [
            { date: '?', region: 'Orsa', description: 'Old town with the family, birthday trip' },
            { date: '?', region: 'Sicily', description: 'Island paradise fall-vacation' },
            { date: '?', region: 'Pisa', description: 'City with the Leaning Tower' },
            { date: '?', region: 'Milano', description: '' },
            { date: '?', region: 'Sicily', description: 'Island paradise fall-vacation' },
            { date: '?', region: 'Bari, Alberobello, Lecce', description: 'Vactation' },
            { date: '?', region: 'Livigno', description: 'Alpine resort town ski-trip, with stunning mountain views with father' },
            { date: '2014-04', region: 'Rome', description: 'History, food, and beautiful culture' },
            { date: '2014-07', region: 'Capalonga Camping, Venice', description: 'Relaxing beach vacationa at the camping with family, and a day trip to Venice to see the canals and architecture' },
            { date: '2016-10', region: 'Verona', description: 'Youth football tournament "Verona Cup" with my team' },
            { date: '2019-07', region: 'Naples, Ischia, Tropea, Amalfi Coast', description: 'Getaway to the Amalfi Coast and Pompeii' },
            { date: '2021-08', region: 'Rivoltella del Garda', description: 'Summer vacation to see the area where we want to buy a house with father, brother and sister.' },
            { date: '2021-12', region: 'Rivoltella del Garda', description: 'Winter trip to see "summer-houses" to buy with my father' },
            { date: '2022-04', region: 'Verona, Rivoltella del Garda', description: 'Spring trip to see Måneskin concert in Verona, and relaxing by the lake in Desenzano del Garda' },
            { date: '2023-01', region: 'Rome', description: 'Shopping, sightseeing and food in the Italian capital with my girlfriend' },
            { date: '2024-05', region: 'Rome, Santa Marinella', description: 'See football in Rome with my dad, brother and sister, and relax at the beach in Santa Marinella' },
            { date: '2024-07', region: 'Toscana, Florence, Pisa', description: 'Wineyards, rolling hills and charming villages. And day trips to Florence and Pisa to see the tourism cities.' },
            { date: '2025-04', region: 'Bologna', description: 'Beautiful city with great food.' },
            { date: '2025-10', region: 'Venice', description: 'The floating city with canals and romantic bridges' }
        ]
    },
    { id: 'JOR', name: 'Jordan', visits: [ { date: '2019-02', region: 'Amman, Petra, Wadi Rum', description: 'Ancient wonders and desert landscapes. Seeing Petra and staying by the beach.' } ] },
    { id: 'MDV', name: 'Maldives', visits: [ { date: '2020-01', region: 'Maldives', description: 'Tropical paradise with crystal waters and resorts. Fulidhoo, Malé, Thinadoo' } ] },
    { id: 'MLT', name: 'Malta', visits: [ { date: '2014-06', region: 'Malta', description: 'Mediterranean island with rich history and stunning coastline' } ] },
    { id: 'MYS', name: 'Malaysia', visits: [ { date: '2010-04', region: 'Kuala Lumpur', description: 'Vibrant capital with modern architecture and rich culture' } ] },
    { id: 'MAR', name: 'Morocco', visits: [ { date: '2025-03', region: 'Marrakech', description: 'Exotic medinas, palaces, and Sahara getaway with my girlfriend' } ] },
    { id: 'NLD', name: 'Netherlands', 
        visits: [ 
            { date: '2016-08', region: 'Amsterdam', description: 'Canals, culture, and vibrant city life with my mother and brother' }, 
            { date: '2017-10', region: 'Amsterdam', description: 'Canals, culture, and vibrant city life - school trip' } 
        ] 
    },
    { id: 'PRT', name: 'Portugal', 
        visits: [ 
            { date: '?', region: 'Azores', description: 'Remote archipelago with volcanic landscapes and whale watching' }, 
            { date: '2018-10', region: 'Lisbon', description: 'Historic tiles and colorful hillside neighborhoods with mother and brother' }, 
            { date: '2022-10', region: 'Faro', description: 'Southern Portugal with beautiful coastline, visiting on the way to Sevilla' },
            { date: '2024-01', region: 'Madeira', description: 'Tropical island with mountain trekking and coastal views' } 
        ] 
    },
    { id: 'SRB', name: 'Serbia', visits: [ { date: '2025-04', region: 'Belgrade', description: 'Vibrant nightlife and historic landmarks with the boys' } ] },
    { id: 'SGP', name: 'Singapore', visits: [ { date: '2010-11', region: 'Singapore', description: 'Modern city-state with diverse cultures' } ] },
    { id: 'ESP', name: 'Spain', 
        visits: [ 
            { date: '2014-07', region: 'Costa Brava, Barcelona', description: 'Youth football tournament with my team, and a day trip to Barcelona to see the football match at Camp Nou' },
            { date: '2014-07', region: 'Barcelona', description: 'Amazing architecture and Mediterranean vibes' }, 
            { date: '2014-07', region: 'Mallorca, Port de Soller', description: 'Trip to Soller with my family, enjoying the beach and local culture' },
            { date: '2015-10', region: 'Fuerteventura', description: 'Playitas sports resort and volcanic island beauty' }, 
            { date: '2016-07', region: 'Tossa de Mar, El Port de Selva', description: 'Vacation with family' }, 
            { date: '2016-11', region: 'Alicante', description: 'Costa Blanca paradise with beautiful coastline' }, 
            { date: '2017-07', region: 'Tenerife', description: 'Canary Islands volcano and beach paradise' }, 
            { date: '2018-07', region: 'Mallorca, Alcudia', description: 'Summer vacation to Alcudia, Palma and Pollenca with my family, enjoying the beach and food' },
            { date: '2019-11', region: 'Malaga', description: 'Whole family trip to celebrate birthdays, living in a villa in the mountains, Alora, with a pool and amazing views' }, 
            { date: '2021-08', region: 'Mallorca, Magaluf', description: 'Trip to Magaluf with my friends, enjoying the beach and nightlife' }, 
            { date: '2022-01', region: 'Gran Canaria', description: 'Island paradise in winter with mother and brother' },
            { date: '2022-07', region: 'Marbella', description: 'Luxury mansion with my friends, enjoying the beach and nightlife' }, 
            { date: '2022-10', region: 'Seville', description: 'Seeing Champions League football (Sevilla vs Copenhagen) with my father and brother, and enjoying the city' },
            { date: '2024-07', region: 'Mallorca, Cala\'dor', description: "Staying in luxury resort at Cala d'Or with my girlfriend and her family, enjoying the beach and food" }, 
            { date: '2025-12', region: 'Villarreal, Alicante', description: 'La Liga football city with local charm. Saw them playing against FC Copenhagen in the Champions League with my dad and brother' } 
        ] 
    },
    { id: 'LKA', name: 'Sri Lanka', visits: [ { date: '?', region: 'Sri Lanka', description: 'Mountains, tea plantations, and coastal beauty' } ] },
    { id: 'SWE', name: 'Sweden', 
        visits: [ 
            { date: '2008-10', region: 'Hjortsberga', description: 'Swedish countryside with my family in classic red cottage, enjoying the peaceful nature and local culture' }, 
            { date: '2009-10', region: 'Hjortsberga', description: 'Swedish countryside with my family in classic red cottage, enjoying the peaceful nature and local culture' }, 
            { date: '2013-06', region: 'Helsingborg', description: 'Laserdome with friends' }, 
            { date: '2014-06', region: 'Helsingborg', description: 'Laserdome with friends' }, 
            { date: '2012-10', region: 'Hjortsberga', description: 'Swedish countryside with my family in classic red cottage, enjoying the peaceful nature and local culture' }, 
            { date: '2014-10', region: 'Hjortsberga', description: 'Swedish countryside with my family in classic red cottage, enjoying the peaceful nature and local culture' }, 
            { date: '2014-11', region: 'Båstad', description: 'Family trip with spa hotel' }, 
            { date: '2022-08', region: 'Malmø', description: 'Amazing summer visit to the Venice of the North with my girlfriend' }, 
            { date: '2024-03', region: 'Helsingborg', description: 'Day visit to see the city with my girlfriend' }, 
            { date: '2025-02', region: 'Ystad', description: 'Relaxing spa getaway with my girlfriend' } 
        ] 
    },
    { id: 'THA', name: 'Thailand', 
        visits: [ 
            { date: '?', region: 'Bangkok, others', description: 'First trip to Thailand, only 6 years old' }, 
            { date: '?', region: 'Krabi, Langkawi', description: 'Tropical beaches and lush landscapes' }, 
            { date: '?', region: 'Bangkok, Koh Samui, Koh Phangan, Koh Tao', description: 'Amazing food, temples, and tropical islands' }, 
            { date: '2016-02', region: 'Ko Ngai, Coconut Island, Phuket, Bangkok', description: 'Tropical paradise with stunning beaches and vibrant culture with the family' },
            { date: '2026-01', region: 'Bangkok, Phuket, Khao Lak', description: 'Amazing food, temples, and tropical islands' } 
        ] 
    },
    { id: 'BHS', name: 'The Bahamas', visits: [ { date: '2015-03', region: 'Nassau', description: 'Stopping with the cruiseship. Tropical paradise with crystal-clear waters and pristine beaches' } ] },
    { id: 'TUR', name: 'Turkey', visits: [ { date: '?', region: 'Antalya', description: 'Turkish resort hotel. Didn\'t like because of food poisoning...' } ] },
    { id: 'ARE', name: 'United Arab Emirates', visits: [ { date: '?', region: 'Dubai', description: 'Futuristic skyline and desert adventures' } ] },
    { id: 'GBR', name: 'United Kingdom', 
        visits: [ 
            { date: '2017-01', region: 'London', description: 'Historic capital with iconic landmarks and museums' }, 
            { date: '2017-10', region: 'Manchester', description: 'Industrial heritage and vibrant music scene' } 
        ] 
    },
    { id: 'USA', name: 'United States', 
        visits: [ 
            { date: '2015-02', region: 'Miami Beach, Key West', description: 'Sun, beaches, and cruise ship adventures with the whole family' }, 
            { date: '2017-02', region: 'Puerto Rico', description: 'Caribbean charm with rainforests and beaches' } 
        ] 
    }
];

function parseDateToNumber(dateStr: string): number | null {
    // Accepts full ISO 'YYYY-MM-DD' or 'YYYY-MM' or 'YYYY'. Non-numeric dates return null.
    if (!/^[0-9]{4}/.test(dateStr)) return null;
    const parts = dateStr.split('-').map(p => Number(p));
    const year = parts[0] || 0;
    const month = parts[1] ? parts[1] - 1 : 0;
    const day = parts[2] || 1;
    return new Date(year, month, day).getTime();
}

function dedupeVisits(visits: VisitedCountry['visits']): VisitedCountry['visits'] {
    const seen = new Set<string>();
    const out: VisitedCountry['visits'] = [];
    for (const v of visits) {
        const key = `${v.date}||${v.region}||${v.description}`;
        if (!seen.has(key)) {
            seen.add(key);
            out.push(v);
        }
    }
    return out;
}

function sortVisitsByDateAsc(visits: VisitedCountry['visits']): VisitedCountry['visits'] {
    return visits.slice().sort((a, b) => {
        const da = parseDateToNumber(a.date);
        const db = parseDateToNumber(b.date);
        if (da === null && db === null) return a.region.localeCompare(b.region);
        if (da === null) return 1; // non-parseable go last
        if (db === null) return -1;
        return da - db; // oldest first (most recent last)
    });
}

function normalizeCountries(raw: VisitedCountry[]): VisitedCountry[] {
    const map = new Map<string, VisitedCountry & { visits: VisitedCountry['visits'] }>();
    for (const c of raw) {
        if (!map.has(c.id)) map.set(c.id, { ...c, visits: [...c.visits] });
        else map.get(c.id)!.visits.push(...c.visits);
    }

    const merged = Array.from(map.values()).map(c => ({
        id: c.id,
        name: c.name,
        visits: sortVisitsByDateAsc(dedupeVisits(c.visits))
    }));

    merged.sort((a, b) => a.name.localeCompare(b.name));
    return merged;
}

export const visitedCountries: VisitedCountry[] = normalizeCountries(RAW_VISITED_COUNTRIES);

// Helpful utilities if you want different sort orders later
export function getCountriesSortedByRegion(): VisitedCountry[] {
    return visitedCountries.map(c => ({ ...c, visits: c.visits.slice().sort((a, b) => a.region.localeCompare(b.region)) }));
}
