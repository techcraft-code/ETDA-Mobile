
import React, { Component, Fragment } from 'react';
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
    KeyboardAvoidingView,
    Platform,
    FlatList
} from 'react-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../../styles/base'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Comment from '../../components/Comment'
import translate from '../../constant/lang'
import moment from 'moment'
import { actionLikePost } from '../../Service/PostService'
export default class EventDetail extends Component {
    state = {
        visibleSearch: false,
        data: {},
        list_comment: [],
        comment: null,
        reply_to: null,
        default_avatar: require('../../assets/images/default_avatar.jpg'),
        etda_avatar: require('../../assets/images/etdaprofile.png'),
        lng: {},
        isFetching: false,
        like: 0,
        is_like: 0
    }

    componentDidMount() {

    }

    async UNSAFE_componentWillMount() {
        await this.getLang();
        const { like, is_like } = this.props.data
        await this.setState({ like, is_like })

    }

    async getLang() {
        this.setState({ isFetching: true })
        let vocap = await translate()
        this.setState({ lng: vocap })
        this.setState({ isFetching: false })
    }
    async likePost() {
        try {
            const { post_id } = this.props.data
            let { data } = await actionLikePost({ post_id })
            if (data.status == 'success') {
                await this.setState({ like: this.state.like == 0 ? 1 : 0 })
                await this.setState({ is_like: this.state.is_like == 0 ? 1 : 0 })
            }
        } catch (error) {
            console.log('Like event detail error : ', error)
        }
    }
    render() {
        const { author, title, post_description, post_addition_data, comment_number, post_id } = this.props.data
        const { default_avatar, list_comment, comment, lng, like, is_like } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, backgroundColor: '#F9FCFF', ...style.marginHeaderStatusBar }}>

                    <View style={{ ...styleScoped.shadowCard, backgroundColor: 'white' }}>
                        <View style={{ ...style.navbar }}>
                            <Icon name="chevron-left" size={hp('3%')} color="white" onPress={() => Actions.pop()} />
                            <Text style={{ fontSize: hp('2.2%'), color: 'white' }}>{title}</Text>
                            <View></View>
                            {/* <Icon name="magnify" size={hp('3%')} color="white" onPress={() => Actions.pop()} /> */}
                        </View>
                        <View style={{
                            ...style.space__between,
                            alignItems: 'center',
                            paddingHorizontal: hp('2%'),
                            marginTop: hp('2%')
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{
                                    height: hp('5%'),
                                    width: hp('5%'),
                                    marginRight: hp('1%')
                                }}>
                                    <Image source={require('../../assets/images/avatar2.png')} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                                </View>
                                <View >
                                    <Text style={{ fontSize: hp('2%'), color: "#707070" }}>{author.full_name}</Text>
                                </View>
                            </View>
                        </View>


                        <View style={{ marginTop: hp('1.5%'), paddingHorizontal: hp('2%') }} >
                            <Text style={{ fontSize: hp('2%') }}>{title}</Text>
                            <Text style={{ fontSize: hp('2%'), color: '#707070', marginTop: hp('1%') }}>{moment(post_addition_data.event_date).format('DD/MM/YYYY')}</Text>
                            <Text style={{ fontSize: hp('2%'), marginTop: hp('1%') }}>{post_description}</Text>



                            {/* <View style={{ height: hp('20%'), width: '100%', marginVertical: hp('2%') }}>
                                <Image source={require('../../assets/images/event_post.png')} style={{ height: '100%', width: '100%', resizeMode: 'stretch' }} />
                            </View> */}

                            <View style={{ marginTop: hp('3%'), marginBottom: hp('2%'), alignItems: 'flex-start', ...style.boxTextBorder }}>
                                <Text style={{ ...style.textOnBorder, fontSize: hp('2%'), color: '#B5B5B5', paddingLeft: 0, paddingRight: hp('1%') }}>{lng.schedule}</Text>
                            </View>

                            {
                                post_addition_data.event_schedule ?
                                    post_addition_data.event_schedule.map((el, index) => {
                                        return (
                                            <Fragment key={`event_schedule_${index}`}>
                                                <View style={{ ...style.flex__start, marginTop: hp('1%'), alignItems: 'center' }}>
                                                    <Text style={{ fontSize: hp('2%'), color: '#4267B2', marginRight: hp('2%') }}>{el.time}</Text>
                                                    <Text style={{ fontSize: hp('2%') }}>{el.detail}</Text>
                                                </View>
                                            </Fragment>
                                        )
                                    })
                                    : null
                            }


                        </View>

                        <View style={{ ...styleScoped.sectionSocial }}>
                            <TouchableOpacity style={{ ...style.flex__start, alignItems: 'center', marginRight: hp('3%') }} onPress={() => this.likePost()}>
                                <Icon name="thumb-up" size={hp('2.5%')} style={{ marginRight: hp('1%'), color: is_like ? '#4267B2' : '#B5B5B5' }} />
                                <Text style={{ color: is_like ? '#4267B2' : '#B5B5B5' }}>{like}</Text>
                            </TouchableOpacity>
                            <Icon name="share-outline" size={hp('2.5%')} style={{ marginRight: hp('1%'), color: '#B5B5B5' }} />
                        </View>
                    </View>

                    {/* {
                        list_comment.map((item, index) => {
                            return (
                                <Comment data={item} key={`comment_${index}`} fnPressButton={() => this.onPressButtonChildren.bind(this)}></Comment>
                            )
                        })
                    } */}
                </ScrollView>

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
    warpperComment: {
        paddingHorizontal: hp('3%'),
        paddingTop: hp('1%'),
        paddingBottom: hp('4%'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    boxInputCommment: {
        padding: hp('1%'),
        borderColor: '#C8C8CC',
        borderWidth: 1,
        borderRadius: 5,
        width: '85%',
        marginRight: hp('1%')
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
    },
    sectionSocial: {
        marginTop: hp('2%'),
        paddingTop: hp('2.5%'),
        borderTopWidth: 0.5,
        borderTopColor: '#B5B5B5',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: hp('2%'),
        paddingBottom: hp('1%')
    }
});


