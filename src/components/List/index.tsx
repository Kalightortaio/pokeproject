import React from "react";
import { Pokemon, DetailedPokemon } from "../../types";
import { MissingNo } from "../../App";

import "./List.scss";

interface Props {
    pokemonList: Pokemon[];
    onCardClick: any;
}

const List: React.FC<Props> = (props) => {
    const { pokemonList, onCardClick } = props;
    
    const handleCardClick = (p: Pokemon): any  => {
        onCardClick(p);
    }

    return <div className="cardCollection">
        {pokemonList.map((pokemon) => {
            return (
                <div className="card" onClick={() => handleCardClick(pokemon)} key={pokemon.name}>
                    <img onError={MissingNo} src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemon.id?.toString() + ".png"} alt={"" + pokemon.id?.toString()}></img>
                    <p>{pokemon.name}</p>
                </div>
            )
        })}
    </div>
}

export default List;