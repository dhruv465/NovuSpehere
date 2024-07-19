import React from 'react'
import logo from '../assets/logo.png'
const AuthLayout = ({ children }) => {
    return (
        <>
            <header className='flex justify-center items-center py-3 h-20 shadow-xl bg-white'>
                <img
                    src={logo}
                    alt='logo'
                    width={80}
                    height={80}
                />
            </header>

            {children}
        </>
    )
}

export default AuthLayout