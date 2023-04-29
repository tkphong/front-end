import React, {useState} from 'react'
import ChatBot from 'react-simple-chatbot'
import {ThemeProvider} from 'styled-components'
import Brain from './Brain'
import './Chatbot.css'
const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#0f4d4a',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#0f4d4a',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a'
}

// all available config props
const config = {
    width: '300px',
    height: '400px',
    hideUserAvatar: false,
    placeholder: 'Type your response.',
    headerTitle: 'Weather Chatbot'
}

const Chatbot = () => {
    let [showChat,
        setShowChat] = useState(true)

    const startChat = () => {
        setShowChat(true)
    }
    const hideChat = () => {
        setShowChat(false)
    }

    return (
        <div className='bot'>
            <ThemeProvider theme={theme}>

                <div
                    style={{
                    display: showChat
                        ? 'none'
                        : ''
                }}>
                    {!showChat && <div>
                        <ChatBot
                            speechSynthesis={{
                            enable: true,
                            lang: 'en-US'
                        }}
                            recognitionEnable={true}
                            steps={[
                            {
                                id: 'welcome',
                                message: 'Hello! I am a weather bot. You can ask me anything. Go ahead!',
                                trigger: 'wait_for_question'
                            }, {
                                id: 'wait_for_question',
                                user: true,
                                trigger: 'response_bot'
                            }, {
                                id: 'response_bot',
                                component: <Brain/>,
                                asMessage: true,
                                trigger: 'ask_for_more'
                            }, {
                                id: 'ask_for_more',
                                message: 'Is there anything else you want to know, just ask me.',
                                delay: 3000,
                                trigger: 'wait_for_question'
                            }
                        ]}
                            {...config}/>
                    </div>}
                </div>
                <div>
                    {!showChat
                        ? (
                            <button className="btn" onClick={() => startChat()}>
                                <i className="fa fa-minus"></i>
                            </button>
                        )
                        : (
                            <button className="btn" onClick={() => hideChat()}>
                                <i className="fa fa-plus"></i>
                            </button>
                        )}
                </div>
            </ThemeProvider>
        </div>
    )
}

export default Chatbot