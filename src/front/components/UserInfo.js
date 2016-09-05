import React from 'react'
import UserInput from './UserInput'
import { isValidString, handleInput } from '../utility'

const UserInfo = React.createClass({
    getInitialState: function() {
        this._input = handleInput(8, ['name', 'auto', 'perm', 'desc', 'unDay', 'unHit', 'newPwd', 'conPwd'], this._handleSubmit)
        return Object.assign({}, {
            edit: false,
            newPwd: '',
            conPwd: '',
        }, this._setInitial())
    },
    _checkInput: function(name, orig_input, type) {
        if (this.state[name] !== orig_input) {
            if (isValidString(this.state[name], type)) {
                return {[name]: this.state[name]}
            } else {
                this.props.addalert(`{$name} not vaild!!!`)
                return false;
            }
        }
    }
    _handleSubmit: function(e) {
        if (e) {
            e.preventDefault()
        }
        console.log('submit');
        let set_obj = Object.assign({},
            this._checkInput('name', this.props.user.name, 'name'),
            this._checkInput('auto', this.props.user.auto, 'url')),
            this._checkInput('newPwd', this.state.conPwd, 'passwd'))
        console.log(set_obj);
    },
    _handleChange: function() {
        let input_value = this._input[8]()
        if (this.state.edit) {
            this.setState(Object.assign({}, this.state, input_value))
        } else {
            this.setState(Object.assign({}, this.state, {
                newPwd: input_value.newPwd,
                conPwd: input_value.conPwd,
            }))
        }
    },
    _setInitial: function() {
        return {
            name: this.props.user.name,
            auto: this.props.user.auto,
            perm: this.props.user.perm,
            desc: this.props.user.desc,
            unDay: this.props.user.unDay,
            unHit: this.props.user.unHit,
        }
    },
    render: function() {
        const remove_btn = this.props.user.delable ? (
            <button className="btn btn-danger" type="button">
                <i className="glyphicon glyphicon-remove"></i>
            </button>
        ) : ''
        const editClick = () => {
            this.setState(Object.assign({}, this.state, {
                edit: !this.state.edit
            }, this._setInitial()))
        }
        return (
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-1 col-lg-offset-1">
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h3 className="panel-title">User profile</h3>
                    </div>
                    <form onSubmit={this._handleSubmit}>
                        <div className="panel-body">
                            <button className="btn btn-success" type="submit" >
                                <i className="glyphicon glyphicon-ok"></i>
                            </button>
                            <button className="btn btn-warning" type="button" onClick={editClick}>
                                <i className={this.state.edit ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-edit'}></i>
                            </button>
                            {remove_btn}
                        </div>
                        <div className="panel-footer">
                            <div className="row">
                                <div className="col-md-3 col-lg-3">
                                    <img className="img-circle" src="/user-photo-big.png" alt="User Pic" />
                                </div>
                                <div className="col-md-9 col-lg-9">
                                    <span>
                                        <UserInput
                                            val={this.state.name}
                                            edit={this.state.edit}
                                            getRef={this._input[0].getRef}
                                            onenter={this._input[0].onenter}
                                            onchange={this._handleChange}
                                            headelement='strong'
                                            topelement='section' />
                                        <br />
                                    </span>
                                    <table className="table table-user-information">
                                        <tbody>
                                            <UserInput
                                                val={this.state.auto}
                                                edit={this.state.edit}
                                                getRef={this._input[1].getRef}
                                                onenter={this._input[1].onenter}
                                                onchange={this._handleChange}>
                                                <td>Auto upload:</td>
                                            </UserInput>
                                            <UserInput
                                                val={this.state.perm}
                                                edit={this.state.edit}
                                                show={this.props.user.hasOwnProperty('perm')}
                                                getRef={this._input[2].getRef}
                                                onenter={this._input[2].onenter}
                                                onchange={this._handleChange}>
                                                <td>User level:</td>
                                            </UserInput>
                                            <UserInput
                                                val={this.state.desc}
                                                edit={this.state.edit}
                                                show={this.props.user.hasOwnProperty('desc')}
                                                getRef={this._input[3].getRef}
                                                onenter={this._input[3].onenter}
                                                onchange={this._handleChange}>
                                                <td>Description:</td>
                                            </UserInput>
                                            <UserInput
                                                val={this.state.unDay}
                                                edit={this.state.edit}
                                                show={this.props.user.hasOwnProperty('unDay')}
                                                getRef={this._input[4].getRef}
                                                onenter={this._input[4].onenter}
                                                onchange={this._handleChange}>
                                                <td>Unactive Day:</td>
                                            </UserInput>
                                            <UserInput
                                                val={this.state.unHit}
                                                edit={this.state.edit}
                                                show={this.props.user.hasOwnProperty('unHit')}
                                                getRef={this._input[5].getRef}
                                                onenter={this._input[5].onenter}
                                                onchange={this._handleChange}>
                                                <td>Unactive Hit:</td>
                                            </UserInput>
                                            <tr>
                                                <td>New Password:</td>
                                                <td>
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        placeholder="6~20個英數、!、@、#、$、%"
                                                        ref={ref => this._input[6].getRef(ref)}
                                                        val={this.state.newPwd}
                                                        onKeyPress={this._input[6].onenter}
                                                        onChange={this._handleChange} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Confirm Password:</td>
                                                <td>
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        val={this.state.conPwd}
                                                        ref={ref => this._input[7].getRef(ref)}
                                                        onKeyPress={this._input[7].onenter}
                                                        onChange={this._handleChange} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
})

export default UserInfo