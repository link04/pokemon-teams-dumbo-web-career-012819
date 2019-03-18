const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


const addPokemonLi = (pokemon,status) => {
  let pokemonLi = `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`;
    if (status) {
      return pokemonLi
    } else {
      const divTag = document.querySelector(`[data-id='${pokemon.trainer_id}']`);
      const ulTag = divTag.querySelector('ul');
      ulTag.innerHTML += pokemonLi;
    }
}

const trainersArrayIterate = (trainersArray) => {
  for (const trainerObj of trainersArray ) {

      const divTag = document.createElement('DIV');
      divTag.dataset.id = trainerObj.id;
      divTag.className = "card";
      const pTag = document.createElement('P');
      pTag.innerText = trainerObj.name;
      const buttonTag = document.createElement('BUTTON');
      buttonTag.innerText = "Add Pokemon";
      buttonTag.dataset.trainerId = trainerObj.id;
      const ulTag = document.createElement('UL');

        let status = true
        trainerObj.pokemons.forEach(pokemon => {
          const pokemonLi = addPokemonLi(pokemon,status);
          ulTag.innerHTML += pokemonLi;
        })

      divTag.append(pTag,buttonTag,ulTag);

      document.querySelector('main').append(divTag);
  }
}

///////// DELETE ///////////
const configObj = (action) => {
 return  {
    method: action,
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
};

const deletePokemon = (id) => {
  const dataObj = configObj('DELETE');
  fetch(POKEMONS_URL+"/"+id, dataObj)
  .then(response => response.json())
}

const addPokemon = (id) => {

  fetch(POKEMONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // i need the info i want updated ex. hug_count
    body: JSON.stringify({pokemon: {trainer_id: id} })
  }).then(response =>
    response.json()
  ).then(renderedResp => {
    addPokemonLi(renderedResp,false);
  }).catch(() => {
        alert("That trainer has to many pokemons.");
    });

}

////////////// CRUD METHODS ///////////////////
document.addEventListener('click', (event) => {
  const target = event.target;
  if(target.className === "release") {
    deletePokemon(target.dataset.pokemonId);
    target.parentElement.remove();
  } else if (target.innerText === "Add Pokemon"){
    const ulTag = target.parentElement;
    const pokemon = addPokemon(target.dataset.trainerId);

  }
})

///////////   END   //////////////

const trainerCard = (trainerObj) => {
  trainersArrayIterate(trainerObj);
}

document.addEventListener('DOMContentLoaded', () => {
  fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(renderedResp => {
      trainerCard(renderedResp);
    })
})
