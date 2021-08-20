import React, { Component } from "react";
import Dropzone from "react-dropzone";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.upload = this.upload.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onChangeCustodian = this.onChangeCustodian.bind(this);
    this.state = {
      selectedFiles: undefined,
      progressInfos: [],
      message: [],
      fileInfos: [],
      custodian: ""
    };
  }

  componentDidMount() {
    var self = this;
    
    var progressInterval = setInterval(() => {
      let _progressInfos = [...self.state.progressInfos];
      let updateData = [];
      let loadednum = 0;
      _progressInfos.map((item, index) => {
        if(item.percentage >= 100){
          loadednum ++;
        }
        updateData.push({
          ...item,
          percentage: (item.percentage >= 100 ? 100 : item.percentage + 100/(item.filesize/1024)),
        });
      });
      self.setState({ progressInfos: updateData });
     
    },1);
  }
  onChangeCustodian(e){
    this.setState({custodian : e.target.value});
  }
  upload(idx, file) {
    let _progressInfos = [...this.state.progressInfos];
    let loaded = 0;
    _progressInfos[idx].percentage = 0;
    _progressInfos[idx].filesize = file.size;
    this.setState({ progressInfos: _progressInfos });
   
    this.setState((prev) => {
            let nextMessage = [
              ...prev.message,
              "Uploaded the file successfully: " + file.name,
            ];
            return {
              message: nextMessage,
            };
          });
  }

  uploadFiles() {
    const selectedFiles = this.state.selectedFiles;
    
    if(this.state.custodian == "" || selectedFiles.length == 0){
      alert("Input Error. Please Input Custodian Correctly!");
      return;
    }
    this.setState({custodian: ""});
    let _progressInfos1 = this.state.progressInfos;
    let _progressInfos = [];
    
    for (let i = 0; i < selectedFiles.length; i ++) {
      _progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name + " By " + this.state.custodian});
    }
    if(_progressInfos1.length != 0){
    for (let i = 0; i < _progressInfos1.length; i ++) {
      _progressInfos.push(_progressInfos1[i]);
    }}
    this.setState(
      {
        progressInfos: _progressInfos,
        message: [],
      },
      () => {
        for (let i = 0; i < selectedFiles.length; i++) {
          this.upload(i, selectedFiles[i]);
        }
      }
    );
    this.setState({selectedFiles: []});
  }

  onDrop(files) {
    if (files.length > 0) {
      this.setState({ selectedFiles: files });
    }
  }

  render() {
    const { selectedFiles, progressInfos, message, fileInfos } = this.state;

    return (
      <div>
       

        <div className="my-3">
          <Dropzone onDrop={this.onDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div style={{padding:"30px", border:"solid"}} {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  {selectedFiles &&
                  Array.isArray(selectedFiles) &&
                  selectedFiles.length ? (
                    <div className="selected-file">
                      {selectedFiles.length > 3
                        ? `${selectedFiles.length} files`
                        : selectedFiles.map((file) => file.name).join(", ")}
                    </div>
                  ) : (
                    `Drag and drop files here, or click to select files`
                  )}
                </div>
                <aside className="selected-file-wrapper" style={{"display":"flex","justifyContent":"space-between", marginTop:"20px" }}>
                  <div><label>Custodian : &nbsp;&nbsp;&nbsp;</label><input type="text" className="Custodian" onChange={this.onChangeCustodian} value={this.state.custodian} /></div>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={!selectedFiles || selectedFiles.length == 0}
                    onClick={this.uploadFiles}
                  >
                    Upload
                  </button>
                </aside>
              </section>
            )}
          </Dropzone>
        </div>
        {progressInfos &&
          progressInfos.map((progressInfo, index) => (
            <div className="mb-2" key={index}>
              <span>{progressInfo.fileName}</span>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-info"
                  role="progressbar"
                  aria-valuenow={Math.floor(progressInfo.percentage)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: Math.floor(progressInfo.percentage) + "%" }}
                >
                  {Math.floor(progressInfo.percentage)}%
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
}
