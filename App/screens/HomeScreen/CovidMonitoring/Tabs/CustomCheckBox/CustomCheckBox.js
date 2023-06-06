import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { withTranslation } from 'react-i18next';

// styles
import styles from './CustomCheckBoxStyles'
class CustomCheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.checkBoxWrapper}>
                <TouchableOpacity
                    style={[styles.checkBoxTouchableSection, { backgroundColor: `${this.props.color}` }]}
                    {...this.props}
                ><Text></Text>
                </TouchableOpacity>
            </View >
        );
    }
}

export default withTranslation()(CustomCheckBox);
