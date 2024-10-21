let pokemonData = [];
let filteredPokemon = [];

// background color types
const typeColors = {
  normal: "bg-gray-300",
  fire: "bg-orange-500",
  water: "bg-blue-300",
  electric: "bg-yellow-300",
  grass: "bg-green-300",
  ice: "bg-cyan-300",
  fighting: "bg-orange-300",
  poison: "bg-purple-300",
  ground: "bg-yellow-300",
  flying: "bg-sky-300",
  psychic: "bg-pink-300",
  bug: "bg-lime-300",
  rock: "bg-orange-300",
  ghost: "bg-purple-300",
  dragon: "bg-indigo-300",
  dark: "bg-gray-800",
  steel: "bg-gray-300",
  fairy: "bg-pink-300",
  unknown: "bg-gray-300",
  shadow: "bg-gray-300",
};

// Fetch data from mock server
async function fetchPokemon() {
  try {
    const response = await fetch("http://localhost:3000/pokemon");
    if (!response.ok) {
      throw new Error("http call failed");
    }
    const data = await response.json();
    pokemonData = data;
    filteredPokemon = pokemonData.slice(0, 100);
    renderApp();
  } catch (error) {
    console.error("Failed to fetch Pokemon data:", error);
    renderApp();
  }
}

// Card component
function PokemonCard(props) {
  return React.createElement(
    "div",
    {
      className: "m-4 transition-all duration-300 hover:scale-105 rounded-md relative",
      onMouseEnter: (event) => {
        const audio = new Audio(props.cries.latest);
        const popUp = document.createElement("div");
        popUp.className = `absolute ${typeColors[props.types[0]] || "bg-black"} p-2 rounded-md shadow-md flex justify-center items-center top-0 left-0`;

        const button = document.createElement("button");
        button.className = "text-white text-sm font-bold";
        button.innerHTML =
          `<svg fill="white" height="10px" width="10px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512">
  <g>
    <g>
      <g>
        <path d="m444.8,76.8c-6.8-9-19.7-10.9-28.8-4.2-9.1,6.7-11,19.4-4.2,28.4 64.8,85.9 64.8,225.6 0,311.5-6.8,9-5.1,21.9 4.2,28.4 11.4,7.9 24.8,1.2 28.8-4.2 74.9-99.1 74.9-260.6 0-359.9v-1.42109e-14z"/>
        <path d="m394.7,143.2c-6.8-9-19.7-10.8-28.8-4.2-9.1,6.7-11,19.4-4.2,28.4 36.6,48.4 36.6,130.3 0,178.7-6.8,9-5,21.8 4.2,28.4 11.7,8.3 24.8,1.2 28.8-4.2 48.1-63.6 48.1-163.4 0-227.1z"/>
        <path d="m291.9,438.3l-144.2-112.4v-138.2l144.2-112.3v362.9 5.68434e-14zm-185.4-122.8h-54.3v-117.7h54.3v117.7zm194.7-300.2l-180.1,141.9h-89.5c-11.4,0-20.6,9.1-20.6,20.3v158.2c0,11.2 9.2,20.3 20.6,20.3h91.2l178.4,140.7c12.8,10.1 31.9,1.1 31.9-15.1v-451.2c0-16.2-19-25.3-31.9-15.1z"/>
      </g>
    </g>
  </g>
</svg>`;
        button.addEventListener("click", () => audio.play());

        popUp.appendChild(button);
        event.currentTarget.appendChild(popUp);
      },
      onMouseLeave: (event) => {
        const popUp = event.currentTarget.querySelector(".absolute");
        if (popUp) {
          popUp.remove();
        }
      },
    },
    React.createElement(
      "div",
      { className: "flex flex-col justify-center items-center" },
      React.createElement(
        "img",
        { src: props.image, alt: props.name, className: "w-40 h-40 bg-gray-200 rounded-md" }
      ),
      React.createElement(
        "div",
        { className: "w-full p-2" },
        React.createElement(
          "div",
          { className: "mt-0" },
          React.createElement("p", { className: "text-gray-500 text-sm font-bold" }, `#${props.id}`),
          React.createElement("h2", { className: "text-lg font-bold" }, props.name),
        ),
        React.createElement(
          "div",
          { className: "flex items-center justify-between mt-2" },
          props.types.map((type, index) =>
            React.createElement("p", {
              key: `type-${index}`,
              className: `flex justify-center items-center text-white font-bold
               text-sm w-[70px] h-[25px] rounded-md ${typeColors[type] || "bg-gray-300"}`
            }, type)
          )
        )
      )
    )
  );
}


// List component
function PokemonList() {
  if (filteredPokemon.length === 0) {
    return React.createElement(
      "p",
      { className: "text-center flex justify-center items-center" },
      "Loading Pokemon data..."
    );
  }

  return React.createElement(
    "div",
    { className: "md:max-w-6xl max-w-full bg-white mx-auto flex flex-wrap justify-center" },
    React.createElement(
      "div",
      { id: "home", className: "w-full py-8" },
    ),
    filteredPokemon.map((pokemon) =>
      React.createElement(PokemonCard, {
        key: pokemon.id,
        id: pokemon.id,
        name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
        types: pokemon.types,
        cries: pokemon.cries,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
      })
    )
  );
}

// App component wrap header and list
function App() {
  return React.createElement(
    "div",
    { className: "bg-[url('./assets/svg/bg.svg')]", },
    React.createElement(
      "header",
      { className: "md:max-w-6xl max-w-full mx-auto bg-white" },
      React.createElement(
        "div",
        { className: "flex md:max-w-6xl mx-auto w-full items-center justify-between p-4 fixed top-0 z-10 bg-white" },
        React.createElement(
          "button",
          {
            className: "flex justify-center items-center gap-2 bg-[#4fa8d7] hover:bg-[#71a3c1] text-white font-bold py-2 px-4 rounded",
            onClick: () => {
              filteredPokemon.sort(() => 0.5 - Math.random());
              renderApp();
            },
          },
          React.createElement(
            "svg",
            {
              fill: "white",
              // height: "24px",
              width: "16px",
              version: "1.1",
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 512 512",
              "xml:space": "preserve",
            },
            React.createElement("path", {
              d: "M341.3,28.3v85.3H128c-70.7,0-128,57.3-128,128c0,21.5,5.8,41.4,15.2,59.2L68,263.2c-2.4-6.8-4-13.9-4-21.5 c0-35.4,28.7-64,64-64h213.3V263L512,156.3V135L341.3,28.3z M444,262.8c2.4,6.8,4,13.9,4,21.5c0,35.4-28.6,64-64,64H170.7V263 L0,369.7V391l170.7,106.7v-85.3H384c70.7,0,128-57.3,128-128c0-21.5-5.8-41.4-15.2-59.2L444,262.8z"
            })
          ),
          React.createElement(
            "span",
            { className: "font-bold text-white text-md md:block hidden" },
            "Surprise Me!"
          )
        ),
        React.createElement(
          "h1",
          {
            className: "md:text-3xl text-lg text-center font-bold cursor-pointer md:block hidden",
            onClick: (event) => {
              event.preventDefault();
              const target = document.getElementById("home");
              target.scrollIntoView({
                behavior: "smooth",
              });
            }
          },
          "Pokedex"
        ),
        React.createElement(
          "select",
          {
            className: "bg-[#4fa8d7] hover:bg-[#71a3c1] text-white font-bold py-2 px-4 rounded cursor-pointer z-10 md:text-md text-sm",
            onChange: (event) => {
              const num = parseInt(event.target.value, 10);
              filteredPokemon = pokemonData.slice(0, num);
              renderApp();
            },
          },
          [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((num) =>
            React.createElement(
              "option",
              { key: num, value: num },
              `${num}`
            )
          )
        )
      ),
    ),
    React.createElement(PokemonList, null)
  );
}

// Function to render the app
function renderApp() {
  ReactDOM.render(React.createElement(App), document.getElementById("root"));
}

// Initial render
renderApp();

// Fetch and display the Pokemon data
fetchPokemon();
