import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "./messageSlice";
import { useToast } from "@/hooks/use-toast";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  // const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Initialize socket but don't connect immediately
    socketRef.current = io("http://localhost:3000", {
      autoConnect: false,
    });

    const socket = socketRef.current;

    if (token && user && user.id) {
      // Attach auth token before connecting
      socket.auth = { token };
      socket.connect();

      // Register user ID after connect
      socket.on("connect", () => {
        setIsConnected(true);
        socket.emit("register", user.id);
      });

      // Listen for new messages
      socket.on("newMessage", (msg) => {
        dispatch(addMessage(msg));
        {
          msg.sender?.id != user.id &&
            toast({
              title: `message from ${msg.sender.name}`,
              description: msg.content
            });
        }
      });

      // Optional: handle disconnect
      socket.on("disconnect", () => {
        setIsConnected(false);
      });
    }

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("newMessage");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [user, token, dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
