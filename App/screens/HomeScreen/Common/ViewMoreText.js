import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'native-base'
import {withTranslation} from 'react-i18next';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
import {theme} from '../../../themes/Theme';

class ViewMoreText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textShown: false,
      showViewMore: false,
    };

    this.onTextLayout = this.onTextLayout.bind(this);
    this.toggleNumberOfLines = this.toggleNumberOfLines.bind(this);
  }

  onTextLayout(event) {
    const {numberOfLines = 2} = this.props;
    const {lines} = event.nativeEvent;
    if (lines && Array.isArray(lines) && lines.length > 0) {
      this.setState({
        showViewMore: lines.length >= numberOfLines,
      });
    }
  }

  toggleNumberOfLines() {
    this.setState((prevState) => ({
      textShown: !prevState.textShown,
    }));
  }

  render() {
    const {t, text, style, numberOfLines = 2} = this.props,
      {textShown, showViewMore} = this.state;

    return (
      <>
        <Text
          onTextLayout={this.onTextLayout}
          numberOfLines={textShown ? undefined : numberOfLines}
          style={style}>
          {text}
        </Text>
        {showViewMore && (
          <Text
            onPress={() => this.toggleNumberOfLines()}
            style={[style, styles.toggleButton]}>
            {textShown ? t('COMMON.VIEW_LESS') : t('COMMON.VIEW_MORE')}
          </Text>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  toggleButton: {
    color: APP_PRIMARY_COLOR,
    margin: 5,
    marginLeft: 0,
    fontFamily: theme.fontFamily.primaryBold,
  },
});

export default withTranslation()(ViewMoreText);
