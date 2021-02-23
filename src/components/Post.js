
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';

import { Button, Overlay } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../styles/base'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from "react-native-raw-bottom-sheet";
import { fonts } from '../constant/util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageGrid from './ImageGrid'
import { actionLikePost, actionDeletePost, actionFollowPost } from '../Service/PostService'
import translate from '../constant/lang'

export default class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                title: '',
                time: '',
                image: require('../assets/images/post_1.png'),
                detail: '',
                tag: []
            },
            default_avatar: require('../assets/images/default_avatar.jpg'),
            visibleBottomSheet: false,
            visibleModalReport: false,
            is_like: 0,
            like_count: 0,
            lng: {},
            is_follow: 0,
            user_data: {}
        }
    }

    async UNSAFE_componentWillMount() {
        await this.getLang();
        await this.getUserInfo();
    }

    async getLang() {
        this.setState({ isFetching: true })
        let vocap = await translate()
        this.setState({ lng: vocap })
        this.setState({ isFetching: false })
    }
    async getUserInfo() {
        let user_json = await AsyncStorage.getItem('user_data');
        let user_data = JSON.parse(user_json);

        this.setState({
            user_data: user_data
        })
    };
    async componentDidMount() {
        let { is_like, like, is_follow } = this.props.data
        // console.log(this.props.data)
        this.setState({
            token: await AsyncStorage.getItem('token'),
            is_like: is_like,
            like_count: like,
            is_follow: is_follow
        })
    }

    openOption() {
        this.RBSheet.open()
    }

    async openReport() {
        await this.RBSheet.close()
        // await this.setState({ visibleModalReport: true })
        let self = this
        setTimeout(() => {
            self.props.onPostReport(this.props.data.post_id)
        }, 300);
    }

    renderModalReport() {
        const { visibleModalReport, lng } = this.state
        return (
            <Overlay
                isVisible={true}
                overlayStyle={{
                    width: wp('90%'),
                    paddingVertical: hp('2%'),
                    paddingHorizontal: hp('2%')
                }}
            >
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={{
                        borderBottomColor: '#707070',
                        borderBottomWidth: 1,
                        paddingBottom: hp('1.5%')
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            color: fonts.color.primary,
                            fontSize: hp('2%'),
                            fontWeight: '600'
                        }}>{lng.report}</Text>
                    </View>

                    <View style={{ marginVertical: hp('1%') }}>
                        <Text style={{ fontSize: hp('2%') }}>{lng.select_topic_for_report}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                            <Button
                                title={lng.fake_news}
                                titleStyle={{ fontSize: hp('2%') }}
                                buttonStyle={{ ...style.btnPrimary, margin: hp('0.5%') }}
                            />
                            <Button
                                title={lng.cyber_bully}
                                titleStyle={{ fontSize: hp('2%') }}
                                buttonStyle={{ ...style.btnPrimary, margin: hp('0.5%') }}
                            />
                            <Button
                                title={lng.threat}
                                titleStyle={{ fontSize: hp('2%'), color: fonts.color.primary }}
                                buttonStyle={{ ...style.btnPrimaryOutline, margin: hp('0.5%') }}
                            />
                        </View>
                        <Text style={{ fontSize: hp('2%'), marginTop: hp('2%') }}>{lng.report_reason}</Text>
                    </View>

                    <View style={{ ...style.customInput, height: hp('20%'), flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <TextInput
                            style={{ fontSize: hp('2%'), padding: 0 }}
                            placeholder={lng.enter_reason}
                            multiline={true}
                        />
                    </View>


                    <View style={{ marginTop: hp('1%') }}>
                        <Button
                            title={lng.report}
                            buttonStyle={{
                                padding: hp('1.5%'),
                                ...style.btnRounded,
                                ...style.btnPrimary
                            }}
                            onPress={() => this.setState({ visibleModalReport: tr })}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Overlay>
        )
    }

    renderBottomSheet() {
        const { visibleBottomSheet, is_follow, lng } = this.state
        const { report } = this.props
        let height = Platform.OS === 'ios' ? hp('32%') : hp('30%')
        height = report ? height : Platform.OS === 'ios' ? hp('25%') : hp('23%')
        return (
            <RBSheet
                ref={ref => {
                    this.RBSheet = ref;
                }}
                // height={height}
                openDuration={250}
                customStyles={{
                    container: {
                        borderTopRightRadius: 30,
                        borderTopLeftRadius: 30,
                        paddingTop: hp('1%'),
                        backgroundColor: 'white',
                        ...style.shadowCard,
                        height: 'auto'
                    }
                }}
            >
                <TouchableOpacity style={{
                    ...styleScoped.listMore
                }}
                    onPress={() => this.callPostFollow(this.props.data.post_id)}
                >
                    <Icon
                        name={is_follow ? "heart" : 'heart-outline'}
                        size={hp('3%')} color={is_follow ? "#FF0066" : '#707070'}
                        style={{ marginRight: hp('2%') }} />
                    <Text style={{ fontSize: hp('2%'), color: '#707070' }}>{lng.follow_blog}</Text>
                </TouchableOpacity>
                {
                    this.state.user_data.user_role == 'Admin' || this.state.user_data.userid == this.props.data.author.id &&
                    <>
                        <View style={{ ...style.divider }}></View>
                        <TouchableOpacity style={{
                            ...styleScoped.listMore
                        }}
                            onPress={() => {
                                Actions.replace('CreatePost', {
                                    'type_value': 'edit',
                                    'title': this.props.data.title,
                                    'description': this.props.data.description,
                                    'post_images': this.props.data.post_images,
                                    'post_tag': this.props.data.tags,
                                    'post_id': this.props.data.post_id
                                })
                                this.setState({ visibleBottomSheet: false }),
                                    this.RBSheet.close()
                            }}
                        >
                            <Icon name="pencil" size={hp('3%')} color="#29B100" style={{ marginRight: hp('2%') }} />
                            <Text style={{ fontSize: hp('2%'), color: '#707070' }}>{lng.edit_blog}</Text>
                        </TouchableOpacity>
                        <View style={{ ...style.divider }}></View>

                        <TouchableOpacity style={{
                            ...styleScoped.listMore
                        }}
                            onPress={() => this.callDeletePost(this.props.data.post_id)}
                        >
                            <Icon name="delete" size={hp('3%')} color="#003764" style={{ marginRight: hp('2%') }} />
                            <Text style={{ fontSize: hp('2%'), color: '#707070' }}>{lng.delete_blog}</Text>
                        </TouchableOpacity>
                        <View style={{ ...style.divider }}></View>
                        
                    </>
                }
                {
                    report && this.state.user_data.userid != this.props.data.author.id ?
                        <TouchableOpacity style={{ ...styleScoped.listMore }} onPress={() => this.openReport()}>
                            <Icon name="file-document" size={hp('3%')} color="#003764" style={{ marginRight: hp('2%') }} />
                            <Text style={{ fontSize: hp('2%'), color: '#707070' }}>{lng.report}</Text>
                        </TouchableOpacity>
                        : null
                }


            </RBSheet>
        )
    }


    async callDeletePost(post_id) {
        this.setState({ visibleBottomSheet: false })
        this.RBSheet.close()
        try {
            let response = await actionDeletePost(post_id)
            let { status } = response.data
            if (status == 'success') {
                this.props.onPostUpdate()
            }
        } catch (error) {
            console.log('Delete post error : ', error)
        }
    };

    async callPostLike(post_id) {
        try {
            let { is_like, like_count } = this.state
            let response = await actionLikePost({ post_id })
            let { status } = response.data
            if (status == 'success') {
                this.setState({
                    is_like: is_like ? 0 : 1,
                    like_count: is_like ? like_count - 1 : like_count + 1
                })
            }
        } catch (error) {
            console.log('Like post error : ', error)
        }
    };


    async callPostFollow(post_id) {
        this.setState({ visibleBottomSheet: false })
        this.RBSheet.close()
        try {
            let { is_follow } = this.state
            let response = await actionFollowPost({ post_id })
            let { status } = response.data
            if (status == 'success') {
                this.setState({
                    is_follow: is_follow ? 0 : 1,
                })
            }
        } catch (error) {
            console.log('Follow post error : ', error)
        }
    };

    postView() {
        Actions.PostDetail({ data: { ...this.props.data } })
        // AsyncStorage.setItem('post_id', this.props.data.post_id.toString())
    }

    sharePOST(post_url) {
        this.props.sharePressButton(post_url)
    }

    render() {

        let {
            title,
            post_date,
            post_description,
            post_images, tags,
            post_id,
            like,
            comment_number,
            share_url,
            author,
            view
        } = this.props.data

        let { is_like, like_count, default_avatar, lng } = this.state

        return (
            <View style={{
                ...styleScoped.shadowCard,
                backgroundColor: 'white',
                paddingVertical: hp('1%'),
                marginBottom: hp('2%')
            }}>
                <TouchableOpacity
                    onPress={() => { this.postView() }}
                    style={{ paddingHorizontal: hp('2%') }}
                >
                    <View style={{
                        ...style.space__between,
                        alignItems: 'center'
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                height: hp('5%'),
                                width: hp('5%'),
                                marginRight: hp('1%')
                            }}>

                                <Image source={!author.photo ? default_avatar : { uri: author.photo }}
                                    style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 50 }} />

                            </View>
                            <View >
                                <Text style={{ fontSize: hp('2%') }}>{author.full_name}</Text>
                                <Text style={{ fontSize: hp('2%'), color: fonts.color.secondary, fontSize: 12 }}>{post_date}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.openOption()}>
                            <Icon name="dots-horizontal" size={hp('3%')} color="#707070" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: hp('2%'), fontWeight: '400', marginTop: hp('2%') }} >{title}</Text>
                    <View style={{ marginTop: hp('0.5%'), justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            tags.map((item, index) => {
                                return (
                                    <Button
                                        title={item}
                                        titleStyle={{ fontSize: hp('1.5%') }}
                                        buttonStyle={{ ...style.btnTagPrimary, marginTop: hp('1%') }}
                                        key={index}
                                    />
                                )
                            })
                        }
                    </View>
                    <View style={{ maxHeight: hp('31%'), marginVertical: hp('1%') }}>
                        <ImageGrid data={post_images} />
                    </View>
                    <Text
                        style={{ fontSize: hp('2%'), fontWeight: '300' }}
                        numberOfLines={4}
                        ellipsizeMode="tail"
                    >{post_description}</Text>
                </TouchableOpacity>

                <View style={{
                        justifyContent: 'flex-start',
                        marginTop: hp('2%'),
                        paddingTop: hp('1.5%'),
                        flexDirection: 'row',
                        width: wp('100%'),
                        paddingHorizontal: hp('2%'),
                    }}>
                    <TouchableOpacity onPress={() => this.callPostLike(post_id)} style={{flexDirection: 'row'}}>
                        <Icon name="thumb-up" size={hp('2.5%')} style={{ marginRight: hp('1%'), color: is_like ? '#4267B2' : '#B5B5B5' }} />
                        <Text style={{ marginRight: hp('3%'), color: '#B5B5B5' }}> {like_count}</Text>
                    </TouchableOpacity>

                    <Icon name="eye" size={hp('2.5%')} style={{ marginRight: hp('1%'), color: '#B5B5B5' }} />
                    <Text style={{ marginRight: hp('3%'), color: '#B5B5B5' }}> {view === undefined ? 0 : view}</Text>

                    <TouchableOpacity onPress={() => this.sharePOST(share_url)}>
                        <Icon name="share-outline" size={hp('2.5%')} style={{ marginRight: hp('1%'), color: '#B5B5B5' }} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => this.postView()}
                    style={{
                        ...style.flex__start,
                        marginTop: hp('2%'),
                        paddingTop: hp('1.5%'),
                        borderTopWidth: 1,
                        borderTopColor: '#B5B5B5',
                        alignItems: 'center',
                        paddingHorizontal: hp('2%'),
                    }}>
                    <Icon name="comment-outline" size={hp('2.5%')} style={{ marginRight: hp('1%'), color: '#B5B5B5' }} />
                    <Text style={{ color: '#B5B5B5' }}>{comment_number}  {lng.comment}</Text>
                </TouchableOpacity>

                {this.renderBottomSheet()}
                {/* {this.renderModalReport()} */}
            </View>
        );
    }
};

const styleScoped = StyleSheet.create({

    shadowCard: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    listMore: {
        width: '100%',
        padding: hp('2%'),
        flexDirection: 'row',
        alignItems: 'center',

    }
});