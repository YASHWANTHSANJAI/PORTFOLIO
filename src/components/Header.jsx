export default function Header() { return (<header className="topbar" id="topbar">
    <nav className="nav wrap" aria-label="Main navigation">
      <a className="brand" href="#home" aria-label="Yashwanth Sanjai S, home"><span className="brand-mark">YS</span><span className="brand-type">Yashwanth Sanjai S</span></a>
      <button className="menu-toggle" id="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="nav-links" type="button"><span></span><span></span><span></span></button>
      <div className="nav-links" id="nav-links"><a href="#story">The Story</a><a href="#arsenal">The Arsenal</a><a href="#achievements">Projects</a><a href="#journey">Journey</a><a href="#contact">Contact</a></div>
      <div className="scroll-progress" aria-hidden="true"></div>
    </nav>
  </header>); }