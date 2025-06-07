import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Buffer } from 'buffer'
import Markdown from 'react-markdown'
import { htmlToText } from 'html-to-text'

import AdsOverlay from './ai-usage/AdsOverlay'
import PremuimUpgrade from './ai-usage/PremuimUpgrade'
import LimitReached from './ai-usage/LimitReached'
import { useUsage } from '../contexts/UsageContext.jsx'


const NewAi = ({ Application, Post }) => {
    const {usage,incrementRequests,recordAdWatch,hasReachedLimit}=useUsage()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [prompt, setPrompt] = useState('')
    const [messages, setMessages] = useState([])
    const [collapse, setCollapse] = useState(false)
    const [showAds, setShowAds] = useState(false)
    const [showPremium, setShowPremium] = useState(false)
    
    const [isPremium,setIsPremium]=useState(false)

    const pdfUrl = Application?.cv
    const extractText = html => {
        return htmlToText(html, {
            selectors: [
                { selector: 'img', format: 'skip' },
                { selector: 'video', format: 'skip' },
            ],
        })
    }
    const postContent = extractText(Post?.content)

    const handleButtonClick = async () => {

        if (!prompt || prompt.trim() === '') {
            setError('Prompt is required')
            return
        }
        if (!pdfUrl && !postContent) {
            // Check if at least one source exists
            setError('There is no source content (CV or Post) to process.')
            return
        }

        setLoading(true)
        setError(null)
        const userMessage = { sender: "user", text: prompt }
        setMessages(prev => [...prev, userMessage])
        const tempAiMessage = { sender: "ai", text: "", isLoading: true }
        setMessages(prev=>[...prev,tempAiMessage])

        try {
            // Initialize the Gemini client
            const genAI = new GoogleGenerativeAI(
                import.meta.env.VITE_GEMINI_API_KEY,
            )
            const model = genAI.getGenerativeModel({
                model: 'models/gemini-1.5-flash',
            })

            let result

            if (pdfUrl) {
                // Fetch the PDF
                const pdfResp = await fetch(pdfUrl).then(response => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`,
                        )
                    }
                    return response.arrayBuffer()
                })

                // Generate content from PDF and prompt
                result = await model.generateContent([
                    {
                        inlineData: {
                            data: Buffer.from(pdfResp).toString('base64'),
                            mimeType: 'application/pdf',
                        },
                    },
                    prompt,
                ])
            } else if (postContent) {
                // Generate content from Post content and prompt
                result = await model.generateContent([postContent, prompt])
            } else {
                // This case should ideally be caught by the initial check, but added for robustness
                setError('No valid content source provided.')
                setLoading(false)
                return
            }

            const responseText = result.response.text()

            // Update state
            setMessages(prev => {
                const newMessages = [...prev]
                newMessages[newMessages.length - 1] = {
                    sender: 'Ai',
                    text: responseText,
                    isLoading: false,
                }
                return newMessages
            })
            if (!isPremium) {
                incrementRequests()
            }
            setPrompt('')
        } catch (err) {
           console.error('API Error:', err)
           setError(err.message || 'Failed to generate response.')
           // Update the temporary AI message with error state
           setMessages(prev => {
               const newMessages = [...prev]
               newMessages[newMessages.length - 1] = {
                   sender: 'Ai',
                   text: error || 'Failed to generate response.',
                   isLoading: false,
               }
               return newMessages
           })
        } finally {
            setLoading(false)
        }
    }
    
const handlWatchAdCompelete = () => {
        recordAdWatch()
        setShowAds(false)
    }
    const handleUpgradeOnSuccess = () => {
        setIsPremium(true)
        setShowPremium(false)
}
    const toggleCollapse = () => {
        setCollapse(!collapse)
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Allow shift + Enter for new line
            e.preventDefault()
            handleButtonClick()
        }
    }
    const canMakeRequest=isPremium|| !hasReachedLimit()
    return (
        <div className=" aiContainer relative text-white flex flex-col mb-12 mt-2 w-1/2 outline outline-debo-blue/50 shadow-debo-blue/60 ml-10 p-2 rounded-lg ">
            <div
                className={`aiChat  flex flex-col overflow-y-auto h-80 ${collapse ? 'hidden' : ''}`}>
                {error && messages.length === 0 && (
                    <p style={{ color: 'red' }}>{error}</p>
                )}
                {/* Display error if no messages yet */}
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`rounded-md max-w-[80%] p-2 mb-2 text-sm bg-gray-800 font-sans ${message.sender === 'user' ? 'self-end mb-2' : 'self-start mb-2'}`}>
                        {message.isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <Markdown>{message.text}</Markdown>
                        )}
                        {error &&
                            index === messages.length - 1 &&
                            message.sender === 'ai' && (
                                <p style={{ color: 'red' }}>{error}</p>
                            )}{' '}
                        {/* Show error for the latest AI message */}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 items-center justify-between">
                <textarea
                    className="text-gray-300 h-20 w-full rounded-lg bg-gray-800 items-start p-2 outline-none m-1 "
                    type="text"
                    placeholder="Ask anything"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={!canMakeRequest && !isPremium}
                />

                {showPremium && (
                    <PremuimUpgrade
                        onClose={() => setShowPremium(false)}
                        onSuccess={handleUpgradeOnSuccess}
                    />
                )}
                {showAds && (
                    <div>
                        <AdsOverlay
                            onComplete={handlWatchAdCompelete}
                            onClose={() => setShowAds(false)}
                        />
                    </div>
                )}

                <div className="flex flex-col justify-between h-20">
                    <button
                        onClick={toggleCollapse}
                        className=" self-start rounded-md px-2 text-xl hover:text-green-500 ml-1">
                        {collapse ? ' ▲' : '▼'}
                    </button>
                    <button
                        onClick={handleButtonClick}
                        disabled={
                            loading ||
                            (!pdfUrl && !postContent) ||
                            !prompt.trim() ||
                            (!canMakeRequest && !isPremium)
                        } // Disable if loading, no source, or empty prompt
                        className={`bg-gray-800 rounded-lg text-white px-2 hover:text-green-500 ${loading || (!pdfUrl && !postContent) || !prompt.trim() || (!canMakeRequest && !isPremium) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {loading ? 'Loading...' : 'Ask'}
                    </button>
                </div>
            </div>

            {!canMakeRequest && !isPremium && (
                <div className="absolute bottom-0 right-0 left-0 p-4">
                    <LimitReached
                        onWatchAd={() => setShowAds(true)}
                        onUpgrade={() => setShowPremium(true)}
                    />
                </div>
            )}

            {!isPremium && (
                <div className="text-xs text-gray-400 mt-2">
                    Your Today Request is {usage.dailyRequests}/
                    {usage.adsWatchedToday > 0 ? 2 : 3}(Free tier)
                </div>
            )}
        </div>
    )
}

export default NewAi
