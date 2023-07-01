import React, { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import './Chat.css'
import Room from '../room/Room';
import Message from '../messages/Message';
import axios from 'axios';
import Modal from '../modal/Modal';

const Chat = () => {
    const [token, setToken] = useState(undefined);
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([
        // {
        //     "message": "Lam Trường",
        //     "id_admin_action": null,
        //     "id_customer": "643775f4971815b99f8cf54f",
        //     "id_collaborator": null,
        //     "id_room": "649a4917aca243672ab06386",
        //     "id_replly_message": null,
        //     "status_reader_collaborator": "received",
        //     "status": "sending",
        //     "images": [],
        //     "date_create": "2023-06-27T06:28:42.365Z",
        //     "recall_date_create": null,
        // },

    ]);
    const [message, setMessage] = useState('');
    const [rooms, setRooms] = useState([]);
    const [phone, setPhone] = useState('');;
    const [password, setPassword] = useState('');
    const [typeUser, setTypeUser] = useState('customer')
    const configs = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }
    useEffect(() => {
        const options = {
            path: '',
            transportOptions: {
                polling: {
                    extraHeaders: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            }
        }
        if (token) {
            socket = io(ENDPOINT, options);
            socket.on('pushRoom', async (data) => {
                console.log('data pushRoom =>>> ', data);
                setRooms(rooms => [...rooms, data]);
            });
            // socket.on('cone', async (data) => {
            //     console.log('data =>>> ', data);
            //     setRooms(rooms => [...rooms, data]);
            // });
            axios.get(`${ENDPOINT}/room/get_list?lang=vi`, configs)
                .then(res => {
                    console.log(res.data);
                    setRooms(res.data.data);
                }).catch(err => {
                    console.log(err);
                })
            getUserByToken();
        }

    }, [ENDPOINT, token])
    const sendMessage = () => {
        const data = {
            idRoom: room,
            name_sender: 'truong',
            message: message,
            images: [],
        }
        socket.emit('msgToServer', data);
        setMessage('')
    }
    // console.log('messages ', messages);
    const joinRoom = (item) => { // join vào phòng đó
        if (item !== room) {
            if (room !== '') {
                socket.emit('leaveRoom', room, (error) => {
                    setMessages([]);
                });
            }
            socket.emit('joinRoom', item);
            socket.on('msgToClient', async (data) => {
                console.log('data =>>> ', data,);
                setMessages(messages => [...messages, data]);
            });
            setRoom(item);
        }
    }
    // console.log('current room ', room);
    useEffect(() => { // auto gọi các đoạn chat của phòng đó
        if (room !== '' && token) {
            axios.get(`${ENDPOINT}/message/get_message/${room}`, configs)
                .then(res => {
                    setMessages(res?.data?.data?.reverse())
                })
                .catch(err => console.log('err ', err))
        }
    }, [room]);

    const login = async () => {
        const data = {
            phone: phone,
            password: password,
            code_phone_area: '+84'
        }
        axios.post(`${ENDPOINT}/${typeUser}/auth/login`, data).then(res => {
            console.log(res.data);
            setToken(res.data.token);
            // setUser(res.data.data.user);
        }).catch(err => {
            console.log(err?.response?.data[0]?.message);
        })
    }
    const getUserByToken = () => {
        axios.get(`${ENDPOINT}/${typeUser}/profile/get_info_by_token`, configs)
            .then(res => {
                setUser(res?.data);
            })
            .catch(err => {
                console.log(err);
            })
    }
    const outRoom = () => {
        if (room !== '') {
            socket.emit('leaveRoom', room, (error) => {

            });
            setMessages([]);
            setRoom('');
        }
    }
    const onEnter = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }
    return (
        <div className='chat section-margin section-padding'>
            {token && <div className='chat-list__room'>
                <h3>
                    Danh sách phòng trò chuyện
                </h3>
                {room && <button onClick={outRoom}>Thoát Phòng</button>}
                <button>Load</button>
                <ul>
                    {rooms.map((item, index) => {
                        const check = item._id === room;
                        return (
                            <Room currentRoom={check} key={index} room={item} eventClick={() => joinRoom(item._id)} />
                        )
                    })}
                </ul>
            </div>}
            {token && <div className='chat-message__container'>
                <div className='scroll'>
                    {
                        messages.map((message, index) => (
                            <Message message={message} userId={user?._id} key={index} />
                        ))
                    }
                </div>
                <div className='form__input'>
                    <input type='text' placeholder='Enter your text' onKeyDown={onEnter} value={message} onChange={({ target: { value } }) => setMessage(value)} />
                    <button onClick={() => sendMessage()}>Gửi</button>
                </div>
            </div>}
            <div className={`${'chat__login'}`}>
                <input type='number' placeholder='Phone' onChange={({ target: { value } }) => setPhone(value)} />
                <input type='password' placeholder='Password' onChange={({ target: { value } }) => setPassword(value)} />
                <select onChange={({ target: { value } }) => setTypeUser(value)}>
                    <option value={'customer'}>Customer</option>
                    <option value={'collaborator'}>Collaborator</option>
                </select>
                <button disabled={!(phone !== '' && password !== '')} onClick={login}>Đăng nhập</button>
                {user ?
                    <div className='chat__info'>
                        <img src={user.avatar} alt='avatar' />
                        <h3>{user.full_name}</h3>
                        <p>{user._id}</p>
                    </div> :
                    <> {token && <button onClick={getUserByToken}>Get Info</button>}</>
                }
            </div>
        </div>
    )
}

export default React.memo(Chat)


// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTGFtIFRyxrDhu51uZyIsImZ1bGxfbmFtZSI6IkxhbSBUcsaw4budbmciLCJlbWFpbCI6IiIsImF2YXRhciI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2RieG5wNXZjMC9pbWFnZS91cGxvYWQvdjE2NjcyMDQyNjIvZ3V2aS9odGJ3bWJvbGFtMXVoMTh2amxlNC5wbmciLCJwaG9uZSI6IjAzMjgzNzQ4MTAiLCJjb2RlX3Bob25lX2FyZWEiOiIrODQiLCJfaWQiOiI2NDM3NzY3Mzk3MTgxNWI5OWY4Y2Y3NzgiLCJpYXQiOjE2ODc5MTg1ODcsImV4cCI6MTcxOTQ1NDU4N30.hbsCLR2d38ci0vmilNvW2lHfO4bGYbZ4hxkVmk_bwNI'
const ENDPOINT = 'http://192.168.1.62:5000';
let socket;
