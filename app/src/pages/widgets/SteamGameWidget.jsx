import React from 'react';
import { SteamScrollbars } from '../../components/ScrollsBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSteam } from '@fortawesome/free-brands-svg-icons';
import { faEllipsisV, faExpandArrowsAlt, faTrashAlt, faKeySkeleton, faStopwatch } from '@fortawesome/pro-duotone-svg-icons'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import axiosInstance from '../../helpers/axios';
import { useForm } from "react-hook-form";
import { updateWidget, deleteWidget } from '../../helpers/firestore';
import { auth } from '../../helpers/firebase';
import { useState, useEffect } from 'react';

const API_STEAM_FRIENDS_URL = `${process.env.REACT_APP_API_URL}/steam/game`;

export default function SteamGameWidget(props) {
  const modalId = Math.random().toString(36).slice(2);
  const user = auth.currentUser;
  const [modalShow, setModalShow ] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ params, setParams ] = useState({
    timer: props.params.timer,
    gameId: props.params.gameId,
  });
  const [game, setGame] = useState({});

  const handleCloseModal = () => { setModalShow(false) }
  const onParamsUpdate = (newParams) => {
    setLoading(true);
    setParams(newParams);
    updateWidget(user, props.widgetName, {
      component: 'steamGame',
      key: props.widgetName,
      params: newParams
    })
  }
  const onDelete = () => {
    deleteWidget(user, props.widgetName);
    props.onDelete();
  }

  useEffect(() => {
    if (params.gameId !== '')
      axiosInstance.get(API_STEAM_FRIENDS_URL, {
          params: {
            ID: params.gameId,
          }
      }).then((result) => {
        if (!result.data || result.data.length <= 0) {
              return;
        }
        if (result.data.error === undefined) {
          setGame(result.data)
          setLoading(false)
        }
      }).catch((err) => {
        setGame({
          error: true
        })
        setLoading(false)
      });
    else
      setLoading(false);
}, [params]);

  if (loading) {
    return (
      <div className="widget__content widget-bg-steam widget-steam-game">
        <div className="widget-bg-steam widget__move drag-handle"><FontAwesomeIcon icon={faExpandArrowsAlt} /></div>
        <button className="widget-bg-steam widget__edit" onClick={() => {setModalShow(true);}}><FontAwesomeIcon icon={faEllipsisV} /></button>
        <div className="widget-bg-steam widget__content widget-steam-game__content">
          <div className="gamename"><span class="placeholder col-6"></span></div>
          <div className="data">
            <span class="placeholder mb-1 col-6 playerscount-placeholder"></span>
            <span class="placeholder col-3 placeholder-xs"></span>
          </div>
        </div>
        <SteamGameConfigModal onDelete={onDelete} show={modalShow} close={handleCloseModal} onHide={() => {setModalShow(false)}} id={modalId} onParamsUpdate={onParamsUpdate} params={params} />
      </div>
  )
  } else {
    return (
      <div className="widget__content widget-bg-steam widget-steam-game">
        <div className="widget-bg-steam widget__move drag-handle"><FontAwesomeIcon icon={faExpandArrowsAlt} /></div>
        <button className="widget-bg-steam widget__edit" onClick={() => {setModalShow(true);}}><FontAwesomeIcon icon={faEllipsisV} /></button>
        <div className="widget-bg-steam widget__content widget-steam-game__content">
          <div className="gamename">{game.gameName}</div>
          <div className="data">
            <div className="data__playerscount">{game.players}</div>
            <div className="data__playerstooltip">players</div>
          </div>
        </div>
        <SteamGameConfigModal onDelete={onDelete} show={modalShow} close={handleCloseModal} onHide={() => {setModalShow(false)}} id={modalId} onParamsUpdate={onParamsUpdate} params={params} />
      </div>
  )
  }
}

function SteamGameConfigModal(props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [ params, setParams ] = useState({
    timer: props.params.timer,
    gameId: props.params.gameId,
  });

  const onSubmit = async (data) => {
    let newParams = {
      timer: data.timer,
      gameId: data.gameId,
    }
    setParams(newParams)
    props.onParamsUpdate(newParams)
    props.close()
  };

  const onCancel = () => {
    props.close();
    reset(params)
  }

    return (
      <Modal show={props.show} backdrop="static">
        <Modal.Header >
          <Modal.Title>Steam game configuration</Modal.Title>
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
              <div className="input-group has-validation">
                <span className="input-group-text" id="basic-addon1">
                  <FontAwesomeIcon icon={faKeySkeleton} />
                </span>
                <input defaultValue={params.gameId} {...register("gameId", {required: true})} type="text" className={`form-control ${errors.gameId ? 'is-invalid' : ''}`} placeholder="GameId" aria-label="City" />
                <div className="invalid-feedback ms-1">GameId is required</div>
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