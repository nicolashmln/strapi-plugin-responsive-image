import { fromJS } from 'immutable';

const initialState = fromJS({
  isLoading: true,
  responsiveDimensions: true,
  initialData: {
    formats: [],
    quality: 87,
  },
  modifiedData: {
    formats: [],
    quality: 87,
  },
});

const defaultFormat = {
  name: '',
  width: 500,
  fit: 'cover',
  position: 'centre',
  withoutEnlargement: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'CANCEL_CHANGES':
      return state.update('modifiedData', () => state.get('initialData'));
    case 'GET_DATA_SUCCEEDED':
      return state
        .update('isLoading', () => false)
        .update('responsiveDimensions', () => fromJS(action.data.responsiveDimensions))
        .update('initialData', () => fromJS(action.data))
        .update('modifiedData', () => fromJS(action.data));
    case 'ON_CHANGE':
      return state.updateIn(['modifiedData', ...action.keys.split('.')], () => action.value);
    case 'ON_FORMATS_CHANGE':
      return state.updateIn(['modifiedData', 'formats', action.index, action.keys], () => action.value);
    case 'ADD_FORMAT':
      return state.updateIn(['modifiedData', 'formats'], arr => arr.unshift(fromJS(defaultFormat)));
    case 'DELETE_FORMAT':
      return state.updateIn(['modifiedData', 'formats'], arr => arr.splice(action.index, 1));
    case 'SUBMIT_SUCCEEDED':
      return state.update('initialData', () => state.get('modifiedData'));
    default:
      return state;
  }
};

export default reducer;
export { initialState };