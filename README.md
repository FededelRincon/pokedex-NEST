<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Execute as develop
1. Clone the repository
```
git clone git@github.com:FededelRincon/pokedex-NEST.git
```

2. Execute
```
npm add install
```

3. Install Nest CLI
```
npm add -g @nestjs/cli
```

4. Rise/upload the data base, with docker-compose
```
docker-compose up -d
```

5. Clone file __.env.template__ and rename copy to __.env__

6. Fill environment variables in .env


7. Execute the app en dev, with command:
```
npm run start:dev
```

8. Build data base with Seed
```
http://localhost:3000/api/v2/seed
```


## USED STACK
* MongoDB (Mongoose)
* Nest (express)
* 