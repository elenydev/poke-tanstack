import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PokemonDetail, PokemonListItem, PokemonListResponse } from '../types/pokemon'

interface LoaderData {
  pokemonDetails: PokemonDetail[];
}

export const Route = createFileRoute('/')({
  component: HomeComponent,
  loader: async (): Promise<LoaderData> => {
    // Fetch the list of pokemon
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
    if (!response.ok) {
      throw new Error('Failed to fetch Pokémon list');
    }
    const data = await response.json() as PokemonListResponse;

    // Fetch details for each pokemon
    const detailsPromises = data.results.map(async (pokemon: PokemonListItem) => {
      const detailResponse = await fetch(pokemon.url);
      if (!detailResponse.ok) {
        throw new Error(`Failed to fetch details for ${pokemon.name}`);
      }
      return await detailResponse.json() as PokemonDetail;
    });
    
    const pokemonDetails = await Promise.all(detailsPromises);
    
    return { pokemonDetails };
  },
  staleTime: 60_000
})

function HomeComponent() {
  const { pokemonDetails } = Route.useLoaderData();

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        marginBottom: '20px', 
        textAlign: 'center' 
      }}>
        Pokémon List
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {pokemonDetails.map((pokemon) => (
          <Link 
            key={pokemon.id} 
            to="/pokemon/$pokemonId"
            params={{ pokemonId: pokemon.id.toString() }}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
              cursor: 'pointer'
            }}
          >
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              height: '100%'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{ 
                backgroundColor: '#f0f0f0', 
                padding: '15px',
                display: 'flex',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <img 
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
                  alt={pokemon.name} 
                  style={{ height: '150px', width: '150px', objectFit: 'contain' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#ffcc00',
                  color: '#333',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  #{pokemon.id}
                </div>
              </div>
              
              <div style={{ padding: '15px' }}>
                <h2 style={{ 
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  textTransform: 'capitalize'
                }}>
                  {pokemon.name}
                </h2>
                
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '5px',
                  marginBottom: '10px'
                }}>
                  {pokemon.types.map((type) => (
                    <span key={type.type.name} style={{
                      padding: '3px 8px',
                      fontSize: '12px',
                      borderRadius: '16px',
                      color: 'white',
                      backgroundColor: '#3b82f6'
                    }}>
                      {type.type.name}
                    </span>
                  ))}
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '10px',
                  fontSize: '14px' 
                }}>
                  <div>Height: {pokemon.height / 10}m</div>
                  <div>Weight: {pokemon.weight / 10}kg</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
