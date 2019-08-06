$(function() {

    // create game
    let game = new GameManager('handPlayer', moviedb, apiKey, 'dev');
    game.startGame(EventController);


});
