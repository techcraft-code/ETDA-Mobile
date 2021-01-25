
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TextInput,
    TouchableOpacity,
    Platform
} from 'react-native';

import { Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../styles/base'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterail from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors, fonts } from '../constant/util';

export default class MenuFooter extends Component {
    state = {
        userType: 'admin' // normal user or admin
    }
    render() {
        const { userType } = this.state
        return (
            <View >
                <View style={styleScoped.container}>
                    <TouchableOpacity style={{ width: userType == 'admin' ? '25%' : '33.33%' }} onPress={() => Actions.replace('Main')}>
                        <Icon name="home" size={hp('2.6%')} color={colors.primary} style={{ alignSelf: 'center' }} />
                        <Text style={{ textAlign: 'center', fontSize: hp('1.2%'), color: fonts.color.primary }}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: userType == 'admin' ? '25%' : '33.33%' }} onPress={() => Actions.replace('MessageBoard')}>
                        <Icon name="globe" size={hp('2.6%')} color="#B5B5B5" style={{ alignSelf: 'center' }} />
                        <Text style={{ textAlign: 'center', fontSize: hp('1.2%'), color: '#B5B5B5' }}>Message Board</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: userType == 'admin' ? '25%' : '33.33%' }} onPress={() => Actions.replace('Activity')}>
                        <Icon name="calendar" size={hp('2.6%')} color="#B5B5B5" style={{ alignSelf: 'center' }} />
                        <Text style={{ textAlign: 'center', fontSize: hp('1.2%'), color: '#B5B5B5' }}>Activity</Text>
                    </TouchableOpacity>
                    {/* section admin */}
                    <TouchableOpacity style={{ width: userType == 'admin' ? '25%' : '33.33%' }} onPress={() => Actions.replace('ManageBlog')}>
                        <IconMaterail name="view-carousel" size={hp('2.6%')} color="#B5B5B5" style={{ alignSelf: 'center' }} />
                        <Text style={{ textAlign: 'center', fontSize: hp('1.2%'), color: '#B5B5B5' }}>Manage Blogs</Text>
                    </TouchableOpacity>
                    {/* end section admin */}

                </View>
            </View>
        );
    }
};

const styleScoped = StyleSheet.create({
    container: {
        paddingBottom: Platform.OS === 'ios' ? hp('4%') : hp('1%'),
        flexDirection: 'row',
        paddingHorizontal: hp('2%'),
        paddingVertical: hp('1.5%'),
        backgroundColor: 'white',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },

});


