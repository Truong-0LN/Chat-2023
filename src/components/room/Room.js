import React from 'react'
import './Room.css'
const Room = ({ room, eventClick, currentRoom }) => {
    return (
        <div onClick={() => eventClick()} className={`room__container ${currentRoom ? 'bg__' : ''}`}>
            <img src={require('../../assets/images/logo192.png')} alt='room avatar' />
            <div className='room__container-title'>
                <h3 >{room?.name}</h3>
                <p>last message</p>
            </div>

        </div>
    )
}
export default Room