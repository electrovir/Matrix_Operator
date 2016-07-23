function Action(store) {
  
  return function(type, data) {
    var state = store.getState();
    
    switch (type) {
      case 'operation click':
        if (state.current_operation.type === null) {
          store.dispatch( { type: 'begin operation',  operation: { type: data.operation, row_1_index: data.index, operation: data.operation } } );
        }
        else if (data.index === state.current_operation.row_1_index) {
          store.dispatch( {type: 'end operation'} );
        }
        else {
          store.dispatch( { type: state.current_operation.type, operation: {row_1_index: state.current_operation.row_1_index, row_2_index: data.index, multiple: data.multiple} } );
          store.dispatch( {type: 'end operation'} );
        }
        
      break;
      
      case 'three lines click':
        if (state.current_operation.type === null) {
          store.dispatch( {type: 'hamburger click', index: data.index } );
        }
        else if (data.index === state.current_operation.row_1_index) {
          store.dispatch( {type: 'end operation'} );
        }
        else {
          store.dispatch( { type: state.current_operation.type, operation: {row_1_index: state.current_operation.row_1_index, row_2_index: data.index, multiple: data.multiple } } );
          store.dispatch( {type: 'end operation'} );
        }
      break;
    
    
      default:
        throw new Error('Invalid action type passed.'.concat(type));
    }
  };
}