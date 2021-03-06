
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
    FlatList,
    KeyboardAvoidingView,
    AsyncStorage
} from 'react-native';

import { Button, BottomSheet } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../styles/base'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { apiServer } from '../constant/util';
export default class Poll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            text: '',
            visibleSearch: false,
            list_search : []
        }
    }


    async componentDidMount() {
        try {
            const token = await AsyncStorage.getItem('token')
            this.setState({
                token: token
            })
        } catch (err) {
            // handle errors
        }
    }

    callSearch = async (name) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.token
        }

        axios.get(apiServer.url + '/api/backend/post/search?query=' + name, {
            headers
        })
            .then((response) => {
                console.log('data : ', response.data)
                if (response.data.status == "success") {
                    var i 
                    var text = ""
                    var list = []
                    for (i = 0 ; i  < response.data.post_data.length ; i++){
                        text = response.data.post_data[i].title
                        list.push(text)
                    }

                    this.setState({
                        list_search : list
                    })
                } else {

                }
            })
            .catch((error) => {
                console.log('data : ', error)
            })
            .finally(function () {
            });

    };
    render() {
        return (
            <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'white', ...style.marginHeaderStatusBar }}>
                        <View style={{ ...style.navbar }}>
                            <Icon name="chevron-left" size={hp('3%')} color="white" onPress={() => Actions.pop()} />
                            <Text style={{ fontSize: hp('2.2%'), color: 'white' }}>Search</Text>
                            <TouchableOpacity onPress={() => Actions.replace('Main')}>
                                <Text style={{ fontSize: hp('2.2%'), color: 'white' }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ ...style.container, marginTop: hp('2%') }}>
                            <View style={{ ...styleScoped.customInputSearch }}>
                                <Icon name="magnify" size={hp('2.2%')} style={{ marginRight: hp('1%'), }} color={'rgba(0,0,0,0.16)'} />
                                <TextInput style={{ padding: 0, fontSize: hp('2%') }} placeholder="Search..."
                                 onChangeText={(value) => {
                                    this.callSearch(value)
                                }}
                                ></TextInput>
                            </View>
                            <View style={{ marginTop: hp('2%') }}>
                                <Text style={{ fontSize: hp('2%'), color: '#707070' }}>Search by tags</Text>
                            </View>
                        </View>
                        <View style={{ marginVertical: hp('2%'), ...style.divider }}></View>
                        <ScrollView style={{ ...style.container }}>
                        {this.state.list_search.map((item, index) => {
                                return (
                                    <Text style={{ ...styleScoped.textList }}>{item}</Text>
                                    )}
                                )}
                        </ScrollView>
                    </View>
            </View>
        );
    }
};

const styleScoped = StyleSheet.create({
    customInputSearch: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.16)',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: hp('1%')
    },
    textList: {
        fontSize: hp('2%'),
        color: '#707070',
        fontWeight: '300',
        marginTop: hp('2%')
    }
});


