/*
  action {
    type: STRING,
    
    -- THE FOLLOWING ARE OPTIONAL AS NEEDED--
    
    loaded_data: {
      start_index: ,
      timeline:
    },
    
    matrix: [],
    
    operands: {
      row1_index: ,
      row2_index: ,
      multiple:
    }
  }
*/


function matrixAppReducer(state, action) {
  
  function addNewMoment(passedState, passed_orig_matrix, passed_cur_matrix, passed_action) {
    
    var moment = {
      original_matrix: passed_orig_matrix,
      current_matrix: passed_cur_matrix,
      operation: {
        type: passed_action.type,
        operands: passed_action.operands
      }
    };
    
    passedState.timeline.push(moment);
    passedState.index++;
    
    return passedState;
  }
  
  // NOTE: This following line MIGHT have big performance consequences.
  // NOTE: I am using JSON here because object.assign doesn't do a deep copy, which completely wrecks its usefulness in using it to make a copy...
  var newState = JSON.parse( JSON.stringify(state) );
  
  switch( action.type ) {
  
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
    // LOAD
    // ================================================
    case 'load':
      newState = replaceProperties( newState, action.loaded_data );
      // set the point in the timeline at which the app will start
      newState.index = action.loaded_data.start_index;
    break;
    
    // ================================================
    // MATRIX MUTATIONS
    // ================================================
    case 'typing input':
      newState = addNewMoment( newState, action.matrix, action.matrix, null );
    break;
    
    case 'add row':
      var current = newState.getCurrent();
      var new_row = createBlankMatrix(1, current[0].length);
      newState = addNewMoment( current.concat(new_row) );
    break;
    
    case 'remove row':
      if ( newState.getCurrent().length <= 2 ) {
        throw new Error('Tried to remove a row when only two rows were present.');
      }
      addNewMoment( newState.getCurrent().pop() );
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
      if ( new_matrix[0].length <= 2) {
        throw new Error('Tried to remove a column when only two columns were present.');
      }
      
      new_matrix.forEach( function(row) {
        row.pop();
      });
      
      newState = addNewMoment( newState, new_matrix );
    break;
    
    case 'reset to original':
      newState = addNewMoment( newState, [index].original_matrix );
    break;
    
    case 'clear':
      newState = addNewMoment( newState, createBlankMatrix(state.current_matrix.length, state.current_matrix[0].length) );
    break;
    
    // ================================================
    // MATRIX OPERATIONS
    // ================================================

    case 'swap rows':
      var new_matrix = newState.getCurrent();
      
      var temp_row = new_matrix[action.operands.row1_index];
      new_matrix[action.operands.row1_index] = new_matrix[action.operands.row2_index];
      new_matrix[action.operands.row2_index] = temp_row;
      
      newState = addNewMoment( newState, newState.getOriginal(), new_matrix, action );
    break;
    
    case 'multiply row':
      var new_matrix = newState.getCurrent();
      var multiple = action.operands.multiple;
      
      new_matrix[action.operands.row1_index].forEach( function(e, i) {
        e = matrixItemMultiply( e, multiple );
      });
      
      newState = addNewMoment( newState, newState.getOriginal(), new_matrix, action );
    break;
    
    case 'add row multiple':
      var new_matrix = newState.getCurrent();
      var multiple = action.operands.multiple;
      
      new_matrix[action.operands.row2_index].forEach( function(e, i) {
        e = matrixItemAdd( matrixItemMultiply( new_matrix[action.operands.row1_index][i], multiple ),  e );
      });
      
      newState = addNewMoment( newState, newState.getOriginal(), new_matrix, action );
    break;
    
    
    default:
      newState = {
        timeline: [],               // array of moments
        index: -1,                  // index of current moment
        start_index: 0,             // this is needed to know at what index to start on after loading a timeline from local storage
        getCurrent: function() {
          return JSON.parse( JSON.stringify( timeline[index].current_matrix ) );
        },
        getOriginal: function() {
          return JSON.parse( JSON.stringify( timeline[index].original_matrix ) );
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