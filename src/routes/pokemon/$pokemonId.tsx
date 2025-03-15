import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PokemonDetail } from "../../types/pokemon";
import { getPokemonById } from "../../utils/getPokemonById";
import { Suspense } from "react";

export const Route = createFileRoute("/pokemon/$pokemonId")({
  component: PokemonDetailComponent,
  loader: async ({ params }): Promise<{ pokemon: PokemonDetail }> => {
    const pokemon = await getPokemonById(
      `https://pokeapi.co/api/v2/pokemon/${params.pokemonId}/`
    );

    return { pokemon };
  },
  staleTime: Infinity,
});

function PokemonLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex justify-center items-center p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full">
        <div className="w-16 h-16 relative">
          <div className="w-full h-full border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xl font-bold text-gray-700">Loading Pokémon data...</p>
        <p className="text-gray-500 mt-2">Please wait while we search the Pokédex</p>
      </div>
    </div>
  );
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

// Function to get a background gradient based on Pokemon type
function getTypeGradient(types: Array<{type: {name: string}}>): string {
  if (types.length === 0) return "from-gray-100 to-gray-200";
  
  if (types.length === 1) {
    const type = types[0].type.name;
    switch(type) {
      case "fire": return "from-orange-400 to-red-500";
      case "water": return "from-blue-400 to-blue-600";
      case "grass": return "from-green-400 to-green-600";
      case "electric": return "from-yellow-300 to-yellow-500";
      case "ice": return "from-blue-200 to-blue-400";
      case "fighting": return "from-red-600 to-red-800";
      case "poison": return "from-purple-400 to-purple-600";
      case "ground": return "from-yellow-600 to-yellow-800";
      case "flying": return "from-indigo-200 to-indigo-400";
      case "psychic": return "from-pink-400 to-pink-600";
      case "bug": return "from-lime-400 to-green-500";
      case "rock": return "from-yellow-500 to-yellow-700";
      case "ghost": return "from-purple-600 to-purple-800";
      case "dragon": return "from-indigo-500 to-indigo-700";
      case "dark": return "from-gray-600 to-gray-800";
      case "steel": return "from-gray-400 to-gray-600";
      case "fairy": return "from-pink-300 to-pink-500";
      default: return "from-gray-100 to-gray-200";
    }
  }
  
  // If multiple types, use the first two types
  const type1 = types[0].type.name;
  const type2 = types[1].type.name;
  
  // Custom gradients for common type combinations
  if ((type1 === "fire" && type2 === "flying") || (type2 === "fire" && type1 === "flying")) {
    return "from-orange-400 to-indigo-300";
  }
  if ((type1 === "grass" && type2 === "poison") || (type2 === "grass" && type1 === "poison")) {
    return "from-green-400 to-purple-500";
  }
  if ((type1 === "water" && type2 === "flying") || (type2 === "water" && type1 === "flying")) {
    return "from-blue-400 to-indigo-300";
  }
  
  // Default to first type's gradient
  return getTypeGradient([{type: {name: type1}}]);
}

function PokemonDetailComponent() {
  const { pokemon } = Route.useLoaderData();
  
  // Calculate stats percentage (based on max stat value of 255 in games)
  const getStatPercentage = (value: number) => {
    return Math.min(Math.round((value / 255) * 100), 100);
  };

  return (
    <Suspense fallback={<PokemonLoadingFallback />}>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Pokedex header with back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => window.history.back()}
              className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-4">Pokédex Entry #{pokemon.id.toString().padStart(3, '0')}</h1>
          </div>

          {/* Main Pokemon card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border-2 border-gray-200">
            {/* Top section with image and basic info */}
            <div className={`bg-gradient-to-br ${getTypeGradient(pokemon.types)} p-8 relative`}>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-6 md:mb-0 flex flex-col items-center md:items-start">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white capitalize mb-2 drop-shadow-lg">
                    {pokemon.name}
                  </h2>
                  
                  <div className="flex gap-2 mb-4">
                    {pokemon.types.map((type) => {
                      const typeColor = getTypeColor(type.type.name);
                      return (
                        <span
                          key={type.type.name}
                          className={`${typeColor} px-4 py-1 rounded-full text-white text-sm font-medium shadow-md`}
                        >
                          {type.type.name}
                        </span>
                      );
                    })}
                  </div>
                  
                  <div className="p-3 bg-white bg-opacity-40 backdrop-blur-sm rounded-xl shadow-lg">
                    <div className="grid grid-cols-2 gap-4 text-gray-800">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="font-bold">Height: {pokemon.height / 10}m</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6L6 7M6 7L3 18L6 17M6 7L12 9M12 9L21 4M12 9L9 20M21 4L18 15M18 15L9 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span className="font-bold">Weight: {pokemon.weight / 10}kg</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-4 border-white border-opacity-30 rounded-full"></div>
                  </div>
                  <div className="relative z-10">
                    <img
                      src={
                        pokemon.sprites.other["official-artwork"].front_default ||
                        pokemon.sprites.front_default
                      }
                      alt={pokemon.name}
                      className="h-64 w-64 drop-shadow-2xl object-contain"
                    />
                  </div>
                </div>
              </div>
              
              {/* Decorative pokeball in background */}
              <div className="absolute -bottom-12 -right-12 opacity-10">
                <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50" fill="white" />
                  <path d="M50 0C77.6142 0 100 22.3858 100 50H0C0 22.3858 22.3858 0 50 0Z" fill="#FF0000" />
                  <circle cx="50" cy="50" r="12" stroke="black" strokeWidth="8" fill="white" />
                </svg>
              </div>
            </div>
            
            {/* Stats and abilities section */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stats section */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
                    Base Stats
                  </h3>
                  
                  <div className="space-y-4">
                    {pokemon.stats?.map((stat) => (
                      <div key={stat.stat.name} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {stat.stat.name.replace('-', ' ')}
                          </span>
                          <span className="text-sm font-bold text-gray-800">{stat.base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500" 
                            style={{ width: `${getStatPercentage(stat.base_stat)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Abilities and sprites section */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
                    Abilities
                  </h3>
                  
                  <ul className="mb-6 space-y-2">
                    {pokemon.abilities.map((ability) => (
                      <li
                        key={ability.ability.name}
                        className="flex items-center bg-gray-100 p-3 rounded-lg"
                      >
                        <div className="h-2 w-2 rounded-full bg-red-500 mr-3"></div>
                        <span className="capitalize font-medium">
                          {ability.ability.name.replace("-", " ")}
                          {ability.is_hidden && (
                            <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                              Hidden
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
                    Sprites
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
                      <img 
                        src={pokemon.sprites.front_default} 
                        alt={`${pokemon.name} front`}
                        className="w-24 h-24 object-contain"
                      />
                      <span className="text-xs text-gray-500">Front</span>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
                      <img 
                        src={pokemon.sprites.back_default} 
                        alt={`${pokemon.name} back`}
                        className="w-24 h-24 object-contain"
                      />
                      <span className="text-xs text-gray-500">Back</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mb-8">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Pokédex
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
