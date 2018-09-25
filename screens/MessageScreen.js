import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as firebase from "firebase";
import { Constants } from 'expo'
import {  Body, Label, Right, Picker, Title, Header, Form, Container, Content, Input, Button, Item as FormItem } from "native-base";


class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: "",
      userId: "",
      titulo: "",
      mensaje: "",
      acceso: "public",
      photoURL: "https://cdn1.iconfinder.com/data/icons/social-messaging-productivity-1-1/128/gender-male2-512.png",
      auth: false,
      user: null,
      selected: "public"

    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  async componentDidMount() {


    await firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        this.setState({ user: user });
      } else {
        this.setState(
          { user: null }
        )
      }
    });

    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        const name = firebase.auth().currentUser.displayName;
        var uId = firebase.auth().currentUser.uid;
        console.log("uid: " + uId);
        console.log("idk");



        this.setState({
          nombre: name,
          userId: uId,
          auth: true
        });
        console.log("name: " +name);


      } else {
        this.setState(
          { user: null }
        )
      }
    });
  }


  onValueChange(value) {
    this.setState({
      selected: value
    });
  }

  sendMessage() {



    var userId = this.state.userId;
    console.log("user id: " + userId);
    // e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    //fire.database().ref('messages').push(this.state.mensaje);
    var ref = firebase.database().ref().child("messages");
    var userposts = firebase.database().ref().child("user-posts");
    //crear una key para el mensaje
    var key = ref.push().getKey();




    /*ref.child(key).child("likes").child(userId).setValue(true);para los likes del usuario
    deberia ester en el metodo de likeMessage en el Dashboard y en MisPosts*/

    console.log("new key: "+ key);

    try {
      
      ref.child(key).set({
        titulo: this.state.titulo,
        mensaje: this.state.mensaje,
        userName: this.state.nombre,
        userId: userId,
        acceso: this.state.selected,
        idMensaje: key,
        photo: this.state.photoURL,
        likes: {
          cont: 0
        }
      });
/*

moved to firebase functions

      userposts.child(userId + "/" + this.state.selected + "/" + key).set({
        titulo: this.state.titulo,
        mensaje: this.state.mensaje,
        userName: this.state.nombre,
        userId: userId,
        acceso: this.state.selected,
        idMensaje: key,
        photo: this.state.photoURL,
        likes: {
          cont: 0
        }
  
  
      });*/
      alert("mensaje enviado");

      this.setState({
        mensaje : "",
        titulo: ""
      })
    } catch (error) {
      alert("error : " + error.message);
    }
    
    
    


    /*
    const dbRef = firebase.database().ref("posts");
    const newPost = dbRef.push();
    const record = {
      id: newPost.key,
      title: this.state.title,
      mensaje: this.state.content,
      privacy: "PUBLIC",
      displayname: firebase.auth().currentUser.email,
      uid: firebase.auth().currentUser.uid,
      photoUrl:'https://www.tenforums.com/geek/gars/images/2/types/thumb__ser.png',
      comments: {},
      contFav: 0,
      countComment: 0

      
    };
    newPost.set(record).then(
      this.setState(state => ({
        title: "",
        mensaje: ""
      }))
    );*/


    /*Toast.show({
      text:'Mensaje enviado!'
      ,buttonText:'Ok'
      ,duration:4000
    })*/
    //TODO:Agregar post fav a la base de datos
    //const dbUser = firebase.database().ref("users/"+this.state.user.uid);

  }


  render() {

    if (this.state.user !== null) {
      return (
        <Container style={{ paddingTop: Constants.statusBarHeight }}>
          <Header>
            <Body>
              <Title>Post a comment</Title>
            </Body>
            <Right>
                <Form>
                  <Picker
                    note
                    mode="dropdown"
                    style={{ width: 120 }}
                    selectedValue={this.state.selected}
                    onValueChange={this.onValueChange.bind(this)}
                  >
                    <Picker.Item label="public" value="public" />
                    <Picker.Item label="private" value="private" />
                    <Picker.Item label="followers" value="followers" />
                  </Picker>
                </Form>
              </Right>
          </Header>

          <Form>
            <FormItem floatingLabel>
              <Label>Titulo</Label>
              <Input label="Titulo"
                onChangeText={titulo => this.setState({ titulo })} value={this.state.titulo} />
            </FormItem>
            <FormItem floatingLabel last regular>
              <Label>Mensaje</Label>
              <Input label="Mensaje"
                onChangeText={mensaje => this.setState({ mensaje })}
                value={this.state.mensaje} />
            </FormItem>
            <Button full primary style={{ paddingBottom: 4 }} onPress={() => this.sendMessage()}>
              <Text> Enviar Mensaje</Text>
            </Button>

          </Form>

        </Container>

      );

    } else {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'red'
        }}>
          <Text >
            Not logged in.
          </Text>
        </View>

      )

    }
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default PostScreen;


