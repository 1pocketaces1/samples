// Styles for StandardBtn

import { StyleSheet } from 'react-native';
import { IOS_GREY } from '../../assets/colors';
import normalize from '../../assets/normalize';

// Constants
const BORDERW = normalize('width', 1);
const BORDERR = normalize('width', 5);

export default StyleSheet.create({
  btnPress: {
    backgroundColor: IOS_GREY
  },
  empty: {
    flex:1,
    position: 'absolute',
    zIndex: 50,
    top: 0,
    left: 0
  },
  txtFormat: {
    letterSpacing: 1,
    paddingTop: normalize('width', 5)
  }
});

export const containerInner = {
  left: {
    width: "100%",
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  center: {
    width: "100%",
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  right: {
    width: "100%",
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
}
