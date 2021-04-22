const moviesDisplay = document.querySelector("#movies");
const form = document.querySelector("#form");
const myModal = document.querySelector(".modal-content");

// Call movies searching function 
form.addEventListener("submit", search);

// If no API key provided
if (typeof API_KEY === 'undefined'){
  moviesDisplay.innerHTML += '<p class="mt-5 text-center font-weight-bold">There is no API_KEY, the search will not work</p>';
}

// Function to search the movie with the API
function search(e) {
  e.preventDefault();
  const searchValue = document.querySelector("#search").value;
  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchValue}`)
    .then((response) => response.json() )
    .then((data) => {
      moviesDisplay.innerHTML = "";
      data.Search.map(element => showMovies(moviesDisplay, element.Title, element.Year, element.Poster, element.imdbID))
    })
    .catch((error) => {
      console.error('error:', error);
      moviesDisplay.innerHTML = "";
      moviesDisplay.innerHTML += '<p class="mt-5 text-center font-weight-bold">There is no movies for this research</p>'
    });
}

// Creation of movies cards
const showMovies = (selector, title, year, poster, imdbID) => {
  if (poster == "N/A"){
    poster = "./no-poster.jpg";
  }
  selector.innerHTML += `
      <div class="card-movies container clearfix mt-5 shadow p-3 mb-5 bg-white rounded" style="border: 1px solid #ff8b88; background-color: #FCEDED !important">
        <img src="${poster}" alt="movie poster" width="150px" height="auto" class="py-3 float-left mr-5">
        <h3 class="font-weight-bold pt-3">Movie : ${title}</h3>
        <p class="font-weight-bold pt-2">${year}</p>
        <button type="button" class="btn btn-info" data-toggle="modal" data-target="#exampleModalCenter" onclick="movieDetails('${imdbID}')">More details</button>        
      </div>
  `;

  // Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((element) => {
            if (element.intersectionRatio > 0.1) {
                element.target.classList.add('card-movies--displayed');
            } else {
                element.target.classList.remove('card-movies--displayed');
            }
        });
    },
    { threshold: [0.1] }
  );
  
  document.querySelectorAll('.card-movies').forEach((item) => {
    observer.observe(item);
  });
}

// Search the movie by ID with the ID and display it into a modal
const movieDetails = (id) => {
  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
    .then((response) => response.json() )
    .then((data) => {
      myModal.innerHTML = "";
      displayMoviesDetails(myModal, data.Title, data.Year, data.Plot, data.Poster)
    })
    .catch((error) => {
      console.error('error:', error);
      moviesDisplay.innerHTML = "";
      moviesDisplay.innerHTML += '<p class="mt-5 text-center font-weight-bold">There is no movies for this research</p>';
    });
}

// Modal creation
const displayMoviesDetails = (selector, title, year, plot, poster) => {
  if (poster == "N/A"){
    poster = "./no-poster.jpg";
  }
  selector.innerHTML += `
      <div class="modal-header">
        <h5 class="modal-title font-weight-bold" id="exampleModalLongTitle"><span style="color: #ff8b88">${title}</span> - ${year}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <img src="${poster}" alt="movie poster" width="150px" height="auto" class="float-left mr-5">
        <p>${plot}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
      </div>
  `
}