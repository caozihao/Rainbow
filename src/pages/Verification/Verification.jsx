import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import withRouter from 'umi/withRouter';
import {} from 'antd';
//import styles from './Verification.less';
@withRouter
class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  componentDidUpdate() { }

  render(){
    return(
      <div>核销</div>
      )
  }
}
Verification.propTypes = {}
Verification.defaultProps = {}
export default Verification;
