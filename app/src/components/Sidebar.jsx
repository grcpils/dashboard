import { faCog, faAcorn, faConciergeBell } from '@fortawesome/pro-duotone-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Brand from './Brand';

function Sidebar() {
    return (
        <aside className="App-sidebar">
            <Brand />
            <UserProfil />
            <ul className="App-sidebar__list">
                <MenuItem icon={faAcorn} title='Dashboard' />
                <MenuItem icon={faConciergeBell} title='Services' />
                <MenuItem icon={faCog} title='Settings' />
            </ul>
        </aside>
    )
}

function UserProfil() {
    return (
        <div className="App-sidebar__profil">
            <img src="https://picsum.photos/250" alt="avatar" />
            <span>grcpils</span>
        </div>
    )
}

function MenuItem(props) {
  return (
    <li className="App-sidebar__list__item">
      <FontAwesomeIcon icon={props.icon} />
      <a href="#index">
        {props.title}
      </a>
    </li>
    )
  }

export default Sidebar;