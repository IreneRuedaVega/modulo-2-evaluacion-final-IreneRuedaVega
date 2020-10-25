"use strict";

//Constantes

const resultsShow = document.querySelector(".js-list");
const resultsFavouritesShows = document.querySelector(".js-list-favourites");

//Arrays

let series = [];
let favouritesList = [];

//Función para obtener los datos de la API

function getDataFromApi(ev) {
  ev.preventDefault();
  const inputSearch = document.querySelector(".js-input");
  const inputValue = inputSearch.value;
  fetch(`//api.tvmaze.com/search/shows?q=${inputValue}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      series = data;
      paintSeries();
      listenSeries();
    });
}

//Función para pintar los resultados de la búsqueda de series

function paintSeries() {
  let seriesResults = "";
  let urlPhoto = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
  for (let i = 0; i < series.length; i++) {
    let classFavourite;
    const favouriteIndex = favouritesList.indexOf(series[i]);
    if (favouriteIndex === -1) {
      classFavourite = "";
    } else {
      classFavourite = "card__favourite";
    }
    seriesResults += `<li class="card ${classFavourite}" id="${series[i].show.id}">`;
    seriesResults += `<h2 class="card__title">${series[i].show.name}</h2>`;
    if (series[i].show.image === null) {
      seriesResults += `<img class="card__img" src="${urlPhoto}" alt="Foto de ${series[i].show.name}"/>`;
    } else {
      seriesResults += `<img class="card__img" src="${series[i].show.image.medium}" alt="Foto de ${series[i].show.name}"/>`;
    }
    seriesResults += "<li>";
  }
  resultsShow.innerHTML = seriesResults;
}

//Función para escuchar el evento de la búsqueda de series

const formSearch = document.querySelector(".js-form-search");

function listenButton() {
  formSearch.addEventListener("submit", getDataFromApi);
}

//Función para guardar las series favoritas

const favouritesShows = function (event) {
  const clickedSerie = parseInt(event.currentTarget.id);
  let serieFav;
  let indexInFavourites;
  for (let i = 0; i < series.length; i++) {
    if (clickedSerie === series[i].show.id) {
      //Buscamos en favoritos en el objeto cuyo id sea el mismo que el de la serie
      serieFav = favouritesList.find(
        (favouritesList) => favouritesList.show.id == series[i].id
      );
      //Si lo encontramos (si no está undefined) está dentro de favoritos
      if (serieFav !== undefined) {
        //Buscamos el índice de esa serie en favoritos y lo sacamos del array
        indexInFavourites = favouritesList.findIndex((fav) => serieFav === fav);
      } else {
        favouritesList.push(series[i]);
      }
    }
  }

  paintSeries();
  listenSeries();
  paintFavourites();
  setInLocalStorage();
};

//Función que pinta las series favoritas en el apartado de series favoritas

function paintFavourites() {
  let seriesFavouriteResults = "";
  let urlPhotoFavourites =
    "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
  for (let i = 0; i < favouritesList.length; i++) {
    seriesFavouriteResults += `<li class="card" id="${favouritesList[i].show.id}">`;
    seriesFavouriteResults += `<button class="js-button-fav" type="reset"><i class="fas fa-times"></i></button>`;
    seriesFavouriteResults += `<h2 class="card__title">${favouritesList[i].show.name}</h2>`;
    if (favouritesList[i].show.image === null) {
      seriesFavouriteResults += `<img class="card__img" src="${urlPhotoFavourites}" alt="Foto de ${favouritesList[i].show.name}"/>`;
    } else {
      seriesFavouriteResults += `<img class="card__img" src="${favouritesList[i].show.image.medium}" alt="Foto de ${favouritesList[i].show.name}"/>`;
    }
    seriesFavouriteResults += "<li>";
  }
  resultsFavouritesShows.innerHTML = seriesFavouriteResults;
}

//Función para escuchar el evento para seleccionar las series

function listenSeries() {
  const seriesItems = document.querySelectorAll(".card");
  for (const serieItem of seriesItems) {
    serieItem.addEventListener("click", favouritesShows);
  }
}

// Local Storage

function setInLocalStorage() {
  const stringifyFavourites = JSON.stringify(favouritesList);
  localStorage.setItem("favourites", stringifyFavourites);
}

function getFromLocalStorage() {
  const localStorageData = localStorage.getItem("favourites");
  if (localStorageData !== null) {
    favouritesList = JSON.parse(localStorageData);
    paintFavourites();
  }
}

getFromLocalStorage();

//Función para borrar los elementos de la lista de favoritos

function resetAll() {
  favouritesList.splice(favouritesList);
  paintFavourites();
  window.localStorage.clear();
}

const buttonReset = document.querySelector(".js-button-reset");

function listenReset() {
  buttonReset.addEventListener("click", resetAll);
}

listenReset();

//start app

listenButton();
