import { cache } from "react";
import { PokemonDetail } from "../types/pokemon";


const retrievePokemonById = async (pokemonUrl: string) => {
  try {
    const response = await fetch(pokemonUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon list');
    }
    const data = await response.json() as PokemonDetail;
    return data;
  }
  catch (error) {
    throw error;
  }
}

// In order to enable caching - we need to use RSC
export const getPokemonById = cache(async (pokemonUrl: string) => await retrievePokemonById(pokemonUrl));
