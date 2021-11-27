import { faUser, faLock } from '@fortawesome/pro-duotone-svg-icons';
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
            <LoginBoxTitle title="Logging-In" subtitle="Please login before access Dashboard" />
            <LoginContent />
        </LoginBox>
    </div>
  );
}

function LoginContent() {
    return (
      <div className="App-login__box__content">
        <LoginForm />
        <LoginSeparator />
        <LoginOAuth />
      </div>
    )
}

function LoginForm() {
    return (
        <form className="App-login__form">
          <div>
          <div className="input-group mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
          </div>

          <div className="input-group mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input type="password" className="form-control" placeholder="Password" aria-label="Password" />
          </div>
            </div>
            <LoginControls />
        </form>
    )
}

function LoginControls() {
    return (
      <div className="d-grid gap-2">
          <input type="submit" value="Connect" className="btn btn-primary" />
          <NavLink to="/register" className="btn btn-lightgray btn-block">No account ?</NavLink>
      </div>
    )
}

function LoginOAuth() {
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