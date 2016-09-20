import React from 'react'
import ReFileUploader from '../containers/ReFileUploader'
import UserInput from './UserInput'
import { isValidString, api } from '../utility'

const FileAdd = React.createClass({
    getInitialState: function() {
        this._clearFiles = () => console.log('clear')
        this._input = new UserInput.Input(['url'], this._handleSubmit, this._handleChange)
        return Object.assign({
            files: [],
            type: false,
        }, this._input.initValue())
    },
    _setFiles: function(files) {
        if (this.state.files.length === 0 && files.length > 0) {
            this.props.toggle()
        }
        this.setState(Object.assign({}, this.state, {files}))
    },
    _setClearFiles: function(clear) {
        this._clearFiles = clear
    },
    _handleChange: function() {
        this.setState(Object.assign({}, this.state, {type: this._ref.checked}, this._input.getValue()))
    },
    _handleSubmit: function(e) {
        if (e) {
            e.preventDefault()
        }
        if (isValidString(this.state.url, 'url')) {
            const url = this.state.url
            this.setState(Object.assign({}, this.state, this._input.initValue()))
            api('/api/getPath').catch(err => this.props.addalert(err))
            .then(ret => api(`${this.props.mainUrl}/api/upload/url`, Object.assign({
                type: this.state.type ? 1 : 0,
                url: url,
            }, ret), 'POST')).then(result => {
                if (result.stop) {
                    this.props.addalert('Background upload was stoped')
                } else {
                    console.log(result);
                }
            }).catch(err => this.props.addalert(err))
        } else {
            this.props.addalert('Url not vaild!!!')
        }
    },
    render: function() {
        let rows = []
        this.state.files.forEach(file => {
            rows.push(<div style={{color: '#31708f'}} key={file.key}>{file.name}<span className="badge">{file.progress + '%'}</span></div>)
        })
        const show = this.props.show ? {width: '205px', marginBottom: '0px'} : {width: '205px', marginBottom: '0px', display: 'none'}
        return (
            <section className="panel panel-info" style={show}>
                <div className="panel-heading" onClick={this.props.toggle}>
                    <h4 className="panel-title">
                        <a href="#" style={{textDecoration: 'none'}}>
                            Uploader<i className="pull-right glyphicon glyphicon-remove"></i>
                        </a>
                    </h4>
                </div>
                <form onSubmit={this._handleSubmit}>
                    <div className="input-group">
                        <span className="input-group-addon">
                            <input
                                type="checkbox"
                                checked={this.state.type}
                                ref={ref => this._ref = ref}
                                onChange={this._handleChange} />
                        </span>
                        <UserInput
                            val={this.state.url}
                            getinput={this._input.getInput('url')}
                            placeholder="URL Upload" />
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="submit">
                                <i className="glyphicon glyphicon-upload"></i>
                            </button>
                        </span>
                    </div>
                </form>
                <div>
                    {rows}
                    <div className="progress" style={{marginBottom: '0px'}}>
                        <div className="progress-bar" style={{width: this.props.progress + '%'}}>
                            {this.props.progress + '% Complete'}
                        </div>
                    </div>
                    <div className="btn-group">
                        <div className="btn btn-primary btn-file btn-s" style={{position: 'relative'}}>
                            <span className="glyphicon glyphicon-folder-open"></span>&nbsp;Choose
                            <ReFileUploader url={this.props.mainUrl + '/upload/file'} set={this._setFiles} setClear={this._setClearFiles} params={{type: this.state.type ? 1 : 0}} beforeUpload={() => api('/api/getPath').catch(err => this.props.addalert(err))} />
                        </div>
                        <button className="btn btn-danger btn-s" disabled={!this.state.files.length} onClick={this._clearFiles}>
                            <span className="glyphicon glyphicon-trash"></span>Remove all
                        </button>
                    </div>
                </div>
            </section>
        )
    }
})

export default FileAdd