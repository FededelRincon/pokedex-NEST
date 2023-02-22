import { join } from 'path'; //es de node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
