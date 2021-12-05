import { useState, useEffect } from 'react'
import axiosInstance from '../../helpers/axios';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faEllipsisV, faExpandArrowsAlt, faMapPin, faTrashAlt, faStopwatch, faFlagAlt } from '@fortawesome/pro-duotone-svg-icons'
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { countries } from '../../helpers/weather_data';
import { deleteWidget, updateWidget } from '../../helpers/firestore';
import { auth } from '../../helpers/firebase';

const API_WEATHER_URL = `${process.env.REACT_APP_API_URL}/weather`;

export default function WeatherWidget(props) {
  const modalId = Math.random().toString(36).slice(2);
  const user = auth.currentUser;
  const [modalShow, setModalShow ] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ params, setParams ] = useState(props.params);
  const [weather, setWeather] = useState({
    city: null,
    max: 0,
    min: 0,
    current: 0,
    error: false
  });

  const handleCloseModal = () => { setModalShow(false) }
  const onParamsUpdate = (newParams) => {
    setParams(newParams);
    updateWidget(user, props.widgetName, {
      component: 'weather',
      key: props.widgetName,
      params: newParams
    })
  }
  const onDelete = () => {
    deleteWidget(user, props.widgetName);
    props.onDelete();
  }


  useEffect(() => {
    axiosInstance.get(API_WEATHER_URL, {
        params: {
          city: params.city,
          country: params.country.value,
          state: ''
        }
    }).then((result) => {
      if (!result.data || result.data.length <= 0) {
            return;
        }
        if (result.data.error === undefined) {
        setWeather({
          city: result.data.city,
          max: result.data.max,
          min: result.data.min,
          current: result.data.current,
          error: false
        })
          setLoading(false)
        }
    }).catch((err) => {
      setWeather({
        city: null,
        max: 0,
        min: 0,
        current: 0,
        error: true
      })
      setLoading(false)
      console.log(err);
    });
}, [params]);


  if (loading) {
    return (
      <div className="widget__content widget-weather--loading placeholder-glow">
        <div className="widget-bg-light widget__move drag-handle"><FontAwesomeIcon icon={faExpandArrowsAlt} /></div>
        <button className="widget-bg-light widget__edit" onClick={() => {setModalShow(true);}}><FontAwesomeIcon icon={faEllipsisV} /></button>
        <div className="widget-weather__content">
            <div className="widget-weather__temp">
                <span className="placeholder"></span>
            </div>
            <div className="widget-weather__city">
              <span className="placeholder placeholder-sm"></span>
            </div>
        </div>
        <div className="widget-weather__tempbar">
          <div className="widget-weather__tempbar__min">
            <span className="placeholder"></span>
          </div>
          <div className="widget-weather__tempbar__max">
            <span className="placeholder"></span>
          </div>
        </div>
        <WeatherWidgetConfigModal onDelete={onDelete} params={params} show={modalShow} close={handleCloseModal} onHide={() => {setModalShow(false)}} id={modalId} onParamsUpdate={onParamsUpdate} />
      </div>
    )
  } else {
    if (weather.error) {
      return (
        <div className="widget__content d-flex justify-content-center align-items-center">
          <div className="widget-bg-light widget__move drag-handle"><FontAwesomeIcon icon={faExpandArrowsAlt} /></div>
          <button className="widget-bg-light widget__edit" onClick={() => {setModalShow(true);}}><FontAwesomeIcon icon={faEllipsisV} /></button>
          <FontAwesomeIcon icon={faExclamationCircle} style={{width: 80, height: 80}} className="text-danger" />
          <WeatherWidgetConfigModal onDelete={onDelete} params={params} show={modalShow} close={handleCloseModal} onHide={() => {setModalShow(false)}} id={modalId} onParamsUpdate={onParamsUpdate} />
        </div>
      )
    } else {
      return (
        <div className="widget__content">
          <div className="widget-bg-light widget__move drag-handle"><FontAwesomeIcon icon={faExpandArrowsAlt} /></div>
          <button className="widget-bg-light widget__edit" onClick={() => {setModalShow(true);}}><FontAwesomeIcon icon={faEllipsisV} /></button>
          <div className="widget-weather__content">
              <div className="widget-weather__temp">{weather.current}°</div>
              <div className="widget-weather__city">{params.city}</div>
          </div>
          <div className="widget-weather__tempbar">
            <div className="widget-weather__tempbar__min">{weather.min}°</div>
            <div className="widget-weather__tempbar__max">{weather.max}°</div>
          </div>
          <WeatherWidgetConfigModal onDelete={onDelete} params={params} show={modalShow} close={handleCloseModal} onHide={() => {setModalShow(false)}} id={modalId} onParamsUpdate={onParamsUpdate} />
        </div>
      )
    }
  }
}

function WeatherWidgetConfigModal(props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [ selectOpt, setSelectOpt ] = useState('')
  const [ params, setParams ] = useState(props.params);
  let oldSelectOpt = props.params.country;

  const onSubmit = async (data) => {
    let newParams = {
      timer: data.timer,
      city: data.city,
      country: selectOpt
    }
    setParams(newParams)
    props.onParamsUpdate(newParams)
    props.close()
  };

  const selectHandleChange = (selectedOption) => {
    setSelectOpt(selectedOption);
  };

  const onCancel = () => {
    props.close();
    reset(params)
  }

    return (
      <Modal show={props.show} backdrop="static">
        <Modal.Header >
          <Modal.Title>Weather configuration</Modal.Title>
          <OverlayTrigger key='left' placement='left' overlay={
            <Tooltip>
              Delete this widget
            </Tooltip>
          }>
            <Button className="text-danger" variant="light" onClick={props.onDelete}><FontAwesomeIcon icon={faTrashAlt} /></Button>
          </OverlayTrigger>
        </Modal.Header>

        <Modal.Body>
          <form method="post" onSubmit={(e) => {e.preventDefault()}}>
            <div>
              <div className="input-group mb-2 has-validation">
                <span className="input-group-text" id="basic-addon1">
                  <FontAwesomeIcon icon={faFlagAlt} />
                </span>
                <Select defaultValue={oldSelectOpt.valuealue} defaultInputValue={oldSelectOpt.label} onChange={selectHandleChange} placeholder='Country' options={countries} classNamePrefix="rs" className={`form-control rs__form-control ${errors.country ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback ms-1">Country is required</div>
              </div>
              <div className="input-group has-validation">
                <span className="input-group-text" id="basic-addon1">
                  <FontAwesomeIcon icon={faMapPin} />
                </span>
                <input defaultValue={params.city} {...register("city", {required: true})} type="text" className={`form-control ${errors.city ? 'is-invalid' : ''}`} placeholder="City" aria-label="City" />
                <div className="invalid-feedback ms-1">City is required</div>
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <form method="post" onSubmit={(e) => {e.preventDefault()}}>
              <div className="input-group has-validation input-timer">
                <span className="input-group-text"><FontAwesomeIcon icon={faStopwatch} /></span>
                <input {...register("timer", {required: true, min: 3, max: 60 })} type="number" min='3' max='60' defaultValue={params.timer} className={`form-control ${errors.timer ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback position-absolute ms-1" style={{right: -140}}>Timer needed (between 3 and 60 minutes)</div>
              </div>
            </form>
            <div>
              <Button className="me-2" variant="lightgray" onClick={onCancel}>Close</Button>
              <Button variant="primary" onClick={handleSubmit(onSubmit)}>Save</Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    )
}
