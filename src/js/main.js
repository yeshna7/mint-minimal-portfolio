
$(document).ready(function(){
    $(".toggle-button").click(function() {
      $("body").toggleClass("showing");
    });

    $(".toggle-button-close").click(function () {
        $("body").removeClass("showing");
      });
});
