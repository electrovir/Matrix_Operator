/*
  accepted action types:
    change original matrix      expects a matrix in action.matrix
    update current matrix       expects a matrix in action.matrix
    undo
    redo
    add row
    remove row
    add column
    remove column
    reset to original
    clear
*/



function matrixAppReducer(state, action) {
  // var newState = JSON.parse(JSON.stringify(state));  for performance concerns, not doing this
  var newState = state;
  newState.lastState = state;
  newState.action_history.push(action);
  
  function changeCurrentMatrix(newMatrix) {
    
    newState.matrix_history.push(state.current_matrix);
    newState.current_matrix = newMatrix;
  }
  
  switch(action.type) {
    
    case 'load timeline':
      newState.timeline = action.timeline;
    break;
    
    case 'change original matrix':
      newState.matrix_history.push(state.current_matrix);
      newState.original_matrix = action.matrix;
    break;
    
    case 'update current matrix':
      changeCurrentMatrix(action.matrix);
    break;
    
    //    history -> current -> future
    case 'undo':
      newState.matrix_future.unshift(state.current_matrix);
      newState.current_matrix = newState.matrix_history.pop();
    break;
    
    //    history <- current <- future
    case 'redo':
      changeCurrentMatrix(newState.matrix_future.shift());
    break;
    
    case 'add row':
      var new_row = [];
      for (var i in newState.current_matrix[0]) {
        new_row.push('0');
      }
      changeCurrentMatrix( newState.current_matrix.concat(new_row) );
    break;
    
    case 'remove row':
      if (newState.current_matrix.length > 2) {
        changeCurrentMatrix( newState.current_matrix.pop() );
      }
    break;
    
    case 'add column':
      newState.current_matrix.forEach( function(row) {
        row.push('0');
      });
      changeCurrentMatrix( newState.current_matrix );
    break;
    
    case 'remove column':
      newState.current_matrix.forEach( function(row) {
        row.pop();
      });
      changeCurrentMatrix( newState.current_matrix );
    break;
    
    case: 'reset to original':
      changeCurrentMatrix( state.original_matrix );
    break;
    
    case: 'clear':
      changeCurrentMatrix( createBlankMatrix(state.current_matrix.length, state.current_matrix[0].length) );
    break;
    
    default:
      newState = {
        timeline: [], //array of moments
        index: -1,    //index of current moment
        
        
      }
    break;
  }
  
  return newState;
}

function createBlankMatrix(rowCount, columnCount) {
  var new_matrix = Array(rowCount);
  new_matrix.forEach( function(row) {
    row = Array(columnCount);
  });
  
  return new_matrix;
}