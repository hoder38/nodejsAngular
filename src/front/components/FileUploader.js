import React from 'react'
let key = 0

const FileUploader = React.createClass({
    componentWillMount: function() {
        this._files = []
        this._uploading = -1
        this._request = null
        if (this.props.setClear) {
            this.props.setClear(this._clearFile)
        }
        if (this.props.setPush) {
            this.props.setPush(this._pushFile)
        }
    },
    componentWillUnmount: function() {
        this._clearFile()
    },
    _setState: function() {
        this.props.set(this._files)
        let progress = 0
        this._files.forEach(file => progress += file.progress)
        progress = progress > 0 ? Math.round(progress / this._files.length) : 0
        this.props.setProgress(progress, this._uploading === -1 ? false : true)
    },
    _pushFile: function(e) {
        e.preventDefault()
        const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files
        Array.from(droppedFiles).forEach(file => this._files.push(Object.assign(file, {
            key: key++,
            progress: 0,
            params: false,
            done: false,
        })))
        this._setState()
        if (this._files.length > 0) {
            this._uploadFile()
        }
    },
    _clearFile: function() {
        if (this._request) {
            this._request.upload.removeEventListener('progress', this._uploadProgress, false)
            this._request.removeEventListener('load', this._uploadFinish, false)
            this._request.removeEventListener('error', this._uploadError, false)
            this._request.removeEventListener('abort', this._uploadAbort, false)
            this._request.abort()
        }
        this._files = []
        this._setState()
    },
    _uploadFile: function() {
        const uploader = ret => {
            this._files = this._files.map(file => file.params === false ? Object.assign(file, {params: Object.assign({}, this.props.params, ret)}) : file)
            for (let i = 0; i < this._files.length; i++) {
                if (!this._files[i].done) {
                    if (this._uploading === -1) {
                        this._uploading = i
                        let formData = new FormData()
                        formData.append("file", this._files[this._uploading])
                        Object.keys(this._files[this._uploading].params).forEach(key => formData.append(key, JSON.stringify(this._files[this._uploading].params[key])))
                        this._request = new XMLHttpRequest()
                        this._request.withCredentials = true
                        this._request.upload.addEventListener('progress', this._uploadProgress, false)
                        this._request.addEventListener('load', this._uploadFinish, false)
                        this._request.addEventListener('error', this._uploadError, false)
                        this._request.addEventListener('abort', this._uploadAbort, false)
                        this._request.open("POST", this.props.url)
                        this._request.send(formData)
                    }
                    break;
                }
            }
            this._setState()
        }
        if (this.props.beforeUpload) {
            Promise.resolve(this.props.beforeUpload()).then(uploader)
        } else {
            uploader()
        }
    },
    _uploadProgress: function(e) {
        if (e.lengthComputable) {
            const progress = Math.round(e.loaded * 100 / e.total)
            this._files[this._uploading].progress = progress
            this._setState()
        }
    },
    _uploadFinish: function() {
        if (this._files[this._uploading]) {
            this._files[this._uploading].done = true
        }
        this._uploading = -1
        this._uploadFile()
    },
    _uploadError: function(e) {
        console.log('error');
        console.log(e);
        if (this._files[this._uploading]) {
            this._files[this._uploading].done = true
        }
        this._uploading = -1
        this._uploadFile()
    },
    _uploadAbort: function() {
        console.log('abort');
        if (this._files[this._uploading]) {
            this._files[this._uploading].done = true
        }
        this._uploading = -1
        this._uploadFile()
    },
    render: function() {
        return <input type="file" multiple onChange={this._pushFile} />
    }
})

export default FileUploader