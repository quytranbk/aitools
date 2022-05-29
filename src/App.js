import React from 'react';
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import FileDetail from './components/file-detail';
import './styles/globals.scss';
import NewFile from './components/new-file';

function App() {
    return <>
        <HashRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/main" />}>
        </Route>
                <Route path="/main" element={<Layout />}>
                    <Route path=":fileName" element={<FileDetail />} />
                    <Route path="new" element={<NewFile />} />
                </Route>
            </Routes>
        </HashRouter>
  </>
}

export default App;
