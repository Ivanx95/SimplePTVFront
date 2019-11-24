import { React } from "react";
import NavBarItem from "/sandbox/other/components/NavBarItem.js";
export class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <NavBarItem
            hrf="https://smers.sse.codesandbox.io/"
            imgR="https://smers.sse.codesandbox.io/dna.png"
            altR="Logo"
          />
        </div>
      </nav>
    );
  }
}
