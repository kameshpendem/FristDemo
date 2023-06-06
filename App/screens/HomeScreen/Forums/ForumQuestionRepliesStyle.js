import {StyleSheet} from 'react-native';
import {wp} from '../../../themes/Scale';
import {theme} from '../../../themes/Theme';
import {CARD_SUB_TEXT_COLOR} from '../../../themes/variable';

export default StyleSheet.create({
  container: {},
  forumQuestion: {
    padding: wp(15),
  },
  repliesContent: {
    padding: wp(15),
    paddingTop: wp(10),
  },
  repliesCountText: {
    fontSize: theme.fontSizes.ml,
    marginTop: 0,
    marginBottom: wp(10),
    fontFamily: theme.fontFamily.primarySemiBold,
    color: CARD_SUB_TEXT_COLOR,
  },
  safeAreaView: {
    marginBottom: wp(20),
  },
});
