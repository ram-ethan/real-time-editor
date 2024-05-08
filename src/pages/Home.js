import React, { useState } from 'react'
import logo from './icon-1.png'
import { v4 as uuidv4 } from 'uuid'
import { toast } from "react-hot-toast"
import { useNavigate } from 'react-router-dom'
export default function Home() {
    const [roomId, setRoomId] = useState("");
    const [username, setuserName] = useState("");
    const navigate = useNavigate();
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        console.log(id);
        setRoomId(id);
        toast.success("created a new Room");

    }
    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error("ROOMID & UserName is required");
            return;
        }
        console.log(roomId);
        navigate(`/editor/${roomId}`, {
            state: {
                username
            }
        })
    }
    const handleInputEnter = (e) => {
        if (e.code == 'Enter') {
            joinRoom();
        }
    }
    return (
        <div className="homeWrapper">
            <div className='formWrapper'>
                <div className="logo" >
                    {/* BAAD MEIN */}
                    <img src="" alt="" />
                </div>
                <h4 className="mainLabel">
                    Paste Invitation Room Id
                </h4>
                <div className="inputGrp">
                    <input type="text" className='inputBox' placeholder='ROOM ID' value={roomId} onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleInputEnter} />
                    <input type="text" className='inputBox' placeholder='USERNAME' value={username} onChange={(e) => setuserName(e.target.value)} onKeyUp={handleInputEnter} />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        JOIN
                    </button>
                    <span className='createInfo'>
                        If you don't have an invite then create &nbsp;
                        <a onClick={createNewRoom} href="" className='createNewBtn'> new room</a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>
                    Buitl with love by <a href="">ram-ethan</a>
                </h4>
            </footer>
        </div>
    )
}
