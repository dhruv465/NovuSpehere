import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { IoCall, IoChevronBack, IoCloseOutline, IoDocumentText, IoSend, IoVideocam } from 'react-icons/io5'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoAddOutline } from "react-icons/io5";
import { IoImages } from "react-icons/io5";
import Loading from './Loader';
import uploadFile from '../helpers/uploadFile'
import bgimage from '../assets/wallpaper.png'
import moment from 'moment'
import { FcVideoCall } from "react-icons/fc";
import { PiPhoneCallFill } from "react-icons/pi";






const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)

  const user = useSelector(state => state?.user)
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  })
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    documentUrl: "",
    videoUrl: "",
    documentName: ""
  });

  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage] = useState([])
  const currentMessage = useRef(null)

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [allMessage])


  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(preve => !preve)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url
      }
    })
  }

  const handleClearUploadImage = () => {
    setMessage(preve => {
      return {
        ...preve,
        imageUrl: ""
      }
    })
  }


  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url
      }
    })
  }
  const handleClearUploadVideo = () => {
    setMessage(preve => {
      return {
        ...preve,
        videoUrl: ""
      }
    })
  }

  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage(preve => {
      return {
        ...preve,
        documentUrl: uploadPhoto.url,
        documentName: file.name
      }
    });
  }


  const handleClearUploadDocument = () => {
    setMessage(preve => {
      return {
        ...preve,
        documentUrl: "",
        documentName: ""
      }
    });
  }



  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId)

      socketConnection.emit('seen', params.userId)

      socketConnection.on('message-user', (data) => {
        setDataUser(data)
      })

      socketConnection.on('message', (data) => {
        console.log('message data', data)
        setAllMessage(data)
      })


    }
  }, [socketConnection, params?.userId, user])


  const handleOnChange = (e) => {
    const { name, value } = e.target

    setMessage(preve => {
      return {
        ...preve,
        text: value
      }
    })
  }

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl || message.documentUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          documentUrl: message.documentUrl,
          documentName: message.documentName,
          msgByUserId: user?._id
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
          documentUrl: "",
          documentName: ""
        });
      }
    }
  }


  return (
    <div style={{ backgroundImage: `url(${bgimage})` }} className='bg-no-repeat bg-cover z-10'>
      <header className='sticky top-0 h-16 bg-slate-100 shadow-md flex justify-between items-center px-4'>
        <div className='flex items-center gap-2'>
          <Link to={"/"} className='rounded-full lg:hidden'>

            <IoChevronBack
              size={25}
            />

          </Link>
          <div
            className='m-2'
          >
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>
              {dataUser?.name}
            </h3>
            <p className='-my-2 text-sm'>
              {
                dataUser.online ? <span className='text-purple-500'>online</span> : <span className='text-slate-400'>offline</span>
              }
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <button className='bg-slate-200 p-2 rounded-full hover:bg-slate-300' data-tooltip-target="tooltip-default">
            <PiPhoneCallFill
              size={25}
            />
          </button>
          <div id="tooltip-default" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Tooltip content
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
          <button className='bg-slate-200 p-2 rounded-full hover:bg-slate-300' title='This feature is current unavailable'>
            <FcVideoCall
              size={25}
            />
          </button>
          <button className='bg-slate-200 p-2 rounded-full hover:bg-slate-300' title='Go back'>
            <HiOutlineDotsVertical
              size={25}
            />
          </button>
        </div>
      </header>

      {/* Message container */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative  bg-white bg-opacity-40' >



        {/* upload image */}
        {
          message.imageUrl && (
            <div className='fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
              <div className='w-full max-w-sm bg-white rounded-lg p-5'>
                <div className='flex justify-end items-center'>
                  <button onClick={handleClearUploadImage} className='rounded-md hover:text-red-500 cursor-pointer'>
                    <IoCloseOutline
                      size={25}
                    />
                  </button>
                </div>
                <div className='flex justify-center items-center '>
                  <img src={message.imageUrl}
                    alt='uploadimage'
                    className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                  />
                </div>
              </div>
            </div>
          )
        }
        {/* upload video */}
        {
          message.videoUrl && (
            <div className='fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
              <div className='w-full max-w-sm bg-white rounded-lg p-5'>
                <div className='flex justify-end items-center'>
                  <button onClick={handleClearUploadVideo} className='rounded-md hover:text-red-500 cursor-pointer'>
                    <IoCloseOutline
                      size={25}
                    />
                  </button>
                </div>
                <div className='flex justify-center items-center '>
                  <video
                    src={message.videoUrl}
                    className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                    controls
                  />
                </div>
              </div>
            </div>
          )
        }
        {/* upload document */}
        {
          message.documentUrl && (
            <div className='fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
              <div className='w-full max-w-sm bg-white rounded-lg p-5'>
                <div className='flex justify-end items-center'>
                  <button onClick={handleClearUploadDocument} className='rounded-md hover:text-red-500 cursor-pointer'>
                    <IoCloseOutline size={25} />
                  </button>
                </div>
                <div className='flex justify-center items-center '>
                  <a href={message.documentUrl} target='_blank' rel='noreferrer'>
                    <IoDocumentText size={50} />
                    <span className='ml-2'>{message.documentName}</span>
                  </a>
                </div>
              </div>
            </div>
          )
        }

        {
          loading && (
            <div className='fixed top-0 left-0 bottom-0 right-0 bg-black z-50 bg-opacity-50 flex justify-center items-center'>
              <div className='w-full max-w-sm bg-white rounded-lg p-5'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-xl font-bold'>Uploading...</h1>
                  <button>
                    <IoCloseOutline
                      size={25}
                    />
                  </button>
                </div>
                <Loading />
              </div>
            </div>
          )
        }
        {/* Message container */}

        <div className='w-full max-w-screen-xl mx-auto p-4' ref={currentMessage}>
          {/*<div className='flex flex-col justify-center items-center'>
          <div className='flex justify-center items-center gap-2'>
            <div className='w-1/2 h-1 bg-slate-400'></div>
            <p className='text-slate-400'>Today</p>
            <div className='w-1/2 h-1 bg-slate-400'></div>
          </div>   key={index}
        </div>  */}
          {
            allMessage.length === 0 && (
              <p className='text-center bg-purple-100 rounded-md shadow-md text-black '>
                No messages here yet!!
              </p>
            )
          }
          {
            allMessage.length > 0 && (
              allMessage.map((msg, index) => {
                return (
                  <div key={index} className={`flex max-w[280px] gap-2 ${msg?.msgByUserId === user?._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 py-2 items-center ${msg?.msgByUserId === user?._id ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className='m-2'>
                        <Avatar
                          width={40}
                          height={40}
                          imageUrl={msg?.msgByUserId === user?._id ? user?.profile_pic : dataUser?.profile_pic}
                          name={msg?.msgByUserId === user?._id ? user?.name : dataUser?.name}
                          userId={msg?.msgByUserId === user?._id ? user?._id : dataUser?._id}
                        />
                      </div>
                      <div className={` shadow-2xl drop-shadow-2xl transition-shadow p-2 mt-2 lg:max-w-xl md:max-w-sm rounded-lg ${user._id === msg.msgByUserId ? "ml-auto bg-purple-200" : "bg-white"}`}>
                        <p className='text-sm'>
                          {msg.text}
                        </p>
                        <p className='text-xs ml-auto w-fit'>
                          {moment(msg.createdAt).format('hh:mm')}
                        </p>
                        {
                          msg.imageUrl && (
                            <img src={msg.imageUrl} alt='messageimage' className='w-full h-40 object-cover rounded-lg' />
                          )
                        }
                        {
                          msg.videoUrl && (
                            <video src={msg.videoUrl} className='w-full h-40 object-cover rounded-lg' controls />
                          )
                        }
                        {
                          msg.documentUrl && (
                            <a href={msg.documentUrl} target='_blank' rel='noreferrer'>
                              <IoDocumentText
                                size={25}
                              />

                            </a>
                          )
                        }
                      </div>
                    </div>
                  </div>
                )
              })
            )
          }

        </div>

      </section>

      <section className='fixed bottom-0 w-full bg-slate-100 p-4 flex items-center gap-2  z-50'>
        <div>
          <button onClick={handleUploadImageVideoOpen} className='relative flex justify-center items-center p-2 rounded-full hover:bg-purple-500 hover:text-white'>
            <IoAddOutline
              size={25}
            />
          </button>
        </div>
        {/* Upload options */}
        {
          openImageVideoUpload && (
            <div className='absolute bottom-16 left-8 w-48 bg-slate-200 p-3 shadow rounded-lg'>
              <form className=''>
                <label htmlFor='uploadImage' className='flex items-center gap-3 p-2 hover:bg-slate-300 rounded-md cursor-pointer'>
                  <div className='text-indigo-600 '>
                    <IoImages size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label htmlFor='uploadVideo' className='flex items-center gap-3 p-2 hover:bg-slate-300 rounded-md cursor-pointer' >
                  <div className='text-green-600'>
                    <IoVideocam size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type='file'
                  id='uploadImage'
                  onChange={handleUploadImage}
                  className='hidden'
                />
                <input
                  type='file'
                  id='uploadVideo'
                  onChange={handleUploadVideo}
                  className='hidden'
                />
                <label htmlFor='uploadDocument' className='flex items-center gap-3 p-2 hover:bg-slate-300 rounded-md cursor-pointer'>
                  <div className='text-blue-600'>
                    <IoDocumentText size={18} />
                  </div>
                  <p>Document</p>
                </label>
                <input
                  type='file'
                  id='uploadDocument'
                  onChange={handleUploadDocument}
                  className='hidden'
                />
              </form>
            </div>
          )
        }

        {/* input box for message */}
        <form className='w-full max-w-screen-xl flex gap-3 ' onSubmit={handleSendMessage}>
          <input
            type='text'
            value={message.text}
            onChange={handleOnChange}
            placeholder='&nbsp; Type a message...'
            className='flex-1 p-2 rounded-full bg-slate-200 focus:outline-none w-full'
          />


          <button className='hover:bg-purple-500 hover:text-white p-2 rounded-full text-secondary'>
            <IoSend
              size={25}
            />
          </button>
        </form>
      </section>
    </div>
  )
}

export default MessagePage