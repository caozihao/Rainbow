import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import withRouter from 'umi/withRouter';
import {} from 'antd';
//import styles from './Datail.less';
@withRouter
class Datail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  componentDidUpdate() { }

  render(){
    return(
      <div>合同详情</div>
      )
  }
}
Datail.propTypes = {}
Datail.defaultProps = {}
export default Datail;
