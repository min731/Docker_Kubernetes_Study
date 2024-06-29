const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const mongoose = require('mongoose');

const Favorite = require('./models/favorite');

const app = express();

app.use(bodyParser.json());

// 몽고DB에 저장된 데이터 호출
app.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find();
  res.status(200).json({
    favorites: favorites,
  });
});

// 몽고DB에 데이터 저장
app.post('/favorites', async (req, res) => {
  const favName = req.body.name;
  const favType = req.body.type;
  const favUrl = req.body.url;

  try {
    if (favType !== 'movie' && favType !== 'character') {
      throw new Error('"type" should be "movie" or "character"!');
    }
    const existingFav = await Favorite.findOne({ name: favName });
    if (existingFav) {
      throw new Error('Favorite exists already!');
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const favorite = new Favorite({
    name: favName,
    type: favType,
    url: favUrl,
  });

  try {
    await favorite.save();
    res
      .status(201)
      .json({ message: 'Favorite saved!', favorite: favorite.toObject() });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// 외부 API에서 데이터 호출
app.get('/movies', async (req, res) => {
  try {
    const response = await axios.get('https://swapi.dev/api/films');
    res.status(200).json({ movies: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// 외부 API에서 데이터 호출
app.get('/people', async (req, res) => {
  try {
    const response = await axios.get('https://swapi.dev/api/people');
    res.status(200).json({ people: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// app.listen(3000);

// 로컬 호스트 머신의 몽고DB 호출
mongoose.connect(
  // 동일 컨테이너에서 연결
  // 'mongodb://localhost:27017/swfavorites',
  
  // 로컬 호스트 머신과 연결
  // 'mongodb://host.docker.internal:27017/swfavorites',
  
  // 타 컨테이너와 연결(IP Adress 활용)
  // 'mongodb://172.17.0.2:27017/swfavorites',

  // 타 컨테이너와 연결(--network 활용, 컨테이너명 명시)
  'mongodb://mongodb:27017/swfavorites',

  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(3000);
    }
  }
);
