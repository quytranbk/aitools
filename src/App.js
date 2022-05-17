import React from 'react';
import { Button } from 'react-bootstrap';
import './App.scss';
import Footer from './components/footer';
import Header from './components/header';
import LeftBar from './components/left-bar';
import MainBody from './components/main-body';
import RightBar from './components/right-bar';
import './styles/globals.scss';

function App() {
    return <div className="h-full flex flex-col">
        <Header />

        <div className="flex-1 flex min-h-0">
            <div className="flex-1 flex flex-col">
                <div className="border-b flex justify-between">
                    <div className="w-[200px] p-2 flex justify-between">
                        <div>
                            <Button variant="" className="btn-icon text-xl">
                                <span className="material-symbols-rounded">arrow_back_ios_new</span>
                            </Button>
                            <Button variant="" className="btn-icon text-xl">
                                <span className="material-symbols-rounded">arrow_forward_ios</span>
                            </Button>

                        </div>
                    </div>
                    <div className="p-2 flex-1 flex justify-between items-center">
                        <div>
                            {/* <span>than van he.txt</span> */}
                        </div>
                        <div>
                            <Button variant="primary">Lưu</Button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex min-h-0">
                    <RightBar />
                    <MainBody />
                </div>

            </div>

            <LeftBar />
        </div>
        <Footer/>
    </div>
}

export default App;
