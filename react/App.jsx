import "regenerator-runtime/runtime";
import React, { Component } from "react";
import Button from "./components/Button.jsx";
import { connect } from "react-redux";
import { fetchData } from "./actions.js";
import Filerop from "./Filedrop.jsx";

const FileUploadButton = props => (
  <div className="upload-btn-wrapper">
    <button className="btn">{props.label}</button>
    <input type="file" accept={props.accept} capture={props.capture} />
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
  }

  renderFilerop() {
    const url = "https://httpbin.org/post";
    const fileInputProperties = {
      capture: "camera",
      style: { display: "block" }
    };
    return (
      <Filerop url={url} accept="image/*" inputProps={fileInputProperties}>
        {status => {
          const { isDragActive, isDragReject } = status;
          if (isDragReject) {
            return "Some files will be rejected";
          }
          if (isDragActive) {
            return "All files will be accepted";
          }
          return "Dropping some files here...";
        }}
      </Filerop>
    );
  }

  render() {
    return (
      <div>
        <div>
          <FileUploadButton
            label="Capture Image"
            capture="camera"
            accept="image/*"
          />
        </div>
        <div>
          <FileUploadButton
            label="Capture Video"
            capture="camcorder"
            accept="video/*"
          />
        </div>

        {this.renderFilerop()}
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    counter: state.data.counter || 0,
    loading: state.ui.loading || false
  }),
  (dispatch, ownProps) => ({
    fetch: () => dispatch(fetchData())
  })
)(App);
