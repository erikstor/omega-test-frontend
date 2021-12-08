import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";

import {App} from "./components/App/App";
import {Users} from "./components/Users/Users";

export default function Navigation() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/omega/">Home</Link>
                        </li>
                        <li>
                            <Link id='usersList' to="/omega/users">Users</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/omega/users" element={<Users/>}/>
                    <Route path="/omega/" element={<App/>}/>
                </Routes>
            </div>
        </Router>
    );
}