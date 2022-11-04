
$(document).ready(function(){
    $(".toggle-button").click(function() {
      $("body").toggleClass("showing");
    });


      $('.grid').masonry({
        // options
        itemSelector: '.grid-item',
       gutter:30,
      });

      $(".work__link").click(function(event){
        event.preventDefault();
      });

      $(document).ready(function() {
        $('select').niceSelect();

      });
});

