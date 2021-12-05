import { faEnvelope, faLock } from '@fortawesome/pro-duotone-svg-icons';
import { faGithub, faGoogle, /* faSteam, faMicrosoft,  faReddit */ } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BrandedButton from '../components/BrandedButton';
import Brand from './../components/Brand';
import { onAuthStateChanged } from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginBox, LoginBoxTitle, LoginSeparator } from './../components/LoginBox';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { auth } from '../helpers/firebase';
import { loginInWithEmailAndPassword, loginWithGithub, loginWithGoogle } from '../helpers/auth';

export default function Login() {
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        navigate("/");
      }
    });
  });

  if (loading) {
    return (
      <div className="App-login">
        <Brand />
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else {
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
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [ errorMessage, setErrorMessage ] = useState("");

  const onSubmit = async (data) => {
    let message = await loginInWithEmailAndPassword(data.email, data.password);
    setErrorMessage(message);
    if (message === "ok") {
      navigate("/");
    }
  };
  
    return (
        <form onSubmit={handleSubmit(onSubmit)} method="post" className="App-login__form">
          <div>
            <div className="input-group has-validation mb-2">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input {...register("email", {required: true, pattern: /^\S+@\S+\.\S+$/g})} type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email" aria-label="Email" />
              <div className="invalid-feedback ms-1">Email is required</div>
            </div>

            <div className="input-group has-validation mb-2">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input {...register("password", {required: true})} type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Password" aria-label="Password" />
              <div className="invalid-feedback ms-1">Password is required</div>
            </div>
            <div className={`${errorMessage ? 'alert alert-danger mb-2' : ''}`}>{errorMessage}</div>
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
          <NavLink to="/reset" className="btn btn-light btn-sm text-primary">Missing password ?</NavLink>
      </div>
    )
}

function LoginOAuth() {
    const [ errorMessage, setErrorMessage ] = useState("");

    const loginInWithProvider = async (provider) => {
      let message = "";
      switch (provider) {
        case 'github':
          message = await loginWithGithub();
          break;
        case 'google':
          message = await loginWithGoogle();
          break;
        default:
          message = "Provider doesn't exist"
          break;
      }
      setErrorMessage(message);
    }

    return (
      <div className="App-login__brands">
        <BrandedButton brand="github" icon={faGithub} onClick={async () => {loginInWithProvider('github')}}>Github</BrandedButton>
        <BrandedButton brand="google" icon={faGoogle} onClick={async () => {loginInWithProvider('google')}}>Google</BrandedButton>
        {/* <BrandedButton brand="steam" icon={faSteam}>Steam</BrandedButton>
        <BrandedButton brand="office" icon={faMicrosoft}>Office 365</BrandedButton>
        <BrandedButton brand="reddit" icon={faReddit}>Reddit</BrandedButton> */}
        <div className={`${errorMessage ? 'alert alert-danger mb-2' : ''}`}>{errorMessage}</div>
      </div>
    )
}