$(function() {

    // create game
    let game = new GameManager('handPlayer', moviedb, apiKey);
    game.createCards();
    game.initEvents();

});
