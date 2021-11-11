import './sass/App.scss';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App">

      <Sidebar />

      <header className="App-header">
      </header>

      <section className="App-content">
        <Outlet />
      </section>

    </div>
  );
}

export default App;
