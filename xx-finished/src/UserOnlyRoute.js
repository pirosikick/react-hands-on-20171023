import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import * as firebase from 'firebase';

function UserOnlyRoute({ component: Component, ...rest }) {
  const user = firebase.auth().currentUser;
  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} user={user} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )}
    />
  );
}

UserOnlyRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.instanceOf(React.Component),
    PropTypes.func,
  ]).isRequired,
};

export default UserOnlyRoute;
