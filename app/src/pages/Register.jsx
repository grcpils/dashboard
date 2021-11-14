import { faUser, faLock, faEnvelope } from '@fortawesome/pro-duotone-svg-icons';
import { faGithub, faGoogle, faSteam, faMicrosoft,  faReddit } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BrandedButton from '../components/BrandedButton';
import Brand from './../components/Brand';
import { NavLink } from 'react-router-dom';
import { LoginBox, LoginBoxTitle, LoginSeparator } from './../components/LoginBox';

export default function Login() {
    return (
      <div className="App-login">
        <Brand />
        <LoginBox>
            <LoginBoxTitle title="Register" subtitle="Please register before use this application" />
            <RegisterContent />
        </LoginBox>
      </div>
    );
}

function RegisterContent() {
  return (
    <div className="App-login__box__content">
      <RegisterForm />
      <LoginSeparator />
      <RegisterOAuth />
    </div>
  )
}

function RegisterForm() {
  return (
      <form className="App-login__form">
        <div>
          <div className="input-group-icon">
              <FontAwesomeIcon icon={faUser} className="input-group-icon__icon" />
              <input className="input-group-icon__input" placeholder="Username" />
          </div>

          <div className="input-group-icon">
              <FontAwesomeIcon icon={faEnvelope} className="input-group-icon__icon" />
              <input className="input-group-icon__input" placeholder="Email" />
          </div>

          <div className="input-group-icon">
              <FontAwesomeIcon icon={faLock} className="input-group-icon__icon" />
              <input className="input-group-icon__input" placeholder="Password" type="password" />
          </div>
          <div className="input-group-icon">
              <FontAwesomeIcon icon={faLock} className="input-group-icon__icon" />
              <input className="input-group-icon__input" placeholder="Confirm password" type="password" />
          </div>
          </div>
          <RegisterControls />
      </form>
  )
}

function RegisterControls() {
  return (
      <div className="App-login__controls">
          <button className="btn btn-accent btn-text-bold btn-block">Register</button>
          <NavLink to="/login" className="btn btn-lightgray btn-block">Already registered ?</NavLink>
      </div>
  )
}

function RegisterOAuth() {
  return (
    <div className="App-login__brands">
      <BrandedButton brand="github" icon={faGithub}>Github</BrandedButton>
      <BrandedButton brand="google" icon={faGoogle}>Google</BrandedButton>
      <BrandedButton brand="steam" icon={faSteam}>Steam</BrandedButton>
      <BrandedButton brand="office" icon={faMicrosoft}>Office 365</BrandedButton>
      <BrandedButton brand="reddit" icon={faReddit}>Reddit</BrandedButton>
    </div>
  )
}