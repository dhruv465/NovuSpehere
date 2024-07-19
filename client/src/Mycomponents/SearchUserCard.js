import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const SearchUserCard = ({ user, onClose }) => {
    return (
        <div>
            <Link to={"/" + user?._id} onClick={onClose} className='flex gap-4 items-center border-b border-slate-100 p-2 lg:p-4 hover:bg-[#ddd7f7] hover:text-black cursor-pointer rounded-md'>
                <div>
                    <Avatar
                        width={50}
                        height={50}
                        name={user.name}
                        userId={user?._id}
                        imageUrl={user.profile_pic}
                    />
                </div>
                <div>
                    <div className=' font-semibold text-ellipsis line-clamp-1'>
                        {user.name}
                    </div>
                    <p className='text-sm text-ellipsis line-clamp-1'>
                        {user.email}
                    </p>
                </div>

            </Link>

        </div>
    )
}

export default SearchUserCard