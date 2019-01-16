

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
        this.point      = 0;
        this.round      = 1;
        this.step       = 20;
    }

    // create the cards
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

    // retrieve a card
    retrieveCard(card_id)
    {
        let id = parseInt(card_id);
        let cards = this.cards;
        return cards[id];
    }

    // init the event listenner
    initEvents()
    {
        this.eventController.init();
    }

    // find a random id movie
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

    // retrieve a movie
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
                game.startSortableParty();
            }

        // if case of 404 select another movie
        }).fail(function(e){
            game.findRandomMovie(card_id);
        });
    }

    // start game when all cards are founded
    startSortableParty()
    {
        // stop card cardAnimation
        //$('.card').removeClass('cardAnimation');

        // active sortable
        this.eventController.sortableInit();

        // show button validation
        $('#validAnswer').show();
    }

    // reset data when game continue
    gameContinue()
    {

        console.log('remove');
        // remove cards
        for(let i = 1; i < this.limit; i++) {
            $('#cardContainer-'+i).remove();
            console.log('#cardContainer-'+i);
        }
        // remove img0
        $('#img0').remove();

        // remove element
        $('.cardElement').empty();
        $('.cardElement').hide();

        // start game
        this.startGame();

    }


    startGame(nb)
    {
        //
        $('.card').addClass('cardAnimation');
        $('#validAnswer').show();
        this.createCards();
        this.initEvents();
    }

    // verif result
    checkResult()
    {
        let game = this;

        var sorted = $( "#handPlayer" ).sortable( "toArray");
        var sorted_dateKey = new Array();

        // create the sorted_dateKey
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

        this.calculResult();
    }

    // calcul result
    calculResult()
    {
        let win   = this.win
        let point = this.point;
        let step  = this.step;
        let round = this.round;
        let resultMessage;
        let limit = this.limit;

        // if win == 1
        if(win == 1)
        {
            // calcul point
            point = point + step;
            round = round + 1;
            $('#points').html(point);
            $('#round').html(round);


            // step and round
            if(round > 6 )  { step = 15};
            if(round > 10 ) { step = 10};
            if(round > 20 ) { step = 5};

            // change limit
            if(round > 4)  { limit = limit + 1 }
            if(round > 8)  { limit = limit + 1 }
            if(round > 12) { limit = limit + 1 }
            if(round > 16) { limit = limit + 1 }

            // resultMessage
            resultMessage = '<h2>Gagné</h2>';
            $('#goOn').show();

        } else {
            // resultMessage
            resultMessage = '<h2>Perdu</h2>';
            $('#newGame').show();
        }

        // show bar information result
        $('#validAnswerButton').hide();
        $('#result').html(resultMessage);

        // update data
        this.point = point;
        this.round = round;
        this.limit = limit;

    }

}
