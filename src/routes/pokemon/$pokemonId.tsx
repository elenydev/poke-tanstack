import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PokemonDetail } from "../../types/pokemon";
import { getPokemonById } from "../../utils/getPokemonById";

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

function PokemonDetailComponent() {
  const { pokemon } = Route.useLoaderData();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            textTransform: "capitalize",
            marginBottom: "15px",
          }}
        >
          {pokemon.name}
        </h1>
        <div style={{ position: "relative" }}>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "30px",
              borderRadius: "50%",
              marginBottom: "20px",
            }}
          >
            <img
              src={
                pokemon.sprites.other["official-artwork"].front_default ||
                pokemon.sprites.front_default
              }
              alt={pokemon.name}
              style={{ height: "250px", width: "250px", objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#ffcc00",
              color: "#333",
              padding: "5px 10px",
              borderRadius: "15px",
              fontWeight: "bold",
            }}
          >
            #{pokemon.id}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              style={{
                padding: "5px 15px",
                fontSize: "14px",
                borderRadius: "20px",
                color: "white",
                backgroundColor: "#3b82f6",
                textTransform: "capitalize",
              }}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Physical
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <strong>Height:</strong> {pokemon.height / 10}m
            </div>
            <div>
              <strong>Weight:</strong> {pokemon.weight / 10}kg
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Abilities
          </h2>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            {pokemon.abilities.map((ability) => (
              <li
                key={ability.ability.name}
                style={{
                  marginBottom: "5px",
                  textTransform: "capitalize",
                }}
              >
                {ability.ability.name.replace("-", " ")}
                {ability.is_hidden && (
                  <span style={{ color: "#888", fontSize: "14px" }}>
                    {" "}
                    (Hidden)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Back to List
        </button>
      </div>
    </div>
  );
}
