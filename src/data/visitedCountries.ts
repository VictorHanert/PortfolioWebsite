export interface VisitedCountry {
    id: string;
    name: string;
    visits: {
        date: string;
        region: string;
        description: string;
    }[];
}

export const visitedCountries: VisitedCountry[] = [
    {
        id: 'DNK',
        name: 'Denmark',
        visits: [
            {
                date: 'Home',
                region: 'Denmark',
                description: 'Born and raised in Denmark. The home where it all started!'
            },
        ]
    },
    {
        id: 'SWE',
        name: 'Sweden',
        visits: [
            {
                date: '2022-08',
                region: 'Malmø',
                description: 'Amazing summer visit to the Venice of the North with my girlfriend'
            }
        ]
    },
    {
        id: 'DEU',
        name: 'Germany',
        visits: [
            {
                date: '2015-09',
                region: 'Berlin',
                description: 'Cultural and historical monuments with my grandparents'
            }
        ]
    },
    {
        id: 'FRA',
        name: 'France',
        visits: [
            {
                date: '2016-06',
                region: 'Paris',
                description: 'The city of lights - perfect for inspiration'
            }
        ]
    },
    {
        id: 'ESP',
        name: 'Spain',
        visits: [
            {
                date: '2014-07',
                region: 'Barcelona',
                description: 'Amazing architecture and Mediterranean vibes'
            }
        ]
    },
    {
        id: 'ITA',
        name: 'Italy',
        visits: [
            {
                date: '2013-10',
                region: 'Rome',
                description: 'History, food, and beautiful culture'
            },
            {
                date: '2023-10',
                region: 'Rome',
                description: 'History, food, and beautiful culture'
            },
            {
                date: '2019-05',
                region: 'Venice',
                description: 'The floating city with canals and romantic bridges'
            },
            {
                date: '2018-09',
                region: 'Milano',
                description: 'Fashion capital and historic cathedral'
            },
            {
                date: '2018-08',
                region: 'Toscana',
                description: 'Rolling hills, vineyards, and Renaissance art'
            },
            {
                date: '2018-08',
                region: 'Pisa',
                description: 'Iconic leaning tower and beautiful piazza'
            },
            {
                date: '2018-08',
                region: 'Florence',
                description: 'Art renaissance epicenter with stunning museums'
            },
            {
                date: '2018-07',
                region: 'Verona',
                description: 'Romeo and Juliet\'s city with ancient architecture'
            },
            {
                date: '2018-07',
                region: 'Naples',
                description: 'Gateway to the Amalfi Coast and Pompeii'
            },
            {
                date: '2018-06',
                region: 'Sicily',
                description: 'Island paradise with Greek temples and pristine beaches'
            },
            {
                date: '2018-06',
                region: 'Sicily',
                description: 'Island paradise with Greek temples and pristine beaches'
            },
            {
                date: '2018-06',
                region: 'Livigno',
                description: 'Alpine resort town with stunning mountain views with father'
            }
        ]
    },
    {
        id: 'NLD',
        name: 'Netherlands',
        visits: [
            {
                date: '2017-10',
                region: 'Amsterdam',
                description: 'Canals, culture, and vibrant city life'
            },
            {
                date: '2016-08',
                region: 'Amsterdam',
                description: 'Canals, culture, and vibrant city life'
            }
        ]
    },
    {
        id: 'GRC',
        name: 'Greece',
        visits: [
            {
                date: '2023-02',
                region: 'Athens, Kos, Rhodes, Simi, Nisiros',
                description: 'Island hopping adventure with stunning landscapes and rich history'
            },
            {
                date: '2017-09',
                region: 'Thassos',
                description: 'Beautiful Greek island with crystal-clear waters and charming villages'
            },
            {
                date: '2016-09',
                region: 'Crete',
                description: 'The largest Greek island with stunning beaches and ancient ruins'
            }
        ]
    },
    {
        id: 'HUN',
        name: 'Hungary',
        visits: [
            {
                date: '2024-05',
                region: 'Budapest',
                description: 'Thermal baths and vibrant city culture with the boys.'
            }
        ]
    },
    {
        id: 'SRB',
        name: 'Serbia',
        visits: [
            {
                date: '2025-04',
                region: 'Belgrade',
                description: 'Vibrant nightlife and historic landmarks with the boys'
            }
        ]
    },
    {
        id: 'GBR',
        name: 'United Kingdom',
        visits: [
            {
                date: '2017-01',
                region: 'London',
                description: 'Historic capital with iconic landmarks and museums'
            },
            {
                date: '2017-10',
                region: 'Manchester',
                description: 'Industrial heritage and vibrant music scene'
            }
        ]
    },
    {
        id: 'PRT',
        name: 'Portugal',
        visits: [
            {
                date: '2019-09',
                region: 'Lisbon',
                description: 'Historic tiles and colorful hillside neighborhoods'
            },
            {
                date: '2024-01',
                region: 'Madeira',
                description: 'Tropical island with mountain trekking and coastal views'
            }
        ]
    },
    {
        id: 'ESP',
        name: 'Spain',
        visits: [
            {
                date: '2014-07',
                region: 'Barcelona',
                description: 'Amazing architecture and Mediterranean vibes'
            },
            {
                date: '2017-07',
                region: 'Tenerife',
                description: 'Canary Islands volcano and beach paradise'
            },
            {
                date: '2016-12',
                region: 'Gran Canaria',
                description: 'Year-round sunshine and diverse landscapes'
            },
            {
                date: '2015-10',
                region: 'Lanzarote',
                description: 'Playitas sports resort and volcanic island beauty'
            },
            {
                date: '2017-08',
                region: 'Seville',
                description: 'Flamenco culture and ornate architecture'
            },
            {
                date: '2017-05',
                region: 'Villarreal',
                description: 'La Liga football city with local charm'
            },
            {
                date: '2016-09',
                region: 'Malaga',
                description: 'Costa del Sol beaches and historic old town'
            },
            {
                date: '2016-10',
                region: 'Marbella',
                description: 'Luxury coastal resort and Mediterranean beaches'
            },
            {
                date: '2016-11',
                region: 'Alicante',
                description: 'Costa Blanca paradise with beautiful coastline'
            },
            {
                date: '2015-08',
                region: 'Mallorca',
                description: 'Balearic island with stunning coves and culture'
            }
        ]
    },
    {
        id: 'AUT',
        name: 'Austria',
        visits: [
            {
                date: '2018-02',
                region: 'Wagrain',
                description: 'Alpine skiing and winter sports paradise'
            }
        ]
    },
    {
        id: 'JOR',
        name: 'Jordan',
        visits: [
            {
                date: '2019-02',
                region: 'Aqaba',
                description: 'Red Sea diving and desert landscape gateway to see Petra (one of the new 7 wonders of the world)'
            }
        ]
    },
    {
        id: 'CYP',
        name: 'Cyprus',
        visits: [
            {
                date: '2014-06',
                region: 'Cyprus',
                description: 'Mediterranean island with beaches and mountains'
            }
        ]
    },
    {
        id: 'TUR',
        name: 'Turkey',
        visits: [
            {
                date: '2016-07',
                region: 'Alanya',
                description: 'Turkish Riviera with historical ruins and beaches'
            }
        ]
    },
    {
        id: 'USA',
        name: 'United States',
        visits: [
            {
                date: '2015-03',
                region: 'Miami',
                description: 'Sun, beaches, and vibrant nightlife'
            },
            {
                date: '2015-04',
                region: 'Puerto Rico',
                description: 'Caribbean charm with rainforests and beaches'
            }
        ]
    },
    {
        id: 'BHS',
        name: 'The Bahamas',
        visits: [
            {
                date: '2015-03',
                region: 'Nassau',
                description: 'Tropical paradise with crystal-clear waters and pristine beaches'
            }
        ]
    },
    {
        id: 'ARE',
        name: 'United Arab Emirates',
        visits: [
            {
                date: '2019-12',
                region: 'Dubai',
                description: 'Futuristic skyline and desert adventures'
            }
        ]
    },
    {
        id: 'SGP',
        name: 'Singapore',
        visits: [
            {
                date: '2015-11',
                region: 'Singapore',
                description: 'Modern city-state with diverse cultures'
            }
        ]
    },
    {
        id: 'MYS',
        name: 'Malaysia',
        visits: [
            {
                date: '2018-04',
                region: 'Kuala Lumpur',
                description: 'Vibrant capital with modern architecture and rich culture'
            }
        ]
    },
    {
        id: 'THA',
        name: 'Thailand',
        visits: [
            {
                date: '2026-01',
                region: 'Bangkok, Phuket, Khao Lak',
                description: 'Amazing food, temples, and tropical islands'
            }
        ]
    },
    {
        id: 'IDN',
        name: 'Indonesia',
        visits: [
            {
                date: '2015-02',
                region: 'Bali, Lombok',
                description: 'Island paradise with rice terraces and beaches'
            }
        ]
    },
    {
        id: 'MDV',
        name: 'Maldives',
        visits: [
            {
                date: '2020-01',
                region: 'Maldives',
                description: 'Tropical paradise with crystal waters and resorts'
            }
        ]
    },
    {
        id: 'LKA',
        name: 'Sri Lanka',
        visits: [
            {
                date: '2016-03',
                region: 'Sri Lanka',
                description: 'Mountains, tea plantations, and coastal beauty'
            }
        ]
    },
    {
        id: 'MAR',
        name: 'Morocco',
        visits: [
            {
                date: '2025-03',
                region: 'Marrakech',
                description: 'Exotic medinas, palaces, and Sahara gateway'
            }
        ]
    },
    {
        id: 'ISL',
        name: 'Iceland',
        visits: [
            {
                date: '2016-09',
                region: 'Reykjavik',
                description: 'Northern lights, geysers, and volcanic landscapes'
            }
        ]
    }
];
