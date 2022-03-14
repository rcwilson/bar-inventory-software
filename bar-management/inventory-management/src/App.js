import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';
import ProductsPage from './products/ProductsPage';
import NewProductPage from './products/NewProduct';
import NavTop from './components/Nav/NavTop';
import { createContext } from 'react';

import UserAuth from './auth/UserAuth';

export const authContext = createContext();

function App() {

  let { user , setUser, logout } = UserAuth();

  function PageContainer( props ) {
    return (
    <div className="content-container ">
      { props.children }
    </div>
    )
  }
  function Content( props ) {
     return (
        <div className="content">
          { props.children }
        </div>
      )
  }

  if( ! user ) {
    return (
      <PageContainer>
        <Router>
        <NavTop user={ user } />
        <Content>
            <Switch>
              <Route exact path="/">
                <Login setUser={ setUser } />
              </Route>
              <Route path="*">
                <Redirect to="/"/>
              </Route>
            </Switch>
        </Content>
        </Router>
      </PageContainer>
    )
  }

  if ( user ) {
    return (
      <PageContainer>
        <Router>
        <NavTop user={ user } logout={ logout } />
        <Content>
            <Switch>
              <Route exact path="/">
                <Redirect to="/products"/>
              </Route>
              <Route exact path="/logout">
                <Logout />
              </Route>
              <Route exact path="/products/new">
                <NewProductPage />
              </Route>
              <Route exact path="/products">
                <ProductsPage />
              </Route>
              <Route path="*">
                <Redirect to="/products"/>
              </Route>
            </Switch>
        </Content>
        </Router>
      </PageContainer>
    )

  }
}
export default App;
