function getHoveredElements(element, samples, tag_restriction) {
  if (!samples) {
    samples = 2;
  }
  var margin = 1;
  
  var e_pos = element.getBoundingClientRect();
  var hovered_elements = [];
  var x_positions = [];
  var y = e_pos.top - margin;
  
  // set bounds
  var bounds = {
    left: e_pos.left - margin,
    right: e_pos.right + margin
  };
  var inc = ( bounds.right - bounds.left ) / ( samples - 1 );
  
  for ( var i = 0; i < samples - 1; i++ ) {
    x_positions.push(bounds.left + inc * i);
  }
  x_positions.push(bounds.right);
  
  x_positions.forEach( function(x) {
    var hovered = document.elementFromPoint( x, y );
    console.log(hovered);
    var push = false;
    if ( !tag_restriction || hovered.tagName === tag_restriction.toUpperCase() ) {
      push = true;
    }
    if ( push && hovered_elements.indexOf(hovered) === -1 ) {
      hovered_elements.push(hovered);
    }
    // drawDot( x, y, 'blue');
  });
  
  return hovered_elements;
  
  
  

  function drawDot(x, y, color) {
    var canvas = document.createElement('canvas');
    canvas.width = "3";
    canvas.height = "3";
    canvas.style.position = 'absolute';
    canvas.style.top = String(y - 1).concat('px');
    canvas.style.left = String(x - 1).concat('px');
    canvas.style.zIndex = 999;
    
    if (canvas.getContext){

      var context = canvas.getContext('2d');
      var centerX = window.innerWidth / 2;
      var centerY = canvas.innerHeight / 2;
      var radius = 70;

      context.fillStyle = color;
            context.fillRect(0,0,window.innerWidth,window.innerHeight);

            context.beginPath();
      
      }
      document.body.appendChild(canvas);
  }
}