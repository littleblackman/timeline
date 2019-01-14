
/**
 * Class card
 */
class Card {
  constructor(id) {
    this.id = id;
    this.containerId;
    this.cardId;
    this.imgTarget;
    this.getCardButton;
    this.cardElementId;
    this.id;
    this.imgSrc;

    this.deg = 0;

    this.setElements();
  }

  setElements() {
    this.containerId = "cardContainer-" + this.id;
    this.cardId = "card-" + this.id;
    this.imgTarget = "imgTarget-" + this.id;
    this.getCardButton = "getCardButton-" + this.id;
    this.cardElementId = "cardElement-" + this.id;
  }

  appendCard() {
    let origin = $('#handPlayer > .cardContainer').last();
    let newCont = origin.clone();

    newCont.attr('id', 'cardContainer-' + this.id);
    newCont.children(':first-child').attr('id', 'card-' + this.id);
    newCont.children(':first-child').children(':first-child').attr('id', 'imgTarget-' + this.id);
    newCont.children(':first-child').children(':first-child').next().attr('id', 'getCardButton-' + this.id);
    newCont.children('.cardElement').attr('id', 'cardElement-' + this.id);

    $('#handPlayer').append(newCont);
  }

  rotate(element)
  {
      this.deg = this.deg + 10;
      element.css("transform", "rotate("+this.deg+"deg)");
  }


  returnCard()
  {
      let $card = $('#card-'+this.id).addClass('cardAnimation');

      $card.addClass('cardAnimation');

      let img = $('<img />').attr({
          'id': 'img'+this.id,
          'src': this.imgSrc ,
          'alt': 'poster',
          'width': 300,
          'height': 400,
      }).appendTo("#imgTarget-"+this.id).fadeIn();

  }








}
