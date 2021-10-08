import React from 'react'
import axios from "axios"

export default function ES() {
    const [messages, setMessages] = React.useState([])
    const [value, setValue] = React.useState('')

    const sendMessage = async() => {
        try {
            await axios.post('http://localhost:5000/new-message', {
            message: value,
            id: Date.now()
        })
        } catch (e) {
            console.log(e)
        }
        setValue('')
    }

    const subscribe = async () => {
        const eventSource = new EventSource('http://localhost:5000/connect')
        eventSource.onmessage = function(e) {
            const message = JSON.parse(e.data)
            setMessages(messages => [message, ...messages])
        }
    }

    React.useEffect(() => {
        subscribe()
    }, [])

    return (
        <div className="chat">
            <div className="message-dialog">
                {messages? messages.map(mess => 
                    <div className="message" key={mess.id}>
                        {mess.message}
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
