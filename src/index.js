let app = {};
app.Movies = function() {
  this.apikey = "https://api.themoviedb.org/3/";
  this.key = "f86cc31e3850cd90ef8e189703f28ac1";
  this.image_size = "/w500/";
  this.movie = {};
  this.parent = document.getElementById("app");
  this.recomendation = {};
  this.inputValue = document.getElementById("data");
  this.trending = this.apikey + "trending/all/day?api_key=" + this.key;
};

app.Movies.prototype = {
  init: function() {
    this.getTrendingMovies();
  },
  createElem: function(tagName, results) {
    let newElem = document.createElement(tagName);
    if (tagName === "img") {
      newElem.setAttribute(
        "src",
        "http://image.tmdb.org/t/p" + this.image_size + results
      );
    } else if (tagName === "a") {
      let title = results.original_title
        ? results.original_title
        : results.original_name;
      title = title ? title : results.name;
      newElem.setAttribute("href", title);
      newElem.setAttribute("id", results.id);
      newElem.addEventListener(
        "click",
        function(evt) {
          evt.preventDefault();
          this.removeElements();
          this.getImage(
            results.backdrop_path ? results.backdrop_path : results.logo_path
          );
          this.createElem("h3", title);
          this.createElem("p", results.overview);
          this.getRecomendation(results.id);
        }.bind(this),
        false
      );
      newElem.innerHTML = title;
      newElem.setAttribute("title", title);
    } else {
      newElem.innerHTML = results;
    }
    this.parent.appendChild(newElem);
  },

  getMovieByName: function() {
    let url =
      this.apikey +
      "search/company?api_key=" +
      this.key +
      "&query=" +
      this.inputValue.value +
      "&page=1";
    this.request(url, "movie");
    this.removeElements();
  },

  request: function(url) {
    fetch(url)
      .then(response => {
        if (response.status !== 200) {
          return Promise.reject({
            status: response.status,
            statusText: response.statusText
          });
        }
        return (response = response.json());
      })
      .then(data => {
        if (data.total_results === 0) {
          return Promise.reject({
            statusText: "Not found items."
          });
        } else
        this.movie = data.results;
        console.log(this.movie);
        this.renderMovieLink();
      })
      .catch(error => {
        console.log("Fetch error: " + error.status, error.statusText);
        this.createElem(
          "p",
          "Looks like there was a problem. <br> Status Code : " +
            error.statusText
        );
      });
  },

  getTrendingMovies: function() {
    this.request(this.trending);
  },

  setLinks: function() {
    let link = document.getElementsByTagName("a");
    for (let i = 0; i < link.length; i++) {
      document.getElementById(link[i].id).addEventListener(
        "click",
        function(evt) {
          this.getImage(evt);
        }.bind(this),
        false
      );
    }
  },

  renderMovieLink: function(){
    this.movie.map(num => {
      this.createElem("a", num);
    });
  },

  getImage: function(obj) {
    start.createElem("img", obj);
  },

  getRecomendation: function(id) {
    let url =
      this.apikey + "movie/" + id + "/recommendations?api_key=" + this.key;
    this.createElem("h3", "Recomendations:");
    this.request(url, "recomendation");
  },

  removeElements: function() {
    let linkArray =  document.getElementById("app");
    while (linkArray.firstChild) {
      linkArray.innerHTML = '';
    }
  }
};

let start = new app.Movies();
start.init();

let reload = [
  document.getElementById("search"),
  document.getElementById("home"),
  document.getElementById("data")
];

reload.map(element => {
  if (element.id === "data") {
    element.onkeydown = function(e) {
      if (e.keyCode === 13) {
        start.getMovieByName();
      }
    };
  };
  if (element.id === "home") {
    element.addEventListener("click", function() {
      start.removeElements();
      start.init();
    });
  };
  if (element.id === "search") {
    element.addEventListener("click", function() {
      if (start.inputValue.value) {
        start.getMovieByName();
      } else {
        start.removeElements();
        start.init();
      }
    });
  };
});
