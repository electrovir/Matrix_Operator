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

/*
  action {
    type: STRING,
    -- THE FOLLOWING ARE OPTIONAL --
    loaded_data: {
      start_index:
      timeline:
    },
    
    matrix: [],
    
    operation: 
  }
*/


function matrixAppReducer(state, action) {
  // this following line MIGHT have big performance consequences
  var newState = JSON.parse(JSON.stringify(state));
  // var newState = state;
  // NOTE: I am using JSON here because object.assign doesn't do a deep copy, which completely wrecks its usefulness in using it to make a copy...
  
  // ============================================
  // ACCEPTED ARGUMENT LIST
  // current_matrix, original_matrix, operation
  //        OR
  // original_matrix, operation
  //        OR
  // orginal_matrix
  // ============================================
  function addNewMoment() {
    var moment = {};
    
    switch(Object.keys(arguments).length) {
      case 3:
        moment.original_matrix = arguments[1];
        moment.operation = arguments[2];
      break;
      case 2:
        moment.original_matrix = arguments[0];
        moment.operation = arguments[1];
      break;
      case 1:
        moment.original_matrix = arguments[0];
        moment.operation = null;
      break;
      default:
        throw new Error('Invalid arguments.');
    }
    
    moment.current_matrix = arguments[0];
    newState.timeline.push(moment);
    newState.index++;
  }
  
  switch(action.type) {
  
    // =====================
    // HISTORY MANIPULATION
    // =====================
    case 'undo':
      if ( state.index <= 0 ) {
        throw new Error('Tried to undo when there was nothing to undo.');
      }
      newState.index--;
    break;
    
    case 'redo':
      if ( state.index === state.timeline.length - 1 ) {
        throw new Error('Tried to redo when there was nothing to redo.');
      }
      newState.index++;
    break;
    
    // ================================================
    // CURRENT MATRIX and ORIGINAL MATRIX MANIPULATION
    // ================================================
    case 'load':
      newState = replaceProperties(action.loaded_data);
      newState.index = action.loaded_data.start_index;
    break;
    
    case 'typing input':
      addNewMoment( action.matrix );
    break;
    
    case 'add row':
      var current = newState.getCurrent();
      
      var new_row = createBlankMatrix(1, current[0].length);
      addNewMoment( current.concat(new_row) );
    break;
    
    case 'remove row':
      var current = newState.getCurrent();
      if (current.length <= 2) {
        throw new Error('Tried to remove a row when only two rows were present.');
      }
      
      addNewMoment( current.pop() );
    break;
    
    case 'add column':
      var new_matrix = newState.getCurrent();
      
      new_matrix.forEach( function(row) {
        row.push('0');
      });
      
      addNewMoment( new_matrix );
    break;
    
    case 'remove column':
      var new_matrix = newState.getCurrent();
      if (new_matrix[0].length <= 2) {
        throw new Error('Tried to remove a column when only two columns were present.');
      }
      
      new_matrix.forEach( function(row) {
        row.pop();
      });
      
      addNewMoment( new_matrix );
    break;
    
    case 'reset to original':
      addNewMoment( newState[index].original_matrix );
    break;
    
    case 'clear':
      addNewMoment( createBlankMatrix(state.current_matrix.length, state.current_matrix[0].length) );
    break;
    
    // ================================================
    // CURRENT MATRIX MANIPULATION only AKA operations
    // ================================================
    
    // TODO: add 'swap rows', 'multiply row', and 'add row multiple' cases here
    
    
    
    
    default:
      newState = {
        timeline: [],               // array of moments
        index: -1,                  // index of current moment
        start_index: 0,             // this is needed for loading timelines from local storage
        getCurrent: function() {
          return Object.assign( {}, timeline[index].current_matrix);
        },
        current_operation: null     // corresponds to what operation is currently taking place (dramatically affects the view)
      };
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

/**
 * This takes two objects and overrides all the properties in the first
 * object with the properties in the second.  It leaves all properties
 * from the first intact that aren't present in the second.
 * 
 * @param oldObject   The object with propeties to be overriden
 * @param newData     The object with new properties
 * @return            The resulting object with replacements made
 * 
*/
function replaceProperties(oldObject, newData) {
  
  var returnObject = Object.assign({}, oldObject); //NOTE: this doesn't do a deep copy
  for (var key in newData) {
    if (newData.hasOwnProperty(key) && oldObject.hasOwnProperty(key)) {
      returnObject[key] = newData[key];
    }
  }
  return returnObject;
}