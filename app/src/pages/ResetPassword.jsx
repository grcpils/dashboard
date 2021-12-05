import { faEnvelope } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Brand from './../components/Brand';
import { onAuthStateChanged } from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginBox, LoginBoxTitle } from './../components/LoginBox';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { auth } from '../helpers/firebase';
import { resetPasswordWithEmail } from '../helpers/auth';

export default function ResetPassword() {
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
              <LoginBoxTitle title="Password reset" subtitle="You can send reset email from this place" />
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
      </div>
    )
}

function LoginForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [ errorMessage, setErrorMessage ] = useState("");

  const onSubmit = async (data) => {
    let message = await resetPasswordWithEmail(data.email, data.password);
    setErrorMessage(message);
    if (message === "ok") {
      navigate("/login");
    }
  };

    return (
        <form onSubmit={handleSubmit(onSubmit)} method="post" className="App-login__form">
          <div>
            <div className="input-group has-validation mb-2">
              <span className="input-group-text" id="basic-addon1">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input {...register("email", {required: true, pattern: /^\S+@\S+\.\S+$/g})} type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email" aria-label="Email" />
              <div className="invalid-feedback ms-1">Email is required</div>
            </div>

            <div className={`${errorMessage ? 'alert alert-success mb-2' : ''}`}>{errorMessage}</div>
          </div>
          <LoginControls />
        </form>
    )
}

function LoginControls() {
    return (
      <div className="d-grid gap-2">
          <input type="submit" value="Send reset email" className="btn btn-primary" />
          <NavLink to="/login" className="btn btn-lightgray btn-block">I remember it now !</NavLink>
      </div>
    )
}