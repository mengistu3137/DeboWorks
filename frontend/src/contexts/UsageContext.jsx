// src/contexts/UsageContext.js (or usageContext.js - but be consistent)
import { createContext, useContext, useState, useEffect } from 'react'

// 1. Create context with proper capitalization
const UsageContext = createContext()

export const UsageProvider = ({ children }) => {
    const [usage, setUsage] = useState(() => {
        // Load from localStorage or initialize
        const saved = localStorage.getItem('aiUsage')
        return saved
            ? JSON.parse(saved)
            : {
                  dailyRequests: 0,
                  lastRequestDate: null,
                  adsWatchedToday: 0,
              }
    })

    useEffect(() => {
        // Reset daily counts if it's a new day
        const today = new Date().toDateString()
        if (usage.lastRequestDate !== today) {
            setUsage(prev => ({
                dailyRequests: 0,
                lastRequestDate: today,
                adsWatchedToday: 0,
            }))
        }
    }, [usage.lastRequestDate])

    useEffect(() => {
        // Save to localStorage whenever usage changes
        localStorage.setItem('aiUsage', JSON.stringify(usage))
    }, [usage])

    const incrementRequests = () => {
        setUsage(prev => ({
            ...prev,
            dailyRequests: prev.dailyRequests + 1,
        }))
    }

    const recordAdWatch = () => {
        setUsage(prev => ({
            ...prev,
            adsWatchedToday: prev.adsWatchedToday + 1,
            dailyRequests: 0, // Reset their counter for new requests
        }))
    }

    const hasReachedLimit = () => {
        if (usage.adsWatchedToday > 0) {
            return usage.dailyRequests >= 2
        }
        return usage.dailyRequests >= 3
    }

    return (
        <UsageContext.Provider
            value={{
                usage,
                incrementRequests,
                recordAdWatch,
                hasReachedLimit,
            }}>
            {children}
        </UsageContext.Provider>
    )
}

// 2. Export hook with proper context name
export const useUsage = () => useContext(UsageContext)
