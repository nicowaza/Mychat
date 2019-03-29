<template>
  <div id="app">
    <div id="my-chat">
      <div id="user">Hello {{ currentUser.name }}, speak to {{ currentUser.name === 'Nico' ? 'Sybille' : 'Nico' }} !</div>
    <div id="chat-window">
      <div v-for="message in messages" :key="message.id" id="output" v-bind:class="currentUser.id === message.id ? 'outputBlue' : 'outputGrey'"><p>{{ message.message }}</p></div>
      <div v-show="isTyping" id="feedback">{{ typingUser }} is typing</div>
    </div>
    <input @input="typing" v-model="inputValue" type="text" id="message" placeholder="Write your message...">
    <button @click="send" id="send">Send</button>
  </div>
  </div>
</template>


<script>
import io from 'socket.io-client'
const socket = io('http://localhost:4500')

export default {
  name: 'app',

  components: {

  },
  data() {
    return {
      inputValue:'',
      typingUser: '',
      isTyping: false,
      currentUser:'',
      messages: [],
    }
  },

  mounted(){
    socket.on('chooseUser', (data) => {
          this.currentUser = data;
        }),

    socket.on('typing', (typingUser) => {
      this.isTyping = true;
      this.typingUser = typingUser
    }),
    socket.on('msg', (data) => {
      this.isTyping = false;
        this.messages.push(data)
      })
  },

  methods: {
    send(){
      if(this.inputValue.replace(/\s/g, '').length >= 1){
        if(this.inputValue.indexOf('$') != -1){
          const regex = /(?<=\$)[^\s]+/g;
          const devise = this.inputValue.match(regex);
          let i = 0;
          let inputValueCopy = this.inputValue;
          devise.forEach(x => {
            fetch(`https://api.iextrading.com/1.0/stock/${x}/price`)
            .then((res) => res.json())
            .then((res) => {
              //const regex$ = /(\$[A-Z]*[a-z]*[0-9]*)\w*[^\s]/g;
              inputValueCopy = inputValueCopy.replace(x, res);
              i++;
              if(i === devise.length){
                socket.emit('msg', {
                  message: inputValueCopy,
                  id: this.currentUser.id,
                });
                this.inputValue = '';
              }
            })
            .catch((error) => {
              i++;
              if(i === devise.length){
                socket.emit('msg', {
                  message: inputValueCopy,
                  id: this.currentUser.id,
                });
                this.inputValue = '';
              }
            })
          })
      } else {
        socket.emit('msg', {
          message: this.inputValue,
          id: this.currentUser.id,
        })
        this.inputValue = '';}
    }},

    typing(){
      let typingUser = this.currentUser.name
      socket.emit('typing', typingUser)
    }
  }
}


</script>

<style lang="scss">
html{
  height: 100%;
}

body{
  font-family: 'Nunito';
  height:100%;
}

h2{
  font-size: 18px;
  padding: 10px 20px;
  color: #575ed8;
}

#my-chat{
  width: 33vw;
  max-width: 600px;
  min-width: 400px;
  border: 1px solid rgb(29, 3, 3);
  box-shadow: 8px 3px 5px rgba(0,0,0,0.05);
  margin: 50px auto;
}
#chat-window{
  height: 400px;
  overflow-y: scroll;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.outputBlue {
  padding: 5px 14px;
  color: rgb(19, 16, 16);
  max-width: 60%;
  }

.outputBlue > p {
  max-width: 60%;
  margin: auto;
  background-color: paleturquoise;
  display: inline-block;
  padding: 5px 15px;
  border-radius: 15px;
  overflow-wrap: break-word;
}


.outputGrey {
  padding: 5px 14px;
  color: white;
  margin-left: auto;
  max-width: 60%;
}

.outputGrey > p {
  max-width: 60%;
  word-wrap: break-word;
  margin: auto;
  background-color: purple;
  display: inline-block;
  padding: 5px 15px;
  border-radius: 15px;
}

#feedback {
  color: #aaa;
  margin: 15px;
}

label{
  box-sizing: border-box;
  display: block;
  padding: 10px 20px;
}

input{
  padding: 10px 20px;
  box-sizing: border-box;
  background: #eee;
  border: 0;
  display: block;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eee;
  font-family: Nunito;
  font-size: 16px;
}

button{
  background: #575ed8;
  color: #fff;
  font-size: 18px;
  border: 0;
  padding: 12px 0;
  width: 100%;
  border-radius: 0 0 2px 2px;
}

#user{
  margin: 15px 15px;
}

</style>
