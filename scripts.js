function addRow() {
  clearAllButtons();
  var row = document.createElement('div');
  row.setAttribute('class', 'row');
  row.setAttribute('id', ROW_COUNTER+1);
  row.innerHTML = document.getElementById('0').innerHTML;
  document.getElementById('Matrix').appendChild(row);
  ROW_COUNTER++;
}

function addCol() {
  clearAllButtons();
  var rows = document.getElementsByClassName('inputs');
  rows.forEach( function(element) {
    var input = document.createElement('input');
    element.appendChild(input);
  });
  COL_COUNTER++;
}

function reset() {
  document.getElementById('Matrix').innerHTML = '<div class="row" id="0"> <button class="switch" tabindex="-1" onclick="switchRows(event);"> &#8597; </button> <div class="inputs"><input><input></div> <button class="X" tabindex="-1" onclick="addThisRow(event);"> + </button> <button class="X" tabindex="-1" onclick="multiplyRow(event);"> X </button> </div> <div class="row" id="1"> <button class="switch" tabindex="-1" onclick="switchRows(event);"> &#8597; </button> <div class="inputs"><input><input></div> <button class="X" tabindex="-1" onclick="addThisRow(event);"> + </button> <button class="X" tabindex="-1" onclick="multiplyRow(event);"> X </button> </div>';
  ROW_COUNTER = 2;
  COL_COUNTER = 2;
  ROW_CLICKED = -1;
  clearAllButtons();
}

function showInstructions() {
  var div = document.getElementById('instructions');
  if (div.getAttribute('style')) {
    div.removeAttribute('style');
  }
  else {
    div.setAttribute('style', 'display: none;');
  }
}

function switchRows(event) {
  if (ROW_CLICKED === -1) {
    console.log('stuff');
    clearAllButtons();
    ROW_CLICKED = event.target.parentNode.id;
    activateButton(event.target);
  }
  else {
    var secondValues = event.target.parentNode.querySelector('.inputs').children;
    var firstValues = document.getElementById(ROW_CLICKED).querySelector('.inputs').children;
    var temp = [];
    
    firstValues.forEach( function(element, i) {
      temp.push(element.value);
      element.value = secondValues[i].value;
    });
    secondValues.forEach( function(element, i) {
      element.value = temp[i];
    });
    
    document.getElementById(ROW_CLICKED).querySelector('.switch').setAttribute('class', 'switch');
    
    clearAllButtons();
  }
}

function clearAllButtons() {
  document.getElementsByTagName('button').forEach( function(element) {
    if (element.getAttribute('class')) {
      element.setAttribute('class', element.getAttribute('class').replace(clicked_button_str,''));
    }
  });
  hideForm();
  ROW_CLICKED = -1;
  ADD_CLICKED = -1;
}

function activateButton(button) {
  if (button.getAttribute('class').indexOf(clicked_button_str) === -1) {
    button.setAttribute('class', button.getAttribute('class') + clicked_button_str);
  }
}

function multiplyRow(event) {
  clearAllButtons();
  activateButton(event.target);
  var input = document.getElementById('multiplier');
  showMultipleForm('multiply(' + event.target.parentNode.id + ');');
  
  document.getElementById('multipleOfRow').setAttribute('style', 'display: auto;');
  input.focus();
}

function showMultipleForm(input) {
  console.log('derp');
  document.getElementById('multipleForm').setAttribute('style', 'display: auto;');
  
  document.getElementById('multipleForm').setAttribute('action', 'javascript:' + input);
}

function multiply(row) {
  var factor = document.getElementById('multiplier').value;
  if (factor === '') {
    console.warn('blank input');
    factor = 1;
  }
  document.getElementById(row).querySelector('.inputs').children.forEach( function(element) {
    console.log(element.value, '*', factor);
    element.value = myMultiply(element.value, factor);
  });
  clearAllButtons();
}

function hideForm() {
  document.getElementById('multipleOfRow').setAttribute('style', 'display: none;');
  document.getElementById('multipleOfRowAdd').setAttribute('style', 'display: none;');
  document.getElementById('multipleForm').setAttribute('style', 'display: none;');
  document.getElementById('multiplier').value = '';
}

function myMultiply(one, two) {
  return reduce(fractionMultiply(one, two));
}

function fractionMultiply(one, two) {
  if (String(one).indexOf('/') === -1 && String(two).indexOf('/') === -1) {
    return Number(one) * Number(two);
  }
  
  var oneS = [one];
  var twoS = [two];
  
  if (String(one).indexOf('/') !== -1) {
    oneS = one.split('/');
    if (oneS.length > 2) {
      console.warn('NaN');
      return NaN;
    }
    if (isNaN(oneS[0]) && isNaN(oneS[1])) {
      console.warn('NaN');
      return NaN;
    }
  }
  if (String(two).indexOf('/') !== -1) {
    twoS = two.split('/');
    if (twoS.length > 2) {
      console.warn('NaN');
      return NaN;
    }
    if (isNaN(twoS[0]) && isNaN(twoS[1])) {
      console.warn('NaN');
      return NaN;
    }
  }
  
  if (twoS.length === 2 && oneS.length === 2) {
    return oneS[0]*twoS[0]+'/'+oneS[1]*twoS[1];
  }
  else if (oneS.length === 2 && twoS.length === 1) {
    if (isNaN(two)) {
      console.warn('NaN');
      return NaN;
    }
    return oneS[0]*two+'/'+oneS[1];
  }
  else if (twoS.length === 2 && oneS.length === 1) {
    if (isNaN(one)) {
      console.warn('NaN');
      return NaN;
    }
    return twoS[0]*one+'/'+twoS[1];
  }
  else if (twoS.length === 1 && oneS.length === 1) {
    if (isNaN(one) || isNaN(two)) {
      console.warn('NaN');
      return NaN;
    }
    return one*two;
  }
  else {
    console.warn('NaN');
    return NaN;
  }
}

function reduce(input) {
  function otherReduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
  }
  
  if (String(input).indexOf('/') === -1) {
    return input;
  }
  
  var split = input.split('/');
  if (isNaN(Number(split[0])) || isNaN(Number(split[1]))) {
    console.warn('NaN');
    return NaN;
  }
  var result = otherReduce(Number(split[0]), Number(split[1]));
  if (result[0] % result[1] === 0) {
    return result[0]/result[1];
  }
  else {
    return result[0]+'/'+result[1];
  }
}

function myAdd(one, two) {
  return reduce(fractionAdd(one, two));
}

function fractionAdd(one, two) {
  if (String(one).indexOf('/') === -1 && String(two).indexOf('/') === -1) {
    return Number(one) + Number(two);
  }
  
  var oneS = [one];
  var twoS = [two];
  
  if (String(one).indexOf('/') !== -1) {
    oneS = one.split('/');
    if (oneS.length > 2) {
      console.warn('NaN');
      return NaN;
    }
    if (isNaN(oneS[0]) && isNaN(oneS[1])) {
      console.warn('NaN');
      return NaN;
    }
  }
  if (String(two).indexOf('/') !== -1) {
    twoS = two.split('/');
    if (twoS.length > 2) {
      console.warn('NaN');
      return NaN;
    }
    if (isNaN(twoS[0]) && isNaN(twoS[1])) {
      console.warn('NaN');
      return NaN;
    }
  }
  
  if (twoS.length === 2 && oneS.length === 2) {
    return addTwoFractions(oneS, twoS);
  }
  else if (oneS.length === 2 && twoS.length === 1) {
    if (isNaN(two)) {
      console.warn('NaN');
      return NaN;
    }
    return (Number(oneS[0])+Number(two*oneS[1]))+'/'+oneS[1];
  }
  else if (twoS.length === 2 && oneS.length === 1) {
    if (isNaN(one)) {
      console.warn('NaN');
      return NaN;
    }
    return (Number(twoS[0])+Number(one*twoS[1]))+'/'+twoS[1];
  }
  else if (twoS.length === 1 && oneS.length === 1) {
    if (isNaN(one) || isNaN(two)) {
      console.warn('NaN');
      return NaN;
    }
    return one+two;
  }
  else {
    console.warn('NaN');
    return NaN;
  }
  
}

// return a string
function addTwoFractions(one, two) {
  function hcf(a, b) {
    if (b === 0) {
        return a;
    }
    return hcf(b, a%b);
}
  function lcm(a,b) {
    return a*b/(hcf(a,b));
}
  var d = lcm(one[1], two[1]);
  var n = one[0]*(d/one[1])+two[0]*(d/two[1]);
  
  return n+'/'+d;
}

function addThisRow(event) {
  if (ADD_CLICKED === -1) {
    ADD_CLICKED = event.target.parentNode.id;
    activateButton(event.target);
    var input = document.getElementById('multiplier');
    showMultipleForm('');
    document.getElementById('go').setAttribute('style', 'display: none;');
    document.getElementById('multipleOfRowAdd').removeAttribute('style');
    
    input.focus();
    return ADD_CLICKED;
  }
  else {
    var inputs = document.getElementById(ADD_CLICKED).querySelector('.inputs').children;
    var factor = document.getElementById('multiplier').value;
    var final = document.getElementById(event.target.parentNode.id).querySelector('.inputs').children;
    var temp = [];
    
    if (factor === '') {
      console.warn('blank input');
      factor = 1;
    }
    
    inputs.forEach( function(element) {
      temp.push(myMultiply(element.value, factor));
    });
    console.dir(temp);
    final.forEach( function(element, i) {
      element.value = myAdd(element.value, temp[i]);
    });
    
    document.getElementById('go').removeAttribute('style');
    clearAllButtons();
  }
}

HTMLCollection.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.forEach = Array.prototype.forEach;

const clicked_button_str = ' activeButton';
var ROW_COUNTER = 2;
var COL_COUNTER = 2;
var ROW_CLICKED = -1;
var ADD_CLICKED = -1;