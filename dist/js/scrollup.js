// const toTop = document.querySelector("foot__scroll");

// toTop.addEventListener("click", function() {
//     console.log('dfg'); 
// // $("html, body").animate({scrollTop:0}, "slow");
    
// });

$(".foot__scroll").click(function() {
    $("html, body").animate({scrollTop:0}, 1000); 
});