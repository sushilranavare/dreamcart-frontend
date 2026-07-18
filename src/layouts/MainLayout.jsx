/* This layout provides the common structure used by customer-facing pages. */

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout(){
    return(
        <div className="app-layout">
            {/* Main Navigation Bar*/}
            <Navbar />

            {/* Page Content */}

            {/* Page content is rendered here */}
            <main>
                <Outlet />
            </main>
            {/* Footer is added here */}
            <footer>
                <p> ©2026 DreamCart. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default MainLayout;