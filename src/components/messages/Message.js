import React, { useEffect, useRef } from 'react'
import './Message.css'
import { format } from 'date-fns';
const Message = ({ message, userId }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);
    let check = userId === message.id_collaborator;
    if (!check) {
        check = userId === message.id_customer;
    }
    if (!check) {
        check = userId === message.id_admin_action;
    }
    const time = message?.date_create ? format(new Date(message?.date_create), 'HH:mm') : '00:00';
    console.log('check ', check);
    return (
        <div className='message__container'>
            {!check ?
                <div className='message-left'>
                    <img src={require('../../assets/images/logo192.png')} alt='avatar' />
                    <div className='message__content'>
                        <p>{message?.message}</p>
                        <p>{time}</p>
                    </div>
                </div>
                :
                <div className='message-right'>
                    <div className='message__content'>
                        <p>{message?.message}</p>
                        <p>{time}</p>
                    </div>
                    <img src={require('../../assets/images/logo192.png')} alt='avatar' />
                </div>
            }
        </div>
    )
}

export default React.memo(Message)