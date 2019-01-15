

class GameManager
{
    constructor(handPlayer, moviedb, apiKey) {
        this.handPlayer = handPlayer;
        this.moviedb    = moviedb;
        this.nbMovies   = 0;
        this.limit      = 3;
        this.apiKey     = apiKey;
        this.cards      = new Array();
        this.movies     = new Array();
        this.win        = 1;
        this.eventController = new EventController(this);
    }

    createCards()
    {
        let cards = new Array();
        let originCard = new Card(0);
        cards[0] = originCard;
        for(let i = 1; i < this.limit; i++) {
            let card = new Card(i);
            card.appendCard();
            cards[i] = card;
        }
        this.cards = cards;
    }

    retrieveCard(card_id)
    {
        let id = parseInt(card_id);
        let cards = this.cards;
        return cards[id];
    }

    initEvents()
    {
        this.eventController.init();
    }

    findRandomMovie(card_id){
         let game = this;
         let latestMovieUrl = "https://api.themoviedb.org/3/movie/latest";
         $.get(latestMovieUrl, { api_key : apiKey} ).done(function(data) {
           let latestMovieId = data.id;

           // random movie id
           let randomId = Math.floor(Math.random() * 1000) + 1  ;
           game.retrieveMovie(card_id, randomId);
       });
    }


    retrieveMovie(card_id, randomId)
    {
        let currentCard = this.retrieveCard(card_id);
        let game        = this;
        let url         = game.moviedb+randomId;


        // retrieve the movie
        $.get(
            url,{ api_key : game.apiKey, language : "fr" }
        ).done(function (data) {

            // if there is no poster to show select another movie
            if(data.poster_path == null) {
                game.findRandomMovie(card_id);
            }

            // hydrate card
            currentCard.hydrateFromMovie(data);

            // add img and return it
            currentCard.returnCard();
            $("#imgTarget-"+card_id).addClass('cardMovie');

            game.nbMovies = game.nbMovies+1;

            if(game.nbMovies  === game.limit) {
                game.startGame();
            }

        // if case of 404 select another movie
        }).fail(function(e){
            game.findRandomMovie(card_id);
        });
    }

    startGame()
    {
        // stop card cardAnimation
        $('.card').removeClass('cardAnimation');

        // active sortable
        this.eventController.sortableInit();

        // show button validation
        $('#validAnswer').show();
    }

    checkResult()
    {
        let game = this;

        var sorted = $( "#handPlayer" ).sortable( "toArray");
        var sorted_dateKey = new Array();

        for(let i = 0; i<sorted.length; i++)
        {
            let sorted_id = sorted[i].split('-')[1];
            let currentCard = game.retrieveCard(sorted_id);

            sorted_dateKey[i] = currentCard.dateKey;

            let title = currentCard.title;
            let releaseDateFormat = $.datepicker.formatDate('dd M yy', new Date(currentCard.release_date));

            // show cardElement
            $('.cardElement').show();
            $('#'+sorted[i]+' > .cardElement').html('<h5>'+title+'</h5>');
            $('#'+sorted[i]+' > .cardElement').append('<h6>'+releaseDateFormat+'</h6>');

        }

        // compare dateKey
        for(let j= 0; j<sorted_dateKey.length; j++)
        {   if(sorted_dateKey[j+1]) {
              // if first datekey is bigger than next
              if(sorted_dateKey[j] > sorted_dateKey[j+1]) {
                 game.win = 0
              }
          }

        }

        this.showResult();
    }

    showResult()
    {
        $('#startAgain').show();
        $('#validAnswerButton').hide();

        if(this.win == 1) {
            $('#result').html('<h2>Gagné</h2>');
        } else {
            $('#result').html('<h2>Perdu<h2>');
        }
    }

}
