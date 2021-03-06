
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
    AsyncStorage
} from 'react-native';
import axios from 'axios';
import { Button, BottomSheet } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../styles/base'
import { Actions } from 'react-native-router-flux'
import HeaderNavbar from '../components/Navbar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MenuFooter from '../components/MenuFooter'
import MenuFooterUser from '../components/MenuFooterUser'
import Post from '../components/Post'
import { apiServer, refreshToken } from '../constant/util';
export default class Main extends Component {
    state = {
        visibleSearch: false,
        user_type: '',
        token :'',
        list_data : [],
        user_role : ''
    }

    async componentDidMount() {
        try {
            await refreshToken()
            const token = await AsyncStorage.getItem('token');
            const user_type = await AsyncStorage.getItem('user_type');
            const user_role = await AsyncStorage.getItem('user_role');
            this.setState({
                user_type: user_type,
                token : token,
                user_role : user_role
            })
            this.callHomeFeed(token)
        } catch (err) {
            console.log('err 1 : ' ,err)
        }
    }



    callHomeFeed = async (token) => {
        axios.get(apiServer.url + '/api/backend/post/home-feed',{
            headers: {
                Accept: 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
        .then((response) => {
            var i  
            var objectHomeFeed = {}
            var list = []
            for (i = 0 ; i < response.data.post_data.length ; i++){
                objectHomeFeed = {
                    post_id : response.data.post_data[i].post_id,
                    title : response.data.post_data[i].title,
                    date : response.data.post_data[i].post_date,
                    description : response.data.post_data[i].post_description,
                    tags : response.data.post_data[i].tags,
                    post_images :  response.data.post_data[i].post_images,
                    comment : response.data.post_data[i].comment_number,
                    like : response.data.post_data[i].like,
                }
                this.setState({
                    list_data : list
                })
            })
            .catch((error) => {
                console.log('err 2 : ' ,error)
            })
        })
        .catch((error) => {
            console.log('err 2 : ' ,error)
        })
        .finally(function () {
        });

    };

    render() {

        const { dataList } = this.state
        return (
            <View style={{ flex: 1, ...style.marginHeaderStatusBar }}>
                <StatusBar barStyle="dark-content" />
                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: '#F9FCFF', paddingBottom: hp('1%') }}>
                    {this.state.user_role == "Member" ? 
                    <HeaderNavbar  value={'member'}></HeaderNavbar>
                    :
                    <HeaderNavbar  value={'admin'}></HeaderNavbar>
                    }
                        <View style={{ backgroundColor: '#F9FCFF', paddingBottom: hp('8%') }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: hp('2%'),
                                alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: hp('2.2%'), color: '#003764' }}> ETDA Blogs </Text>
                                <Icon name="compare-vertical" size={hp('3%')} color="#707070" />
                            </View>

                            {/* section admin */}
                            {this.state.user_type == 'read, post_read' ?
                                <View style={{ ...style.container, marginBottom: hp('1%') }}>
                                    <Button
                                        title="Write New Blog"
                                        Outline={true}
                                        titleStyle={{ color: '#003764', }}
                                        buttonStyle={{
                                            padding: hp('1%'),
                                            ...style.btnPrimaryOutline,
                                            ...style.btnRounded
                                        }}
                                        onPress={() => Actions.CreatePost({ 'type_value' : 'create' , 'title': '',
                                        'description': '',
                                        'post_images': []})}
                                    />


                                </View>
                                :
                                <View style={{ ...style.container, marginBottom: hp('1%') }}></View>
                            }
                            {/* end section admin */}

                            <ScrollView style={{ marginBottom: 24 }}>
                                {this.state.list_data.map((item, index) => {
                                return (
                                    <Post data={item} key={`post_${index}`}></Post>
                                    )}
                                )}
                            </ScrollView>


                        </View>
                    </View>
                
                
                </ScrollView>
                <View style={{ backgroundColor: null }}>
                    {this.state.user_role == "Member" ? 
                         <MenuFooterUser value={'home'}></MenuFooterUser>
                        :
                        <MenuFooter value={'home'}></MenuFooter>
                    }
                   
                </View>
            </View>
        );
    }
};

const styleScoped = StyleSheet.create({
    imageLogo: {
        height: hp('15%'),
        width: hp('23%')
    },
    textWelcome: {
        textAlign: 'center',
        fontSize: hp('2%'),
        color: '#003764'
    },
    inputCustom: {
        height: hp('5%'),
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: hp('1%')
    },
    shadowCard: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    }
});


