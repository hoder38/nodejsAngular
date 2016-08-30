import React from 'react'
import { Link, IndexLink } from 'react-router'

//記得改為 /
export default function Navlist({ navlist, collapse }) {
    let rows = []
    navlist.forEach(nav => {
        if (nav.hash === '/webpack') {
            rows.push(
                <li key={nav.key}>
                    <IndexLink to="/webpack">
                        <i className={nav.css}></i>&nbsp;{nav.title}
                    </IndexLink>
                </li>
            )
        } else {
            rows.push(
                <li key={nav.key}>
                    <Link to={nav.hash}>
                        <i className={nav.css}></i>&nbsp;{nav.title}
                    </Link>
                </li>
            )
        }
    })
    return (
        <div className={collapse ? 'navbar-collapse collapse' : 'navbar-collapse collapse in'}>
            <ul className="nav navbar-nav side-nav">{rows}</ul>
        </div>
    )
}