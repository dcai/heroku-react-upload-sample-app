import {
  all,
  select,
  call,
  put,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import axios from "axios";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action) {
  try {
    const url = `https://api.github.com/users/${action.payload.username}`;
    const Api = axios.get(url).then(res => res.data);
    const user = yield Api;
    yield put({ type: "USER_FETCH_SUCCEEDED", payload: { user } });
  } catch (e) {
    yield put({ type: "USER_FETCH_FAILED", message: e.message });
  }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
function* fetchUserSaga() {
  yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
}

export default function* rootSaga() {
  yield all([
    fetchUserSaga(),
    takeEvery("*", function* logger(action) {
      // console.log("action", action);
      // const state = yield select();
      // console.log("state after", state);
    })
  ]);
}
