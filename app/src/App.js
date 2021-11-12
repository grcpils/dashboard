import './sass/App.scss';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  // Outlet == selected route and content
  return (
    <div className="App">

      <Sidebar />

      <Header />

      <section className="App-content">
        <Outlet />
      </section>

    </div>
  );
}

export default App;
