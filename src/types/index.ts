export type Pokemon = {
    name: string,
    url: string,
    id?: number
}

export interface DetailedPokemon extends Pokemon {
    type?: string,
    height?: string,
    weight?: string,
    desc?: string,
    wiki?: string
}