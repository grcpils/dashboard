import { faAcorn, faConciergeBell, faFileAlt } from '@fortawesome/pro-duotone-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import Brand from './Brand';

function Sidebar() {
  return (
    <aside className="App-sidebar">
      <Brand />
      <UserProfil />
        <Menu>
          <MenuItem icon={faAcorn} title='Dashboard' to="/" />
          <MenuItem icon={faConciergeBell} title='Services' to="/services" />
          <MenuItem icon={faFileAlt} title='Documentations' to="/docs" />
        </Menu>
    </aside>
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

export default Sidebar;