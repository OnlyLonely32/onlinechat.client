import React from 'react'
import axios from "axios"

export default function WebSock() {
    const [messages, setMessages] = React.useState([])

    const [userName, setUserName] = React.useState('')
    const [value, setValue] = React.useState('')

    const [connected, setConnected] = React.useState(false)

    const socket = React.useRef()
    

    const sendMessage = async() => {
        const message = {
            event: 'message',
            userName,
            id: Date.now(),
            message: value
        }
        
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            console.log('connect seccess');
            const message = {
                event: 'connection',
                userName,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages( messages => [message, ...messages])
        }
        socket.current.onclose = () => {
            console.log('socket close')
        }
        socket.current.onerror = () => {
            console.log('socket error')
        }
    }

    if (!connected) {
        return(
            <div>
                <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} />
                <button onClick={connect} >SignIn</button>
            </div>
        )
    }

    return (
        <div className="chat">
            <div className="message-dialog">
                {messages? messages.map(mess => 
                    <div className="message" key={mess.id}>
                        {mess.event === 'connection'
                        ?<div>user {mess.userName} connected</div>
                        :<div>{mess.userName}. {mess.message}</div>
                        }
                    </div>
                ): console.log("stack is empty")}
            </div>
            <div className="form">
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}
