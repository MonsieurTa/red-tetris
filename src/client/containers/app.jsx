import React from 'react';
import { connect } from 'react-redux';

function App({ message }) {
  return <span>{message}</span>;
}

const mapStateToProps = (state) => ({
  message: state.message,
});

export default connect(mapStateToProps, null)(App);
