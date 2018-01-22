export const ACTION_FETCH_DATA_LOADING = "FETCH_DATA_LOADING";
export const ACTION_FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const ACTION_CLICK_BUTTON = "CLICK_BUTTON";
export const ACTION_FILES_DROPPED = "ACTION_FILES_DROPPED";
export const ACTION_FILES_UPLOADED = "ACTION_FILES_UPLOADED";
export const ACTION_FILES_UPLOAD_FAILED = "ACTION_FILES_UPLOAD_FAILED";
export const ACTION_FILES_UPLOAD_PROGRESS = "ACTION_FILES_UPLOAD_PROGRESS";

export const fetchData = () => dispatch => {
  dispatch({
    type: ACTION_FETCH_DATA_LOADING
  });
  return new Promise(resolve =>
    resolve({
      status: "ok",
      payload: "cool data"
    })
  ).then(data =>
    dispatch({
      type: ACTION_FETCH_DATA_SUCCESS,
      data
    })
  );
};

export const filesDropped = files => ({
  type: ACTION_FILES_DROPPED,
  payload: {
    files
  }
});

export const fileUploaded = data => ({
  type: ACTION_FILES_UPLOADED,
  payload: {
    data
  }
});

export const fileUploadFailed = data => ({
  type: ACTION_FILES_UPLOAD_FAILED,
  payload: {
    data
  }
});

export const fileUploadProgress = payload => ({
  type: ACTION_FILES_UPLOAD_PROGRESS,
  payload
});

export const clickButton = () => ({
  type: ACTION_CLICK_BUTTON
});
