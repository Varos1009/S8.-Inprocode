import React from "react";
import { Link } from "react-router-dom";


const NavBar = () => {
    return (
        <div className=" d-flex">
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active fs-4" aria-current="page" to="/">Home <i className="bi bi-house text-black"></i></Link>
                </li>
            </ul>
            <div className="d-flex ms-auto">
                <ul className="nav">
                    <li className="nav-item">
                        <Link className="nav-link fs-4" to="/map">Map <i className="bi bi-geo-alt text-danger"></i></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link fs-4" to="/calendar">Calendar <i className="bi bi-calendar3 text-warning"></i></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link fs-4" to="/charts">Charts <i className="bi bi-bar-chart text-success"></i></Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NavBar;