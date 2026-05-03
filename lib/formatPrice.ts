/**
 * Formats a numeric value or string with dots as thousands separators.
 * Example: 1000 -> 1.000, "1500000" -> 1.500.000
 */
export const formatPrice = (val: string | number | undefined | null) => {
  if (val === undefined || val === null || val === "") return "";

  //TODO: use react-intl or currency.js
  
  // If it's a string, we strip non-numeric characters first (except for the case where we want to keep existing digits)
  const strVal = typeof val === "number" 
    ? val.toString() 
    : val.toString().replace(/[^0-9]/g, "");
    
  return strVal.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
