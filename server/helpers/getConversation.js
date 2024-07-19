const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (currentUserId) => {
    if (currentUserId) {
        const currentUserConversation = await ConversationModel.find({
            "$or": [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        }).sort({ updatedAt: -1 }).populate('messages').populate('sender').populate('receiver');

        const conversation = currentUserConversation.map((conv) => {
            const countUnseenMsg = conv?.messages?.reduce((prev, curr) => {
                if (curr?.msgByUserId.toString() !== currentUserId) {
                    return prev + (curr?.seen ? 0 : 1);
                }
                return prev;
            }, 0);

            const lastMessage = conv.messages[conv?.messages?.length - 1];

            return {
                _id: conv?._id,
                sender: conv?.sender,
                receiver: conv?.receiver,
                unseenMsg: countUnseenMsg,
                lastMsg: {
                    text: lastMessage?.text,
                    imageUrl: lastMessage?.imageUrl,
                    videoUrl: lastMessage?.videoUrl,
                    documentUrl: lastMessage?.documentUrl, // Include document URL
                    documentName: lastMessage?.documentName, // Include document name
                    msgByUserId: lastMessage?.msgByUserId,
                    seen: lastMessage?.seen,
                    createdAt: lastMessage?.createdAt,
                    updatedAt: lastMessage?.updatedAt,
                }
            };
        });

        return conversation;
    } else {
        return [];
    }
};

module.exports = getConversation;
