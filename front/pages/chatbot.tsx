import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chatbot.module.css';


const Chatbot: React.FC = () => {
    const loggedIn = true; // Set this based on your actual login status

    // Define the state for each button
    const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({
        type1: false,
        type2: false,
        type3: false,
        type4: false
    });

    // Function to toggle each button's expanded state
    const toggleExpand = (type: string) => {
        setIsExpanded(prevState => ({
            ...prevState,
            [type]: !prevState[type]
        }));
    };

    const samplePrompts = ["What's up?", "Tell me a joke", "Latest news updates?", "Help with my account"];

    const [chats, setChats] = useState<Array<{id: number, name: string}>>([]);

    const [editingChatId, setEditingChatId] = useState<number | null>(null);
    const [tempChatName, setTempChatName] = useState<string>('');


    const [inputText, setInputText] = useState('');

    const [isPromptSelected, setIsPromptSelected] = useState(false);

    const [isBotTyping, setIsBotTyping] = useState(false);

    const handlePromptSelect = (prompt: string) => {
        // Set the input text to the selected prompt
        setInputText(prompt);
    
        // Add user message from prompt
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), sender: 'user', text: prompt }]);
    
        // Clear the input field after sending
        setInputText('');
    
        // Add temporary typing indicator message
        setMessages(prevMessages => [
            ...prevMessages, 
            { id: Date.now(), sender: 'bot', text: '', isTyping: true }
        ]);
    
        // Replace typing indicator with actual response after a delay
        setTimeout(() => {
            setMessages(prevMessages => prevMessages.map(msg => 
                msg.isTyping ? { ...msg, text: 'Hello, this is a placeholder response!', isTyping: false } : msg
            ));
        }, 1000); // Adjust the delay as needed
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const [messages, setMessages] = useState<Array<{id: number, sender: string, text: string, isTyping?: boolean}>>([]);

    const chatContentRef = useRef<HTMLDivElement | null>(null);

    const handleSend = () => {
        if (inputText.trim() !== '') {
            // Add user message from input
            setMessages(prevMessages => [
                ...prevMessages, 
                { id: Date.now(), sender: 'user', text: inputText }
            ]);
            setInputText('');
    
            // Add temporary typing indicator message
            setMessages(prevMessages => [
                ...prevMessages, 
                { id: Date.now(), sender: 'bot', text: '', isTyping: true }
            ]);
    
            // Replace typing indicator with actual response after a delay
            setTimeout(() => {
                setMessages(prevMessages => prevMessages.map(msg => 
                    msg.isTyping ? { ...msg, text: 'Hello, this is a placeholder response!', isTyping: false } : msg
                ));
            }, 1000);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();  // Prevents from adding a new line on Enter
            handleSend();
        }
    };

    useEffect(() => {
        if (messages.length && messages[messages.length - 1].sender === 'user') {
            setTimeout(() => {
                setMessages([...messages, { id: Date.now(), text: 'Placeholder bot response', sender: 'bot' }]);
            }, 1000);
        }
        if (chatContentRef.current) {
            setTimeout(() => {
                const element = chatContentRef.current;
                if (element) {
                    element.scrollTop = element.scrollHeight;  // Scroll to bottom
                }
            }, 100);
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-screen font-poppins">
            <Head>
                <title>CompleteBS - Stop Making Sense</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <nav>
                <div className={styles.navContainer}>
                    <div className={styles.brand}>
                        <img src="/logo2bg.png" alt="CompleteBS Logo" className={styles.logoIcon} />
                        <Link href="/">
                            <span className={styles.brandName}>CompleteBS</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex flex-grow"> {/* Added flex-grow here */}

            {/* Right Section */}
            <div className="hidden xl:flex flex-col w-1/4 bg-black text-white p-4 space-y-4">
                <div className="flex items-center justify-center mb-4">
                </div>
            </div>

            {/* Middle Section */}
            <div className="flex-1 bg-gray-150 p-4">
                <div className={styles.chatContentContainer}>
                    {messages.length === 0 && (
                        <div className={styles.centeredContent}>
                            <img src="/logo2bg.png" alt="Your Logo" className={styles.logo} />
                            <p className={styles.centeredText}>Your Gateway to Hilariously Misguided Conversations</p>
                            <div className={styles.promptOptions}>
                                {samplePrompts.map((prompt, index) => (
                                    <button key={index} className={styles.promptOption} onClick={() => handlePromptSelect(prompt)}>
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.chatContent}>
                        {messages.map(msg => (
                            <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                                <img 
                                    src={msg.sender === 'user' ? `/user.svg` : `/logo2bg.png`}
                                    alt={msg.sender} 
                                    className={styles.icon} 
                                />
                                <div className={msg.isTyping ? styles.typingBubble : styles.messageBubble}>
                                    {msg.isTyping ? (
                                        <div className={styles.typingIndicator}>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    ) : (
                                        <p>{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Container */}
                    <div className={styles.inputContainer}>
                        <input 
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className={styles.textInput} 
                            placeholder="Type a message"
                        />
                        <img src="/send.svg" alt="Send" className={styles.iconButton} onClick={handleSend} />
                    </div>
                </div>
            </div>


            {/* Right Section */}
            <div className="hidden xl:flex flex-col w-1/4 bg-black text-white p-4 space-y-4">
                <div className="flex items-center justify-center mb-4">
                </div>
            </div>
        </div>
    </div>
    )
}

export default Chatbot;
