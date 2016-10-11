import React from 'react'

export default function TopSection() {
    return (
        <section id="top-section" style={{float: 'left', position: 'fixed', left: '0px', width: '100%'}}>
            <form>
                <div className="input-group">
                    <span className="input-group-btn">
                        <button className="btn active btn-primary" type="button">
                            <i className="glyphicon glyphicon-eye-close"></i>
                        </button>
                    </span>
                    <input type="text" className="form-control" placeholder="Search Tag" />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="submit">
                            <span className="glyphicon glyphicon-search"></span>
                        </button>
                    </span>
                </div>
            </form>
        </section>
    )
}