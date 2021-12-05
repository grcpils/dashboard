import React from 'react';
import PageTitle from './../components/PageTitle';
import { faPlus } from '@fortawesome/pro-duotone-svg-icons'
import RoundIconButton from '../components/RoundIconButton';
import { Responsive, WidthProvider } from 'react-grid-layout';
import WeatherWidget from './widgets/WeatherWidget';
import { onAuthStateChanged } from "firebase/auth";
import SteamFriendsListWidget from './widgets/SteamFriendsListWidget';
import SteamGameWidget from './widgets/SteamGameWidget';
import RssWidget from './widgets/RssWidget';
import { auth } from './../helpers/firebase';
import { addWidget, saveLayout, getLayout, getWidgetsList } from './../helpers/firestore';
import { useState } from 'react'
import { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


const ResponsiveGridLayout = WidthProvider(Responsive);
function Dashboard() {
  const [modalShow, setModalShow ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ layouts, setLayouts ] = useState({});
  const [ widgets, setWidgets ] = useState([]);
  const [ editing, setEditing ] = useState(false);

  async function fetchData(user) {
    const savedLayout = await getLayout(user);
    const savedWidgetList = await getWidgetsList(user);
    return {
      layouts: savedLayout,
      widgets: savedWidgetList
    };
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user).then((data) => {
          setLayouts(data.layouts);
          setWidgets(data.widgets);
          setLoading(false);
        })
      }
    });
  }, []);

  const onLayoutChange = (layout) => {
    if (!loading) {
      let newLayouts = {
        lg: layout
      }
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLayouts(newLayouts);
          if (!editing)
            saveLayout(user, newLayouts)
          else
            setEditing(false);
        }
      });
    }
  }

  const onWidgetEdited = () => {
    const user =  auth.currentUser;
    setLoading(true);
    setEditing(true);
    fetchData(user).then((data) => {
      setLayouts(data.layouts);
      setWidgets(data.widgets);
      setLoading(false);
    })
  }

  if (loading) {
    return (
      <div>
      <div className="position-relative">
        <PageTitle title="Dashboard" subtitle="Main page of project" />
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      </div>
    )
  } else {
    return (
      <div>
        <div className="position-relative">
          <PageTitle title="Dashboard" subtitle="Main page of project" />
          <RoundIconButton name="add-widget" fn={() => {setModalShow(true)}} icon={faPlus} className="text-accent widget-btn-add" />
        </div>
        <ResponsiveGridLayout onLayoutChange={onLayoutChange} className="widget-container" draggableHandle=".drag-handle" layouts={layouts}
          useCSSTransforms={false}
          breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
          cols={{lg: 8, md: 6, sm: 4, xs: 2, xxs: 2}}>
            {widgets.map(config => widgetRenderer(config, onWidgetEdited))}
        </ResponsiveGridLayout>
        <AddWidgetModal onEdit={onWidgetEdited} close={() => {setModalShow(false)}} show={modalShow} />
      </div>
    );
  }
}

const KeysToComponentMap = {
  weather: WeatherWidget,
  steamFriends: SteamFriendsListWidget,
  steamGame: SteamGameWidget,
  rss: RssWidget
};

function widgetRenderer(config, onWidgetEdited) {
  if (typeof KeysToComponentMap[config.component] !== "undefined") {
    return (
      <div className="widget" key={config.key}>
        {React.createElement(KeysToComponentMap[config.component], { widgetName: config.key, params: config.params, onDelete: onWidgetEdited })}
      </div>
    )
  }
}

function AddWidgetModal(props) {
  const user = auth.currentUser;
  const onCancel = () => {
    props.close();
  }
  const addSteamFriends = async () => {
    const widgetId = Math.random().toString(36).slice(2);
    await getLayout(user)
    .then(async (layouts) => {
      layouts.lg.push({
        i: widgetId,
        x: 0, y: 0,
        w: 2, h: 2,
        minH: 2, maxH: 4,
        resizeHandles: ['s']
      })
      addWidget(user, widgetId, {
        component: 'steamFriends',
        key: widgetId,
        params: {
          steamId64: '',
          timer: 5
        }
      })
      await saveLayout(user, layouts).then(() => {
        props.onEdit();
      })
    })
  }
  const addWeather = async () => {
    const widgetId = Math.random().toString(36).slice(2);
    await getLayout(user)
    .then(async (layouts) => {
      layouts.lg.push({
        i: widgetId,
        x: 0, y: 0,
        w: 1, h: 1,
        minH: 1, maxH: 1,
        isResizable: false
      })
      addWidget(user, widgetId, {
        component: 'weather',
        key: widgetId,
        params: {
          city: 'Lille',
          country: {"label":"France","value":"FRA","country-code":"250"},
          timer: 2
        }
      })
      await saveLayout(user, layouts).then(() => {
        props.onEdit();
      })
    })
  }
  const addGame = async () => {
    const widgetId = Math.random().toString(36).slice(2);
    await getLayout(user)
    .then(async (layouts) => {
      layouts.lg.push({
        i: widgetId,
        x: 0, y: 0,
        w: 1, h: 1,
        minH: 1, maxH: 1,
        isResizable: false
      })
      addWidget(user, widgetId, {
        component: 'steamGame',
        key: widgetId,
        params: {
          gameId: '',
          timer: 5
        }
      })
      await saveLayout(user, layouts).then(() => {
        props.onEdit();
      })
    })
  }
  const addRss = async () => {
    const widgetId = Math.random().toString(36).slice(2);
    await getLayout(user)
    .then(async (layouts) => {
      layouts.lg.push({
        i: widgetId,
        x: 0, y: 0,
        w: 2, h: 2,
        minH: 2, maxH: 4,
        resizeHandles: ['s']
      })
      addWidget(user, widgetId, {
        component: 'rss',
        key: widgetId,
        params: {
          url: '',
          timer: 10
        }
      })
      await saveLayout(user, layouts).then(() => {
        props.onEdit();
      })
    })
  }

    return (
      <Modal show={props.show} backdrop="static">
        <Modal.Header >
          <Modal.Title>Add new widget</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-grid gap-2">
            <Button variant="weather" onClick={addWeather}>Temperature of city</Button>
            <Button variant="rss" onClick={addRss}>Rss flux</Button>
            <Button variant="steam" onClick={addSteamFriends}>Steam friends list</Button>
            <Button variant="steam" onClick={addGame}>Game's players count</Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button className="me-2" variant="lightgray" onClick={onCancel}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
}

export default Dashboard;