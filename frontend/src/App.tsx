import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { Navbar } from './Navbar';
import { Sublist } from './Sublist';
import { Subreddit } from './Subreddit';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className='content'>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/sub/:sub'>
            <Subreddit />
          </Route>
          <Route path='/subList'>
            <Sublist />
          </Route>
        </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
