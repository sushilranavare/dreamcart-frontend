/* This layout provides the common structure used by customer-facing pages. */

import { Outlet } from "react-router-dom";

function MainLayout(){
    return(
        <div className="app-layout">
            {/* Navigation Bar*/}
            <header>
                <he>DreamCart</he>
            </header>

            {/* Page content is rendered here */}
            <main>
                <Outlet />
            </main>
            {/* Footer is added here */}
            <footer>
                <p> 2026 DreamCart. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default MainLayout;