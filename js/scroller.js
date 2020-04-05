window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}


var controller = new ScrollMagic.Controller();
var revealElements = document.getElementsByClassName("step");

for (var i = 0; i < revealElements.length; i++) { // create a scene for each element
    var scene = new ScrollMagic.Scene({
            triggerElement: revealElements[i],
            duration: 500,
            offset: -100
        })
        // .setClassToggle(revealElements[i], "visible") // add class toggle
        .on('enter', canvasTransition.bind(this, i))
        .addTo(controller);
}