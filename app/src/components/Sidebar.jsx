import { faAcorn, faConciergeBell, faFileAlt, faBars } from '@fortawesome/pro-duotone-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Brand from './Brand';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const ToggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <aside className={(isCollapsed) ? "App-sidebar" : "App-sidebar collapsed"}>
      <SidebarTop onChangeCollapsedState={() => {ToggleCollapsed()}} />
      <UserProfil />
        <Menu>
          <MenuItem icon={faAcorn} title='Dashboard' to="/" />
          <MenuItem icon={faConciergeBell} title='Services' to="/services" />
          <MenuItem icon={faFileAlt} title='Documentations' to="/docs" />
        </Menu>
    </aside>
  )
}

function SidebarTop(props) {
  return (
    <div className="App-sidebar__top">
      <button onClick={props.onChangeCollapsedState} className="App-sidebar__top__sidebar-toggle">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <button onClick={props.onChangeCollapsedState} className="App-sidebar__top__sidebar-toggle-collapsed">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <Brand />
    </div>
  )
}

function Menu(props) {
  return (
    <nav>
      <ul className="App-sidebar__list">
        {props.children}
      </ul>
    </nav>
  )
}

function MenuItem(props) {
  return (
    <li className="App-sidebar__list__item">
      <NavLink to={props.to} className="App-sidebar__list__item__link stretched-link" activeClassName="active">
        <div className="icon"><FontAwesomeIcon icon={props.icon} /></div>
        {props.title}
      </NavLink>
    </li>
  )
}

function UserProfil() {
  return (
      <div className="App-sidebar__profil">
          <img src="https://picsum.photos/250" alt="avatar" />
          <span>username</span>
      </div>
  )
}