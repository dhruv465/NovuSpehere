import React from 'react'

const Loading = () => {
    return (
        <div>
            <div className='flex justify-center items-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
        </div>
    )
}

export default Loading