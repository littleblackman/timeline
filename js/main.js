$(function() {

    // create game
    let game = new GameManager('handPlayer', moviedb, apiKey);
    game.startGame(EventController);

});
