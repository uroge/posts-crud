import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/Home/Home';
import AllPosts from './pages/AllPosts/AllPosts';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
      <React.Fragment>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/all-posts" exact component={AllPosts}/>
        </Switch>
      </React.Fragment>
    </BrowserRouter>
    );
  }
}

export default App;
