import React from 'react'

export default function UserInput({ val, getinput, edit=true, show=true, type='text', placeholder='', children }) {
    if (!show) {
        return null
    }
    const content = edit ? (
        <input
            type={type}
            className={getinput.className}
            style={getinput.style}
            placeholder={placeholder}
            value={val}
            ref={ref => getinput.getRef(ref)}
            onChange={getinput.onchange}
            onKeyPress={getinput.onenter} />
    ) : val
    if (!children) {
        return content
    } else if (children.props.children) {
        return React.cloneElement(children, {}, children.props.children.map(child => {
            if (!child.props.children) {
                return React.cloneElement(child, {
                    style: {wordBreak: 'break-all', wordWrap: 'break-word', height: 'auto'}
                }, content)
            } else {
                return child
            }
        }))
    } else {
        return React.cloneElement(children, {
            style: {wordBreak: 'break-all', wordWrap: 'break-word', height: 'auto'}
        }, content)
    }
}

UserInput.Input = class {
    constructor(names, submit, change, className='form-control', style={}) {
        this.submit = submit
        this.change = change
        this.className = className
        this.style = style
        this.ref = new Map()
        names.forEach(name => this.ref.set(name, null))
    }
    getInput(target) {
        return {
            getRef: ref => this.ref.set(target, ref),
            onenter: e => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    let start = false
                    for (let [key, value] of this.ref) {
                        if (start) {
                            if (value !== null) {
                                value.focus()
                                return true
                            }
                        }
                        if (key === target) {
                            start = true
                        }
                    }
                    this.submit()
                }
            },
            onchange: this.change,
            className: this.className,
            style: this.style,
        }
    }
    initFocus() {
        for (let value of this.ref.values()) {
            if (value !== null) {
                value.focus()
                return true
            }
        }
    }
    getValue() {
        let obj = {}
        for (let [key, value] of this.ref) {
            if (value !== null) {
                obj[key] = value.value
            }
        }
        return obj
    }
    initValue(init = {}) {
        let obj = {}
        for (let key of this.ref.keys()) {
            if (init[key] === undefined) {
                obj[key] = ''
            } else {
                obj[key] = init[key]
            }
        }
        return obj
    }
    allBlur() {
        for (let value of this.ref.values()) {
            if (value !== null) {
                value.blur()
            }
        }
    }
}