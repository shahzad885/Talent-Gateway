import React, { useState, useEffect, useRef } from "react";
import {
  FaPhone,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import io from "socket.io-client";
import SimplePeer from "simple-peer/simplepeer.min.js";
import "../../App.css";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket", "polling"],
});

const VideoCall = () => {
  const myVideoRef = useRef();
  const peerVideoRef = useRef();
  const connectionRef = useRef();

  const [stream, setStream] = useState(null);
  const [userId, setUserId] = useState("");
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [incominCallInfo, setIncominCallInfo] = useState({});
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  useEffect(() => {
    // Request both video and audio with explicit constraints
    const mediaConstraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
      },
    };

    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((mediaStream) => {
        console.log("Media stream obtained:", mediaStream);
        console.log("Audio tracks:", mediaStream.getAudioTracks());
        console.log("Video tracks:", mediaStream.getVideoTracks());

        setStream(mediaStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }

        // Verify audio tracks are enabled
        mediaStream.getAudioTracks().forEach((track) => {
          console.log("Audio track enabled:", track.enabled);
          console.log("Audio track readyState:", track.readyState);
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        // Fallback to audio only if video fails
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((audioStream) => {
            console.log("Audio-only stream obtained");
            setStream(audioStream);
          })
          .catch((audioError) => {
            console.error("Error accessing audio:", audioError);
          });
      });

    socket.on("incomingCall", handleIncomingCall);
    socket.on("callEnded", destroyConnection);

    return () => {
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callEnded", destroyConnection);
      // Clean up media stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleIncomingCall = ({ from, signalData }) => {
    console.log("Incoming call from:", from);
    setIncominCallInfo({ isSomeoneCalling: true, from, signalData });
  };

  const initiateCall = () => {
    if (!userId) {
      alert("Please enter user ID to initiate a call");
      return;
    }

    if (!stream) {
      alert(
        "Media stream not available. Please check your camera/microphone permissions."
      );
      return;
    }

    console.log("Initiating call with stream:", stream);
    console.log("Stream tracks:", stream.getTracks());

    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("signal", (signalData) => {
      console.log("Sending signal data:", signalData);
      socket.emit("initiateCall", { userId, signalData, myId: socket?.id });
    });

    peer.on("stream", (remoteStream) => {
      console.log("Received remote stream:", remoteStream);
      console.log("Remote audio tracks:", remoteStream.getAudioTracks());
      console.log("Remote video tracks:", remoteStream.getVideoTracks());

      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = remoteStream;
        // Ensure audio is not muted on the peer video element
        peerVideoRef.current.muted = false;
      }
    });

    peer.on("connect", () => {
      console.log("Peer connection established");
      setConnectionStatus("connected");
    });

    peer.on("error", (error) => {
      console.error("Peer connection error:", error);
      setConnectionStatus("error");
    });

    socket.on("callAccepted", (signal) => {
      console.log("Call accepted, signaling peer");
      setIsCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    if (!stream) {
      alert(
        "Media stream not available. Please check your camera/microphone permissions."
      );
      return;
    }

    console.log("Answering call with stream:", stream);
    setIsCallAccepted(true);

    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("signal", (data) => {
      console.log("Sending answer signal:", data);
      socket.emit("answerCall", { signal: data, to: incominCallInfo.from });
    });

    peer.on("stream", (currentStream) => {
      console.log("Received stream in answer:", currentStream);
      console.log("Remote audio tracks:", currentStream.getAudioTracks());
      console.log("Remote video tracks:", currentStream.getVideoTracks());

      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = currentStream;
        // Ensure audio is not muted
        peerVideoRef.current.muted = false;
      }
    });

    peer.on("connect", () => {
      console.log("Peer connection established (answer)");
      setConnectionStatus("connected");
    });

    peer.on("error", (error) => {
      console.error("Peer connection error (answer):", error);
      setConnectionStatus("error");
    });

    peer.signal(incominCallInfo.signalData);
    connectionRef.current = peer;
  };

  const toggleMicrophone = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
      console.log("Microphone toggled:", !isMicOn);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
      console.log("Video toggled:", !isVideoOn);
    }
  };

  const endCall = () => {
    socket.emit("endCall", { to: incominCallInfo.from });
    destroyConnection();
  };

  const destroyConnection = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    setIsCallAccepted(false);
    setIncominCallInfo({});
    setConnectionStatus("disconnected");

    // Clean up and restart media stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Restart media stream for next call
    const mediaConstraints = {
      video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: { echoCancellation: true, noiseSuppression: true },
    };

    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((newStream) => {
        setStream(newStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = newStream;
        }
      })
      .catch((error) => console.error("Error restarting media:", error));
  };

  return (
    <div 
      className="flex flex-col min-h-screen p-4" 
      style={{ backgroundColor: '#f4f7fa' }}
    >
      <h2 
        className="text-center text-3xl font-bold mb-6" 
        style={{ color: '#123458' }}
      >
        Video Calling
      </h2>

      {/* Controls Row - ID input, My ID, and Status in one row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: 'white', border: '2px solid #B8C8D9' }}>
        {/* Left: ID Input and Call Button */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
            className="px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ 
              borderColor: '#B8C8D9', 
              backgroundColor: 'white',
              color: '#123458',
              minWidth: '200px'
            }}
          />
          <button
            onClick={initiateCall}
            className="px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#123458' }}
            disabled={!stream}
          >
            Call
          </button>
        </div>

        {/* Center: My ID */}
        <div 
          className="px-4 py-2 rounded-lg text-center"
          style={{ backgroundColor: '#D4C9BE', color: '#123458' }}
        >
          <span className="font-semibold">My ID: </span>
          <span className="font-mono text-sm">{socket?.id}</span>
        </div>

        {/* Right: Connection Status */}
        <div className="flex items-center gap-2">
          <span style={{ color: '#123458' }}>Status:</span>
          <span
            className={`font-bold px-3 py-1 rounded-full text-sm ${
              connectionStatus === "connected"
                ? "bg-green-100 text-green-800"
                : connectionStatus === "error"
                ? "bg-red-100 text-red-800"
                : "text-gray-600"
            }`}
            style={{
              backgroundColor: connectionStatus === "disconnected" ? '#B8C8D9' : undefined,
              color: connectionStatus === "disconnected" ? '#123458' : undefined
            }}
          >
            {connectionStatus}
          </span>
        </div>
      </div>

      {/* Video Section - Takes up most of the screen */}
      <div className="flex-1 flex gap-4 mb-6">
        {/* My Video - Takes full available space when alone, half when peer is connected */}
        <div className={`flex flex-col ${isCallAccepted ? 'w-1/2' : 'w-full'}`}>
          <h3 
            className="text-center text-xl font-semibold mb-3" 
            style={{ color: '#123458' }}
          >
            My Video
          </h3>
          <div 
            className="flex-1 p-3 rounded-lg shadow-lg"
            style={{ backgroundColor: 'white', border: '2px solid #B8C8D9' }}
          >
            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg"
              style={{ minHeight: '400px' }}
            />
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={toggleMicrophone}
              className="p-3 rounded-full text-white transition-all duration-200 hover:opacity-90 shadow-md"
              style={{ backgroundColor: isMicOn ? '#123458' : '#B8C8D9' }}
            >
              {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>
            <button
              onClick={toggleVideo}
              className="p-3 rounded-full text-white transition-all duration-200 hover:opacity-90 shadow-md"
              style={{ backgroundColor: isVideoOn ? '#123458' : '#B8C8D9' }}
            >
              {isVideoOn ? <FaVideo /> : <FaVideoSlash />}
            </button>
          </div>
        </div>

        {/* Peer Video - Only shows when call is accepted */}
        {isCallAccepted && (
          <div className="w-1/2 flex flex-col">
            <h3 
              className="text-center text-xl font-semibold mb-3" 
              style={{ color: '#123458' }}
            >
              Peer Video
            </h3>
            <div 
              className="flex-1 p-3 rounded-lg shadow-lg"
              style={{ backgroundColor: 'white', border: '2px solid #B8C8D9' }}
            >
              <video
                ref={peerVideoRef}
                autoPlay
                playsInline
                muted={false}
                className="w-full h-full object-cover rounded-lg"
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      {isCallAccepted ? (
        <div className="text-center">
          <button 
            className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 flex items-center justify-center mx-auto"
            onClick={endCall}
            style={{ backgroundColor: '#B8C8D9' }}
          >
            <FaPhoneSlash className="inline mr-2" />
            End Call
          </button>
        </div>
      ) : (
        incominCallInfo?.isSomeoneCalling && (
          <div className="text-center">
            <div 
              className="mb-4 p-4 rounded-lg font-semibold inline-block"
              style={{ backgroundColor: '#D4C9BE', color: '#123458' }}
            >
              <span className="text-lg">{incominCallInfo?.from}</span> is calling
            </div>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={answerCall} 
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 flex items-center"
                style={{ backgroundColor: '#123458' }}
              >
                <FaPhone className="inline mr-2" />
                Answer
              </button>
              <button
                onClick={() => setIncominCallInfo({})}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 flex items-center"
                style={{ backgroundColor: '#B8C8D9' }}
              >
                <FaPhoneSlash className="inline mr-2" />
                Decline
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default VideoCall;