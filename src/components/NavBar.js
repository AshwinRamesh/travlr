

export const NavBar = (props) => {
  return (
    <nav className="bg-glade-green-500 py-2 px-8 flex items-center justify-between fixed w-full top-0 z-10 mb-20">
      <div className="text-white font-bold text-2xl mr-auto">Travlr 🛫</div>
      <button className={"text-white font-bold mr-4"}>Trips</button>
      <button className={"text-white font-bold"}>Account</button>
    </nav>
  );
}