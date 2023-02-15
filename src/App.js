import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layouts from './layouts';
import Router from './routes/Router';

function App() {
  const path = window.location.pathname;

  const Layout = path === '/' || path === '/register' || path === '/login' ? Fragment : Layouts;

  return (
    <Layout>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Layout>
  );

}

export default App;
