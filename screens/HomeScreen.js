import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import * as firebase from "firebase"
import { Container, Header, Right, Content, Card, CardItem, Title, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import * as Expo from "expo";
import { Ionicons } from '@expo/vector-icons';
import { Constants } from 'expo'

class HomeScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isReady: false,
      mensajes: [], 
      user: null
    }
    this.followUser = this.followUser.bind(this);
    this.likePost = this.likePost.bind(this);
  }


  followUser(userToFollow) {
    var userId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref().child("users/" + userId + "/");

    ref.once("value").then(function (snapshot) {
      if (snapshot.child(userToFollow).exists()) {
        alert("Unfollowed user");
        ref.child(userToFollow).remove();
      } else {
        if (userToFollow != userId) {
          alert("Followed user");
          console.log("user is not followed");
          ref.child(userToFollow).set(true);
        } else {
          alert("Can't follow yourself");
          console.log("can't follow yourself");
        }

      }
    });
  }

  likePost(messageID, postUserId, tipoAcceso) {
    var userId = firebase.auth().currentUser.uid;
    //var refNumLikes = fire.database().ref().child("messages/" + messageID + "/likes");
    var ref = firebase.database().ref().child("messages/" + messageID + "/likes");
    var ref2 = firebase.database().ref().child("user-posts/" + postUserId + "/" + tipoAcceso + "/" + messageID + "/likes");

    console.log(messageID);
    console.log("like");

    //ref("-messages/"+ "-likes/-userIDs"+ userId).update(ref("-messages/"+ "-likes/-userIDs"+ userId) === false ? ( console.log("false") ) : (console.log("true")));
    ref.once("value")
      .then(function (snapshot) {
        //console.log(snapshot.child("userIDs").child(userId).exists() ? ("user likes exists") : ("does not exist"));
        var contador = snapshot.child("cont").val();
        if (snapshot.child("userIDs").child(userId).exists()) {
          console.log("user like exists");
          ref.child("userIDs").child(userId).remove();
          
          contador = contador - 1;
          /* moved to firebase functions
          ref.update({ cont: contador });

           ref2.child("userIDs").child(userId).remove();
          ref2.update({ cont: contador });
          */

        /* */
          //cont--
        } else {
          contador = contador + 1;
          console.log("user like does not exist");
          ref.child("userIDs").child(userId).set(true);
          /*moved to firebase functions
          ref.update({ cont: contador });
          
          ref2.child("userIDs").child(userId).set(true);
          ref2.update({ cont: contador });*/
          
        }

        console.log("Cont likes: " + contador);

      });
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });


    //Setting the state to true when font is loaded.
    this.setState({ isReady: true });

    try {
      await firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.setState({ user: user });
        } else {
          this.setState(
            { user: null }
          )
        }
      });
    } catch (error) {
      console.log("error");
    }



    try {
      firebase.database().ref("messages").on("value", (data) => {
        let list = []
        data.forEach(doc => {
          
          //console.log("entro");
          //console.log(doc.val());
          if (doc.val().acceso === "public" /*&& doc.val().userId != fire.auth().currentUser.uid*/) {
            list.push(doc.val())
            // console.log(doc.val());
          } else {
            console.log("false");
          }
        })
        this.setState({
          mensajes: list
        })
      });
    } catch (error) {
      console.log("error");
    }

  }


  render() {

    let data = this.state.mensajes.map((item) => {

      const butLike = this.state.user ? (<View><Button transparent onPress={() => this.likePost(item.idMensaje, item.userId, item.acceso)}>
        <Ionicons name="md-thumbs-up" size={30} color="blue" />
        <Text> {item.likes.cont} likes </Text>
      </Button></View>) : (<View><Button transparent onPress={() => alert("No se puede dar like sin log in")}>
        <Ionicons name="md-thumbs-up" size={30} color="blue" />
        <Text> {item.likes.cont} likes </Text>
      </Button></View>);

      const butFollow = this.state.user ? (<Right>
        <Button transparent onPress={() => this.followUser(item.userId)}>
          <Ionicons name="md-person-add" size={30} color="blue" />
          <Text> Follow User </Text>
        </Button>
      </Right>) : (<Right>
              <Button transparent onPress={() => alert("no se puede follow sin log in")}>
                <Ionicons name="md-person-add" size={30} color="blue" />
                <Text> Follow User </Text>
              </Button>
            </Right>);

      return (
        <Card key={item.idMensaje}>


          <CardItem >
            <Left>
              <Thumbnail source={{ uri: 'https://cdn1.iconfinder.com/data/icons/social-messaging-productivity-1-1/128/gender-male2-512.png' }} />
              <Body >
                <Text>{item.titulo}</Text>
                <Text note>user : {item.userName}</Text>
              </Body>
            </Left>
          </CardItem>

          <CardItem>
            <Body>
              <Text > {item.mensaje}</Text>
            </Body>
          </CardItem>



          <CardItem>
            <Left>
              {butLike}
            </Left>
            <Right>
              {butFollow}
            </Right>
          </CardItem>
        </Card>

      )
    })



    if (this.state.isReady) {
      return (
        <Container style={{ paddingTop: Constants.statusBarHeight }}>
          <Header>
            <Body>
              <Title>Public Posts</Title>
            </Body>
          </Header>
          <Content >

            {data}

          </Content>
        </Container>
      );
    } else {
      return <Expo.AppLoading />;
    }

  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
