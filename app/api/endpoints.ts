import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { api } from ".";
import cars from "~/constants/carMockData";
import { CARMAKE_DATA, CARMODEL_DATA } from "~/constants/brandsData";

export async function postData({
  formData,
  signal,
}: {
  formData: any;
  signal: AbortSignal;
}) {
  try {
    const response = await api.post("/posts", formData, { signal });
    return response;
  } catch (e: any) {
    throw new Error("Error, try again later");
  }
}

export async function searchLocation({
  params,
  signal,
}: {
  params: { q: string; size: string };
  signal: AbortSignal;
}) {
  try {
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/search?&class=place&countrycodes=cr&format=jsonv2&${params}`,
      { signal }
    );
    return data ?? [];
  } catch (e: any) {
    throw new Error("Error, try again later");
  }
}

// Haversine Formula Function
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const R = 1; // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180); // deg2rad
  const dLon = (lon2 - lon1) * (Math.PI / 180); // deg2rad
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// Function to check if the point is within 5 kilometers radius
const isWithinRadius = (centerLat: number, centerLon: number, pointLat: number, pointLon: number, radius: number): boolean => {
  const distance = getDistanceFromLatLonInKm(centerLat, centerLon, pointLat, pointLon);
  return distance <= radius;
}

const sortProperties = (properties: Car[], sortBy: string): Car[] => {
  switch (sortBy) {
    case "price-asc":
      return properties.sort((a, b) => a.price - b.price);
    case "relevant":
      // Implement your relevance criteria sorting here, if applicable
      return properties; // Example: return properties.sort(...);
    case "newest":
      return properties.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    case "smallest":
      return properties.sort((a, b) => a.mileage - b.mileage);
    case "biggest":
      return properties.sort((a, b) => b.mileage - a.mileage);
    default:
      return properties; // Default to returning unsorted properties
  }
};
// Car interface
export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  mileage: number;
  color: string;
  description: string;
  features: string[];
  location: string;
  lat: number;
  lon: number;
  updated_at: string;
  updated_by: string;
  email: string;
  phone: string;
  promotional?: boolean;
  fuelType: string;
  displacement: number; // in cc (cubic centimeters)
  power: number; // in horsepower (HP)
  transmissionType: string;
  doors: number;
  drivetrain: string;
  equipment: string[];
}

// Interface for filter criteria
export interface FilterCriteria {
  category?: string;
  price_from?: number;
  price_to?: number;
  mileage_from?: number;
  mileage_to?: number;
  year_from?: number;
  year_to?: number;
  make?: string;
  model?: string;
  color?: string;
  promotional?: boolean;
  lat?: number;
  lng?: number;
  radius?: number; // Radius in kilometers for proximity filtering
  features?: string[];
  sort?: string;
  page?: number;
  size?: number;
}

// Mock Axios instance
const fakeAxios = {
  get: async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Car | Car[]>> => {
    if (url.includes('/cars')) {
      const urlParts = url.split('/');
      const carId = urlParts[urlParts.length - 1];
      
      // Handling single car request by ID
      if (carId !== 'cars' && carId !== 'filter') {
        const car = cars.find(car => car.id === parseInt(carId));
        if (car) {
          return {
            data: car,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          };
        } else {
          return {
            data: {} as Car,
            status: 404,
            statusText: 'Not Found',
            headers: {},
            config: {},
          };
        }
      } else {
        // Handling filtered list of cars
        const params = new URLSearchParams(config?.params as string);
        const criteria: FilterCriteria = {
          category: params.get('category') || undefined,
          price_from: params.get('price_from') ? parseFloat(params.get('price_from')!) : undefined,
          price_to: params.get('price_to') ? parseFloat(params.get('price_to')!) : undefined,
          mileage_from: params.get('mileage_from') ? parseFloat(params.get('mileage_from')!) : undefined,
          mileage_to: params.get('mileage_to') ? parseFloat(params.get('mileage_to')!) : undefined,
          year_from: params.get('year_from') ? parseInt(params.get('year_from')!) : undefined,
          year_to: params.get('year_to') ? parseInt(params.get('year_to')!) : undefined,
          make: params.get('make') || undefined,
          model: params.get('model') || undefined,
          color: params.get('color') || undefined,
          promotional: params.get('promotional') ? params.get('promotional') === 'true' : undefined,
          lat: params.get('lat') ? parseFloat(params.get('lat')!) : undefined,
          lng: params.get('lng') ? parseFloat(params.get('lng')!) : undefined,
          radius: params.get('radius') ? parseFloat(params.get('radius')!) : undefined,
          features: params.get('features') ? params.get('features')!.split(',') : undefined,
          sort: params.get('sort') || undefined,
          page: params.get('page') ? parseFloat(params.get('page')!) : 1,
          size: params.get('size') ? parseFloat(params.get('size')!) : 10, // Default size of 10 if not provided
        };

        let filteredCars = cars.filter(car => {
          // Apply filtering based on criteria
          if (criteria.category && car.category !== criteria.category) {
            return false;
          }
          if (criteria.price_from !== undefined && car.price < criteria.price_from) {
            return false;
          }
          if (criteria.price_to !== undefined && car.price > criteria.price_to) {
            return false;
          }
          if (criteria.mileage_from !== undefined && car.mileage < criteria.mileage_from) {
            return false;
          }
          if (criteria.mileage_to !== undefined && car.mileage > criteria.mileage_to) {
            return false;
          }
          if (criteria.year_from !== undefined && car.year < criteria.year_from) {
            return false;
          }
          if (criteria.year_to !== undefined && car.year > criteria.year_to) {
            return false;
          }
          if (criteria.make && car.make) {
            const current = CARMAKE_DATA.find((item) => item.id === criteria.make)
            if (current?.label !== car.make) {
              return false;
            }
          }
          if (criteria.model && car.model) {
            const current = CARMODEL_DATA.find((item) => item.id === criteria.model)
            if (current?.label !== car.model) {
              return false;
            }
          }
          if (criteria.color && car.color !== criteria.color) {
            return false;
          }
          if (criteria.promotional !== undefined && car.promotional !== criteria.promotional) {
            return false;
          }
          if (criteria.lat !== undefined && criteria.lng !== undefined && criteria.radius !== undefined) {
            const correctRadius = isWithinRadius(criteria.lat, criteria.lng, car.lat, car.lng, criteria.radius);
            if (!correctRadius) {
              return false;
            }
          }
          if (criteria.features && !criteria.features.every(feature => car.features.includes(feature))) {
            return false;
          }
          return true;
        });

        // Apply sorting if specified
        if (criteria.sort) {
          filteredCars = sortProperties(filteredCars, criteria.sort);
        }

        const totalResults = filteredCars.length; // Total results before pagination

        // Pagination logic
        const startIndex = (criteria.page - 1) * criteria.size;
        const endIndex = startIndex + criteria.size;
        filteredCars = filteredCars.slice(startIndex, endIndex);

        // Prepare response object with pagination info
        const totalPages = Math.ceil(totalResults / criteria.size); // Total pages
        const responseObj = {
          page: criteria.page,
          size: criteria.size,
          total: totalResults,
          results: filteredCars,
        };

        return {
          data: responseObj,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        };
      }
    }

    // Default case if the URL does not match known patterns
    return {
      data: {} as Car,
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config: {},
    };
  }
};


export async function getSearchResults({
  params,
  signal,
}: {
  params: URLSearchParams;
  signal: AbortSignal;
}) {
  try {
    const { data } = await fakeAxios.get('/cars', { params: params.toString(), signal });
    return data ?? [];
  } catch (e: any) {
    throw new Error("Error, try again later");
  }
}

export async function getProductById({
  id,
  signal,
}: {
  id: string;
  signal: AbortSignal;
}) {
  try {
    const { data } = await fakeAxios.get(`/cars/${id}`, { signal });
     return data ?? {};
  } catch (e: any) {
    throw new Error("Error, try again later");
  }
}
