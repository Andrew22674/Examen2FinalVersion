import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "react-navigation";
import * as firebase from "firebase"
import * as Expo from "expo";
import { Font, AppLoading } from "expo";
import { Ionicons } from '@expo/vector-icons';


//initialize firebase
import fire from './firebase/firebase';

import FollowerScreen from "./screens/FollowerScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";

import MessageScreen from "./screens/MessageScreen";




class App extends React.Component {
  constructor(props){
    super(props)


    this.state = {
      isReady: false
    }
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
    //Setting the state to true when font is loaded.
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return <AppTabNavigator />;
  }
}

export default createBottomTabNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      tabBarLabel: "Login/Logout",
      tabBarIcon: <Ionicons name="md-log-in" size={30} color="blue" />
    }
  },
  DashBoard: {
    screen: DashboardScreen,
    navigationOptions: {
      
      tabBarLabel: "My Posts",
      tabBarIcon: <Ionicons name="md-text" size={30} color="blue" />
    }
  },
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: "Home",
      tabBarIcon: <Ionicons name="md-home" size={30} color="blue" />
    }
  },
  Follower: {
    screen: FollowerScreen,
    navigationOptions: {
      tabBarLabel: "Followers",
      tabBarIcon:  <Ionicons name="md-person-add" size={30} color="blue" />
    }
  },
  Post: {
    screen: MessageScreen,
    navigationOptions: {
      tabBarLabel: "New Message",
      tabBarIcon:  <Ionicons name="md-send" size={30} color="blue" />
    }
  }
} , {

  initialRouteName:'Login',

  navigationOptions:{
    tabBarVisible: true,
  },
 

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
