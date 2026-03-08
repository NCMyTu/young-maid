# Young Maid
A __2-player Goofspiel web game__ built with the __MERN__ stack and TypeScript.

## Table of Contents
* [Demo](#demo)
* [Features](#features)
* [How to run](#how-to-run)
* [FAQs](#faqs)

## Demo
[Watch the demo](demo.mp4)

## Features
- Simple 2-player game (can be extended to support more players)
- CRU~~D~~ operations
- Authentication, authorization (sign up, sign in and admin role)

## Browser Compatibility
Tested in:
- Microsoft Edge

## How to run
### Configure environment variables
Fill in the ```backend/.env.example``` file and rename it to ```backend/.env```. It should be self-desciptive.
### Run the Backend
Requires __Node.js v22.20.0__.\
Open a terminal and run:
```
cd backend
yarn install
yarn run dev
```
### Run the Frontend
Open another terminal and run:
```
cd frontend
yarn install
yarn run dev
```

Now you can access it at ```http://localhost:5173/```.

## FAQs
### Why did you build this?
Because I was unemployed (hopefully not anymore) and needed a project to prove my skills.
### Why is it called *Young Maid*?
Originally, the project was meant to be a variation of the card game *Old Maid*, with punishment and reward cards, hence the name *__Young__ Maid*.

However, implementing features like:
- Card shuffling so players can't guess other cards (requires drag-and-drop)
- Choosing cards from other players (requires physics/animations...)

is too much work.

So the game was switched to [Goofspiel](https://en.wikipedia.org/wiki/Goofspiel) instead. The name still stuck.
### Why not use a game framework like Phaser?
Because ~~corporations~~ everyone loves __React__! __React__ is the best! Everything should be done in __React__!
### Why is it so ugly?
- I don't have an eye for design.
- The game is supposed to include textures and sound later, so the UI is minimal.
### Why isn't it responsive?
Because it's a game. It was meant to be played in a horizontal layout.
### Why are there no tests?
When I started this project, I was still learning JS, so automated tests were not implemented.
### Why is there no live demo?
I don't have card to host it.