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

function removeCol() {
  if (COL_COUNTER <= 2) {
    console.warn('Tried to remove column when only 2 existed.');
    return false;
  }
  clearAllButtons();
  var rows = document.getElementsByClassName('inputs');
  rows.forEach( function(element) {
    element.removeChild(element.lastChild);
  });
  COL_COUNTER--;
}

function removeRow() {
  if (ROW_COUNTER <= 2) {
    console.warn('Tried to remove row when only 2 existed.');
    return false;
  }
  clearAllButtons();
  var matrix = document.getElementById('Matrix');
  matrix.removeChild(matrix.lastChild);
  ROW_COUNTER--;
}

function fillWithZeros() {
  var inputs = document.getElementsByTagName('INPUT');
  inputs.forEach( function(element) {
    if (element.value === '') {
      element.value = '0';
    }
  });
}

function equalArray(one, two) {
  if (one.constructor !== Array || two.constructor !== Array) {
    return false;
  }
  else if (one.length !== two.length) {
    return false;
  }
  for(var i in one) {
    if (one[i].constructor === Array) {
      if (!equalArray(one[i], two[i])) {
        return false;
      }
    }
    else {
      if (one[i] !== two[i]) {
        return false;
      }
    }
  }
  return true;
}

function checkMatrix() {
  var matrix = getMatrix();
  reduceMatrix(LAST_MATRIX);
  
  if (equalArray(matrix, LAST_MATRIX)) {
    colorMatrix('good');
  }
  else {
    colorMatrix('bad');
  }
}

function colorMatrix(className) {
  window.clearTimeout(TIMEOUT_ID);
  styleRemove();
  document.getElementById('Matrix').setAttribute('class', 'matrix '+className);
  
  TIMEOUT_ID = window.setTimeout(styleRemove, 3000);
}

function styleRemove() {
  // document.getElementById('CheckText').setAttribute('style', 'display: none;');
  
  document.getElementById('Matrix').setAttribute('class', 'matrix');
}

function getMatrix() {
  var result = [];
  var rows = document.getElementsByClassName('row');
  
  rows.forEach( function(row, i) {
    result.push([]);
    row.getElementsByTagName('INPUT').forEach( function(element) {
      if (element.value === '') {
        result[i].push(0);
      }
      else {
        result[i].push(toMyNumber(element.value));
      }
    });
  });
  
  return result;
}

function vectorScale(scalar, vector) {
  var result = [];
  vector.forEach( function(element) {
    result.push(scalar*element);
  });
  return result;
}

function matrixRowSwap(matrix, one, two) {
  var temp = matrix[one];
  matrix[one] = matrix[two];
  matrix[two] = temp;
  return matrix;
}

function vectorAdd(one, two) {
  var result = [];
  if (one.length !== two.length) {
    throw new Error('Unequal length of vectors.');
  }
  one.forEach( function(e, i) {
    result.push(e+two[i]);
  });
  return result;
}

// creates a copy of the matrix
// I use this really just to prevent mutation of the original matrix
function copyMatrix(matrix) {
  var copyMatrix = [];
  for (var k in matrix) {
    copyMatrix[k] = matrix[k].filter(function() {return true;});
  }
  return copyMatrix;
}

function reduceMatrix(passedMatrix) {
  var matrix = copyMatrix(passedMatrix);
  // col = column to put a 1 in front
  // row = row that needs a pivot
  for (var col = 0, row = 0; col < matrix.length; col++) {
    // j = row that doesn't have a 0 in front, swap to row row
    for (var j = row; j < matrix[0].length; j++) {
      if (matrix[j][col] !== 0) {
        matrixRowSwap(matrix, row, j);
        matrix[row] = vectorScale(1/matrix[j][col], matrix[j]);
        // k = row to remove numbers from  above the 1
        for (var k = 0; k < matrix.length; k++) {
          if (k !== row) {
            matrix[k] = vectorAdd(vectorScale(-1*matrix[k][col], matrix[row]), matrix[k]);
          }
        }
        row++;
        break;
      }
    }
  }
  return matrix;
}

function showSolved() {
  var reduced = reduceMatrix(LAST_MATRIX);
  
  printMatrix(reduced);
}

function printMatrix(matrix) {
  console.log(matrixToString(matrix));
}

function matrixToString(matrix) {
  var output = '';
  for (var row in matrix) {
    for (var col in matrix[row]) {
      output = output.concat(matrix[row][col], ', ');
    }
    output = output.substr(0, output.length - 2).concat('\n');
  } 
  return output;
}

function reset() {
  var inputs = document.getElementById('Matrix').getElementsByTagName('Input');
  var i = 0;
  for (var row in LAST_MATRIX) {
    for (var col in LAST_MATRIX[row]) {
      inputs[i].value = LAST_MATRIX[row][col];
      i++;
    }
  }
  resizeAllInputs();
}

function clear() {
  document.getElementById('Matrix').innerHTML = '<div class="row" id="0"> <button class="switch" tabindex="-1" onclick="switchRows(event);"> &#8597; </button> <div class="inputs"><input><input></div> <button class="X" tabindex="-1" onclick="addThisRow(event);"> + </button> <button class="X" tabindex="-1" onclick="multiplyRow(event);"> X </button> </div> <div class="row" id="1"> <button class="switch" tabindex="-1" onclick="switchRows(event);"> &#8597; </button> <div class="inputs"><input><input></div> <button class="X" tabindex="-1" onclick="addThisRow(event);"> + </button> <button class="X" tabindex="-1" onclick="multiplyRow(event);"> X </button> </div>';
  ROW_COUNTER = 2;
  COL_COUNTER = 2;
  ROW_CLICKED = -1;
  resizeAllInputs();
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
      resizeInput(element);
    });
    secondValues.forEach( function(element, i) {
      element.value = temp[i];
      resizeInput(element);
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
    element.value = myMultiply(element.value, factor);
    resizeInput(element);
  });
  clearAllButtons();
}

function hideForm() {
  document.getElementById('multipleOfRow').setAttribute('style', 'display: none;');
  document.getElementById('multipleOfRowAdd').setAttribute('style', 'display: none;');
  document.getElementById('multipleForm').setAttribute('style', 'display: none;');
  document.getElementById('multiplier').value = '';
  document.getElementById('multiplier').removeAttribute('style');
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
// finds a gcd for the final result
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

function toMyNumber(input) {
  if (!isNaN(Number(input))) {
    return Number(input);
  }
  var split = input.split('/');
  return Number(split[0])/Number(split[1]);
}

function calculateDeterminant(matrix) {
  if (matrix.length != matrix[0].length) {
    throw new Error('Not a square matrix!');
  }
  if (matrix.length === 2 && matrix[0].length === 2) {
    return (matrix[0][0]*matrix[1][1])-(matrix[0][1]*matrix[1][0]);
  }
  var result = 0;
  var cofactorMultiplier = -1;
  for (var row in matrix) {
    cofactorMultiplier *= -1;
    result += cofactorMultiplier*matrix[row][0]*calculateDeterminant(subMatrix(matrix, [row], [0]));
  }
  return result;
}

function setMatrix() {
  return [
    [
      8, 7, 5
    ],
    [
      4, 6, 8
    ],
    [
      9, 7, 6
    ]
  ];
}

// subMatrix(matrix,[rows to remove],[columns to remove])
//  TODO: alter this to allow 2+ dimensions
function subMatrix(matrix, rows, cols) {
  if (matrix.constructor !== Array) {
    throw new Error('Invalid matrix, must be an array of arrays.');
  }
  if (rows.length === 0 && cols.length === 0) {
    return matrix;
  }
  
  // create a copy of the matrix for mutation
  
  var subMatrix = copyMatrix(matrix);
  
  // sort arrays
  function compareNumbers(a,b) {
    return a-b;
  }
  rows.sort(compareNumbers);
  cols.sort(compareNumbers);
  
  // remove rows
  for (var i in rows) {
    subMatrix.splice(rows[i]-i,1);
  }
  // remove columns
  for (var j in cols) {
    for (var row in subMatrix) {
      subMatrix[row].splice(cols[j],1);
    }
  }
  
  return subMatrix;
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
      resizeInput(element);
    });
    
    document.getElementById('go').removeAttribute('style');
    clearAllButtons();
  }
}

function addEventToInputs() {
  var matrix = document.getElementById('Matrix');
  var multiplier = document.getElementById('multiplier');
  
  matrix.addEventListener('input', function inputChange(event) {
    if (event.target.tagName === 'INPUT') {
      LAST_MATRIX = getMatrix();
      resizeInput(event.target);
    }
  });
  
  multiplier.addEventListener('input', function resizeMultiplier(event) {
    resizeInput(event.target);
  });
}

function resizeInput(input) {
  console.log('resize one:', input);
  if (input.value.length > 12) {
    input.setAttribute('style', 'font-size: 0.5em; word-break: break-word;');
  }
  else if (input.value.length > 3) {
    input.setAttribute('style', 'font-size: 1em; word-break: break-word;');
  }
  else {
    input.removeAttribute('style');
  }
}

function resizeAllInputs() {
  var inputs = document.getElementsByTagName('Input');
  console.log('all inputs:', inputs);
  inputs.forEach(function(element) {
    resizeInput(element);
  });
}

function randomMatrix() {
  var inputs = document.getElementById('Matrix').getElementsByTagName('Input');
  for (var i in inputs) {
    if (getRandomInt(0,2) < 2) {
      inputs[i].value = getRandomInt(0,10);
    }
    else {
      inputs[i].value = getRandomInt(0, 100);
    }
  }
  
}


//
//
//

HTMLCollection.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.forEach = Array.prototype.forEach;

addEventToInputs();

calculateDeterminant(setMatrix());


const clicked_button_str = ' activeButton';
var LAST_MATRIX = [];

var ROW_COUNTER = 2;
var COL_COUNTER = 2;
var ROW_CLICKED = -1;
var ADD_CLICKED = -1;
var TIMEOUT_ID;