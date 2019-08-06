class GameManager
{
    constructor(handPlayer, moviedb, apiKey, mode) {
        this.eventController = new EventController(this);
        this.myAnimation     = new AnimationElement();
        this.handPlayer = handPlayer;
        this.moviedb    = moviedb;
        this.apiKey     = apiKey;
        this.cards      = new Array();
        this.movies     = new Array();

        this.nbMovies = 0;
        this.win = 1;

        this.initValues();

        this.mode = mode;

        //this.startGame(this.eventController);
    }

    // initValues
    initValues()
    {
        this.point  = 0;
        this.round  = 1;
        this.limit  = 3;
        this.limit2 = 4
        this.step   = 20;
        this.jokerStock = 7;
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

    deleteCard(card_id)
    {
        let id = parseInt(card_id);
        let cards = this.cards;
        delete cards[id];
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

            currentCard.appendElementMovie();

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
        $('.card').removeClass('cardAnimation');

        // active sortable
        this.eventController.sortableInit();

        // show button validation
        $('#validAnswerButton').show();
    }

    // reset data when game continue
    gameContinue()
    {

        //removeClass
        $(".imgTarget").removeClass('cardMovie');
        $('.card').addClass('cardAnimation');

        // remove cards
        for(let i = 1; i < this.limit; i++) {
            $('#cardContainer-'+i).remove();
        }

        // restore cards
        this.cards = new Array();

        // remove img0
        $('#img0').remove();

        this.eventController.stopEvent();

        $('.partyButton').hide();

        // start game
        this.startGame();

    }


    startGame()
    {

        $('.cardElement').empty();

        $('.jokerButton').hide();

        $('#result').css('backgroundColor', "rgba(255, 255, 255, 0.90)");
        $('#resultMessage').empty().show();

        $('#jokerStock').html(this.jokerStock);

        $('#validAnswerButton').hide();

        // remove Cardelement
        if(this.mode != "dev") {
            $('.cardElement').hide();
        } else {
            console.log('--------');

            console.log('mode = dev');
            console.log('start game');
            // show vars
            console.log('point: '+this.point);
            console.log('round: '+this.round);
            console.log('limit: '+this.limit);
            console.log('step: '+this.step);
            console.log('win: '+this.win);
            console.log('nbMovies: '+this.nbMovies);
            console.log('--------');
        }


        $('.card').addClass('cardAnimation');
        this.createCards();
        this.initEvents();

        // init for each set
        this.win = 1;
        this.nbMovies = 0;

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

            // show cardElement
            $('.cardElement').show();

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

    showPointAndRound()
    {
        $('#points').html(this.point);
        $('#round').html(this.round);
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
        let game = this;

        var targetcolor;

        // if win == 1
        if(win == 1)
        {
            // calcul point
            point = point + step;
            round ++;

            // step and round
            if(round > 6)  {
                step = 25;
                limit = game.limit2;
            };

            if( round == 11 )
            {
                alert('game over');
            }

            // resultMessage
            resultMessage = '<h2>Gagné</h2>';
            $('#goOn').show();

            targetcolor = "#82E765";

            // update data
            game.point = point;
            game.round = round;
            game.limit = limit;
            game.step  = step;


        } else {
            // resultMessage
            resultMessage = '<h2>Perdu</h2>';
            $('#newGame').show();

            // init value
            this.initValues();

            targetcolor = "#E78865";
        }

        // show bar information result
        $('#validAnswerButton').hide();
        this.myAnimation.swapColor('result', targetcolor);
        this.myAnimation.showHtml('resultMessage', resultMessage);



        this.showPointAndRound();

    }

}
