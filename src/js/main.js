
$(document).ready(function(){
    $(".toggle-button").click(function() {
      $("body").toggleClass("showing");
    });

    $(".toggle-button-close").click(function () {
        $("body").removeClass("showing");
      });

      $('.grid').masonry({
        // options
        itemSelector: '.grid-item',
        columnWidth: 200
      });
});

