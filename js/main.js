// Raccourci Evènement Ready
$(function() {

    var apiKey = "4a7c07f50800222e53c80f2dc5f61d36";
    var moviedb = "https://api.themoviedb.org/3/movie/";
    var intervalID;
    var deg = 0;
    var card_start_id;
    var movies = new Array();
    var status = null;
    var nbMovies = 0;
    var limit = 3;

    /**** EVENTS ****/
    $('#handPlayer > .cardContainer > .card').hover(function(){
        let card = $(this);
        let card_id = card.attr('id').split('-')[1];
        $('#card-'+card_id).addClass('shadowIn')
    });

    $('#handPlayer > .cardContainer > .card').mouseleave(function()
    {
      let card = $(this);
      let card_id = card.attr('id').split('-')[1];
      $('#card-'+card_id).removeClass('shadowIn');
    })

    $('#handPlayer > .cardContainer > .card >.getCardButton').mouseenter(function(){
        let card_id = $(this).parent().attr('id').split('-')[1];
        let button = $('#getCardButton-'+card_id);
        intervalID = setInterval(function() { rotateElement(button) }, 100);
    });

    $('#handPlayer > .cardContainer > .card > .getCardButton').mouseleave(function(){
      clearInterval(intervalID);
      let card_id = $(this).parent().attr('id').split('-')[1];
      let button = $('#getCardButton-'+card_id);
      button.css("transform", "rotate(0deg)");
      deg = 0;
    })

    // select a movie
    $('#handPlayer > .cardContainer > .card >.getCardButton').click(function(e)
    {
        let card = $(this).parent();
        let card_id = card.attr('id').split('-')[1];
        let latestMovieUrl = "https://api.themoviedb.org/3/movie/latest";
        getAMovie(card, card_id, latestMovieUrl);
    })

    /****** FUNCTIONS *******/

    // rotate
    function rotateElement(element)
    {
      deg = deg + 10;
      element.css("transform", "rotate("+deg+"deg)");
    }

    function returnCard(card, card_id, imgSrc)
    {
      card.addClass('cardAnimation');

      var img = $('<img />').attr({
          'id': 'img'+card_id,
          'src': imgSrc ,
          'alt': 'poster',
          'width': 300,
          'height': 400,
      }).appendTo("#imgTarget-"+card_id).fadeIn();

    }

    // get a movie
    function getAMovie(card, card_id, latestMovieUrl)
    {
      // retrieve first the latest movie id
      $.get(latestMovieUrl, { api_key : apiKey} ).done(function(data) {
        let latestMovieId = data.id;

        // random movie id
        let movieId = Math.floor(Math.random() * 1000) + 1  ;
        let url = moviedb+movieId;

        // retrieve the movie
        $.get(
              url,
              { api_key : apiKey, language : "fr" }
            ).done(function (data) {

                // if there is no poster to show select another movie
                if(data.poster_path == null) {
                  getAMovie(card, card_id, latestMovieUrl);
                }

                // create img src
                let imgSrc = "https://image.tmdb.org/t/p/w500"+data.poster_path;

                // add img and return it
                returnCard(card, card_id, imgSrc);
                $("#imgTarget-"+card_id).addClass('cardMovie');

                // add data movie to array
                movies[card_id] = data;

                nbMovies++;

                console.log(nbMovies);

                if(nbMovies === limit) {
                  startGame();
                }

          // if case of 404 select another movie
          }).fail(function(e){
            getAMovie(card, card_id, latestMovieUrl);
          })
          ;

      });
    }

    /**** START GAME ****/

    function startGame()
    {
          // stop card cardAnimation
          $('.card').removeClass('cardAnimation');

          // active sortable
          $('#handPlayer').sortable('option', 'disabled', false);

          // show button validation
          $('#validAnswer').show();
    }

    /*** SORTABLE ****/

    $('#handPlayer').sortable({
      cursor: "move",
      distance: 10,
      disabled: true,
      stop: function( event, ui ) {
        $( "#handPlayer" ).sortable( "refreshPositions" );
      }
    });
    $('#handPlayer').disableSelection();



    /*** valid order ****/
    $('#validAnswerButton').click(function() {
      var sorted = $( "#handPlayer" ).sortable( "toArray");
      var sorted_movies = new Array();

      $('.cardElement').show();

      for(let i = 0; i<sorted.length; i++)
      {
          let m = new Array();
          let sorted_id = sorted[i].split('-')[1];
          let dateKey = movies[sorted_id].release_date.replace(/-/g, '');
          let release_date = movies[sorted_id].release_date;
          let title = movies[sorted_id].title;
          m = [title, release_date, dateKey ];
          sorted_movies[i] = m;

          let releaseDateFormat = $.datepicker.formatDate('dd M yy', new Date(release_date));

          // show cardElement
          $('#'+sorted[i]+' > .cardElement').html('<h5>'+title+'</h5>');
          $('#'+sorted[i]+' > .cardElement').append('<h6>'+releaseDateFormat+'</h6>');


          //show game option
          $('#startAgain').show();
          $('#validAnswerButton').hide();
      }

      if(sorted_movies[0][2] < sorted_movies[1][2] &&  sorted_movies[1][2] < sorted_movies[2][2])
      {
        status = 1
      } else {
        status = 0;
      }

      // status
      if(status == 1) {
        $('#result').html('<h2>Gagné</h2>');
      } else {
        $('#result').html('<h2>Perdu<h2>');
      }

    })

});
