import React, { useEffect, useState } from 'react';
import { Pokemon, DetailedPokemon } from "./types"

import './App.scss';
import List from './components/List';

export const MissingNo = (event: any) => {
  event.target.src = "https://upload.wikimedia.org/wikipedia/commons/6/62/MissingNo.png";
  event.target.className = "MissingNo";
}

const App: React.FC = () => {
  const [allPokemonById, setAllPokemonById] = useState<Pokemon[]>([]);
  const [allPokemonByName, setAllPokemonByName] = useState<Pokemon[]>([]);
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon[]>([]);
  const pokeAPI: string = "https://pokeapi.co/api/v2/pokemon?limit=-1/"
  const [setPage, setSetPage] = useState<number>(12);
  const [loadPage, setLoadPage] = useState<boolean>(true);
  const [useId, setUseId] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<DetailedPokemon>();

  const getAllPokemon = async (): Promise<any> => {
    const res = await fetch(pokeAPI);
    const data = await res.json();
    data.results.forEach((element: Pokemon) =>
      allPokemonById.push(element)
    );
    for (var i=0;i<allPokemonById.length;i++) {
      const test = allPokemonById[i].url.match(new RegExp("mon/" + "(.*)" + "/"));
      if (test != null) allPokemonById[i].id = +test[1];
      allPokemonByName.push(allPokemonById[i]);
      if (selectedPokemon == null) {
        getDetailedPokemon(allPokemonById[i]);
      }
    }    
    setAllPokemonByName(allPokemonByName.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
    setCurrentPokemon(allPokemonById.slice(setPage - 12, setPage))
    setLoadPage(false);
  }

  const getDetailedPokemon = async (selectedPokemon: DetailedPokemon): Promise<any> => {
    if (selectedPokemon != null && selectedPokemon.type == null) {
      const res = await fetch(("https://pokeapi.co/api/v2/pokemon/" + selectedPokemon.id?.toString()));
      const data = await res.json();
      for (var element of data.types) {
        if (selectedPokemon.type == null) {
          selectedPokemon.type = element.type.name
        } else {
          selectedPokemon.type = selectedPokemon.type + ", " + element.type.name;
        }
      }
      selectedPokemon.height = data.height;
      selectedPokemon.weight = data.weight;
      const res2 = await fetch(("https://pokeapi.co/api/v2/pokemon-species/" + selectedPokemon.id?.toString()));
      const data2 = await res2.json();
      let str = data2.flavor_text_entries[0].flavor_text;
      const regex1 = /[\r\n\x0B\x0C\u0085\u2028\u2029]+/g;
      const regex2 = /[^\wÀ-úÀ-ÿ,.!?;: '"]/;
      let str2 = str.replace(regex1, " ");
      selectedPokemon.desc = str2.replace(regex2, "");
    }
  }

  useEffect(():void => {
    setLoadPage(true);
    if (allPokemonById[0] == null) {
      getAllPokemon();
    }
    if (useId) {
      setCurrentPokemon(allPokemonById.slice(setPage - 12, setPage));
      setLoadPage(false);
    }
    if (!useId) {
      setCurrentPokemon(allPokemonByName.slice(setPage - 12, setPage));
      setLoadPage(false);
    }
    if (selectedPokemon != null) {
      getDetailedPokemon(selectedPokemon);
    }
  }, [setPage, useId, selectedPokemon]);

  const handleNextPage = ():void => {
    if (setPage + 12 <= allPokemonById.length + 12) {
      setSetPage(setPage + 12);
    }
  }

  const handlePrevPage = ():void => {
    if (setPage - 12 >= 0) {
      setSetPage(setPage - 12);
    } 
  }

  const handleByName = ():void => {
    setUseId(false);
  }

  const handleByID = ():void => {
    setUseId(true);
  }

  return (
  <div className="App">
    <div className="Main">
      <div className="Selection">
        {(selectedPokemon != null) && <>
        <h2 className="id">#{selectedPokemon.id}</h2>
        <h1 className="name">{selectedPokemon.name}</h1>
        <div className="type-wrapper"><h2 className="type">Type: {selectedPokemon.type}</h2></div>
        <h2 className="height">Height: {Number(selectedPokemon.height) / 10} m</h2>
        <h2 className="weight">Weight: {Number(selectedPokemon.weight)} kgs</h2>
        <div className="desc-wrapper"><h2 className="desc">Description: {selectedPokemon.desc}</h2></div>
        <h2 className="wiki">Bulbapedia: </h2>
        <h3 className="link"><a href={"https://bulbapedia.bulbagarden.net/wiki/index.php?&search=" + selectedPokemon.name}>{"https://bulbapedia.bulbagarden.net/wiki/index.php?&search=" + selectedPokemon.name}</a></h3>
        <img src={require("./resources/bg.png")} alt="backdrop"></img>
        <img onError={MissingNo} src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + selectedPokemon.id?.toString() + ".png"} alt={"" + selectedPokemon.id?.toString()}></img>
        </>}
      </div>
    </div>
    <div className="Footer">
      <div className="Title">
        <h1>All the Pokemon!</h1>
        <div>
          <input type="radio" checked={useId === false} onChange={handleByName}/>
            <label><a onClick={handleByName}>Sort Name</a></label>
        </div>
        <div>
            <input type="radio" checked={useId === true} onChange={handleByID}/>
          <label><a onClick={handleByID}>Sort ID</a></label>
        </div>
      </div>
        <div className="List"><List pokemonList={currentPokemon} onCardClick={setSelectedPokemon}/></div>
      <div className="Navigation">
        {(setPage - 12 > 0) && <button className="Previous" onClick={handlePrevPage}><span>Previous 12</span></button>}
        {(setPage + 12 < allPokemonById.length) && <button className="Next" onClick={handleNextPage}><span>Next 12</span></button>}
      </div>
    </div>
  </div>
  )
};

export default App;