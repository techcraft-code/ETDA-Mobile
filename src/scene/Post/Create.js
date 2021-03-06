
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
import { SliderBox } from "react-native-image-slider-box";

import { Button, BottomSheet, ThemeConsumer } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../../styles/base'
import { Actions } from 'react-native-router-flux'
import HeaderNavbar from '../../components/Navbar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuFooter from '../../components/MenuFooter'
import { fonts } from '../../constant/util';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import { apiServer } from '../../constant/util';

export default class CreatePost extends Component {
    constructor() {
        super();
        this.state = { visibleSearch: false, token: '', title: '', type: 'blog', image: [], description: '', tag: [], addition: '', postId: '' , images : [] , tags : [] }
    }

    async componentDidMount() {
        try {
            console.log('data : ' , this.props.title)
            const token = await AsyncStorage.getItem('token')
            this.setState({
                token: token,
                title : this.props.title,
                description : this.props.description,
                image : this.props.post_images
            })
            this.callTagsList(token)
        } catch (err) {
            // handle errors
        }
    }


    callTagsList = async (token) => {
        console.log('token : ' , token)
        axios.get(apiServer.url + '/api/backend/post/tag-list',{
            headers: {
                Accept: 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
            .then((response) => {
                if (response.data.status == "success") {
                    var list = []
                    var i
                    for (i = 0 ; i < response.data.post_data.length ; i++){
                        var name = response.data.post_data[i].tag
                        list.push(name)
                    }
                    this.setState({
                        tag : list
                    })
                } else {

                }
            })
            .catch((error) => {
                console.log('error : ' , error)
            })
            .finally(function () {
            });

    };

    callCreatePost = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.token
        }

        const data = {
            "post_title": this.state.title,
            "post_type": this.state.type,
            "post_images": this.state.images,
            "post_description": this.state.description,
            "post_tag": this.state.tag,
            "post_addition_data": this.state.addition
        }


        console.log('post : ' , this.state.images )

        axios.post(apiServer.url + '/api/backend/post/create', data, {
            headers
        })
            .then((response) => {
                if (response.data.status == "success") {
                   Actions.MessageBoard()
                } else {

                }
            })
            .catch((error) => {
                console.log('data : ', error)
            })
            .finally(function () {
            });

    };



    callUpdatePost = async (title , type , images , description , tags , addition , post_id) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.token
        }

        const data = {
            "post_title": title,
            "post_type": type,
            "post_images": images,
            "post_description": description,
            "post_tag": tags,
            "post_addition_data": addition
        }


        axios.put(apiServer.url + '/api/backend/post/update/' + post_id, data, {
            headers
        })
            .then((response) => {
                console.log('data : ', response.data)
                if (response.data.status == "success") {
                    Actions.MessageBoard()
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
        const { dataList } = this.state

        onChangeTextTitle = async (value) => {
            this.setState({
                title: value
            })
        }

        onChangeTextDescription = async (value) => {
            this.setState({
                description: value
            })
        }

        return (
            <ScrollView style={{ flex: 1, backgroundColor: 'white', ...style.marginHeaderStatusBar }}>
                <View style={{ ...style.navbar }}>
                    <TouchableOpacity onPress={() => Actions.pop()}>
                        <Icon name="chevron-left" size={hp('3%')} color="white" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: hp('2.2%'), color: 'white' }}>{this.props.type_value == 'detail' ? 'Detail Blog' : this.props.type_value == 'create' ? 'Create Blog' : 'Edit Blog'}</Text>
                    {this.props.type_value == 'detail' ? 
                        <View>
                        </View>     
                    
                    :
                    <TouchableOpacity onPress={() => 
                    {
                        if (this.props.type_value == 'create'){
                                this.callCreatePost()
                        }else{
                            this.callUpdatePost(this.state.title,
                            'blog' ,
                            this.state.images,
                            this.state.description,
                            this.state.tag,
                            this.state.addition,
                            this.props.data.post_id,
                            )
                        }
    }
    }>
<Text style={{ fontSize: hp('2.2%'), color: 'white' }}>Post</Text>
</TouchableOpacity>
                    }
                   
                </View>
                {/* content */}
                <View>
                    <View style={{ height: hp('7%') }}>
                        <TextInput placeholder="Enter your topic here…" style={{ paddingVertical: hp('2%'), paddingHorizontal: hp('2%'), fontSize: hp('2.2%') }}
                            defaultValue={this.state.title}
                            editable={this.props.type_value == 'detail' ? false : true} selectTextOnFocus={this.props.type_value == 'detail' ? false : true}
                            onChangeText={(value) => {
                                onChangeTextTitle(value)
                            }}
                        >



                        </TextInput>
                    </View>
                    <View style={{ ...style.divider }}></View>
                    <View style={{ height: hp('25%') }}>
                        <TextInput placeholder="Enter your post here…" style={{ paddingVertical: hp('2%'), paddingHorizontal: hp('2%'), fontSize: hp('2.2%') }} multiline={true}
                          defaultValue={this.state.description}
                          editable={this.props.type_value == 'detail' ? false : true} selectTextOnFocus={this.props.type_value == 'detail' ? false : true}
                        onChangeText={(value) => {
                            onChangeTextDescription(value)
                        }}
                        ></TextInput>
                    </View>

                    { this.state.image.length == 0 ? 
                    <View >

                    </View>
                    
                    : 
                    
                    <View style={{ height: hp('30%') }}>
                        <SliderBox
                            images={this.state.image}
                            sliderBoxHeight={hp('30%')}
                        />
                    </View>
                    }

                    

                    <View style={{ ...style.divider }}></View>
                    <TouchableOpacity onPress={() =>  
                                ImagePicker.openPicker({ multiple: true,
                                    includeBase64 : true
                                    }).then(images => {
                                    var j 
                                    var image = []
                                    var image_base64 = []
                                    for (j = 0 ; j < images.length ; j++){
                                        console.log('image path : ' , images[j].path)
                                        image.push(images[j].path)
                                        var image_send = 'data:image/jpeg;base64,' + images[j].data
                                        image_base64.push(image_send)
                                    }
                                    this.setState({
                                        image : image,
                                        images : image_base64
                                    })
                                   // console.log('result image : ' , images[0]);
                                  })}>
                          {this.props.type_value == 'detail' ?           
                   <View>
                       
                   </View>

                    :
                    <View style={{
                        marginTop: hp('1%'),
                        marginBottom: hp('1%'),
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: hp('2%')
                    }}>
                        <Icon name="camera" style={{ marginRight: hp('2%') }} color="#003764" size={hp('3%') } />
                        <Text style={{ fontSize: hp('2.5%'), color: '#003764' }}>Pick picture</Text>
                    
                    </View>
                } 


                    </TouchableOpacity>
                    <View style={{ ...style.divider }}></View>

                    <View style={{
                        marginTop: hp('2%'),
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: hp('2%')
                    }}>
                        <Icon name="tag" style={{ marginRight: hp('2%') }} color="#003764" size={hp('2.5%')} />
                        <Text style={{ fontSize: hp('2.5%'), color: '#003764' }}>Tag</Text>
                    </View>
                    {this.props.type_value == 'detail' ?   
                        <View>
                        </View>    
                    :
                    <View>
                    <View style={{ marginTop: hp('2%'), paddingHorizontal: hp('2%') }}>
                        <TextInput
                            style={style.customInput}
                            placeholder="Add tag by yourself…"
                        />
                    </View>


                    <View style={{ paddingHorizontal: hp('2%') }}>
                        <View style={{ marginTop: hp('4%'), alignItems: 'center', ...style.boxTextBorder }}>
                            <Text style={{ ...style.textOnBorder, fontSize: hp('2%'), color: '#B5B5B5' }}>Or</Text>
                        </View>
                    </View>
                    </View>

                }



                    <View style={{
                        marginTop: hp('2%'),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingHorizontal: hp('2%'),
                        flexWrap: 'wrap'

                    }}>
                    
                        <Button
                            title="E-commerce"
                            titleStyle={{ fontSize: hp('2%') }}
                            buttonStyle={{ ...style.btnPrimary, margin: hp('0.5%') }}
                            onPress={() => { 
                               
                            }} 
                        />
                        <Button
                            title="E-commerce"
                            titleStyle={{ fontSize: hp('2%') }}
                            buttonStyle={{ ...style.btnPrimary, margin: hp('0.5%') }}
                        />
                        <Button
                            title="E-commerce"
                            titleStyle={{ fontSize: hp('2%'), color: fonts.color.primary }}
                            buttonStyle={{ ...style.btnPrimaryOutline, margin: hp('0.5%') , marginBottom : hp('10%') }}
                        />

                    </View>



                </View>

            </ScrollView>
        );
    }
};

const styleScoped = StyleSheet.create({

});


