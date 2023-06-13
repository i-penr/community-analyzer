import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AddPost } from './AddPost';
import { AddSubreddit } from './AddSubreddit';
import { Home } from './Home';
import { Navbar } from './Navbar';
import { Posts } from './Posts';
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
          <Route path='/searchPosts'>
            <Posts />
          </Route>
          <Route path='/addPost'>
            <AddPost />
          </Route>
          <Route path='/addSub'>
            <AddSubreddit />
          </Route>
        </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
