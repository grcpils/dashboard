import { faAcorn, faConciergeBell, faFileAlt, faBars, faSignOutAlt } from '@fortawesome/pro-duotone-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Brand from './Brand';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../helpers/firebase';
import { logout } from '../helpers/auth';
import RoundIconButton from './RoundIconButton';

export default function Sidebar(props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const ToggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <aside className={(isCollapsed) ? "App-sidebar" : "App-sidebar collapsed"}>
      <SidebarTop onChangeCollapsedState={() => {ToggleCollapsed()}} />
      <UserProfil />
        <Menu>
          <MenuItem icon={faAcorn} title='Dashboard' to="/" onClick={() => {ToggleCollapsed()}} />
          <MenuItem icon={faConciergeBell} title='Services' to="/services" onClick={() => {ToggleCollapsed()}} />
          <MenuItem icon={faFileAlt} title='Documentations' to="/docs" onClick={() => {ToggleCollapsed()}} />
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
      <NavLink onClick={props.onClick} to={props.to} className={`${(props.isActive) ? 'active' : ''} App-sidebar__list__item__link stretched-link`} >
        <div className="icon"><FontAwesomeIcon icon={props.icon} /></div>
        {props.title}
      </NavLink>
    </li>
  )
}

function UserProfil(props) {
  const navigate = useNavigate();
  const [ username, setUsername ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName);
        setEmail(user.email);
        setLoading(false);
      } else {
        navigate("/login");
      }
    });
  }, []);

  const signout = () => {
    let error = logout();
    if (error === true)
      navigate("/login");
  }

  if (loading) {
    return (
      <div className="App-sidebar__profil">
        <div className="App-sidebar__profil__data placeholder-wave">
          <div className="avatar-placeholder placeholder"></div>
          <div className="data">
            <span className="placeholder col-6 mb-1"></span>
            <span className="placeholder col-8 placeholder-xs"></span>
          </div>
        </div>
        <RoundIconButton name="signout" fn={signout} icon={faSignOutAlt} className="btn-signout text-danger" />
      </div>
    )
  } else {
    return (
      <div className="App-sidebar__profil">
        <div className="App-sidebar__profil__data">
          <img src={`https://avatars.dicebear.com/api/adventurer-neutral/${props.username}.svg`} alt="avatar" />
          <div className="data">
            <div className="data__username">{username}</div>
            <div className="data__email">{email}</div>
          </div>
        </div>
        <RoundIconButton name="signout" fn={signout} icon={faSignOutAlt} className="btn-signout text-danger" />
      </div>
    )
  }
}