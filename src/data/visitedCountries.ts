import { Ban } from "lucide-react";

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
                date: '2024-03',
                region: 'Helsingborg',
                description: 'Day visit to see the city with my girlfriend'
            },
            {
                date: '2022-08',
                region: 'Malmø',
                description: 'Amazing summer visit to the Venice of the North with my girlfriend'
            },
            {
                date: '2025-02',
                region: 'Ystad',
                description: 'Relaxing spa getaway with my girlfriend'
            },
            {
                date: '2014-11',
                region: 'Båstad',
                description: 'Family trip with spa hotel'
            },
            {
                date: '2014-10',
                region: 'Hjortsberga',
                description: 'Swedish countryside with my family in classic red cottage, enjoying the peaceful nature and local culture'
            },
            {
                date: '2014-06',
                region: 'Helsingborg',
                description: 'Laserdome with friends'
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
            },
            {
                date: '2017-07',
                region: 'Vidauban',
                description: 'Family house with pool, relax and fun'
            },
            {
                date: '2015-10',
                region: 'Nice',
                description: 'Fall getaway - Beautiful Mediterranean coast with stunning architecture'
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
                date: '2024-05',
                region: 'Rome and Santa Marinella',
                description: 'See football in Rome with my dad and brother and sister, and relax at the beach in Santa Marinella'
            },
            {
                date: '2025-10',
                region: 'Venice',
                description: 'The floating city with canals and romantic bridges'
            },
            {
                date: '2014-07',
                region: 'San Michele Al Tagliamento and Venice',
                description: 'Relaxing beach vacation with family, and a day trip to Venice to see the canals and architecture'
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
                date: '2016-07',
                region: 'Verona',
                description: 'Football tournament with my team'
            },
            {
                date: '2019-07',
                region: 'Naples, Ischia, Tropea, Amalfi Coast',
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
            },
            {
                date: '2025-04',
                region: 'Bologna',
                description: 'Beautiful city with great food.'
            },

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
            },
            {
                date: '2009-04',
                region: 'Azores',
                description: 'Remote archipelago with volcanic landscapes and whale watching'
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
                region: 'Fuerteventura',
                description: 'Playitas sports resort and volcanic island beauty'
            },
            {
                date: '2016-07',
                region: 'Tossa de Mar',
                description: 'Vacation with family'
            },
            {
                date: '2017-08',
                region: 'Seville',
                description: 'Flamenco culture and ornate architecture'
            },
            {
                date: '2025-12',
                region: 'Villarreal',
                description: 'La Liga football city with local charm. Saw them playing against FC Copenhagen in the Champions League with my dad and brother'
            },
            {
                date: '2019-11',
                region: 'Malaga',
                description: 'Whole family trip to celebrate birthdays, living in a villa in the mountains with a pool and amazing views'
            },
            {
                date: '2022-07',
                region: 'Marbella',
                description: 'Luxury mansion with my friends, enjoying the beach and nightlife'
            },
            {
                date: '2016-11',
                region: 'Alicante',
                description: 'Costa Blanca paradise with beautiful coastline'
            },
            {
                date: '2021-08',
                region: 'Mallorca',
                description: 'Trip to Magaluf with my friends, enjoying the beach and nightlife'
            },
            {
                date: '2024-07',
                region: 'Mallorca',
                description: 'Staying in luxury resort at Cala d\'Or with my girlfriend and her family, enjoying the beach and food'
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
        id: 'MLT',
        name: 'Malta',
        visits: [
            {
                date: '2014-06',
                region: 'Malta',
                description: 'Mediterranean island with rich history and stunning coastline'
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
                date: '2016-01',
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
                date: '2010-12',
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
                date: '2010-11',
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
                date: '2010-04',
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
            },
            {
                date: '2014-01',
                region: 'Bangkok, Koh Samui, Koh Phangan, Koh Tao',
                description: 'Amazing food, temples, and tropical islands'
            },
            {
                date: '2010-01',
                region: 'Krabi, Langkawi',
                description: 'Tropical beaches and lush landscapes'
            },
            {
                date: '2007-01-01',
                region: 'Bangkok and others',
                description: 'First trip to Thailand, only 6 years old'
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
                description: 'Exotic medinas, palaces, and Sahara gateway with my girlfriend'
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
                description: 'Northern lights, geysers, and volcanic landscapes with my mother.'
            }
        ]
    }
];
