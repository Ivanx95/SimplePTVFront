import React from "react";

export class NavBarItem extends React.Component {
  render() {
    return (
      <a href="{this.props.href}" className="navbar-item">
        <img src="{this.props.img}" alt="{this.props.alt}" />
      </a>
    );
  }
}
