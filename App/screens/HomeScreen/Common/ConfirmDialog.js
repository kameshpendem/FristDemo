import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Portal, Dialog} from 'react-native-paper';
import {
  DEFAULT_BLACK_COLOR,
  DEFAULT_WHITE_COLOR,
} from '../../../themes/variable';

class ConfirmDialog extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Portal>
        <Dialog visible={this.props.visible} onDismiss={this.props.onDismiss}>
          <Dialog.Title
          testID={this.props.title+"title"}
          accessibilityLabel={this.props.title+"title"}>{this.props.title}</Dialog.Title>
          <Dialog.Content>
            <Text
            testID={this.props.content+"text"}
            accessibilityLabel={this.props.content+"text"}>{this.props.content}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <TouchableOpacity
            testID={this.props.noLabel+"touch"}
            accessibilityLabel={this.props.noLabel+"touch"}
              style={styles.confirmButtons}
              onPress={() => this.props.onDismiss(false)}>
              <Text
              testID={this.props.noLabel+"text"}
              accessibilityLabel={this.props.noLabel+"text"}>{this.props.noLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            testID={this.props.yesLabel+"touch"}
            accessibilityLabel={this.props.yesLabel+"text"}
              style={styles.confirmButtons}
              onPress={() => this.props.onDismiss(true)}>
              <Text
              testID={this.props.yesLabel+"text"}
              accessibilityLabel={this.props.yesLabel+"touch"}>{this.props.yesLabel}</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  confirmButtons: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    color: DEFAULT_BLACK_COLOR,
    margin: 10,
    padding: 10,
  },
});

export default ConfirmDialog;
