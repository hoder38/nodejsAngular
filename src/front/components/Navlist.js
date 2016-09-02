import React from 'react'
import { Link, IndexLink } from 'react-router'
import { ROOT_PAGE } from '../constants'

export default function Navlist({ navlist, collapse }) {
    let rows = []
    navlist.forEach(nav => {
        if (nav.hash === ROOT_PAGE) {
            rows.push(
                <li key={nav.key}>
                    <IndexLink to={ROOT_PAGE}>
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