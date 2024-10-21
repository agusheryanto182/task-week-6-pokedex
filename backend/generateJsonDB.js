const fs = require("fs");

function extractEvolution(chain) {
  const evolutionChains = [];
  evolutionChains.push(chain.species.name);
  let currentChain = chain;
  while (currentChain && currentChain.evolves_to.length > 0) {
    currentChain = currentChain.evolves_to[0];
    evolutionChains.push(currentChain.species.name);
  }

  return evolutionChains;
}

async function generateJsonDB() {
  const pokemonApiURL = "https://pokeapi.co/api/v2/pokemon?limit=1000";

  const response = await fetch(pokemonApiURL);
  const data = await response.json();

  const pokemon = await Promise.all(
    data.results.map(async (pokemon) => {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonData = await pokemonResponse.json();
      const types = pokemonData.types.map((type) => type.type.name);
      const species = await fetch(pokemonData.species.url);
      const speciesData = await species.json();
      const evolutionChainsResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionChainsData = await evolutionChainsResponse.json();
      const evolutionChains = extractEvolution(evolutionChainsData.chain);
      const cries = {
        latest: '',
        legacy: '',
      };
      for (const [key, value] of Object.entries(pokemonData.cries)) {
        cries[key] = value;
      }
      return {
        id: speciesData.id,
        name: pokemon.name,
        types,
        abilities: pokemonData.abilities.map((ability) => ability.ability.name),
        height: pokemonData.height,
        weight: pokemonData.weight,
        cries,
        evolutionChains,
      };
    })
  );

  console.log('pokemon:', pokemon);
  fs.writeFileSync("db.json", JSON.stringify({ pokemon }));
}

generateJsonDB();
