import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import MenuItems from "./MenuItems.jsx";

import Mediciones from "./Mediciones";

import Metas from "./Metas";

import Reportes from "./Reportes";

import Usuarios from "./Usuarios";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Menuitems: MenuItems,
    
    Mediciones: Mediciones,
    
    Metas: Metas,
    
    Reportes: Reportes,
    
    Usuarios: Usuarios,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                <Route path="/" element={<Dashboard />} />
                
                <Route path="/dashboard" element={<Dashboard />} />
                
                <Route path="/menu-items" element={<MenuItems />} />
                
                <Route path="/Mediciones" element={<Mediciones />} />
                
                <Route path="/Metas" element={<Metas />} />
                
                <Route path="/Reportes" element={<Reportes />} />
                
                <Route path="/Usuarios" element={<Usuarios />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}