import React, { useEffect, useRef } from 'react'
import Client from '../comp/Client'
import Editor from '../comp/Editor'
import { useState } from 'react'
import { initSocket } from '../socket';
import ACTIONS from './Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
export default function EditorPage() {



    const location = useLocation();
    const [clients, setClients] = useState([]);
    const reactNavigator = useNavigate();
    const socketRef = useRef(null);
    const { roomId } = useParams();
    const codeRef = useRef(null);
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(err) {
                console.log(err);
                toast.error('Socket connection failed,try again Later');
                reactNavigator('/');
            }
            socketRef.current.emit(ACTIONS.JOIN, { roomId, username: location.state?.username })
            console.log(location.state?.username);
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state.username) {
                    toast.success(`${username} joined the room`);
                    console.log(`${username}`);
                }
                console.log("this  is x " + clients)
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId
                })
            })
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room`);
                setClients((prev) => {
                    return prev.filter((client) => {
                        return client.socketId !== socketId
                    })
                })

            })

        }
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    }, []);

    if (!location.state) {
        <Navigate to="/" />
    }
    const copyRoomId = async () => {
        try {

            await navigator.clipboard.writeText(roomId);
            toast.success("Copied Successfully")
        }
        catch (err) {
            console.log(err);
            toast.error("Copied unsuccesfull");
        }
    }
    async function leaveroom() {
        reactNavigator('/');
    }



    return (
        <div className='mainWrapper'>
            <div className="aside">
                <div className="asideInner">
                    <div className="editorlogo">
                        <img className='imgLogo' src="" alt="" />
                    </div>
                    <div>Connected</div>
                    <div className="clientList">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))

                        }
                        {console.log("empty" + clients)}

                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>Copy RoomID</button>
                <button className="btn leaveBtn" onClick={leaveroom}>LeaveRoom</button>
            </div>
            <div className="editorWrapper">
                {console.log("sadasdsa")}
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {
                    codeRef.current = code;
                }} />
            </div>

        </div>
    )
}
