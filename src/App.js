import { Fragment } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Layouts from './layouts';
import Router from './routes/Router';
import store from './stores/store';

function App() {
  const path = window.location.pathname;

  const Layout = path === '/' || path === '/register' || path === '/login' ? Fragment : Layouts;

  return (
    <Provider store={store}>
      <Layout>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </Layout>
    </Provider>
  );

}

export default App;
