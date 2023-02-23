import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

import { Pokemon, PokemonSchema } from './entities/pokemon.entity';


@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name, //este name sale de algo q se extiende del documento
        schema: PokemonSchema,
      }
    ])
  ]
})
export class PokemonModule {}
