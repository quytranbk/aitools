import apple from '../../assets/images/apple.png';

export default function Header() {
  return <header className="px-2 relative flex bg-[#f0f0f0] border-b border-b-[#cccccc] border-t border-t-[#cccccc]">
    <div className="absolute inset-0 flex justify-center items-center">
      <img className="w-[24px] h-[24px]" src={apple} alt="" />
    </div>
    <div className="py-[6px] flex text-[1.45rem] font-medium">

      <div>"ai"</div>
      <div className="text-black text-opacity-40 ml-1">Tools</div>
    </div>
    <div className="flex-1"></div>
    {/* <Navbar bg="light" className="px-4">
      <Navbar.Brand href="#" className="flex">
          <div>nmgh</div>
          <div className="text-black text-opacity-30 ml-1">Tools</div>
          </Navbar.Brand>
  </Navbar> */}
    <div></div>
  </header>;
}