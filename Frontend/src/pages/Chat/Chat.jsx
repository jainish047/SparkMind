import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { api } from "../../API/axiosConfig";
import {
  setContacts,
  setMessages,
  setCurrentChatUser,
  addMessage,
} from "../../context/messageSlice";
import { useSocket } from "../../context/SocketProvide";
import PleaseLogin from "../authentication/PleaseLogin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../../components/ui/button";
import { MoreVertical } from "lucide-react";

export default function ChatPage() {
  const currentUserId = useSelector((state) => state.auth.user?.id || null);
  const [content, setContent] = useState("");
  const { messages, contacts, currentChatUser } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();
  const socket = useSocket();

  // Fetch conversations (contacts)
  useEffect(() => {
    if (currentUserId) {
      api
        .get(`/messages/${currentUserId}/conversations`)
        .then((res) => {
          console.log("contacts API response", res.data); // 👈 Check if it's array
          dispatch(setContacts(res.data));
        })
        .catch((err) => console.error(err));
    }
  }, [currentUserId, dispatch]);

  // When a chat is selected, load its messages
  useEffect(() => {
    if (currentUserId && currentChatUser) {
      api
        .get(`/messages/${currentUserId}/${currentChatUser.id}`)
        .then((res) => dispatch(setMessages(res.data)))
        .catch((err) => console.error(err));
    }
  }, [currentUserId, currentChatUser, dispatch]);

  const sendMessage = () => {
    if (!currentChatUser || !content.trim()) return;
    socket.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: currentChatUser.id,
      content,
    });
    // Optionally, update local state immediately
    // dispatch(
    //   addMessage({
    //     senderId: currentUserId,
    //     receiverId: currentChatUser.id,
    //     content,
    //     createdAt: new Date(),
    //   })
    // );
    setContent("");
  };

  if (!currentUserId) {
    return <PleaseLogin />;
  }

  return (
    <div className="flex h-full">
      {/* Contacts Sidebar */}
      {contacts.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-gray-500">No contacts available</p>
        </div>
      ) : (
        <div className="w-1/4 border-r flex flex-col overflow-y-auto  p-1 gap-2">
          {contacts.map(({ user, lastMessage }) => (
            <div
              key={user.id}
              onClick={() => dispatch(setCurrentChatUser(user))}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 flex gap-3 items-center ${
                currentChatUser?.id === user.id ? "bg-gray-200" : "border"
              }`}
            >
              <Avatar>
                <AvatarImage
                  className="w-10 h-10 cursor-pointer"
                  src={
                    user?.profilePic ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${
                      user?.name || user?.companyName || user?.email
                    }`
                  }
                />
                <AvatarFallback>{(user.name || "U")[0]}</AvatarFallback>
              </Avatar>
              <div className="">
                <div className="font-bold">{user.name}</div>
                <div className="text-sm text-gray-600 truncate">
                  {lastMessage?.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {currentChatUser && (
          <header className="flex p-2 border-b justify-between">
            <div className="flex justify-center items-center gap-2">
              <Avatar>
                <AvatarImage
                  className="w-10 h-10 cursor-pointer"
                  src={
                    currentChatUser?.profilePic ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${
                      currentChatUser?.name ||
                      currentChatUser?.companyName ||
                      currentChatUser?.email
                    }`
                  }
                />
                <AvatarFallback>
                  {(currentChatUser?.name || "U")[0]}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold text-lg">{currentChatUser?.name}</p>
            </div>
            <Button variant="outline" className="p-2 rounded hover:bg-gray-100">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </Button>
          </header>
        )}
        <div className="flex flex-col-reverse overflow-y-auto h-full p-4 gap-0">
          {messages
            .slice()
            .reverse()
            .map((msg, idx) => (
              <div
                className={`${
                  msg.senderId !== currentUserId
                    ? "flex justify-start"
                    : "flex justify-start flex-row-reverse"
                } items-end p-2 gap-2`}
              >
                <div
                  key={idx}
                  className={`w-fit max-w-xl p-2 rounded-lg text-black ${
                    msg.senderId === currentUserId
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-100 text-black self-start"
                  }`}
                >
                  {msg.content}
                </div>
                <p className="text-xs text-slate-500">
                  {String(msg.createdAt.split("T")[1].split(".")[0]) +
                    " " +
                    (new Date(msg.createdAt).toDateString() ===
                    new Date().toDateString()
                      ? ""
                      : String(new Date(msg.createdAt).toDateString()))}
                </p>
              </div>
            ))}
        </div>
        {currentChatUser && (
          <div className="flex p-2 border-t">
            <input
              className="flex-1 p-2 border rounded-lg"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
