import { faUser, faLock, faEnvelope } from '@fortawesome/pro-duotone-svg-icons';
import { faGithub, faGoogle, faSteam, faMicrosoft,  faReddit } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BrandedButton from '../components/BrandedButton';
import Brand from './../components/Brand';
import { NavLink } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { LoginBox, LoginBoxTitle, LoginSeparator } from './../components/LoginBox';
import { registerWithEmailAndPassword } from './../helpers/firebase';

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
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Todo: Data validation and test password confirmation
    registerWithEmailAndPassword(data.username, data.email, data.password);
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="App-login__form needs-validation">
        <div>
          <div className="input-group mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input {...register("username")} type="text" className="form-control" placeholder="Username" aria-label="Username" />
          </div>

          <div className="input-group mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input {...register("email")} type="email" className="form-control" placeholder="Email" aria-label="Email" />
          </div>

          <div className="input-group mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input {...register("password")} type="password" className="form-control" placeholder="Password" aria-label="Password" />
          </div>

          <div className="input-group mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input {...register("passwordBis")} type="password" className="form-control" placeholder="Confirm password" aria-label="Confirm password" />
          </div>

          </div>
          <RegisterControls />
      </form>
  )
}

function RegisterControls() {
  return (
      <div className="d-grid gap-2">
          <input type="submit" value="Register" className="btn btn-primary" />
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