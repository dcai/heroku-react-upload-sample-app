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

const acceptAttr = ".BMP,.DOC,.DOCM,.DOCX,.DOT,.DOTM,.DOTX,.GIF,.HTM,.HTML,.JPEG,.JPG,.MSG,.PDF,.PNG,.RTF,.TIF,.TIFF,.TXT,.WPD,.XPS";
class App extends Component {
  constructor(props) {
    super(props);
  }

  renderFilerop() {
    const url = "https://httpbin.org/post";
    const fileInputProperties = {
      style: { display: "block" }
    };
    return (
      <Filerop url={url} accept={acceptAttr} inputProps={fileInputProperties}>
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
       {this.renderFilerop()}
       <hr/>
       <div>
         Plain file input element: <input type="file" />
         <hr/>
         File upload element with filter: <input type="file" accept={acceptAttr} />
       </div>
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
