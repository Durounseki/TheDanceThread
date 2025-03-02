import { useQuery } from "@tanstack/react-query";
import { Country, State, City } from "country-state-city";
import { v4 as uuidv4 } from "uuid";

const apiUrl = import.meta.env.VITE_API_URL;

export const useDanceStyles = () => {
  return useQuery({
    queryKey: ["danceStyles"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/styles`);
      if (!response.ok) {
        console.log("Error fetching dance styles");
        return null;
      }
      const data = await response.json();
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const countries = Country.getAllCountries();
      const data = countries.map((country) => ({
        id: uuidv4(),
        name: country.name,
        code: country.isoCode,
      }));
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useCities = (countryCode) => {
  return useQuery({
    queryKey: ["cities", countryCode],
    queryFn: async () => {
      const cities = City.getCitiesOfCountry(countryCode);
      if (cities) {
        const data = cities.map((city) => ({
          id: uuidv4(),
          name:
            city.name +
            ", " +
            State.getStateByCodeAndCountry(city.stateCode, countryCode).name,
        }));
        return data;
      } else {
        return [];
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useCsrfToken = () => {
  return useQuery({
    queryKey: ["csrfToken"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/csrf`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        console.log("Error fetching dance styles");
        return "";
      }
      const data = await response.json();
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
