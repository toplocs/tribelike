# TopLocs TribeLike

TopLocs stands for topic- and location-based interests. TribeLike builds a community platform where you can meet likeminded people.

Interactions can be added with plugins, like chat, wiki, events ...

## Tech-Stack

- Typescript server and vuejs web frontend.
- Plugins can be written in any language.


## Project Setup
Install `node` and `pnpm`.

Setup a database and .env files, and run

```sh
pnpm install
pnpm dev
pnpm db:deploy  # if needed
```

### Using docker 
Start the server and database

```sh
docker compose up
```

Run a DB Migration / Create Database initially
```sh
docker compose exec server pnpm db:deploy
```

## Open Source
MIT License. Feedback and contributions are welcome.
