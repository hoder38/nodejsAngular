import React from 'react'

const DropdownMenu = React.createClass({
    componentDidMount: function() {
        this.props.globalClick(true)
    },
    componentWillUnmount: function() {
        this.props.globalClick(false)
    },
    render: function() {
        let rows = []
        this.props.droplist.forEach(drop => {
            if (drop.title) {
                rows.push(
                    <li key={drop.key}>
                        <a href="#" onClick={drop.onclick}>
                            <i className={drop.className}></i>&nbsp;{drop.title}
                        </a>
                    </li>
                )
            } else {
                rows.push(<li className="divider" key={drop.key}></li>)
            }
        })
        return <ul className="dropdown-menu">{rows}</ul>
    }
})

export default DropdownMenu