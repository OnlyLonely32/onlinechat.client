import React from 'react'
import axios from "axios"

export default function LongPulling() {
    const [messages, setMessages] = React.useState([])
    const [value, setValue] = React.useState('')

    const sendMessage = async() => {
        try {
            await axios.post('http://localhost:5000/new-message', {
            message: value,
            id: Date.now()
            }).finally(() => setValue(''))
        } catch (e) {
            console.log(e)
        }
        
    }

    const subscribe = async () => {
        try {
            const {data} = await axios.get('http://localhost:5000/get-message') 
            setMessages(prev => [data, ...prev]) 
            await subscribe()   
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                subscribe()
            }, 500)
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
