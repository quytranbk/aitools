import { Button, Container, Navbar, ProgressBar, Spinner } from 'react-bootstrap';

export default function Footer ({ isPlaying, isPause, handlePlay, handlePause, handleStop, progress }) {
  console.log(isPlaying.current);
    return <footer className="flex bg-[#f0f0f0] border-t">
      <div className="flex-1 flex items-center py-2 px-4">
        <ProgressBar animated now={progress} className="w-full h-1" />
      </div>
      <div className="w-[200px] py-2 px-4 flex justify-end items-center">
                    {
                        (isPlaying.current) && <>
                    <Spinner animation="grow" size="sm" className="flex-none text-slate-400 mr-2" />
                        <Button variant="default" className="mr-2" onClick={handleStop}>Hủy</Button>
                        </>
                    }
        <Button variant="primary" onClick={handlePlay}>{!isPlaying.current || isPause.current ? 'Play' : 'Pause'}</Button>
        
      </div>
    </footer>;
}