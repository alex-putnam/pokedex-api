require('dotenv').config();
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const POKEDEX = require('./pokedex.json');

const app = express();

const PORT = process.env.PORT || 8000;

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`,
];

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganSetting));

app.use(cors());

app.use(helmet());

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

app.use(validateBearerToken);

app.get('/types', handleGetTypes);

app.get('/pokemon', handleGetPokemon);

function validateBearerToken(req, res, next) {
  console.log(req);
  console.log(process.env.API_TOKEN);
  console.log(req.get('Authorization'));
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized Request' });
  }
  // move to the next middleware
  next();
}

function handleGetTypes(req, res) {
  res.json(validTypes);
}

function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;

  if (req.query.name) {
    response = response.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(req.query.name.toLowerCase());
    });
  }

  if (req.query.type) {
    response = response.filter((pokemon) => {
      return pokemon.type.includes(req.query.type);
    });
  }

  res.json(response);
}

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
