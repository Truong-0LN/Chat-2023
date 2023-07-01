import React from 'react'
import ReactDOM from 'react-dom';
import './Modal.css'
const Modal = (isShowing, hide) => isShowing ? ReactDOM.createPortal(
    <React.Fragment>
        <button>Close</button>
        <div className='modal__container'>
            <p>Modal nè !!!</p>
        </div>
    </React.Fragment>, document.body
) : null;

export default Modal