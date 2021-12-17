// Modules
import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

// Global Helpers
import { fill, center, txt } from '../../assets/globalStyles';
import normalize from '../../assets/normalize';

// Private Helpers
import styles, { containerInner }from './styles';

export default class StandardBtn extends Component {

  constructor(props) {
    super();
    this.state = {
      pressed: false
    }
  }

  render() {

    return (
      <TouchableWithoutFeedback
        onPressIn={this.pressDown}
        onPressOut={this.pressUp}
        style={fill}>
        <View style={[
          fill,
          center,
          {
            borderBottomColor: this.props.borderC,
            borderTopColor: this.props.borderC,
            borderLeftColor: this.props.borderC,
            borderRightColor: this.props.borderC,
            borderColor: this.props.borderC,


            borderBottomWidth: this.props.borderW,
            borderTopWidth: this.props.borderW,
            borderLeftWidth: this.props.borderW,
            borderRightWidth: this.props.borderW,
            borderWidth: this.props.borderW,

            borderBottomRightRadius: this.props.borderR,
            borderBottomLeftRadius: this.props.borderR,
            borderTopRightRadius: this.props.borderR,
            borderTopLeftRadius: this.props.borderR,
            borderRadius: this.props.borderR,

            backgroundColor: this.props.background
          },
          this.state.pressed && styles.btnPress
        ]}>
          <View style={[
              containerInner[this.props.align]
          ]}>
            <Text style={[
                txt.bold.center[this.props.textSize][this.props.device],
                {color: this.props.colorTXT},
                styles.txtFormat
              ]}>
              {this.props.textContent}
            </Text>
          </View>

          <View style={[
              styles.empty,
              {
                borderBottomRightRadius: this.props.borderR,
                borderBottomLeftRadius: this.props.borderR,
                borderTopRightRadius: this.props.borderR,
                borderTopLeftRadius: this.props.borderR
              },
              this.state.pressed && {backgroundColor: this.props.click}
          ]}></View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  pressDown = () => {
    this.setState({
      pressed: true
    });
  }

  pressUp = () => {
    this.setState({
      pressed: false
    });
    this.props.press();
  }
}

// PropTypes
StandardBtn.propTypes = {
  type: PropTypes.oneOf(['text', 'icon']),
  press: PropTypes.func.isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
  textSize: PropTypes.string.isRequired,
  textContent: PropTypes.string.isRequired,
  background: PropTypes.string, // Background color
  click: PropTypes.string, // Click feedback color
  borderC: PropTypes.string, // Border color
  borderW: PropTypes.number, // Border width
  borderR: PropTypes.number, // Border radius
  device: PropTypes.oneOf(['a','b','c','d']).isRequired
}
