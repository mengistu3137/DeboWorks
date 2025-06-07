
const LimitReached = ({onWatchAd,onUpgrade}) => {
  return (
      <div className='bg-gray-800 p-4 rounded-lg mb-4 flex flex-col items-center'>
          <p> you have reached your daily limit</p>
          <div className="flex  gap-4 w-full justify-center">
              <button
                  onClick={onWatchAd}
                  className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500 flex-1 max-w-xs"
              >
                  Watch Ads
              </button> 
              <button
                  onClick={onUpgrade}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 flex-1 max-w-xs"
              >
                  Upgrade to Primium
              </button> 
          </div>
    </div>
  )
}

export default LimitReached