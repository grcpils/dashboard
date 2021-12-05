import { faUser, faLock, faEnvelope } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Brand from './../components/Brand';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { LoginBox, LoginBoxTitle } from './../components/LoginBox';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../helpers/firebase';
import { registerWithEmailAndPassword } from '../helpers/auth';

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  });

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
    </div>
  )
}

function RegisterForm(props) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [ errorMessage, setErrorMessage ] = useState("");
  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async (data) => {
    let message = await registerWithEmailAndPassword(data.username, data.email, data.password);
    setErrorMessage(message);
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} method="post" className="App-login__form needs-validation">
        <div>
          <div className="input-group has-validation mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input {...register("username", {required: true, message: 'Please specify username'})} type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`} placeholder="Username" aria-label="Username" />
            <div className="invalid-feedback ms-1">Username is required</div>
          </div>

          <div className="input-group has-validation mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input {...register("email", {required: true, pattern: /^\S+@\S+\.\S+$/g})} type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email" aria-label="Email" />
            <div className="invalid-feedback ms-1">Email is required</div>
          </div>

          <div className="input-group has-validation mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input {...register("password", {required: true})} type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Password" aria-label="Password" />
            <div className="invalid-feedback ms-1">Password is required</div>
          </div>

          <div className="input-group has-validation mb-2">
            <span className="input-group-text" id="basic-addon1">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input {...register("passwordBis", {required: true, validate: value => value === password.current})} type="password" className={`form-control ${errors.passwordBis ? 'is-invalid' : ''}`} placeholder="Confirm password" aria-label="Confirm password" />
            <div className="invalid-feedback ms-1">Passwords must be the same</div>
          </div>

          <div className={`${errorMessage ? 'alert alert-danger mb-2' : ''}`}>{errorMessage}</div>
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