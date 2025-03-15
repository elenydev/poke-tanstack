import * as React from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pokemon, PokemonResponse } from "../types/pokemon";

export interface LoaderData {
  pokemons: Pokemon[];
  nextUrl: string | null;
}

// Helper function to get color classes based on Pokemon type
function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-orange-500",
    water: "bg-blue-500",
    electric: "bg-yellow-500",
    grass: "bg-green-500",
    ice: "bg-blue-300",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-700",
    flying: "bg-indigo-300",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-600",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-600",
    dark: "bg-gray-700",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
  };

  return typeColors[type] || "bg-gray-400";
}

const fetchPokemonTypes = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.types.map((type: { type: { name: string } }) => type.type.name);
};

export const Route = createFileRoute("/")({
  component: HomeRoute,
  loader: async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");
    const data: PokemonResponse = await response.json();

    // Extract IDs and fetch additional data for each Pokemon
    const pokemons = await Promise.all(
      data.results.map(async (pokemon) => {
        const id = pokemon.url
          .replace("https://pokeapi.co/api/v2/pokemon/", "")
          .replace("/", "");

        // Get Pokemon types
        const types = await fetchPokemonTypes(pokemon.url);

        return {
          ...pokemon,
          id: parseInt(id),
          types,
        };
      })
    );

    return {
      pokemons,
      nextUrl: data.next,
    };
  },
});

function HomeRoute() {
  const { pokemons: initialPokemons, nextUrl: initialNextUrl } =
    Route.useLoaderData();

  const [pokemons, setPokemons] = useState<
    Array<Pokemon & { types?: string[] }>
  >(initialPokemons);
  const [nextUrl, setNextUrl] = useState<string | null>(initialNextUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  const observerTarget = useRef(null);

  // Function to capitalize first letter of a string
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && nextUrl && !isLoading && !allLoaded) {
          setIsLoading(true);
          try {
            const response = await fetch(nextUrl);
            const data: PokemonResponse = await response.json();

            // Extract IDs and fetch additional data for each Pokemon
            const newPokemons = await Promise.all(
              data.results.map(async (pokemon) => {
                const id = pokemon.url
                  .replace("https://pokeapi.co/api/v2/pokemon/", "")
                  .replace("/", "");

                // Get Pokemon types
                const types = await fetchPokemonTypes(pokemon.url);

                return {
                  ...pokemon,
                  id: parseInt(id),
                  types,
                };
              })
            );

            setPokemons((prevPokemons) => [...prevPokemons, ...newPokemons]);
            setNextUrl(data.next);
            if (!data.next) {
              setAllLoaded(true);
            }
          } catch (error) {
            console.error("Error loading more Pokemon:", error);
          } finally {
            setIsLoading(false);
          }
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [nextUrl, isLoading, allLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Pokedex Header */}
      <header className="bg-gradient-to-b from-red-600 to-red-500 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <div className="mr-4 flex items-center">
              {/* Pokeball icon */}
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-white rounded-full"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-[2px] bg-gray-800"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-800"></div>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 rounded-t-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Pokédex</h1>
              <p className="text-red-100">Discover and explore Pokémon</p>
            </div>
            <div className="ml-auto flex space-x-2">
              {/* Decorative lights */}
              <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse delay-75"></div>
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Pokemon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {pokemons.map((pokemon) => (
            <Link
              key={pokemon.id}
              to="/pokemon/$pokemonId"
              params={{ pokemonId: pokemon.id?.toString() || "" }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border-2 border-gray-200 h-full flex flex-col">
                {/* Pokemon ID Badge */}
                <div className="absolute top-3 right-3 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                  #{pokemon.id?.toString().padStart(3, "0")}
                </div>
                
                {/* Pokemon Image */}
                <div className="p-6 flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 transition-colors group-hover:from-gray-100 group-hover:to-gray-200">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                    alt={pokemon.name}
                    className="h-36 w-36 object-contain transform transition-transform group-hover:scale-110"
                  />
                </div>
                
                {/* Pokemon Info */}
                <div className="p-4 flex-grow">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 capitalize">
                    {pokemon.name}
                  </h2>
                  
                  {/* Pokemon Types */}
                  {pokemon.types && (
                    <div className="flex flex-wrap gap-2">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`${getTypeColor(type)} px-3 py-1 rounded-full text-white text-xs font-medium`}
                        >
                          {capitalize(type)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* View Details Button */}
                <div className="px-4 pb-4 mt-auto">
                  <div className="bg-red-500 hover:bg-red-600 text-white text-center py-2 rounded-lg font-medium transition-colors group-hover:bg-red-600">
                    View Details
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Loading indicator/sentinel */}
        <div ref={observerTarget} className="py-8 flex justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16">
                <div className="w-full h-full rounded-full border-4 border-gray-200 border-t-red-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-700">Loading more Pokémon...</p>
            </div>
          ) : allLoaded ? (
            <div className="text-center p-4 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-gray-700 font-medium">All Pokémon loaded!</p>
              <p className="text-gray-500 text-sm mt-1">You've caught 'em all</p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
