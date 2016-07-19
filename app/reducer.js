/**
 * Creates and returns an empty matrix of specified size
 * 
 * @param rowCount    The number of rows to have in the blank matrix
 * @param newData     The number of columns to have in the blank matrix
 * @return            The blank matrix
 * 
*/
function createBlankMatrix(rowCount, columnCount, filler) {
  var new_matrix = [];
  for (var i = 0; i < rowCount; i++) {
    new_matrix.push( [] );
  }
  new_matrix.forEach( function(row) {
    for (i = 0; i < columnCount; i++) {
      if (filler) {
        row.push( filler );
      }
      else {
        row.push('');
      }
    }
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
  
  var returnObject = JSON.parse( JSON.stringify( oldObject ) );
  for (var key in newData) {
    if (newData.hasOwnProperty(key) && oldObject.hasOwnProperty(key)) {
      returnObject[key] = newData[key];
    }
  }
  return returnObject;
}



/*

  ==== structure for Action ====
  this is validated inside the reducer  
  
  action {
    type: STRING,
    
    -- THE FOLLOWING ARE OPTIONAL AS NEEDED --
    
    loaded_data: {
      start_index: ,
      timeline:
    },
    
    operation: {
      row_1_index: ,
      row_2_index: ,
      multiple:
    }
  }
*/

function matrixAppReducer(state, action) {
  
  /**
   * Pushes a new 'moment' onto the timeline array.  A single 'moment' is an object that looks like this:
   *
   * moment {
   *  original_matrix: ,
   *  current_matrix: ,
   *  operation:
   * }
   * 
   * @param passedState             The state with the timeline to be modified
   * @param passed_orig_matrix      Will be used as the original matrix for the new moment
   * @param passed_cur_matrix       Will be used as the current matrix for the new moment
   * @param passed_action           The action that will be split apart to make the operation of the moment
   * @return                        true
   * 
   * TODO: just make this into a contrustor for the moment object
  */
  function addNewMoment( passedState, passed_orig_matrix, passed_cur_matrix, passed_operation) {
    
    // a moment
    var moment = {
      original_matrix: passed_orig_matrix,
      current_matrix: passed_cur_matrix,
      operation: passed_operation
    };
    
    if (!passed_cur_matrix) {
      moment.current_matrix = passed_orig_matrix;
    }
    
    passedState.index++;
    
    
    if ( passedState.timeline.length > passedState.index + 1 ) {
      console.log('before', passedState.timeline, 'index', passedState.index, 'length', passedState.timeline.length);
      passedState.timeline.splice( passedState.index, passedState.timeline.length - passedState.index );
      console.log('after', passedState.timeline);
    }
    // pause(500);
    passedState.timeline.push(moment);
    
    return true;
  }
  
  function matrixItemMultiply( a, b ) {
    return Number(a) * Number(b);
  }
  
  function matrixItemAdd( a, b ) {
    return Number(a) + Number(b);
  }
  
  

  var newState;
  if (state) {
    // newState = JSON.parse( JSON.stringify(state) ); // not using JSON because it can't copy over functions
    newState = Object.assign({}, state); // NOTE: this does NOT make a deep copy
  }
  
  
  var accepted_types = ['@@redux/INIT', 'begin operation', 'undo', 'redo', 'load', 'typing input', 'add row', 'add column', 'remove row', 'remove column', 'reset to original', 'clear', 'swap rows', 'multiply row', 'add row multiple', 'open operations'];
  
  function invalidAction(type, wrong_thing) {
    var text =  'Invalid action.'.concat(type).concat(' passed in dispatch');
    if (wrong_thing) {
      text = text.concat(': ', wrong_thing);
    }
    throw new Error(text);
  }
  
  if ( accepted_types.indexOf(action.type) === -1 ) {
    invalidAction('type', action.type);
  }
  
  if ( action.operation ) {
    // if ( !action.operation.multiple && !action.operation.row_1_index && !action.operation.row_2_index) {
    // console.warn(action.operation);
    //   invalidAction('operation');
    // }
    if ( action.operation.multiple && typeof action.operation.multiple !== 'number') {
      console.warn(action.operation);
      invalidAction('operation.multiple', operation.multiple);
    }
    if ( action.operation.row_1_index && typeof action.operation.row_1_index !== 'number') {
      console.warn(action.operation);
      invalidAction('operation.row_1_index', operation.row_1_index);
    }
    if ( action.operation.row_2_index && typeof action.operation.row_2_index !== 'number') {
      console.warn(action.operation);
      invalidAction('operation.row_2_index', operation.row_2_index);
    }
    
  }
  
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
    
    // ------------------------------------------------
    
    case 'redo':
      if ( state.index >= state.timeline.length - 1 ) {
        throw new Error('Tried to redo when there was nothing to redo.');
        // console.log('redo start');
        // return;
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
    // Operation steps
    // ================================================
    case 'open operations':
      if ( !state.current_operation.type ) {
        if ( action.operation.row_1_index === state.current_operation.open_operations ) {
          newState.current_operation.open_operations = null;
        }
        else {
          newState.current_operation.open_operations = action.operation.row_1_index;
        }
      }
      else {
        newState.current_operation.open_operations = null;
      }
    break;
    case 'begin operation':
      if ( !state.current_operation.type ) {
        console.warn('OPERATION BEGUN');
        newState.current_operation.row_1_index = action.operation.row_1_index;
        newState.current_operation.type = action.operation.type;
      }
      else {
        console.warn('OPERATION ENDED');
        newState.current_operation.type = null;
      }
    break;
    
    
    
    // ================================================
    // MATRIX MUTATIONS
    // ================================================
    case 'typing input':
      addNewMoment( newState, action.matrix );
    break;
    
    // ------------------------------------------------
    
    case 'add row':
      var current = newState.getCurrent();
      var new_row = createBlankMatrix(1, current[0].length);
      
      addNewMoment( newState, current.concat(new_row) );
    break;
    
    // ------------------------------------------------
    
    case 'remove row':
      if ( newState.getCurrent().length <= 2 ) {
        throw new Error('Tried to remove a row when only two rows were present.');
      }
      
      addNewMoment( newState, newState.getCurrent().slice(0, newState.getCurrent().length - 1) );
    break;
    
    // ------------------------------------------------
    
    case 'add column':
      var new_matrix = newState.getCurrent();
      new_matrix.forEach( function(row) {
        row.push('');
      });
      
      addNewMoment( newState, new_matrix );
    break;
    
    // ------------------------------------------------
    
    case 'remove column':
      var new_matrix = newState.getCurrent();
      if ( new_matrix[0].length <= 2) {
        throw new Error('Tried to remove a column when only two columns were present.');
      }
      
      new_matrix.forEach( function(row) {
        row.pop();
      });
      
      addNewMoment( newState, new_matrix );
    break;
    
    // ------------------------------------------------
    
    case 'reset to original':
      addNewMoment( newState, newState.getOriginal() );
    break;
    
    // ------------------------------------------------
    
    case 'clear':
      var current_matrix = state.getCurrent();
      addNewMoment( newState, createBlankMatrix(current_matrix.length, current_matrix[0].length) );
    break;
    
    // ================================================
    // MATRIX OPERATIONS
    // ================================================

    case 'swap rows':
      var new_matrix = state.getCurrent();
      
      var temp_row = new_matrix[action.operation.row_1_index];
      new_matrix[action.operation.row_1_index] = new_matrix[action.operation.row_2_index];
      new_matrix[action.operation.row_2_index] = temp_row;
      
      addNewMoment( newState, newState.getOriginal(), new_matrix, action.operation );
    break;
    
    // ------------------------------------------------
    
    case 'multiply row':
      var new_matrix = newState.getCurrent();
      var multiple = action.operation.multiple;
      
      console.log('new matrix', new_matrix);
      
      new_matrix[action.operation.row_1_index].forEach( function(e, i, array) {
        // e = matrixItemMultiply( e, multiple );
        array[i] = matrixItemMultiply( e, multiple );
      });
      
      console.log('new matrix after mutation', new_matrix);
      
      addNewMoment( newState, newState.getOriginal(), new_matrix, action.operation );
    break;
    
    // ------------------------------------------------
    
    case 'add row multiple':
      var new_matrix = newState.getCurrent();
      var multiple = action.operation.multiple;
      
      new_matrix[action.operation.row_2_index].forEach( function(e, i, array) {
        array[i] = matrixItemAdd( matrixItemMultiply( new_matrix[action.operation.row_1_index][i], multiple ),  e );
      });
      
      addNewMoment( newState, newState.getOriginal(), new_matrix, action.operation );
    break;
    
    
    // ================================================
    // INITIAL STATE
    // ================================================
    
    default:
      newState = {
        timeline: [],               // array of moments
        index: -1,                  // index of current moment
        start_index: 0,             // this is needed to know at what index to start on after loading a timeline from local storage
        // NOTE: using JSON stuff here to get deep copies easily (object.assign don't do deep copies)
        getCurrent: function() {
          return JSON.parse( JSON.stringify( this.timeline[this.index].current_matrix ) );
        },
        getOriginal: function() {
          return JSON.parse( JSON.stringify( this.timeline[this.index].original_matrix ) );
        },
        current_operation: {
          type: null,
          open_operations: null,
          row1_index: null,
          row2_index: null,
          multiple: null
        }
      };
      
      var beginner = [ ['', ''], ['', ''] ];
      addNewMoment( newState, beginner, beginner, action.operation );
    break;
  }
  // ------------------------------------------------
  console.log( newState.index, newState.timeline, 'action:', action );
  return newState;
}