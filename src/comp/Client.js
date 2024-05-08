import React from 'react'
import Avatar from 'react-avatar'
export default function Client({ username }) {
    return (
        <div>
            <div className="client">
                <Avatar name={username} size={50} round="15px" />
                <span className='userName'>{username}</span>
            </div>
        </div>
    )
}
