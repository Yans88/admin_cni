import Main from '../src/components/main/Main'
import Login from '../src/components/login/Login';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute';
import PublicRoute from './router/PublicRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const getBasename = path => path.substr(0, path.lastIndexOf('/'));
  return (
    <Router basename={getBasename(window.location.pathname)}>
      <Switch>
        
        <PublicRoute exact path="/login">
          <Login />
        </PublicRoute>

        <ProtectedRoute path="/">
          <Main />
        </ProtectedRoute>
        <Redirect from="*" to="/" />
        {/* <Route component={Main} /> */}
      </Switch>
    </Router>

  );
}
