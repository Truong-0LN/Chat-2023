import React from 'react'
import io from "socket.io-client";
import Chat from './components/chat/Chat';
const ENDPOINT = 'https://project-chat-application.herokuapp.com/';

const App = () => {
    return (
        <Chat />
    )
}

export default App