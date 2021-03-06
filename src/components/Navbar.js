
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
    AsyncStorage
} from 'react-native';

import { Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../styles/base'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, apiServer } from '../constant/util'

export default class HeaderNavbar extends Component {
    state = {
        imageAvatar: require('../assets/images/default_avatar.jpg'),
        name : '',
        photo : ''
    }

    async componentDidMount() {
        try {
            const fullname = await AsyncStorage.getItem('fullname');
            const photo = await AsyncStorage.getItem('photo');
            this.setState({
                name: fullname,
                photo : photo
            })
        } catch (err) {
            console.log('err 1 : ' ,err)
        }
    }
    render() {
        const { imageAvatar, user_name } = this.state

        return (
            <View style={styleScoped.container}>
                {/* left side  */}
                <View style={styleScoped.leftSide}>
               
                    <TouchableOpacity style={styleScoped.avatar} onPress={() => {
                        Actions.replace('MyProfile')
                    }}>

                    {this.state.photo == '' || this.state.photo == null ? 
                     <Image
                     source={imageAvatar}
                     style={styleScoped.imageAvatar}
                 />
                :
                <Image
                source={{ uri: this.state.photo}}
                style={styleScoped.imageAvatar}
            />
                }
                   
                </TouchableOpacity>
                    <Text style={styleScoped.textName}>{this.state.name}</Text>
                </View>

                {/* right side */}
                <View style={styleScoped.rightSide}>
                    <TouchableOpacity onPress={() => Actions.push('Search')}>
                        <Icon name="search" size={hp('3%')} color="white" style={{ marginRight: hp('1.5%') }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> Actions.push('Notification')}>
                        <Icon name="notifications" size={hp('3%')} color="white" />
                    </TouchableOpacity>

                </View>


            </View>
        );
    }
};

const styleScoped = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: hp('2%'),
        paddingVertical: hp('1.5%'),
        backgroundColor: colors.primary,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    leftSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        height: hp('5%'),
        width: hp('5%'),
        marginRight: hp('1%')
    },
    imageAvatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 50
    },
    textName: {
        fontSize: hp('2.2%'),
        color: 'white',
        fontWeight: '500'
    }
});


