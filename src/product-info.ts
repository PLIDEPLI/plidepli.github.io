// Shared by the home hero, product page, launch signup and FAQ.
// $295 is the Kickstarter early-bird price: 78% of the later $378 price (22% off).
export const CAMPAIGN_PRICE = '$295'
export const LATER_PRICE = '$378'
export const EARLY_BIRD_SAVING = '22% off'

// Public contact listed in the September 24 product brochure.
export const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() || "lightfolding1@gmail.com"
