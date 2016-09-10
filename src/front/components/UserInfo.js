import React from 'react'
import UserInput from './UserInput'
import { isValidString, api } from '../utility'

const UserInfo = React.createClass({
    getInitialState: function() {
        this._input = new UserInput.Input(['name', 'auto', 'perm', 'desc', 'unDay', 'unHit', 'newPwd', 'conPwd'], this._handleSubmit, this._handleChange)
        const edit = this.props.user.newable ? true : false
        return Object.assign({edit}, this._input.initValue(this.props.user))
    },
    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.edit && !prevState.edit) {
            this._input.initFocus()
        }
    },
    _checkInput: function(name, orig_input = '', type, confirm='') {
        if (confirm) {
            if (this.state[name].toString() !== orig_input.toString()) {
                this.props.addalert(`${name} is not the same!!!`)
            } else {
                if (this.state[name]) {
                    if (isValidString(this.state[name], type)) {
                        return {
                            [name]: this.state[name],
                            [confirm]: orig_input,
                        }
                    } else {
                        this.props.addalert(`${name} not vaild!!!`)
                    }
                }
            }
        } else {
            if (this.state[name].toString() !== orig_input.toString()) {
                if (isValidString(this.state[name], type)) {
                    return {[name]: this.state[name]}
                } else {
                    this.props.addalert(`${name} not vaild!!!`)
                }
            }
        }
        return false
    },
    _handleSubmit: function(e) {
        if (e) {
            e.preventDefault()
        }
        const set_obj = Object.assign({},
            this._checkInput('name', this.props.user.name, 'name'),
            this._checkInput('auto', this.props.user.auto, 'url'),
            this._checkInput('perm', this.props.user.perm, 'perm'),
            this._checkInput('desc', this.props.user.desc, 'desc'),
            this._checkInput('unDay', this.props.user.unDay, 'int'),
            this._checkInput('unHit', this.props.user.unHit, 'int'),
            this._checkInput('newPwd', this.state.conPwd, 'passwd', 'conPwd'))
        if (this.props.user.newable) {
            console.log('new user');
        } else {
            if (Object.keys(set_obj).length > 0) {
                this.props.sendglbpw(userPW => {
                    if (!isValidString(userPW, 'passwd')) {
                        this.props.addalert('User password not vaild!!!')
                        return Promise.reject('User password not vaild!!!')
                    } else {
                        set_obj['userPW'] = userPW
                        return api(`/api/edituser/${this.props.user.key}`, set_obj, 'PUT')
                        .then(info => {
                            if (info.hasOwnProperty('owner')) {
                                this.props.setbasic(info.owner)
                                delete info.owner
                            }
                            this.props.addUser(Object.assign({}, this.props.user, info))
                            this.setState(Object.assign({
                                edit: !this.state.edit
                            }, this._input.initValue(this.props.user)))
                        }).catch(err => {
                            this.props.addalert(err)
                            throw err
                        })
                    }
                })
            } else {
                this.setState(Object.assign({
                    edit: !this.state.edit
                }, this._input.initValue(this.props.user)))
            }
        }
    },
    _handleChange: function() {
        this.setState(Object.assign({}, this.state, this._input.getValue()))
    },
    _delUser: function() {
        this.props.sendglbcf(() => this.props.sendglbpw(userPW => {
            if (!isValidString(userPW, 'passwd')) {
                this.props.addalert('User password not vaild!!!')
                return Promise.reject('User password not vaild!!!')
            } else {
                return api(`/api/deluser/${this.props.user.key}`, {userPW}, 'PUT')
                .then(info => {
                    this.props.delUser(this.props.user.key)
                }).catch(err => {
                    this.props.addalert(err)
                    throw err
                })
            }
        }), `Would you sure to delete USER: ${this.props.user.name} ?`)
    },
    render: function() {
        const editClick = () => {
            this.setState(Object.assign({
                edit: !this.state.edit
            }, this._input.initValue(this.props.user)))
        }
        const edit_btn = this.props.user.newable ? '' : (
            <button className="btn btn-warning" type="button" onClick={editClick}>
                <i className={this.state.edit ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-edit'}></i>
            </button>
        )
        let remove_btn = ''
        if (this.state.edit) {
            remove_btn = (
                <button className="btn btn-success" type="submit" >
                    <i className="glyphicon glyphicon-ok"></i>
                </button>
            )
        } else {
            remove_btn = this.props.user.delable ? (
                <button className="btn btn-danger" type="button" onClick={this._delUser}>
                    <i className="glyphicon glyphicon-remove"></i>
                </button>
            ) : ''
        }
        return (
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-1 col-lg-offset-1">
                <div className={this.props.user.newable ? 'panel panel-info' : 'panel panel-primary'}>
                    <div className="panel-heading">
                        <h3 className="panel-title">User profile</h3>
                    </div>
                    <form onSubmit={this._handleSubmit}>
                        <div className="panel-body">
                            {edit_btn}
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
                                            getinput={this._input.getInput('name')}
                                            edit={this.state.edit}>
                                            <strong />
                                        </UserInput>
                                        <br />
                                    </span>
                                    <table className="table table-user-information">
                                        <tbody>
                                            <UserInput
                                                val={this.state.auto}
                                                getinput={this._input.getInput('auto')}
                                                show={this.props.user.hasOwnProperty('auto')}
                                                edit={this.state.edit}>
                                                <tr>
                                                    <td key="1">Auto upload:</td>
                                                    <td key="2" />
                                                </tr>
                                            </UserInput>
                                            <UserInput
                                                val={this.state.perm}
                                                getinput={this._input.getInput('perm')}
                                                show={this.props.user.hasOwnProperty('perm')}
                                                edit={this.state.edit}>
                                                <tr>
                                                    <td key="1">User level:</td>
                                                    <td key="2" />
                                                </tr>
                                            </UserInput>
                                            <UserInput
                                                val={this.state.desc}
                                                getinput={this._input.getInput('desc')}
                                                show={this.props.user.hasOwnProperty('desc')}
                                                edit={this.state.edit}>
                                                <tr>
                                                    <td key="1">Description:</td>
                                                    <td key="2" />
                                                </tr>
                                            </UserInput>
                                            <UserInput
                                                val={this.state.unDay}
                                                getinput={this._input.getInput('unDay')}
                                                show={this.props.user.hasOwnProperty('unDay')}
                                                edit={this.state.edit}>
                                                <tr>
                                                    <td key="1">Unactive Day:</td>
                                                    <td key="2" />
                                                </tr>
                                            </UserInput>
                                            <UserInput
                                                val={this.state.unHit}
                                                getinput={this._input.getInput('unHit')}
                                                show={this.props.user.hasOwnProperty('unHit')}
                                                edit={this.state.edit}>
                                                <tr>
                                                    <td key="1">Unactive Hit:</td>
                                                    <td key="2"/>
                                                </tr>
                                            </UserInput>
                                            <UserInput
                                                val={this.state.newPwd}
                                                getinput={this._input.getInput('newPwd')}
                                                edit={this.state.edit}
                                                show={this.state.edit}
                                                type="password"
                                                placeholder="6~20個英數、!、@、#、$、%">
                                                <tr>
                                                    <td key="1">New Password:</td>
                                                    <td key="2" />
                                                </tr>
                                            </UserInput>
                                            <UserInput
                                                val={this.state.conPwd}
                                                getinput={this._input.getInput('conPwd')}
                                                edit={this.state.edit}
                                                show={this.state.edit}
                                                type="password"
                                                placeholder="Confirm Password">
                                                <tr>
                                                    <td key="1" >Confirm Password:</td>
                                                    <td key="2" />
                                                </tr>
                                            </UserInput>
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