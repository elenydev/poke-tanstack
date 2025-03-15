import { cache } from "react";
import { PokemonListResponse } from "../types/pokemon";

const retrievePokemonsList = async (limit: number = 20, offset: number = 0) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon list');
    }
    const data = await response.json() as PokemonListResponse;
    return data;
  }
  catch (error) {
    throw error;
  }
}
  
export const getPokemonsList = cache(retrievePokemonsList);
