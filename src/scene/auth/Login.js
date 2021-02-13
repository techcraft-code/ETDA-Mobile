
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Platform,
    View,
    Text,
    StatusBar,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import { apiServer, configs } from '../../constant/util';
import HttpRequest from '../../Service/HttpRequest';
import { Button, Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import style from '../../styles/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
// import LineLogin from 'react-native-line-sdk'
import { 
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager, } from "react-native-fbsdk";
import {
    GoogleSignin,
    statusCodes } from '@react-native-community/google-signin';

const http = new HttpRequest();
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '', 
            pass: '', 
            statusSecureText: true, 
            emailBorder: '#CADAFB', 
            passwordBorder: '#CADAFB', 
            defaultBorder: '#CADAFB', 
            emailEnable: false, 
            passwordEnable: false, 
            disableLogin: true,
            spinner: false
        }
        this.socialSignIn = this.socialSignIn.bind(this);
    }

    componentDidMount () {
        this.checkLogin();
        GoogleSignin.configure({
            webClientId: configs.firebaseWebClientID, // client ID of type WEB for your server(needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            accountName: '', // [Android] specifies an account name on the device that should be used
        });
    }

    async LingLogin () {
        // try {

        //     await LineLogin.login()
        //     .then((user) => {
        //       console.log(user.profile.displayName)
        //     })
        //     // console.log(loginResult)
            
        // } catch (error) {
        //     console.log(error.response.response)
        // }
    }

    async GoogleLogin () {
        try {
            await GoogleSignin.hasPlayServices();
            const info = await GoogleSignin.signIn();
            const {user} = info
            // console.warn({userInfo: user});
            // setUserInfo(info);
            this.socialSignIn(false, user);
          } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          }
    }

    async socialSignIn(error, result) {
        const data = {
            "user_email": (result.email === undefined) ? result.id : result.email,
            "user_password": (result.email === undefined) ? result.id : '',
            "authen_method": 'local',
            "device": Platform.OS
        }
        console.log(data)

        if (error) {
            console.log('Error fetching data: ' + error.toString());
            return false;
        }

        try {
            let loginRequest = await http.post(apiServer.url + '/api/backend/user/login', data);
            let {token} = loginRequest.data;
            console.log(loginRequest)
            await AsyncStorage.setItem('token', token);
            await this.callInfomation();
   
        } catch (e) {
            console.log(e)
        }
    }

    async facebookLogin () {
        const LoginRequest = await LoginManager.logInWithPermissions(["public_profile"])
        if (LoginRequest.isCancelled) {
            console.log("Login cancelled");
          } else {
              const getAccessToken = await AccessToken.getCurrentAccessToken()
              const fbToken = await getAccessToken.accessToken.toString();
              const profileRequest = await new GraphRequest( 
                  '/me', 
                  {
                      accessToken: fbToken, 
                      parameters: {
                          fields: {
                              string: 'email, id, name,  first_name, last_name',
                          }
                      }
                  }, 
                  this.socialSignIn
              );
              new GraphRequestManager().addRequest(profileRequest).start();
        }
    }

    async checkLogin() {
        let token = await AsyncStorage.getItem('token');
        
        if(token) {
            await this.refreshToken();
        }
    }

    async refreshToken() {
        try {
            await http.setTokenHeader();
            let getInfo = await http.post(apiServer.url + '/api/backend/user/information');
            let {status, data} = getInfo.data;

            if(status == 'success') {
                await AsyncStorage.setItem( 'user_data', JSON.stringify(data) );
                await this.setState({ spinner: false });
                await Actions.replace('Main');
            } else {
                let refreshing = await http.post(apiServer.url + '/api/backend/user/refresh-token');
                let {status, token} = await refreshing.data;
                if(status == 'success') {
                    await AsyncStorage.setItem('token', token);
                    await this.callInfomation();
                }
            }
        } catch (e) {
            this.setState({ spinner: false });
        }
    }

    async callLogin () {
        if( this.state.email === '' || this.state.pass === '' ) {
            Alert.alert('Please fill your user name and password.');
            return false;
        }

        const data = {
            "user_email": this.state.email,
            "user_password": this.state.pass,
            "authen_method": "local",
            "device": Platform.OS
        }

        this.setState({ spinner: true });
        try {
            let loginRequest = await http.post(apiServer.url + '/api/backend/user/login', data);
            let {token, status} = loginRequest.data;
   
            await AsyncStorage.setItem('token', token);
            await this.callInfomation();
        } catch (e) {
            if(e.response.status === 401) {
                Alert.alert("Wrong email or password.");
                this.setState({ spinner: false });
            }
        }
         
    };

    callInfomation = async () => {
        try{
            await http.setTokenHeader();
            let response = await http.post(apiServer.url + '/api/backend/user/information');
            let {status, data} = response.data;

            if (status == "success") {
                await AsyncStorage.setItem( 'user_data', JSON.stringify(data) );
                await this.setState({ spinner: false });
                await Actions.replace('Main');
            }
        
        }  catch(e) {
            this.setState({ spinner: false });
        }
    };

    emailValidate = async value => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(value) === false) {
            await this.setState({emailBorder: 'red', email: value.toLowerCase(), emailEnable: false });
            await this.setState({disableLogin: true});
        } else {
            await this.setState({emailBorder: this.state.defaultBorder, email: value.toLowerCase(), emailEnable: true });
            await this.loginCheck();
        }
    }

    passwordValidate = async (value) => {
        if (value.length <= 3) {
            await this.setState({passwordBorder: 'red', pass: value, passwordEnable: false });
            await this.setState({disableLogin: true});
        } else {
            await this.setState({passwordBorder: this.state.defaultBorder, pass: value, passwordEnable: true });
            await this.loginCheck();
        }
    }

    loginCheck = () => {
        if(this.state.emailEnable && this.state.passwordEnable) {
            this.setState({disableLogin: false});
        }
    }
    
    render() {
        const {spinner} = this.state;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={{
                        marginTop: hp('8%'),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        ...style.container
                    }}>
                        <Spinner
                            visible={spinner}
                        />
                        <View style={styleScoped.imageLogo}>
                            <Image
                                source={ require('../../assets/images/logo.png') }
                                style={style.imageContain}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: hp('5%') }}>
                        <Text style={styleScoped.textWelcome}>Welcome</Text>
                    </View>
                    <View style={style.container}>
                        <View style={{ marginTop: hp('2%') }}>
                            <View style={{...style.customInput, borderColor: this.state.emailBorder}}>
                                <TextInput
                                    value={this.state.email}
                                    style={[style.input, { color: 'black', paddingVertical: 3, paddingHorizontal: 8 }]}
                                    placeholder="Email address"
                                    keyboardType='email-address'
                                    onChangeText={ text => this.emailValidate(text) }
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: hp('1%') }}>
                            <View style={{...style.customInput, borderColor: this.state.passwordBorder, display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row'}}>
                                <TextInput
                                    value={this.state.pass}
                                    style={[style.input, { color: 'black', width: wp(70) }]}
                                    placeholder="Password"
                                    secureTextEntry={this.state.statusSecureText}
                                    onChangeText={ text => this.passwordValidate(text) }
                                />
                                <Icon color={this.state.statusSecureText ? "#ccc" : "#333"} type="font-awesome" name={"eye"} onPress={ () => this.setState({statusSecureText: this.state.statusSecureText?false:true }) } />
                            </View>
                        </View>
                        <View style={{ marginTop: hp('2%'), flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => Actions.push('ForgetPassword')}>
                                <Text style={{
                                    color: '#4267B2',
                                    textAlign: 'right',
                                    textDecorationLine: 'underline',
                                    fontSize: hp('1.7%')
                                }}>Forgot password?</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ marginTop: hp('3%') }}>
                            <Button
                                title="Login"
                                disabled={ this.state.disableLogin }
                                buttonStyle={{ padding: hp('1.5%'), ...style.btnPrimary, ...style.btnRounded }}
                                onPress={ () => this.callLogin() }
                            />
                        </View>
                        <View style={{ marginTop: hp('4%'), alignItems: 'center', ...style.boxTextBorder }}>
                            <Text style={{ ...style.textOnBorder, fontSize: hp('2%'), color: '#B5B5B5' }}>Or Login with</Text>
                        </View>
                        <View style={{ marginTop: hp('4%') }}>
                            <Button
                                title="Continue with Line"
                                onPress={ () => this.LingLogin() }
                                buttonStyle={{ padding: hp('1.5%'), ...style.btnLine, ...style.btnRounded }}
                            />
                        </View>
                        <View style={{ marginTop: hp('2%') }}>
                            <Button
                                onPress={ () => this.facebookLogin() }
                                title="Continue with Facebook"
                                buttonStyle={{ padding: hp('1.5%'), ...style.btnFacebook, ...style.btnRounded }}
                            />
                        </View>
                        <View style={{ marginTop: hp('2%') }}>
                            <Button
                                onPress={ () => this.GoogleLogin() }
                                title="Continue with Google"
                                buttonStyle={{ padding: hp('1.5%'), ...style.btnGoogle, ...style.btnRounded }}
                            />
                        </View>

                        <View style={{ marginTop: hp('2%'), flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ color: '#707070', fontSize: hp('1.7%'), marginRight: hp('1%') }}>Do not have an account?</Text>
                            <TouchableOpacity onPress={() => Actions.push('Register')}>
                                <Text style={{ color: '#4267B2', textDecorationLine: 'underline', fontSize: hp('1.7%') }} >Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                    </ScrollView>
                </SafeAreaView>
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
    }
});


