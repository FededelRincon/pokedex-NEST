import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>

  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto )
      return pokemon;
      
    } catch (error) {
      if( error.code === 11000 ){
        throw new BadRequestException(`Pokemon already exists in DB ${ JSON.stringify( error.keyValue ) }`)
      }
      console.log(error)
      throw new InternalServerErrorException(`can´t create pokemon - check server logs`)
    }
    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne( term: string ) {
    let pokemon: Pokemon;

    // pokemon = num
    if( !isNaN( +term ) ) { //si esto es un numero
      pokemon = await this.pokemonModel.findOne({ no: term })
    }
    
    // pokemon = mongoID
    if( !pokemon && isValidObjectId(term) ) {
      pokemon = await this.pokemonModel.findById( term )
    }
    
    // pokemon = name
    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name, o no '${term}' not found in DB`)
    }


    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
