/**
 * Mapping from ISO Alpha-3 codes to ISO Numeric codes (iso_n3)
 * Used to match our visited countries data with MapTiler Countries dataset
 */
export const alpha3ToNumeric: Record<string, string> = {
    'DNK': '208', // Denmark
    'SWE': '752', // Sweden
    'DEU': '276', // Germany
    'FRA': '250', // France
    'ESP': '724', // Spain
    'ITA': '380', // Italy
    'NLD': '528', // Netherlands
    'GRC': '300', // Greece
    'HUN': '348', // Hungary
    'SRB': '688', // Serbia
    'GBR': '826', // United Kingdom
    'PRT': '620', // Portugal
    'AUT': '040', // Austria
    'JOR': '400', // Jordan
    'CYP': '196', // Cyprus
    'TUR': '792', // Turkey
    'USA': '840', // United States
    'BHS': '044', // The Bahamas
    'ARE': '784', // United Arab Emirates
    'SGP': '702', // Singapore
    'THA': '764', // Thailand
    'MYS': '458', // Malaysia
    'IDN': '360', // Indonesia
    'MDV': '462', // Maldives
    'LKA': '144', // Sri Lanka
    'MAR': '504', // Morocco
    'ISL': '352', // Iceland
};
