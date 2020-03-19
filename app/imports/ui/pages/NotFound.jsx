import React from 'react';
import { Header } from 'semantic-ui-react';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
class NotFound extends React.Component {
  render() {
    return (
      <Header textAlign="center">
        <h2>404: Page Not Found</h2>
        <h4>The requested URL was not found on this server</h4>
      </Header>
    );
  }
}

export default NotFound;
