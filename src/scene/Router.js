import React from 'react';
import { Scene, Stack, Router } from 'react-native-router-flux';

import Login from './auth/Login'
import Register from './auth/Register/Register'
import ChooseUserType from './auth/Register/ChooseUserType'
import RegisterSuccess from './auth/Register/Success'
import ForgetPassword from './auth/Login/ForgetPassword'
import Main from './Main'
import Activity from './Activity/Activity'
import MessageBoard from './Message/MessageBoard'
import CreatePost from './Post/Create'
import Event from './Activity/Event'
import EventDetail from './Activity/EventDetail'
import Poll from './Activity/Poll'
import Survey from './Activity/Survey'
import PollDetail from './Activity/PollDetail'
import SurveyDetail from './Activity/SurveyDetail'
import PostDetail from './Post/Detail'
import MyProfile from './Profile/MyProfile'
import EditProfile from './Profile/EditProfile'
import ProfileSetting from './Profile/ProfileSetting'
import Language from './Profile/Language'
import ChangePassword from './Profile/ChangePassword'
import Search from './Search'
import DeleteAccount from './Profile/DeleteAccount'
import ManageBlog from './ManageBlog'
import EventCreate from './Activity/EventCreate'
import EventEdit from './Activity/EventEdit'
import Notification from './Notification'
import PollCreate from './Activity/PollCreate'
import SurveyCreate from './Activity/SurveyCreate'
import MainScene from './MainScene'

const RouterPage = () => {
    return (

        <Router>
            <Stack key="root">
                <Scene key="Login" component={Login} title="Login" hideNavBar initial />
                <Scene key="Register" component={Register} title="Register" />
                <Scene key="ChooseUserType" component={ChooseUserType} title="Choose User Type" />
                <Scene key="RegisterSuccess" component={RegisterSuccess} title="RegisterSuccess" hideNavBar />
                <Scene key="ForgetPassword" component={ForgetPassword} title="Forgot Password" />
                <Scene key="Main" component={Main} title="Main" hideNavBar />
                <Scene key="Activity" component={Activity} title="Activity" hideNavBar />
                <Scene key="MessageBoard" component={MessageBoard} title="MessageBoard" hideNavBar />
                <Scene key="CreatePost" component={CreatePost} title="CreatePost" hideNavBar />
                <Scene key="Event" component={Event} title="Event" hideNavBar />
                <Scene key="EventDetail" component={EventDetail} title="EventDetail" hideNavBar />
                <Scene key="Poll" component={Poll} title="Poll" hideNavBar />
                <Scene key="PollDetail" component={PollDetail} title="PollDetail" hideNavBar />
                <Scene key="PollCreate" component={PollCreate} title="PollCreate" hideNavBar />
                <Scene key="Survey" component={Survey} title="Survey" hideNavBar />
                <Scene key="SurveyCreate" component={SurveyCreate} title="SurveyCreate" hideNavBar />
                <Scene key="SurveyDetail" component={SurveyDetail} title="SurveyDetail" hideNavBar />
                <Scene key="PostDetail" component={PostDetail} title="PostDetail" hideNavBar />
                <Scene key="MyProfile" component={MyProfile} title="MyProfile" hideNavBar />
                <Scene key="EditProfile" component={EditProfile} title="EditProfile" hideNavBar />
                <Scene key="ProfileSetting" component={ProfileSetting} title="ProfileSetting" hideNavBar />
                <Scene key="Language" component={Language} title="Language" hideNavBar />
                <Scene key="ChangePassword" component={ChangePassword} title="ChangePassword" hideNavBar />
                <Scene key="Search" component={Search} title="Search" hideNavBar />
                <Scene key="DeleteAccount" component={DeleteAccount} title="DeleteAccount" hideNavBar />
                <Scene key="ManageBlog" component={ManageBlog} title="ManageBlog" hideNavBar />
                <Scene key="EventCreate" component={EventCreate} title="EventCreate" hideNavBar />
                <Scene key="EventEdit" component={EventEdit} title="EventEdit" hideNavBar />
                <Scene key="Notification" component={Notification} title="Notification" hideNavBar />
                <Scene key="MainScene" component={MainScene} title="MainScene" hideNavBar />
            </Stack>
        </Router>

    );
};


export default RouterPage;