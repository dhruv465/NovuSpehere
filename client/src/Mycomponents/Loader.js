import React from 'react'

const Loading = () => {
    return (
        <div>
            <div className='flex justify-center items-center space-x-2'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'> </div>
                {/* <span>Searching...</span> */}
            </div>
        </div>
    )
}

export default Loading