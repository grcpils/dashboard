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

const API_STEAM_FRIENDS_URL = `${process.env.REACT_APP_API_URL}/steam/friends`;

export default function SteamFriendsListWidget(props) {
  const modalId = Math.random().toString(36).slice(2);
  const user = auth.currentUser;
  const [modalShow, setModalShow ] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ params, setParams ] = useState({
    timer: props.params.timer,
    steamId64: props.params.steamId64,
  });
  const [friendList, setFriendList] = useState({});

  const handleCloseModal = () => { setModalShow(false) }
  const onParamsUpdate = (newParams) => {
    setLoading(true);
    setParams(newParams);
    updateWidget(user, props.widgetName, {
      component: 'steamFriends',
      key: props.widgetName,
      params: newParams
    })
  }
  const onDelete = () => {
    deleteWidget(user, props.widgetName);
    props.onDelete();
  }

  useEffect(() => {
    if (params.steamId64 !== '')
      axiosInstance.get(API_STEAM_FRIENDS_URL, {
          params: {
            ID: params.steamId64,
          }
      }).then((result) => {
        if (!result.data || result.data.length <= 0) {
              return;
        }
        if (result.data.error === undefined) {
          setFriendList(result.data.friends)
          setLoading(false)
        }
      }).catch((err) => {
        setFriendList({
          error: true
        })
        setLoading(false)
      });
    else
      setLoading(false);
}, [params]);

    return (
        <div className="widget__content widget-bg-steam widget-steam-friends">
            <div className="widget-bg-steam widget__move drag-handle"><FontAwesomeIcon icon={faExpandArrowsAlt} /></div>
            <button className="widget-bg-steam widget__edit" onClick={() => {setModalShow(true);}}><FontAwesomeIcon icon={faEllipsisV} /></button>
            <div className="widget-steam-friends__title">
            <FontAwesomeIcon icon={faSteam} />Steam Friends List</div>
            <div className="widget-steam-friends__content">
                <SteamScrollbars>
                    <ul className="list-group list-group-flush">
                    {loading &&
                      <div>
                        <SteamFriendItemPlaceholder />
                        <SteamFriendItemPlaceholder />
                        <SteamFriendItemPlaceholder />
                        <SteamFriendItemPlaceholder />
                      </div>
                    }
                    {friendList.length > 0 &&
                      friendList.map(data => friendsRenderer(data))
                    }
                    {!loading && params.steamId64 === '' &&
                      <div className="alert alert-danger m-2" role="alert">
                      Please configure this widget !
                      </div>
                    }
                    </ul>
                </SteamScrollbars>
            </div>
            <SteamFriendsWidgetConfigModal onDelete={onDelete} show={modalShow} close={handleCloseModal} onHide={() => {setModalShow(false)}} id={modalId} onParamsUpdate={onParamsUpdate} params={params} />
        </div>
    )
}

function friendsRenderer(data) {
    return (React.createElement(SteamFriendItem, { data: data }))
}

function SteamFriendItem(props) {
  return (
    <li className="list-group-item widget-steam-friends__item">
      <div className="item-container">
        <img className="avatar" src={props.data.avatar} alt="avatar" />
        <div className="data">
          <div className="data__pseudo">{props.data.personaname}</div>
          <div className="data__status text-success">Online</div>
        </div>
      </div>
    </li>
  )
}

function SteamFriendItemPlaceholder() {
  return (
    <li className="list-group-item widget-steam-friends__item">
      <div className="item-container placeholder-glow">
        <div className="avatar-placeholder placeholder"></div>
        <div className="data">
          <span className="placeholder col-9"></span>
          <span className="placeholder col-4 placeholder-xs"></span>
        </div>
      </div>
    </li>
  )
}

function SteamFriendsWidgetConfigModal(props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [ params, setParams ] = useState({
    timer: props.params.timer,
    steamId64: props.params.steamId64,
  });

  const onSubmit = async (data) => {
    let newParams = {
      timer: data.timer,
      steamId64: data.steamId64,
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
          <Modal.Title>Steam friends list configuration</Modal.Title>
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
                <input defaultValue={params.steamId64} {...register("steamId64", {required: true})} type="text" className={`form-control ${errors.steamId64 ? 'is-invalid' : ''}`} placeholder="SteamID-64" aria-label="City" />
                <div className="invalid-feedback ms-1">SteamID-64 is required</div>
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