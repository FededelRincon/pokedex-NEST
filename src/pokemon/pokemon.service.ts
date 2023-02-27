import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit:number;

  constructor(

    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService

  ){ 
    this.defaultLimit = configService.get<number>('defaultLimit')
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto )
      return pokemon;
      
    } catch (error) {
      this.handleExceptions( error );
    }
    
  }

  findAll( paginationDto: PaginationDto ) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()

      .limit( limit )
      .skip( offset )
      .sort({ no:1 }) //'no' de forma ascendente
      .select('-__v')
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

  // version Fernando devolviendo el pokemonUpdated hardcodeado (haciendo solo una busqueda...)
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term )
    if( updatePokemonDto.name ) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
    }

    try {
      await pokemon.updateOne( updatePokemonDto )
      return { ...pokemon.toJSON(), ... updatePokemonDto }

    } catch (error) {
      this.handleExceptions( error );
    }
    // se hace asi xq mongo no devuelve lo nuevo, sino q hay q hacer esta "chanchada"
    // se esparce el el pokemon que es "lo viejo", y se le sobreescribe hardcodeado lo que updatee en la bd...
    // osea devuelvo mi creacion, pero no lo que me da la DB
  }

  
  // version Alumno devolviendo el resultado de la DB como realmente esta (pero haciendo 2 busquedas...)
//   async update(term: string, updatePokemonDto: UpdatePokemonDto) {
//     const pokemonBusqueda = await this.findOne( term );
                
//     if ( updatePokemonDto.name ) 
//         updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
 
//     const PokemonActualizado = 
//     await this.pokemonModel.findByIdAndUpdate(pokemonBusqueda._id, updatePokemonDto, { new: true });
 
//     return PokemonActualizado;
// }

  async remove( id: string ) {
    // const pokemon = await this.findOne( id )
    // await pokemon.deleteOne(); 
    // return { id };

    // const result = await this.pokemonModel.findByIdAndDelete( id )

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })

    if( deletedCount === 0){
      throw new BadRequestException(`Pokemon with id '${id}' not found`)
    }

    return;
  }


  private handleExceptions( error: any ){
    if( error.code === 11000 ){
      throw new BadRequestException(`Pokemon already exists in DB ${ JSON.stringify( error.keyValue ) }`)
    }
    console.log(error)
    throw new InternalServerErrorException(`can´t update pokemon - check server logs`)
  }

}
