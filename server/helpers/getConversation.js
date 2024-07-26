const { ConversationModel } = require("../models/ConversationModel");
const { UserModel } = require("../models/UserModel"); // Ensure UserModel is imported

const getConversation = async (currentUserId) => {
    if (!currentUserId) return [];

    try {
        // Retrieve conversations where the current user is either sender or receiver
        const currentUserConversation = await ConversationModel.find({
            "$or": [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        }).sort({ updatedAt: -1 })
          .populate('messages')
          .populate('sender', 'name') // Select fields as needed
          .populate('receiver', 'name'); // Select fields as needed

        const conversations = await Promise.all(currentUserConversation.map(async (conv) => {
            // Count unseen messages
            const countUnseenMsg = conv?.messages?.reduce((prev, curr) => {
                if (curr?.msgByUserId.toString() !== currentUserId) {
                    return prev + (curr?.seen ? 0 : 1);
                }
                return prev;
            }, 0);

            // Get the last message
            const lastMessage = conv.messages[conv?.messages?.length - 1];

            // Optionally, you can add translation logic here if needed

            return {
                _id: conv?._id,
                sender: conv?.sender,
                receiver: conv?.receiver,
                unseenMsg: countUnseenMsg,
                lastMsg: {
                    text: lastMessage?.text,
                    imageUrl: lastMessage?.imageUrl,
                    videoUrl: lastMessage?.videoUrl,
                    documentUrl: lastMessage?.documentUrl,
                    documentName: lastMessage?.documentName,
                    documentType: lastMessage?.documentType,
                    sender: lastMessage?.sender,
                    receiver: lastMessage?.receiver,
                    isRead: lastMessage?.isRead,
                    msgByUserId: lastMessage?.msgByUserId,
                    seen: lastMessage?.seen,
                    createdAt: lastMessage?.createdAt,
                    updatedAt: lastMessage?.updatedAt,
                }
            };
        }));

        return conversations;
    } catch (error) {
        console.error('Error retrieving conversations:', error);
        return []; // Return an empty array or handle the error as needed
    }
};

module.exports = getConversation;
