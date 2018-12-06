// Using example from Daniel Shiffman's A2Z F18
// https://github.com/shiffman/A2Z-F18

function setup() {
  noCanvas();

  // This is all for submitting a new word

  // Input from user
  var artistinput = select('#artist');

    // Use loadJSON
    loadJSON(url, submitted);
    function submitted(result) {
      // Just look at the reply in the console
      console.log(result);
    }

    $('audio').mediaelementplayer({
      features: ['playpause','progress','current','tracks','fullscreen']
    });
  }