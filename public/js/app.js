// ========================
// DEPENDENCIES
// ========================
// Angular Module
const app = angular.module('betterboxdApp', []);

// ========================
// CONTROLLERS
// ========================
// Main Controller
app.controller('MainController', ['$http', function($http){

  // ======= GLOBAL CONFIG(aka some variables)
  // validates for showing the movie details on click, it's changed to true when the movie title is clicked after being searched
  this.showMovieInfo = false

  //validates for showing the movie list after clicking to search by name
  this.showMovieList = false

  // for prior ES6 functions to be able to use this.
  controller = this;

  // setting for session validation
  this.loggedInUsername = null;

  // for user's name
  this.loggedInName = null;
  // ======= API CALLS ====================

  // --- Users+Session Datapoint
  //////////////////
  //Authentication Functions
  //This function gets the username of the user currently in session, then fetches data
  //takes the get function as a parameter
  /////////////////

  this.displayApp = (getData) => {
      $http({
          method:'GET',
          url: '/sessions/'
      }).then(function(response){
          controller.loggedInUsername = response.data.username;
          controller.loggedInName = response.data.name;
          getData(response.data.username);
      }, function(){
          console.log('error');
      });
  }

  ////////////////////////////
  // Create User Function
  // Take information from form, create user, and clear form and leave success or fail message
  ////////////////////////////

  this.createUser = () => {
      $http({
          method:'POST',
          url:'/users',
          data: {
              name: this.createname,
              username: this.createusername,
              password: this.createpassword
          }
      }).then(function(response){
          console.log(response);
          controller.createname = 'thanks, now login';
          controller.createusername = null;
          controller.createpassword = null;
      }, function(error){
          console.log(error);
          controller.createname = 'fail';
          controller.createusername = null;
          controller.createpassword = null;
      })
  }

  //////////////////////
  //LOGIN FUNCTION
  //Takes the Get Function as a Parameter to make sure to populate data on logIn
  // It passes the get function to displayapp so it can populate after establishing session
  //////////////////////

  this.logIn = (getData) => {
  $http({
      method:'POST',
      url:'/sessions/',
      data: {
          username: this.username,
          password: this.password
      }
  }).then(function(response){
      console.log(response);
      controller.username = null;
      controller.password = null;
      controller.displayApp(getData);
  }, function(error){
      console.log(error);
      controller.username = 'fail';
      controller.password = null;
  })
  }

  /////////////////////
  //LOGOUT FUNCTION
  //Takes a function to clear all data as a parameter, so data from previous user doesnt linger
  /////////////////////
  this.logOut = (clearFunction) => {
  $http({
      method:'DELETE',
      url:'/sessions/'
  }).then(function(response){
      console.log(response);
      clearFunction();
  }, function(error){
      console.log(error);
  });
  }

  //////////////////////
  //Clear Data Function
  //Clear any data upon logout or when needed
  //////////////////////

  this.clearData = () => {
      this.loggedInUsername = null;
      this.loggedInName = null;
      this.showMovieInfo = false
      this.showMovieList = false
  }



  // --- OMDB API
  //search for movies -- this.movieTitle is coming from the form ng-model in the searchbox
  this.getMovies = () => {
    $http({
      method:'GET',
      url: 'http://www.omdbapi.com/?apikey=53aa2cd6&s='+this.movieTitle
    }).then( response =>{
      this.movieList = response.data.Search
      console.log(this.movieList);
    }, error => {
      console.log(error);
    })

    //erasing the input field
    this.movieTitle = ''
  }

  // display specific movie and comments associated -- getInfo function calls OMDB API for the movie details.
  this.getInfo = (movieId) => {
    //turning into false to hide the movie list after clicking
    this.showMovieList = false
    $http({
      method:'GET',
      url: 'http://www.omdbapi.com/?apikey=53aa2cd6&i='+movieId
    }).then( response =>{
      this.movieInfo = response.data
      console.log(this.movieInfo);
    }, error => {
      console.log(error);
    })
    this.showMovieInfo = true;

  }

  // like movie / unlike movies

  // add movie comment

  // delete movie comment

  // edit movie comment







}])
