
import { useState, useEffect } from 'react'
import Image from '../Image'
import Slide from '../Slide'

const AdsOverlay = ({ onComplete, onClose }) => {
    const [secondsLeft, setSecondsLeft] = useState(30)

    useEffect(() => {
        if (secondsLeft <= 0) {
            onComplete()
            return
        }

        const timer = setTimeout(() => {
            setSecondsLeft(prev => prev - 1)
        }, 1000)

        return () => clearTimeout(timer)
    }, [secondsLeft, onComplete])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md">
                <h3 className="text-xl font-bold mb-4">
                    Watch Ad to Continue {secondsLeft}{' '}
                </h3>

                {/* Simulated ad content */}
                <div className="bg-gray-700  mb-4 flex items-center justify-center">
                    {secondsLeft > 0 ? (
                        <div className='flex flex-col h-full w-full'>
                            <p>Debo Job and interniship Application Portal</p>
                            <Slide />
                        </div>
                    ) : (
                        <p className="text-green-500">Ad Complete!</p>
                    )}
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">
                        Cancel
                    </button>
                    <button
                        onClick={onComplete}
                        disabled={secondsLeft > 0}
                        className={`px-4 py-2 rounded ${secondsLeft > 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdsOverlay
