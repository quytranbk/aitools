import Footer from '../footer';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header';
import LeftBar from '../left-bar';
import RightBar from '../right-bar';
import TopBar from '../top-bar';

export default function Layout() {
    return <div className="h-full flex flex-col">
        <Header />

        <div className="flex-1 flex min-h-0">
            <div className="flex-1 flex flex-col">
                    <TopBar />
                <div className="flex-1 flex min-h-0">

            <LeftBar />
                    <Outlet />
                </div>

            </div>
                    <RightBar />
        </div>
        <Footer/>
    </div>
}
