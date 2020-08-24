import * as React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import TaskList from "./TaskList";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <a href="/auth">Login</a>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/">Tasks</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/about">About things, yay!</Route>
          <Route path="/">
            <TaskList />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App
