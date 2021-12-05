import React from 'react';
import { RssScrollbars } from '../../components/ScrollsBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRss, faEllipsisV, faExpandArrowsAlt, faTrashAlt, faLink, faStopwatch, faExternalLink } from '@fortawesome/pro-duotone-svg-icons'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import axiosInstance from '../../helpers/axios';
import { useForm } from "react-hook-form";
import { updateWidget, deleteWidget } from '../../helpers/firestore';
import { auth } from '../../helpers/firebase';
import { useState, useEffect } from 'react';

const API_RSS_URL = `${process.env.REACT_APP_API_URL}/rss`;

export default function SteamFriendsListWidget(props) {
  const modalId = Math.random().toString(36).slice(2);
  const user = auth.currentUser;
  const [modalShow, setModalShow ] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ params, setParams ] = useState({
    timer: props.params.timer,
    url: props.params.url,
  });
  const [rss, setRss] = useState([]);

  const handleCloseModal = () => { setModalShow(false) }
  const onParamsUpdate = (newParams) => {
    setLoading(true);
    setParams(newParams);
    updateWidget(user, props.widgetName, {
      component: 'rss',
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
      axiosInstance.get(API_RSS_URL, {
          params: {
            url: params.url,
          }
      }).then((result) => {
        if (!result.data || result.data.length <= 0) {
              return;
        }
        if (result.data.error === undefined) {
          setRss(result.data.data)
          setLoading(false)
        }
      }).catch((err) => {
        setRss({
          error: true
        })
        setLoading(false)
      });
    else
      setLoading(false);
}, [params]);

    return (
        <div className="widget__content widget-bg-rss">
            <div className="widget-bg-rss widget__move drag-handle"><FontAwesomeIcon icon={faExpandArrowsAlt} /></div>
            <button className="widget-bg-rss widget__edit" onClick={() => {setModalShow(true);}}><FontAwesomeIcon icon={faEllipsisV} /></button>
            <div className="widget-rss__title">
            <FontAwesomeIcon icon={faRss} />RSS</div>
            <div className="widget-rss__content">
                <RssScrollbars>
                    <ul className="list-group list-group-flush">
                    {loading &&
                      <div>
                        <RSSPlaceholder />
                        <RSSPlaceholder />
                        <RSSPlaceholder />
                        <RSSPlaceholder />
                      </div>
                    }
                    {rss.length > 0 &&
                      rss.map(data => rssRenderer(data))
                    }
                    {!loading && params.url === '' &&
                      <div className="alert alert-danger m-2" role="alert">
                      Please configure this widget !
                      </div>
                    }
                    </ul>
                </RssScrollbars>
            </div>
            <RssWidgetConfigModal onDelete={onDelete} show={modalShow} close={handleCloseModal} onHide={() => {setModalShow(false)}} id={modalId} onParamsUpdate={onParamsUpdate} params={params} />
        </div>
    )
}

function rssRenderer(data) {
    return (React.createElement(RssItem, { data: data }))
}

function RssItem(props) {
  return (
    <li className="list-group-item widget-rss__item">
      <div className="item-container placeholder-glow">
        <div className="data">
          <span className="data__title mb-1">{props.data.title}</span>
          <span className="data__content">{props.data.content}</span>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <a className="btn btn-sm btn-primary mt-1" href={props.data.link} target="_blank">Read more <FontAwesomeIcon icon={faExternalLink} /></a>
          </div>
        </div>
      </div>
    </li>
  )
}

function RSSPlaceholder() {
  return (
    <li className="list-group-item widget-rss__item">
      <div className="item-container placeholder-glow">
        <div className="data">
          <span className="placeholder col-9 mb-2 placeholder-lg"></span>
          <div className="data__para mb-2">
            <span className="placeholder col-4 me-1 placeholder-xs"></span>
            <span className="placeholder col-2 me-1 placeholder-xs"></span>
            <span className="placeholder col-4 me-1 placeholder-xs"></span>
            <span className="placeholder col-3 me-1 placeholder-xs"></span>
            <span className="placeholder col-2 me-1 placeholder-xs"></span>
            <span className="placeholder col-3 me-1 placeholder-xs"></span>
            <span className="placeholder col-1 me-1 placeholder-xs"></span>
            <span className="placeholder col-3 me-1 placeholder-xs"></span>
            <span className="placeholder col-5 me-1 placeholder-xs"></span>
            <span className="placeholder col-3 me-1 placeholder-xs"></span>
            <span className="placeholder col-4 me-1 placeholder-xs"></span>
            <span className="placeholder col-3 me-1 placeholder-xs"></span>
          </div>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <a href="#" tabindex="-1" class="btn btn-sm btn-primary disabled placeholder col-4" aria-hidden="true"></a>
          </div>
        </div>
      </div>
    </li>
  )
}

function RssWidgetConfigModal(props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [ params, setParams ] = useState({
    timer: props.params.timer,
    url: props.params.url,
  });

  const onSubmit = async (data) => {
    let newParams = {
      timer: data.timer,
      url: data.url,
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
          <Modal.Title>Rss configuration</Modal.Title>
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
                  <FontAwesomeIcon icon={faLink} />
                </span>
                <input defaultValue={params.url} {...register("url", {required: true})} type="text" className={`form-control ${errors.url ? 'is-invalid' : ''}`} placeholder="Url" aria-label="Url" />
                <div className="invalid-feedback ms-1">Url is required</div>
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