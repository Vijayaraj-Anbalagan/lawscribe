import { IFIR } from "@/models/FIR";
import dbConnect from "@/lib/db/mongoose";
import { generateFIRNumber } from "@/lib/error-handling";

/**
 * Process and save FIR data to MongoDB
 */
export async function saveFIR(data: Partial<IFIR>) {
  await dbConnect();
  
  // If no FIR number is provided, generate one
  if (!data.firNumber) {
    // Extract station code from police station name or use default
    const stationCode = extractStationCode(data.policeStationName || "");
    // Extract district code from location or use default
    const districtCode = extractDistrictCode(data.incidentLocation || "");
    
    data.firNumber = generateFIRNumber(stationCode, districtCode);
  }
  
  // Set status to 'draft' if not provided
  if (!data.status) {
    data.status = 'draft';
  }
  
  // Set timestamps
  const now = new Date();
  if (!data.createdAt) {
    data.createdAt = now;
  }
  data.updatedAt = now;
  
  // For a real application, this would make a call to the MongoDB model
  // Example:
  // const FIRModel = mongoose.model('FIR');
  // const newFIR = new FIRModel(data);
  // return await newFIR.save();
  
  // For this demo, we'll simulate the save operation
  console.log("Saving FIR to MongoDB:", data);
  return { ...data, id: `FIR${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` };
}

/**
 * Extract a station code from a police station name
 */
function extractStationCode(stationName: string): string {
  // In a real application, this would use a mapping of station names to codes
  // For this demo, we'll create a simple abbreviation
  if (!stationName) return "PS";
  
  const words = stationName.split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase();
  }
  
  // Create an abbreviation from the first letter of each word
  return words.map(word => word[0]).join("").toUpperCase();
}

/**
 * Extract a district code from a location
 */
function extractDistrictCode(location: string): string {
  // In a real application, this would use geocoding or a mapping of locations to district codes
  // For this demo, we'll create a simple abbreviation
  if (!location) return "UNK";
  
  // Check for common Indian cities
  const cities = [
    { name: "Delhi", code: "DL" },
    { name: "Mumbai", code: "MH" },
    { name: "Kolkata", code: "KL" },
    { name: "Chennai", code: "CN" },
    { name: "Bangalore", code: "BG" },
    { name: "Hyderabad", code: "HY" },
    { name: "Ahmedabad", code: "AH" },
    { name: "Pune", code: "PN" },
    { name: "Jaipur", code: "JP" },
    { name: "Lucknow", code: "LK" },
    { name: "Bhopal", code: "BP" },
    { name: "Indore", code: "IN" },
    { name: "Patna", code: "PT" },
    { name: "Chandigarh", code: "CH" },
    { name: "Surat", code: "ST" },
    { name: "Kochi", code: "KC" },
    { name: "Guwahati", code: "GW" },
    { name: "Nagpur", code: "NG" },
  ];
  
  for (const city of cities) {
    if (location.toLowerCase().includes(city.name.toLowerCase())) {
      return city.code;
    }
  }
  
  // Default to the first two characters of the location
  return location.substring(0, 2).toUpperCase();
}

/**
 * Process search parameters for MongoDB query
 */
export interface SearchParams {
  searchTerm?: string;
  date?: string;
  status?: string;
  section?: string;
  officerRank?: string;
}

export function buildSearchQuery(params: Record<string, unknown>) {
  const query: Record<string, unknown> = {};
  
  // Text search
  if (params.searchTerm) {
    query.$text = { $search: params.searchTerm };
  }
  
  // Date search
  if (params.date && typeof params.date === 'string') {
    const date = new Date(params.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    
    query.incidentDate = { 
      $gte: date,
      $lt: nextDay
    };
  }
  
  // Status search
  if (params.status) {
    query.status = params.status;
  }
  
  // Legal section search
  if (params.section) {
    query["legalSections.section"] = { $regex: params.section, $options: "i" };
  }
  
  // Officer rank search
  if (params.officerRank) {
    query.officerRank = params.officerRank;
  }
  
  return query;
}

/**
 * Process sort parameters for MongoDB query
 */
export function buildSortOptions(column: string, direction: 'asc' | 'desc') {
  const sortDirection = direction === 'asc' ? 1 : -1;
  
  // Map front-end column names to MongoDB field names
  const sortMapping: Record<string, string> = {
    incidentDate: 'incidentDate',
    status: 'status',
    createdAt: 'createdAt',
    complainantName: 'complainantName',
  };
  
  const sortField = sortMapping[column] || 'createdAt';
  
  return { [sortField]: sortDirection };
}

/**
 * Format FIR data for display in the UI
 */
export function formatFIRForDisplay(fir: Partial<IFIR>) {
  return {
    ...fir,
    incidentDate: fir.incidentDate ? new Date(fir.incidentDate) : undefined,
    createdAt: fir.createdAt ? new Date(fir.createdAt) : undefined,
    updatedAt: fir.updatedAt ? new Date(fir.updatedAt) : undefined,
  };
}