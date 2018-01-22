import React from "react";
import ReactDropzone from "react-dropzone";
import axios from "axios";
import _ from "lodash";
import { connect } from "react-redux";
import {
  fileUploadProgress,
  filesDropped,
  fileUploaded,
  fileUploadFailed
} from "./actions.js";
import guid from "guid";

class Filedrop extends React.Component {
  constructor(props) {
    super(props);
    this.droppedFiles = [];
  }
  uploadOneFile(file) {
    const { dispatch, url } = this.props;
    const data = new window.FormData();
    data.append("upfile", file);
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "X-appCorrelationId": guid.raw()
      },
      onUploadProgress: evt => {
        var percent = Math.round(evt.loaded * 100 / evt.total);
        dispatch(
          fileUploadProgress({
            filename: file.name,
            percent
          })
        );
      }
    };
    axios
      .post(url, data, config)
      .then(res => {
        if (res.data.status === "SUCCESS") {
          dispatch(
            fileUploaded(
              _.assign({}, res.data.data, {
                name: file.name
              })
            )
          );
          return;
        }
        dispatch(fileUploadFailed(res.data));
      })
      .catch(error => {
        dispatch(fileUploadFailed({ error }));
      });
  }
  onUpload(droppedFiles) {
    this.droppedFiles.forEach(f => this.uploadOneFile(f));
  }

  onDrop(acceptedFiles) {
    this.droppedFiles = acceptedFiles;
    this.dispatchFilesDropped(acceptedFiles);
  }

  dispatchFilesDropped(files) {
    const { dispatch } = this.props;
    dispatch(filesDropped(files));
  }
  render() {
    return (
      <div className="dropzone">
        <ReactDropzone
          inputProps={this.props.inputProps || {}}
          onDrop={this.onDrop.bind(this)}
          accept={this.props.accept}
        >
          {this.props.children}
        </ReactDropzone>
        <ul>
          {this.props.files.droppedFiles.map(f => {
            return (
              <li key={f.name}>
                <label>{f.name}</label>
                {this.props.files[f.name] &&
                  this.props.files[f.name].percent && (
                    <div>{this.props.files[f.name].percent} %</div>
                  )}
                {this.props.files[f.name] &&
                  this.props.files[f.name].message && (
                    <dl>
                      <dt>Reference API response:</dt>
                      <dd> {this.props.files[f.name].message} </dd>
                    </dl>
                  )}
              </li>
            );
          })}
        </ul>
        <button onClick={this.onUpload.bind(this)}>Upload now</button>
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    files: state.files
  }),
  dispatch => ({
    dispatch: dispatch
  })
)(Filedrop);
