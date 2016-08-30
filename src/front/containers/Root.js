import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from '../configureStore'
import ReApp from './ReApp'
import Homepage from '../components/Homepage'
import Storage from './Storage'
import Bar from '../components/Bar'
import ReLogin from './ReLogin'
import { api, testLogin } from '../utility'

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store)

const isLogin = (nextState, replaceState, callback) => testLogin()
    .then(() => {
        replaceState('/webpack')
        callback()
    }).catch(err => {
        console.log(err)
        callback()
    })

let unsubscribe = store.subscribe(() => console.log(store.getState()))

export default function Root() {
    return (
        <Provider store={store}>
            <div>
                <Router history={history}>
                    <Route path="/webpack/login" component={ReLogin} onEnter={isLogin} />
                    <Route path="/webpack" component={ReApp}>
                        <IndexRoute component={Homepage} />
                        <Route path="foo" component={Storage} />
                        <Route path="bar" component={Bar} />
                    </Route>
                    <Redirect from="*" to="/webpack" />
                </Router>
            </div>
        </Provider>
    )
}