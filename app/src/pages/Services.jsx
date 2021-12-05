import PageTitle from './../components/PageTitle';
import { faGithub, faGoogle, faSteam, faMicrosoft,  faReddit } from '@fortawesome/free-brands-svg-icons';
import { faGraduationCap, faCheckCircle, faLink } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { auth } from './../helpers/firebase';
import { setToken } from './../helpers/firestore';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useForm } from "react-hook-form";
import { useState } from 'react'

export default function Login() {
  const [modalShow, setModalShow ] = useState(false);

  const handleCloseModal = () => { setModalShow(false) }

  return (
    <div>
      <PageTitle title="Services" subtitle="List all available services" />
      <ServicesList>
        <Service className="disabled" title="github" logo={faGithub} />
        <Service className="disabled" title="google" logo={faGoogle} />
        <Service className="disabled" title="steam" logo={faSteam} />
        <Service className="disabled" title="office" logo={faMicrosoft} />
        <Service className="disabled" title="reddit" logo={faReddit} />
        <Service title="epitech" logo={faGraduationCap} onClick={() => {setModalShow(true)}} />
        <ServiceEpitechModal show={modalShow} close={handleCloseModal} onHide={() => {setModalShow(false)}} />
      </ServicesList>
    </div>
  );
}

function ServicesList(props) {
  return (
    <div className="services-container">{props.children}</div>
  )
}

function Service(props) {
  return (
    <a href={`#${props.title}`} onClick={props.onClick} className={`btn btn-${props.title} service ${props.className}`}>
      <span className="service__title">
        { props.active === true &&
          <FontAwesomeIcon className="me-1" icon={faCheckCircle} />
        }
        {props.title}
      </span>
      <div className="service__content">
        <FontAwesomeIcon icon={props.logo} />
      </div>
    </a>
  )
}

function ServiceEpitechModal(props) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const user = auth.currentUser;

  const onSubmit = async  (data) => {
    await setToken(user, 'epitech', data.autologin);
    props.close();
  }

  const onCancel = () => {
    props.close();
  }

  return (
    <Modal show={props.show} backdrop="static">
      <Modal.Header >
        <Modal.Title>Weather configuration</Modal.Title>
      </Modal.Header>
        
      <Modal.Body>
        <form method="post" onSubmit={(e) => {e.preventDefault()}}>
          <div>
            <div className="input-group has-validation">
              <span className="input-group-text" id="basic-addon1">
                <FontAwesomeIcon icon={faLink} />
              </span>
              <input {...register("autologin", {required: true, pattern: /^auth-+.{40}$/gm})} type="text" className={`form-control ${errors.autologin ? 'is-invalid' : ''}`} placeholder="auth-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" aria-label="City" />
              <div className="invalid-feedback ms-1">Autologin is required</div>
            </div>
          </div>
        </form>
      </Modal.Body>
        
      <Modal.Footer>
        <Button className="me-2" variant="lightgray" onClick={onCancel}>Close</Button>
        <Button variant="primary" onClick={handleSubmit(onSubmit)}>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}