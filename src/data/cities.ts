// Geofenced SEO target metros — top 25, Florida-weighted + East Coast corridor.
// Drives /locations/[city] and /locations/[city]/[product]. Each city carries
// real data (metro population, coordinates, nearby areas) so programmatic pages
// render genuinely differentiated content + valid geo schema — no thin/dupe copy.
//
// NOTE: ReVia ships research compounds nationwide; these pages target local
// SEARCH INTENT ("research peptides [city]"), not a physical storefront. Copy
// stays research-use-only and informational.

export interface City {
  slug: string;
  name: string;
  state: string;
  stateAbbr: string;
  region: "Florida" | "East Coast";
  /** Metro-area population (approx, for copy + prioritization). */
  metroPopulation: number;
  lat: number;
  lng: number;
  /** Surrounding areas the page also speaks to (long-tail + uniqueness). */
  nearbyAreas: string[];
  /** One-line, human-written local angle — keeps hub intros non-duplicate. */
  angle: string;
}

export const CITIES: City[] = [
  // ───────────── Florida (home turf — Mike is SW FL) ─────────────
  { slug: "miami", name: "Miami", state: "Florida", stateAbbr: "FL", region: "Florida", metroPopulation: 6200000, lat: 25.7617, lng: -80.1918, nearbyAreas: ["Miami Beach", "Coral Gables", "Hialeah", "Doral", "Kendall"], angle: "South Florida's research and longevity hub" },
  { slug: "fort-lauderdale", name: "Fort Lauderdale", state: "Florida", stateAbbr: "FL", region: "Florida", metroPopulation: 1950000, lat: 26.1224, lng: -80.1373, nearbyAreas: ["Pompano Beach", "Hollywood", "Plantation", "Coral Springs"], angle: "Broward County's wellness corridor" },
  { slug: "west-palm-beach", name: "West Palm Beach", state: "Florida", stateAbbr: "FL", region: "Florida", metroPopulation: 1500000, lat: 26.7153, lng: -80.0534, nearbyAreas: ["Palm Beach", "Boca Raton", "Jupiter", "Wellington"], angle: "Palm Beach County longevity and performance" },
  { slug: "naples", name: "Naples", state: "Florida", stateAbbr: "FL", region: "Florida", metroPopulation: 400000, lat: 26.1420, lng: -81.7948, nearbyAreas: ["Bonita Springs", "Marco Island", "Estero", "Fort Myers"], angle: "Southwest Florida's premier wellness market" },
  { slug: "fort-myers", name: "Fort Myers", state: "Florida", stateAbbr: "FL", region: "Florida", metroPopulation: 790000, lat: 26.6406, lng: -81.8723, nearbyAreas: ["Cape Coral", "Estero", "Lehigh Acres", "Bonita Springs"], angle: "Lee County research and recovery community" },
  { slug: "tampa", name: "Tampa", state: "Florida", stateAbbr: "FL", region: "Florida", metroPopulation: 3200000, lat: 27.9506, lng: -82.4572, nearbyAreas: ["St. Petersburg", "Clearwater", "Brandon", "Wesley Chapel"], angle: "Tampa Bay's fast-growing performance scene" },
  { slug: "st-petersburg", name: "St. Petersburg", state: "Florida", stateAbbr: "FL", region: "Florida", metroPopulation: 3200000, lat: 27.7676, lng: -82.6403, nearbyAreas: ["Clearwater", "Largo", "Pinellas Park", "Tampa"], angle: "Pinellas County wellness and recovery" },
  { slug: "orlando", name: "Orlando", state: "Florida", stateAbbr: "FL", region: "Florida", metroPopulation: 2700000, lat: 28.5383, lng: -81.3792, nearbyAreas: ["Winter Park", "Kissimmee", "Lake Nona", "Sanford"], angle: "Central Florida's biotech and wellness growth" },
  { slug: "jacksonville", name: "Jacksonville", state: "Florida", stateAbbr: "FL", region: "Florida", metroPopulation: 1600000, lat: 30.3322, lng: -81.6557, nearbyAreas: ["Orange Park", "St. Augustine", "Ponte Vedra", "Fernandina Beach"], angle: "Northeast Florida's research and performance market" },
  { slug: "tallahassee", name: "Tallahassee", state: "Florida", stateAbbr: "FL", region: "Florida", metroPopulation: 390000, lat: 30.4383, lng: -84.2807, nearbyAreas: ["Crawfordville", "Quincy", "Monticello"], angle: "Florida's capital and university research center" },

  // ───────────── East Coast corridor ─────────────
  { slug: "atlanta", name: "Atlanta", state: "Georgia", stateAbbr: "GA", region: "East Coast", metroPopulation: 6100000, lat: 33.7490, lng: -84.3880, nearbyAreas: ["Marietta", "Alpharetta", "Sandy Springs", "Decatur"], angle: "The Southeast's biotech and performance capital" },
  { slug: "savannah", name: "Savannah", state: "Georgia", stateAbbr: "GA", region: "East Coast", metroPopulation: 410000, lat: 32.0809, lng: -81.0912, nearbyAreas: ["Pooler", "Hilton Head", "Richmond Hill"], angle: "Coastal Georgia's growing wellness community" },
  { slug: "charlotte", name: "Charlotte", state: "North Carolina", stateAbbr: "NC", region: "East Coast", metroPopulation: 2700000, lat: 35.2271, lng: -80.8431, nearbyAreas: ["Concord", "Gastonia", "Huntersville", "Rock Hill"], angle: "The Carolinas' fastest-growing metro" },
  { slug: "raleigh", name: "Raleigh", state: "North Carolina", stateAbbr: "NC", region: "East Coast", metroPopulation: 1500000, lat: 35.7796, lng: -78.6382, nearbyAreas: ["Durham", "Cary", "Chapel Hill", "Apex"], angle: "Research Triangle science and longevity" },
  { slug: "charleston", name: "Charleston", state: "South Carolina", stateAbbr: "SC", region: "East Coast", metroPopulation: 850000, lat: 32.7765, lng: -79.9311, nearbyAreas: ["Mount Pleasant", "North Charleston", "Summerville"], angle: "Lowcountry wellness and recovery" },
  { slug: "richmond", name: "Richmond", state: "Virginia", stateAbbr: "VA", region: "East Coast", metroPopulation: 1300000, lat: 37.5407, lng: -77.4360, nearbyAreas: ["Henrico", "Chesterfield", "Midlothian"], angle: "Central Virginia's research community" },
  { slug: "virginia-beach", name: "Virginia Beach", state: "Virginia", stateAbbr: "VA", region: "East Coast", metroPopulation: 1800000, lat: 36.8529, lng: -75.9780, nearbyAreas: ["Norfolk", "Chesapeake", "Hampton", "Newport News"], angle: "Hampton Roads performance and recovery" },
  { slug: "washington-dc", name: "Washington", state: "D.C.", stateAbbr: "DC", region: "East Coast", metroPopulation: 6300000, lat: 38.9072, lng: -77.0369, nearbyAreas: ["Arlington", "Alexandria", "Bethesda", "Silver Spring"], angle: "The capital region's science-forward market" },
  { slug: "baltimore", name: "Baltimore", state: "Maryland", stateAbbr: "MD", region: "East Coast", metroPopulation: 2800000, lat: 39.2904, lng: -76.6122, nearbyAreas: ["Towson", "Columbia", "Annapolis", "Glen Burnie"], angle: "Maryland's biomedical research hub" },
  { slug: "philadelphia", name: "Philadelphia", state: "Pennsylvania", stateAbbr: "PA", region: "East Coast", metroPopulation: 6200000, lat: 39.9526, lng: -75.1652, nearbyAreas: ["King of Prussia", "Cherry Hill", "Wilmington", "Camden"], angle: "The Northeast's pharma and research corridor" },
  { slug: "new-york", name: "New York", state: "New York", stateAbbr: "NY", region: "East Coast", metroPopulation: 19200000, lat: 40.7128, lng: -74.0060, nearbyAreas: ["Brooklyn", "Queens", "Jersey City", "Long Island"], angle: "The largest research and performance market in the country" },
  { slug: "newark", name: "Newark", state: "New Jersey", stateAbbr: "NJ", region: "East Coast", metroPopulation: 2100000, lat: 40.7357, lng: -74.1724, nearbyAreas: ["Jersey City", "Elizabeth", "Paterson", "Edison"], angle: "North Jersey's wellness and longevity market" },
  { slug: "boston", name: "Boston", state: "Massachusetts", stateAbbr: "MA", region: "East Coast", metroPopulation: 4900000, lat: 42.3601, lng: -71.0589, nearbyAreas: ["Cambridge", "Quincy", "Newton", "Somerville"], angle: "The country's leading biotech and life-science hub" },
  { slug: "providence", name: "Providence", state: "Rhode Island", stateAbbr: "RI", region: "East Coast", metroPopulation: 1600000, lat: 41.8240, lng: -71.4128, nearbyAreas: ["Warwick", "Pawtucket", "Cranston", "Fall River"], angle: "Southern New England's research community" },
  { slug: "hartford", name: "Hartford", state: "Connecticut", stateAbbr: "CT", region: "East Coast", metroPopulation: 1200000, lat: 41.7658, lng: -72.6734, nearbyAreas: ["West Hartford", "New Britain", "Manchester", "Farmington"], angle: "Central Connecticut's science and wellness market" },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}
