

class AnimationElement
{
    constructor(game)
    {

    }

    swapColor(target, targetcolor, backcolor = "no")
    {
        $( "#"+target ).animate({
          backgroundColor: targetcolor
      }, 2000, function() {
          if(backcolor != "no") {
              $( "#"+target ).animate({ backgroundColor : backcolor})
          }
      });
    }

    showHtml(target, message)
    {
        $('#'+target).hide();
        $('#'+target).html(message);
        $('#'+target).fadeIn("slow");
    }

}
