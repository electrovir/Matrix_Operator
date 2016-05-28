var store = Redux.createStore(matrixAppReducer);


function viewController() {
  init();
  var input_rows = document.getElementsByClassName('inputs');
  var view_matrix = document.getElementById('Matrix');
  
  function init() {
    store.subscribe(actionResponse);
  }
  
  function actionResponse() {
    var state = store.getState();
    updateMatrixView(state.current_matrix);
  }
  
  function updateMatrixView(current_matrix) {
    var row_diff = current_matrix.length - input_rows.length;
    var col_diff = current_matrix[0].length - input_rows[0].children.length;
    
    if (row_diff > 0) {
      addInputRows(row_diff);
    }
    else if (row_diff < 0) {
      removeInputRows(row_diff * -1);
    }
    if (col_diff > 0) {
      addInputColumns(col_diff);
    }
    else if (col_diff < 0) {
      removeInputColumns(col_diff);
    }
    
    current_matrix.forEach( function(row, i) {
      row.forEach( function(cell, j) {
        input_rows[i].children[j].value = cell;
      });
    });
    
  }
  
  function addInputRows(count) {
    for (var i = 0; i < count; i++) {
      var row = document.createElement('div');
      row.setAttribute('class', 'row');
      row.setAttribute('id', view_matrix.lastChild.id+1);
      row.innerHTML = view_matrix.children[0].innerHTML;
      view_matrix.appendChild(row);
    }
  }
  
  function removeInputRows(count) {
    for (var i = 0; i < count; i++) {
      if (view_matrix.length <= 2) {
        console.warn('Tried to remove a row when only ' + view_matrix.length + ' existed');
        return false;
      }
      view_matrix.removeChild(view_matrix.lastChild);
    }
  }
  
  function addInputColumns(count) {
    for (var i = 0; i < count; i++) {
      input_rows.forEach( function(row) {
        var input = document.createElement('input');
        row.appendChild(input);
      });
    }
  }
  
  function removeInputColumns(count) {
    for (var i = 0; i < count; i++) {
      if (view_matrix[0].length <= 2) {
        console.warn('Tried to remove a row when only ' + view_matrix[0].length + ' existed');
        return false;
      }
      input_rows.forEach( function(row) {
        row.removeChild(row.lastChild);
      });
      
    }
  }
  
  function checkMatrix() {
    
    function colorMatrix(className) {
      
      function matrixStyleReset() {        
        view_matrix.setAttribute('class', 'matrix');
      }
      
      window.clearTimeout(timeout_id);
      matrixStyleReset();
      view_matrix.setAttribute('class', 'matrix ' + className);
      
      timeout_id = window.setTimeout(styleRemove, 3000);
    }
    
    var timeout_id;
    var original = store.getState().original_matrix;
    var matrix = getMatrix();
    reduceMatrix(original);
    
    if (equalArray(matrix, original)) {
      colorMatrix('good');
    }
    else {
      colorMatrix('bad');
    }
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
  
}


function randomMatrix() {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  var state = store.getState();
  var row_num = state.current_matrix.length;
  var column_num = state.current_matrix[0].length;
  var random_matrix = createBlankMatrix(row_num, column_num);
  
  random_matrix.forEach( function(row) {
    row.forEach( function(cell) {
      
      if (getRandomInt(0,2) < 2) {
        cell = getRandomInt(0,10);
      }
      else {
        cell = getRandomInt(0, 100);
      }
    });
  });
  
  return random_matrix;
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




