<script setup lang="ts">
import "./index.css"
import { ref } from "vue"
import { Movie } from "./components/Movie";
const username = ref('marcos_ignacio')
const password = ref('avenaconcereal')
let isAuthenticated = ref(false);
let bearerToken = ref('')
let requestToken = ref('');
let sessionID = ref('');
let movies = ref([{} as Movie]);

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMDkzNTJkOTljNDI5OGE5MGYzZDAyYTAxYTI2NTNkMyIsIm5iZiI6MTcyNzIzMTI5OC4yNzExOTYsInN1YiI6IjY2ZjJmNTgzYzIzNzI1OGU0YzI3MGEyNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UrQp6o6lfxbmCDcLsyPbS1jo-DV5oq0Ncz-wSJ5730w";
const url = 'https://api.themoviedb.org/3/authentication/token/new';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => {
    requestToken.value = (json.request_token);
  })
  .catch(err => console.error('error:' + err));


function loginRequest() {

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${API_KEY}`);

  const raw = JSON.stringify({
    "username": username.value,
    "password": password.value,
    "request_token": requestToken.value
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: headers,
    body: raw,
    redirect: "follow"
  };

  fetch("https://api.themoviedb.org/3/authentication/token/validate_with_login", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      isAuthenticated.value = true;
      bearerToken.value = JSON.parse(result).request_token
      createSession()
      setMovies()
    })
    .catch((error) => console.error(error));
}


async function getMovies() {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${API_KEY}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  let response = await fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", requestOptions)

  if (!response.ok) {
    throw new Error(`SOmehtn wen wororngn`);
  }

  let json = await response.json()

  return json.results;
}

async function rateMovie(movieID: number, rate: number) {
  const url = `https://api.themoviedb.org/3/movie/${movieID}/rating?session_id=${sessionID.value}`;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  headers.append("Authorization", `Bearer ${API_KEY}`);

  const raw = JSON.stringify({
    "value": rate
  });
  console.log(raw)

  const requestOptions: RequestInit = {
    method: "POST",
    headers: headers,
    body: raw,
    redirect: "follow"
  };

  fetch(url, requestOptions)
    .then((response) => response.text())
    .then(() => alert("buen rate"))
    .catch((error) => console.error(error));
}

async function movieDetails(movie: Movie, movieID: Number) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${API_KEY}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  };

  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, requestOptions)

  if (!response.ok) {
    throw new Error(`SOmehtn wen wororngn`);
  }

  let json = await response.json()

  console.log(json)

  return json.results;
}

async function deleteRate(movieID: number) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${API_KEY}`);

  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: headers,
    redirect: "follow"
  };

  fetch(`https://api.themoviedb.org/3/movie/${movieID}/rating?session_id=${sessionID.value}`, requestOptions)
    .then((response) => response.text())
    .then(() => alert("borraste el rate de ea pelicula amigue"))
    .catch((error) => console.error(error));
}

async function createSession() {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${API_KEY}`);

  const raw = JSON.stringify({
    "request_token": requestToken.value
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: headers,
    body: raw,
    redirect: "follow"
  };

  fetch("https://api.themoviedb.org/3/authentication/session/new", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      sessionID.value = JSON.parse(result)["session_id"]
    })
    .catch((error) => console.error(error));
}

async function setMovies() {
  const imageBaseUrl: string = `https://image.tmdb.org/t/p/w500`
  movies.value = await getMovies();
  movies.value.forEach(element => {
    element.backdrop_path = `${imageBaseUrl}` + element.backdrop_path
    element.rate = 5;
  });
}

</script>

<template>
  <div v-if="isAuthenticated" className="flex justify-center align-middle">
    <ul className="flex flex-wrap ">
      <li v-for="(movie, index) in movies" className="m-1 bg-kirby-100 w-4/12 space-y-2 p-4 rounded shadow-md"
        :key="index">
        <h1 className="bolder text-2xl text-kirby-950">
          {{ movie.title }}
        </h1>
        <a href=""></a>
        <img :src="movie.backdrop_path" alt="">
        <div className="flex align-middle justify-center space-x-2">
          <span>Tu rating: {{ movie.rate }}</span>
          <input type="range" min="1" max="10" name="" v-model="movie.rate"
            className=" bg-kirby-600 rounded-lg appearance-none cursor-pointer dark:bg-kirby-500" />
        </div>
        <div className="space-x-2 flex">
          <button
            className="bg-kirby-400 text-white py-1 px-2 rounded border-kirby-400 border-2 hover:bg-kirby-500 active:border-kirby-500 shadow-md"
            type="button" @click="rateMovie(movie.id, movie.rate)">rate</button>
          <button className="bg-red-400 text-white py-1 px-2 rounded hover:bg-red-300  active:border-red-400 shadow-md"
            type="button" @click="deleteRate(movie.id)">delete rate</button>
          <button className="bg-kirby-100  py-1 px-2 rounded  shadow-md text-kirby-800" type="button"
            @click="movie.show_details = !movie.show_details">show details</button>
        </div>
        <p v-if="movie.show_details">{{ movie.overview }}</p>
      </li>
    </ul>
  </div>
  <div v-else className="mx-auto w-max flex flex-col shadow-xl">
    <form v-on:submit.prevent="loginRequest" className="flex flex-col bg-kirby-50 p-12 text-kirby-600 space-y-2">
      <h1 className="text-kirby-950 text-3xl bold">Iniciar sesión</h1>
      <label for="username" className="">Nombre de usuario</label>
      <input type="text" v-model="username"
        className="py-1 px-2 rounded text-kirby-300 border-current border-2 autofill:bg-kirby-100" name="username"
        placeholder="owo">
      <label for="password">Contraseña</label>
      <input className="py-1 px-2 rounded text-kirby-300 border-current border-2" type="password" name="password"
        placeholder="" v-model="password">
      <button
        className="bg-kirby-400 text-white py-1 px-2 rounded border-kirby-400 border-2 hover:bg-kirby-500 active:border-kirby-500"
        type="submit">Iniciar
        Sesión</button>
    </form>
  </div>
</template>
