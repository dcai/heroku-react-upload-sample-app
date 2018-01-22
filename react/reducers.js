import { combineReducers } from "redux";
import _ from "lodash";
import {
  ACTION_FILES_UPLOAD_PROGRESS,
  ACTION_CLICK_BUTTON,
  ACTION_FILES_DROPPED,
  ACTION_FILES_UPLOADED,
  ACTION_FILES_UPLOAD_FAILED
} from "./actions.js";

const rootReducer = combineReducers({
  data: (state, action) => {
    if (action.type === ACTION_CLICK_BUTTON) {
      return Object.assign({}, state, {
        counter: state.counter + 1
      });
    }
    return state || {};
  },
  files: (state, action) => {
    if (action.type === ACTION_FILES_UPLOAD_PROGRESS) {
      const fileState = _.assign({}, state[action.payload.filename] || {}, {
        percent: action.payload.percent
      });
      return _.assign({}, state, {
        [action.payload.filename]: fileState
      });
    }
    if (action.type === ACTION_FILES_DROPPED) {
      const droppedFiles = action.payload.files.map(f => ({
        name: f.name,
        lastModified: f.lastModified
      }));
      return _.assign({}, state, {
        droppedFiles
      });
    }
    if (action.type === ACTION_FILES_UPLOADED) {
      return _.assign({}, state, {
        [action.payload.data.name]: action.payload.data
      });
    }
    return state || { droppedFiles: [] };
  },
  ui: (state, action) => {
    return state || {};
  }
});

export default rootReducer;
