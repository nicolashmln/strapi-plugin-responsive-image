import produce from "immer";
import set from "lodash/set";

const initialState = {
  isLoading: true,
  isSubmiting: false,
  responsiveDimensions: true,
  initialData: {
    formats: [],
    quality: 87,
    progressive: false,
  },
  modifiedData: {
    formats: [],
    quality: 87,
    progressive: false,
  },
};

const defaultFormat = {
  name: "",
  width: 500,
  fit: "cover",
  position: "centre",
  withoutEnlargement: false,
  convertToFormat: "",
};

const reducer = (state, action) =>
  // eslint-disable-next-line consistent-return
  produce(state, (drafState) => {
    console.log(action);
    switch (action.type) {
      case "CANCEL_CHANGES":
        drafState.modifiedData = state.initialData;
        break;
      case "GET_DATA_SUCCEEDED":
        drafState.isLoading = false;
        drafState.responsiveDimensions = action.data.responsiveDimensions;
        drafState.initialData = action.data;
        drafState.modifiedData = action.data;
        break;
      case "ON_CHANGE":
        set(
          drafState,
          ["modifiedData", ...action.keys.split(".")],
          action.value
        );
        break;
      case "ON_FORMATS_CHANGE":
        drafState.modifiedData.formats[action.index][action.keys] =
          action.value;
        break;
      case "ADD_FORMAT":
        drafState.modifiedData.formats.push(defaultFormat);
        break;
      case "DELETE_FORMAT":
        drafState.modifiedData.formats.splice(action.index, 1);
        break;
      case "ON_SUBMIT": {
        drafState.isSubmiting = true;
        break;
      }
      case "SUBMIT_SUCCEEDED":
        drafState.initialData = state.modifiedData;
        drafState.isSubmiting = false;
        break;
      case "ON_SUBMIT_ERROR": {
        drafState.isSubmiting = false;
        break;
      }
      default:
        return state;
    }
  });

export default reducer;
export { initialState };
