import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IoIosSend } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { animated, useTransition } from 'react-spring';

const PromptContainer = ({ isVisible, onClose, onMessageGenerated }) => {
    const [message, setMessage] = useState('');
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [followUpMessage, setFollowUpMessage] = useState('');

    const transition = useTransition(isVisible, {
        from: { opacity: 0, transform: 'translateY(20px)' },
        enter: { opacity: 1, transform: 'translateY(0)' },
        leave: { opacity: 0, transform: 'translateY(20px)' },
        config: { tension: 300, friction: 20 },
    });

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const handleFollowUpChange = (event) => {
        setFollowUpMessage(event.target.value);
    };

    const handleSend = async () => {
        if (generatedMessage) {
            await handleFollowUpSubmit();
        } else {
            await generateMessage();
        }
    };

    const generateMessage = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/generate-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: message })
            });

            if (!response.ok) {
                throw new Error('Error generating message');
            }

            const data = await response.json();
            if (data.message) {
                setGeneratedMessage(data.message);
                toast.success('Message generated successfully!');
            }
        } catch (error) {
            console.error('Error generating message:', error);
            toast.error('Failed to generate message');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApply = () => {
        onMessageGenerated(generatedMessage);
        setGeneratedMessage('');
        setMessage('');
        onClose();
    };

    const handleRegenerate = async () => {
        await generateMessage();
    };

    const handleFollowUpSubmit = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/generate-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: `${generatedMessage} ${followUpMessage}` })
            });

            if (!response.ok) {
                throw new Error('Error generating follow-up message');
            }

            const data = await response.json();
            if (data.message) {
                setGeneratedMessage(data.message);
                setFollowUpMessage('');
                toast.success('Follow-up message generated successfully!');
            }
        } catch (error) {
            console.error('Error generating follow-up message:', error);
            toast.error('Failed to generate follow-up message');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClose = (e) => {
        e.preventDefault();
        setMessage('');
        setGeneratedMessage('');
        setFollowUpMessage('');
        setIsGenerating(false);
        onClose();
    };

    const containsQuestion = (text) => {
        // Basic check for a question, you can enhance this logic
        return text.includes('?');
    };

    return transition((style, item) =>
        item && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-end z-50 p-4 sm:p-6 md:p-8">
                <animated.div style={style} className="flex flex-col border border-gray-300 mb-10 lg:mr-32 rounded-lg p-4 w-full sm:w-96 bg-white relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-700">
                            We will draft a nice message for you, just write something & press SEND
                        </span>
                        <button className="text-xl text-gray-500 bg-secondary p-2 rounded-full hover:text-black" onClick={handleClose}>
                            <IoClose />
                        </button>
                    </div>
                    {!generatedMessage && (
                        <div className="relative">
                            <textarea
                                value={message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                className="w-full h-24 border border-gray-300 rounded-lg p-2 text-sm resize-none outline-none mb-10"
                            />
                            <button
                                className="absolute bottom-2 right-2 mt-4 bg-black text-white px-4 py-1 rounded-lg hover:bg-gray-800 transition-colors font-noto-sans"
                                onClick={handleSend}
                            >
                                <IoIosSend size={24} />
                            </button>
                        </div>
                    )}
                    {isGenerating ? (
                        <div className="mt-4 text-center text-gray-700 animate-pulse">Genmo generating response...</div>
                    ) : (
                        generatedMessage && (
                            <div className="mt-4">
                                <div className="flex-grow overflow-y-auto mb-2 h-64">
                                    <div className="flex items-start">
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-2 mt-1">
                                            <path d="M14 28C14 26.0633 13.6267 24.2433 12.88 22.54C12.1567 20.8367 11.165 19.355 9.905 18.095C8.645 16.835 7.16333 15.8433 5.46 15.12C3.75667 14.3733 1.93667 14 0 14C1.93667 14 3.75667 13.6383 5.46 12.915C7.16333 12.1683 8.645 11.165 9.905 9.905C11.165 8.645 12.1567 7.16333 12.88 5.46C13.6267 3.75667 14 1.93667 14 0C14 1.93667 14.3617 3.75667 15.085 5.46C15.8317 7.16333 16.835 8.645 18.095 9.905C19.355 11.165 20.8367 12.1683 22.54 12.915C24.2433 13.6383 26.0633 14 28 14C26.0633 14 24.2433 14.3733 22.54 15.12C20.8367 15.8433 19.355 16.835 18.095 18.095C16.835 19.355 15.8317 20.8367 15.085 22.54C14.3617 24.2433 14 26.0633 14 28Z" fill="url(#paint0_radial_16771_53212)" />
                                            <defs>
                                                <radialGradient id="paint0_radial_16771_53212" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2.77876 11.3795) rotate(18.6832) scale(29.8025 238.737)">
                                                    <stop offset="0.0671246" stop-color="#9168C0" />
                                                    <stop offset="0.342551" stop-color="#5684D1" />
                                                    <stop offset="0.672076" stop-color="#1BA1E3" />
                                                </radialGradient>
                                            </defs>
                                        </svg>
                                        <p className="text-gray-700 flex-grow bg-secondary p-4 rounded-md">{generatedMessage}</p>
                                    </div>
                                </div>
                                {containsQuestion(generatedMessage) && (
                                    <textarea
                                        value={followUpMessage}
                                        onChange={handleFollowUpChange}
                                        placeholder="Provide your response here..."
                                        className="w-full h-24 border border-gray-300 rounded-lg p-2 text-sm resize-none outline-none mt-4"
                                    />
                                )}
                                <div className="flex justify-between items-end mt-4">
                                    <button
                                        className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors"
                                        onClick={handleRegenerate}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button
                                        className="bg-black text-white px-6 py-1.5 rounded-lg hover:bg-gray-800 transition-colors font-noto-sans"
                                        onClick={handleApply}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </animated.div>
            </div>
        )
    );
};

export default PromptContainer;
