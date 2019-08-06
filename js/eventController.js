class EventController
{
    constructor(game)
    {
        this.game = game;
    }

    init()  {

      let game = this.game;

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
          let card    = game.retrieveCard(card_id);
          let button  = $('#getCardButton-'+card_id);
          intervalID  = setInterval(function() { card.rotate(button) }, 100);
      });

      $('#handPlayer > .cardContainer > .card > .getCardButton').mouseleave(function(){
        clearInterval(intervalID);
        let card_id = $(this).parent().attr('id').split('-')[1];
        let card    = game.retrieveCard(card_id);
        let button = $('#getCardButton-'+card_id);
        button.css("transform", "rotate(0deg)");
        game.deg = 0;
      })

      // select a movie
      $('#handPlayer > .cardContainer > .card >.getCardButton').click(function(e)
      {
          let card_id = $(this).attr('id').split('-')[1];
          game.findRandomMovie(card_id);
      })

      $('.jokerButton').click(function(){
          let card_id = $(this).attr('id').split('-')[1];
          let card    = game.retrieveCard(card_id);
          card.showCardElement();
          game.jokerStock = game.jokerStock - 1;
          $('#jokerStock').html(game.jokerStock);

          if(game.jokerStock == 0)
          {
              $('.jokerButton').hide();
          }
      })

    }

    stopEvent() {

      $('#handPlayer > .cardContainer > .card').off('hover');
      $('#handPlayer > .cardContainer > .card').off('mouseleave');
      $('#handPlayer > .cardContainer > .card >.getCardButton').off('mouseenter');
      $('#handPlayer > .cardContainer > .card > .getCardButton').off('mouseleave');
      $('#handPlayer > .cardContainer > .card >.getCardButton').off('click');
      $('.jokerButton').off('click');
      $('#validAnswerButton').off('click');
      $('#goOn').off('click');
      $('#newGame').off('click');
    }

    sortableInit()
    {
        let game = this.game;

        $('#handPlayer').sortable({
          cursor: "move",
          distance: 10,
          stop: function( event, ui ) {
            $( "#handPlayer" ).sortable( "refreshPositions" );
          }
        });
        $('#handPlayer').disableSelection();

        /*** valid order & continue options ****/
        $('#validAnswerButton').click(function() {
            game.checkResult();
        });

        $('#goOn').click(function(){
            game.gameContinue();
        })

        $('#newGame').click(function() {
            game.gameContinue();
        })

        if(game.jokerStock > 0)
        {
            $('.jokerButton').show();
        }

    }

}
