import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoAddOutline, IoChevronBack, IoCloseOutline, IoDocumentText, IoDownloadOutline, IoEllipsisHorizontal, IoImages, IoLanguage, IoSend, IoVideocam } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import Avatar from './Avatar';
import Loading from './Loader';
import PromptContainer from './PromptContainer';
import { MdOutlineKeyboardVoice } from "react-icons/md";


const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const [modalImage, setModalImage] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage] = useState([])
  const currentMessage = useRef(null)
  const [isEmailDraftVisible, setIsEmailDraftVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const buttonRef = useRef(null);

  const handleTranslateClick = (e) => {
    e.preventDefault(); // Prevent form submission
    setShowLanguages(true);
  };

  const handleLanguageSelect = async (e, lang) => {
    e.preventDefault(); // Prevent form submission
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message.text, targetLang: lang }),
      });
      const data = await response.json();
      setMessage(prev => ({ ...prev, text: data.translatedText }));
    } catch (error) {
      console.error('Error translating message:', error);
    } finally {
      setShowLanguages(false);
      setShowMenu(false);
    }
  };


  const languageMap = {
    fr: 'French',
    en: 'English',
    es: 'Spanish',
    hi: 'Hindi',
    de: 'German',
    mr: 'Marathi',
    ar: 'Arabic',
    bn: 'Bengali',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    zh: 'Chinese',
  };

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


  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [allMessage])

  const handleDownload = useCallback((imageUrl, fileName) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'download.jpg'; // Default filename if none provided
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch(error => console.error('Error downloading image:', error));
  }, []);

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
      socketConnection.emit('message-page', params.userId);
      socketConnection.emit('seen', params.userId);

      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });

      socketConnection.on('message', (data) => {
        setAllMessage(data);
      });

      socketConnection.on('seen', (data) => {
        // Update the seen status of messages
        setAllMessage(prevMessages =>
          prevMessages.map(msg =>
            msg.sender === data.userId ? { ...msg, seen: true } : msg
          )
        );
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { value } = e.target

    setMessage(preve => {
      return {
        ...preve,
        text: value
      }
    })
  }

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl || message.documentUrl || message.documentName || message.documentType) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          documentUrl: message.documentUrl,
          documentName: message.documentName,
          documentType: message.documentType,
          msgByUserId: user?._id
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
          documentUrl: "",
          documentName: "",
          documentType: "",
        });
      }
    }
  }, [message, socketConnection, params.userId, user]);

  const textareaRef = useRef(null);
  const maxHeight = 200; // Set your specific maximum height here

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  }, [message.text]);


  const handleButtonClick = (e) => {
    e.preventDefault();
    setIsEmailDraftVisible(!isEmailDraftVisible);
  };

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition(rect);
    }
  }, []);

  const preventEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handlePromptMessageGenerated = (generatedMessage) => {
    setMessage((prev) => ({
      ...prev,
      text: generatedMessage
    }));
    toast.success('Message generated successfully!');
  };
  return (
    <div className=''>
      <header className='sticky top-0 h-16 bg-header border-b backdrop-filter backdrop-blur-lg shadow-lg flex justify-between items-center px-4'>
        <div className='flex items-center gap-2'>
          <Link to={"/"} className='rounded-full lg:hidden'>
            <IoChevronBack size={25} />
          </Link>
          <div className='m-2'>
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
              {dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>}
            </p>
          </div>

        </div>
        <div>
          <button className='p-2 text-primary'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </button>
        </div>
      </header>


      {/* Message container */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden bg-white overflow-y-scroll scrollbar relative ' >
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
                  {/* Check if thumbnailUrl is available, if yes, show the thumbnail, else show the document icon */}
                  {message.thumbnailUrl ? (
                    <a href={message.documentUrl} target='_blank' rel='noreferrer'>
                      <img src={message.thumbnailUrl} alt="Document Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                      <span className='ml-2'>{message.documentName}</span> {/* Displaying the document name */}
                    </a>
                  ) : (
                    <a href={message.documentUrl} target='_blank' rel='noreferrer'>
                      <IoDocumentText size={50} />
                      <span className='ml-2'>{message.documentName}</span> {/* Displaying the document name */}
                    </a>
                  )}
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
          {allMessage.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-16 h-16 mb-4  animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xl font-semibold mb-2">No messages yet</p>
              <p className="text-sm text-center max-w-xs">
                Start a conversation! Send a message to begin chatting.
              </p>
            </div>
          )}
          {allMessage.length > 0 && (
            allMessage.map((msg, index) => {
              return (
                <div key={index} className={`flex flex-col py-2 w-full ${msg?.msgByUserId === user?._id ? 'items-end' : 'items-start'} gap-2`}>
                  <div className={`flex ${msg?.msgByUserId === user?._id ? 'flex-row-reverse' : 'flex-row'} w-full`}>
                    <div className={`message-bubble transition-shadow mt-2 ${user._id === msg.msgByUserId ? "ml-auto" : "mr-auto"}`}>


                      {msg.imageUrl && (
                        <div className="relative group w-full">
                          <img
                            src={msg.imageUrl}
                            alt='messageimage'
                            className='w-full h-auto max-h-40 sm:max-h-60 md:max-h-80 object-contain shadow-lg rounded-lg cursor-pointer'
                            onClick={() => setModalImage(msg.imageUrl)}
                          />
                          <button
                            className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(activeMenu === msg._id ? null : msg._id);
                            }}
                          >
                            <HiOutlineDotsVertical size={20} />
                          </button>
                          {activeMenu === msg._id && (
                            <div className="absolute top-10 right-2 backdrop-filter backdrop-blur-lg bg-white shadow-lg rounded-md py-2 z-10">
                              <a
                                href={msg.imageUrl}
                                download
                                className="block px-4 py-2 hover:bg-secondary text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(msg.imageUrl, `image_${msg._id}.jpg`);
                                  setActiveMenu(null);
                                }}
                              >
                                Download
                              </a>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalImage(msg.imageUrl);
                                  setActiveMenu(null);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-secondary text-sm"
                              >
                                View
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {msg.videoUrl && (
                        <div className="video-message w-full">
                          <video
                            src={msg.videoUrl}
                            className='w-full h-auto max-h-40 object-contain rounded-t-lg'
                            controls
                          />
                        </div>
                      )}
                      {msg.documentUrl && (
                        <div className='document-preview flex cursor-pointer bg-secondary p-4 rounded-xl w-full'>
                          <div className='drop-shadow-xl flex-shrink-0'>
                            {msg.thumbnailUrl ? (
                              <img src={msg.thumbnailUrl} alt="Document Preview" className="w-16 h-auto" />
                            ) : (
                              <svg fill="none" aria-hidden="true" class="w-12 h-12 drop-shadow-lg flex-shrink-0" viewBox="0 0 20 21">
                                <g clip-path="url(#clip0_3173_1381)">
                                  <path fill="#E2E5E7" d="M5.024.5c-.688 0-1.25.563-1.25 1.25v17.5c0 .688.562 1.25 1.25 1.25h12.5c.687 0 1.25-.563 1.25-1.25V5.5l-5-5h-8.75z" />
                                  <path fill="#B0B7BD" d="M15.024 5.5h3.75l-5-5v3.75c0 .688.562 1.25 1.25 1.25z" />
                                  <path fill="#CAD1D8" d="M18.774 9.25l-3.75-3.75h3.75v3.75z" />
                                  <path fill="#F15642" d="M16.274 16.75a.627.627 0 01-.625.625H1.899a.627.627 0 01-.625-.625V10.5c0-.344.281-.625.625-.625h13.75c.344 0 .625.281.625.625v6.25z" />
                                  <path fill="#fff" d="M3.998 12.342c0-.165.13-.345.34-.345h1.154c.65 0 1.235.435 1.235 1.269 0 .79-.585 1.23-1.235 1.23h-.834v.66c0 .22-.14.344-.32.344a.337.337 0 01-.34-.344v-2.814zm.66.284v1.245h.834c.335 0 .6-.295.6-.605 0-.35-.265-.64-.6-.64h-.834zM7.706 15.5c-.165 0-.345-.09-.345-.31v-2.838c0-.18.18-.31.345-.31H8.85c2.284 0 2.234 3.458.045 3.458h-1.19zm.315-2.848v2.239h.83c1.349 0 1.409-2.24 0-2.24h-.83zM11.894 13.486h1.274c.18 0 .36.18.36.355 0 .165-.18.3-.36.3h-1.274v1.049c0 .175-.124.31-.3.31-.22 0-.354-.135-.354-.31v-2.839c0-.18.135-.31.355-.31h1.754c.22 0 .35.13.35.31 0 .16-.13.34-.35.34h-1.455v.795z" />
                                  <path fill="#CAD1D8" d="M15.649 17.375H3.774V18h11.875a.627.627 0 00.625-.625v-.625a.627.627 0 01-.625.625z" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_3173_1381">
                                    <path fill="#fff" d="M0 0h20v20H0z" transform="translate(0 .5)" />
                                  </clipPath>
                                </defs>
                              </svg>
                            )}
                          </div>
                          <div className='leading-tight p-2 text-black flex-grow overflow-hidden'>
                            <a href={msg.documentUrl} target='_blank' rel='noreferrer' className="block truncate">
                              <span className='ml-2 text-sm'>{msg.documentName}</span>
                              <span className='ml-2 text-sm'>{msg.documentType}</span>
                            </a>

                          </div>
                          <IoDownloadOutline size={24} />

                        </div>
                      )}
                      {msg.text && (
                        <div className={`p-3 rounded-3xl inline-block max-w-full ${user._id === msg.msgByUserId ? "bg-primary text-white rounded-br-none" : "bg-tertiary rounded-3xl rounded-bl-none"}`}>
                          <p className='text-sm'>{user._id === msg.msgByUserId ? msg.text : msg.translatedText || msg.text}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Time Container */}
                  <div className={`text-xs flex space-x-2 ${user._id === msg.msgByUserId ? "justify-end" : "justify-start"}`}>
                    {msg.seen ? (
                      <span className="text-gray-500 font-medium">Seen</span>
                    ) : (
                      <span className='text-gray-600 font-medium'>Delivered</span>
                    )}
                    <p>{moment(msg.createdAt).format('hh:mm')}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      <section className='fixed bottom-0 w-full p-2.5 border-t  flex items-center gap-2 z-50'>
        <div className='flex justify-center items-center'>
          <button className='p-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
            </svg>
          </button>

          <button onClick={handleUploadImageVideoOpen} className='relative flex justify-center items-center p-2 rounded-full hover:bg-primary hover:text-white'>
            <IoAddOutline
              size={25}
            />
          </button>
        </div>
        {/* Upload options */}
        {
          openImageVideoUpload && (
            <div className='absolute bottom-16 left-8 w-48 backdrop-filter backdrop-blur-lg  p-3 shadow rounded-lg'>
              <form className=''>
                <label htmlFor='uploadImage' className='flex items-center gap-3 p-2 hover:bg-secondary rounded-md cursor-pointer'>
                  <div className='text-indigo-600 '>
                    <IoImages size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <input
                  type='file'
                  id='uploadImage'
                  onChange={handleUploadImage}
                  className='hidden'
                  accept="image/*"
                />
                <label htmlFor='uploadVideo' className='flex items-center gap-3 p-2 hover:bg-secondary rounded-md cursor-pointer'>
                  <div className='text-green-600'>
                    <IoVideocam size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type='file'
                  id='uploadVideo'
                  onChange={handleUploadVideo}
                  className='hidden'
                  accept="video/*"
                />
                <label htmlFor='uploadDocument' className='flex items-center gap-3 p-2 hover:bg-secondary rounded-md cursor-pointer'>
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
                  accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                          .xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                          .ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,
                          .pdf,application/pdf,text/plain,application/vnd.ms-office'
                />
              </form>
            </div>
          )
        }

        {/* input box for message */}
        <form className='w-full max-w-screen-xl flex gap-3 ' onSubmit={handleSendMessage}>
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={message.text}
              onChange={handleOnChange}
              // onKeyDown={preventEnterKeyPress}
              rows={1}
              tabIndex={10}
              placeholder='Type a message...'
              className='flex-1 p-2 pr-12 rounded-3xl border backdrop-filter backdrop-blur-lg focus:outline-none w-full resize-none overflow-y-auto scrollbar-text'
            // style={{ maxHeight: `${maxHeight}px` }}
            />
            <button
              type="button"
              onClick={() => {
                setShowMenu(!showMenu);
                setShowLanguages(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IoEllipsisHorizontal size={20} />
            </button>
            {showMenu && (
              <div className="absolute right-0 bottom-full mb-2 bg-white shadow-lg rounded-md py-2 z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center"
                  onClick={handleTranslateClick}
                >
                  <IoLanguage className="mr-2" /> Translate my Message
                </button>
                <button
                  ref={buttonRef}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex gap-1 items-center"
                  onClick={handleButtonClick}
                >
                  <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 28C14 26.0633 13.6267 24.2433 12.88 22.54C12.1567 20.8367 11.165 19.355 9.905 18.095C8.645 16.835 7.16333 15.8433 5.46 15.12C3.75667 14.3733 1.93667 14 0 14C1.93667 14 3.75667 13.6383 5.46 12.915C7.16333 12.1683 8.645 11.165 9.905 9.905C11.165 8.645 12.1567 7.16333 12.88 5.46C13.6267 3.75667 14 1.93667 14 0C14 1.93667 14.3617 3.75667 15.085 5.46C15.8317 7.16333 16.835 8.645 18.095 9.905C19.355 11.165 20.8367 12.1683 22.54 12.915C24.2433 13.6383 26.0633 14 28 14C26.0633 14 24.2433 14.3733 22.54 15.12C20.8367 15.8433 19.355 16.835 18.095 18.095C16.835 19.355 15.8317 20.8367 15.085 22.54C14.3617 24.2433 14 26.0633 14 28Z" fill="url(#paint0_radial_16771_53212)" />
                    <defs>
                      <radialGradient id="paint0_radial_16771_53212" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2.77876 11.3795) rotate(18.6832) scale(29.8025 238.737)">
                        <stop offset="0.0671246" stop-color="#9168C0" />
                        <stop offset="0.342551" stop-color="#5684D1" />
                        <stop offset="0.672076" stop-color="#1BA1E3" />
                      </radialGradient>
                    </defs>
                  </svg>
                  Ask Genmo
                </button>
              </div>
            )}
            {showLanguages && (
              <div className="absolute right-0 bottom-24 w-32 mb-2 bg-white shadow-lg rounded-md py-2 z-20 max-h-60 overflow-y-auto hide-scrollbar">
                {Object.entries(languageMap).map(([langCode, langName]) => (
                  <button
                    key={langCode}
                    onClick={(e) => handleLanguageSelect(e, langCode)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {langName}
                  </button>
                ))}
              </div>
            )}
          </div>

          <PromptContainer
            isVisible={isEmailDraftVisible}
            onClose={() => setIsEmailDraftVisible(false)}
            buttonPosition={buttonPosition}
            onMessageGenerated={handlePromptMessageGenerated}
          />
          <button
            className={`${message.text ? 'hover:bg-primary hover:text-white p-2 rounded-full text-primary' : 'text-gray-400 mb-1'}`}

          >            {message.text ? (
            <IoSend size={25} />
          ) : (
            <MdOutlineKeyboardVoice size={25} />
          )}
          </button>
        </form>
      </section>
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setModalImage(null)}>
          <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl h-[60vh] sm:h-[70vh] md:h-[80vh] rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={modalImage}
                alt="Full size"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagePage
