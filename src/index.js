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
    this.getMovies();
  },
  createElem: function(tagName, results) {
    let newElem = document.createElement(tagName);
    if (tagName == "img") {
      newElem.setAttribute(
        "src",
        "http://image.tmdb.org/t/p" + this.image_size + results
      );
    } else if (tagName == "a") {
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
          this.removeLink();
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
    this.error(url, "movie");
    this.removeLink();
    this.movie.results.map(num => {
      this.createElem("a", num);
    });
  },
  error: function(url, name) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    if (request.status == 200) {
      this[name] = JSON.parse(request.responseText);
      this[name].results.map(num => {
        this.createElem("a", num);
      });
    } else {
      this.createElem(
        "p",
        name.charAt(0).toUpperCase() + name.slice(1) + " not found."
      );
    }
  },

  getMovies: function() {
    this.error(this.trending, "movie");
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
  getImage: function(obj) {
    start.createElem("img", obj);
  },
  getRecomendation: function(id) {
    let url =
      this.apikey + "movie/" + id + "/recommendations?api_key=" + this.key;
    this.createElem("h3", "Recomendations:");
    this.error(url, "recomendation");
  },

  removeLink: function() {
    while (this.parent.firstChild) {
      this.parent.removeChild(this.parent.firstChild);
    }
  }
};

let start = new app.Movies();
start.init();

let reload = document.getElementById("search");
reload.addEventListener("click", function() {
  if (start.inputValue.value) {
    start.getMovieByName();
  } else {
    start.removeLink();
    start.init();
  }
});
