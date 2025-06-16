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
      className="min-h-screen flex flex-col p-4 relative overflow-hidden"
      style={{ 
        backgroundColor: '#f4f7fa',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(18, 52, 88, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(184, 200, 217, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(212, 201, 190, 0.04) 0%, transparent 50%)
        `
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10 animate-pulse"
          style={{ 
            backgroundColor: '#123458',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-5 animate-pulse"
          style={{ 
            backgroundColor: '#B8C8D9',
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        />
        <div 
          className="absolute top-1/2 left-10 w-24 h-24 rounded-full opacity-8 animate-pulse"
          style={{ 
            backgroundColor: '#D4C9BE',
            animation: 'float 7s ease-in-out infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(18, 52, 88, 0.3); }
          50% { box-shadow: 0 0 40px rgba(18, 52, 88, 0.5), 0 0 60px rgba(18, 52, 88, 0.2); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: #B8C8D9; }
          50% { border-color: #123458; }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div 
        className="w-full rounded-2xl shadow-2xl p-6 mb-6 relative overflow-hidden animate-glow"
        style={{ 
          background: 'linear-gradient(135deg, #123458 0%, #1e4976 50%, #B8C8D9 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full animate-pulse" />
        <h2 
          className="text-center text-3xl font-bold tracking-wide relative z-10"
          style={{ 
            color: '#f4f7fa',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.5px'
          }}
        >
          🎥 Video Calling 
        </h2>
        <div 
          className="text-center text-lg mt-2 opacity-90 relative z-10"
          style={{ color: '#f4f7fa' }}
        >
          Connect with anyone, anywhere
        </div>
      </div>

      {/* Control Section - All in One Row */}
      <div 
        className="w-full rounded-2xl shadow-xl p-6 mb-6 backdrop-blur-sm relative overflow-hidden"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          border: '2px solid #B8C8D9',
          boxShadow: '0 20px 40px rgba(18, 52, 88, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-#123458 via-#B8C8D9 to-#123458" />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
          {/* Enter User ID Section */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold mb-2" style={{ color: '#123458' }}>
              🆔 Enter User ID to Connect
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID..."
                className="flex-1 px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 text-base font-medium animate-pulse-border"
                style={{ 
                  borderColor: '#B8C8D9',
                  backgroundColor: '#ffffff',
                  color: '#123458',
                  boxShadow: '0 4px 8px rgba(18, 52, 88, 0.1)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#123458';
                  e.target.style.boxShadow = '0 0 0 4px rgba(18, 52, 88, 0.1), 0 4px 8px rgba(18, 52, 88, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#B8C8D9';
                  e.target.style.boxShadow = '0 4px 8px rgba(18, 52, 88, 0.1)';
                }}
              />
              <button
                onClick={initiateCall}
                disabled={!stream}
                className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{ 
                  backgroundColor: '#123458',
                  boxShadow: '0 4px 12px rgba(18, 52, 88, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = '#0f2a47';
                    e.target.style.boxShadow = '0 6px 16px rgba(18, 52, 88, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = '#123458';
                    e.target.style.boxShadow = '0 4px 12px rgba(18, 52, 88, 0.4)';
                  }
                }}
              >
                <FaPhone className="inline mr-2" />
                Call
              </button>
            </div>
          </div>

          {/* My ID Section */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: '#123458' }}>
              📱 My ID
            </label>
            <div 
              className="font-mono px-4 py-3 rounded-xl text-center break-all"
              style={{ 
                backgroundColor: '#D4C9BE',
                color: '#123458',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: '2px solid rgba(18, 52, 88, 0.1)',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {socket?.id || 'Connecting...'}
            </div>
          </div>
          
          {/* Status Section */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: '#123458' }}>
              📡 Connection Status
            </label>
            <div
              className="font-bold px-4 py-3 rounded-xl text-center relative overflow-hidden"
              style={{
                backgroundColor: connectionStatus === "connected" 
                  ? '#22c55e' 
                  : connectionStatus === "error" 
                  ? '#ef4444' 
                  : '#B8C8D9',
                color: connectionStatus === "connected" || connectionStatus === "error" 
                  ? '#ffffff' 
                  : '#123458',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {connectionStatus === "connected" && <span className="mr-2">🟢</span>}
              {connectionStatus === "error" && <span className="mr-2">🔴</span>}
              {connectionStatus === "disconnected" && <span className="mr-2">⚪</span>}
              {connectionStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Video Section - Full Screen Utilization */}
      <div className="flex-1 flex gap-4 mb-6">
        {/* My Video */}
        <div 
          className={`${isCallAccepted ? 'w-1/2' : 'w-full'} rounded-2xl shadow-2xl p-4 backdrop-blur-sm relative overflow-hidden group`}
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: '2px solid #B8C8D9',
            boxShadow: '0 20px 40px rgba(18, 52, 88, 0.15)'
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-#123458 to-#B8C8D9" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">👤</span>
              <h3 
                className="text-xl font-bold"
                style={{ color: '#123458' }}
              >
                My Video
              </h3>
            </div>
            
            {/* Video Controls */}
            <div className="flex gap-2">
              <button
                onClick={toggleMicrophone}
                className="p-3 rounded-full text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg relative overflow-hidden group"
                style={{
                  backgroundColor: isMicOn ? '#22c55e' : '#ef4444',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {isMicOn ? <FaMicrophone size={16} /> : <FaMicrophoneSlash size={16} />}
              </button>
              <button
                onClick={toggleVideo}
                className="p-3 rounded-full text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg relative overflow-hidden group"
                style={{
                  backgroundColor: isVideoOn ? '#22c55e' : '#ef4444',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {isVideoOn ? <FaVideo size={16} /> : <FaVideoSlash size={16} />}
              </button>
            </div>
          </div>
          
          <div className="relative group h-full">
            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full rounded-xl shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
              style={{ 
                border: '3px solid #D4C9BE',
                objectFit: 'cover',
                minHeight: '400px'
              }}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none" />
            
            {!isVideoOn && (
              <div 
                className="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(18, 52, 88, 0.85)' }}
              >
                <div className="text-center">
                  <FaVideoSlash size={64} color="#f4f7fa" className="mb-4 mx-auto" />
                  <p className="text-white text-xl font-semibold">Camera Off</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Peer Video */}
        {isCallAccepted && (
          <div 
            className="w-1/2 rounded-2xl shadow-2xl p-4 backdrop-blur-sm relative overflow-hidden animate-pulse-border"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '2px solid #B8C8D9',
              boxShadow: '0 20px 40px rgba(18, 52, 88, 0.15)'
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-#22c55e to-#123458" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">👥</span>
                <h3 
                  className="text-xl font-bold"
                  style={{ color: '#123458' }}
                >
                  Peer Video
                </h3>
              </div>
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                LIVE
              </div>
            </div>
            
            <div className="relative h-full">
              <video
                ref={peerVideoRef}
                autoPlay
                playsInline
                muted={false}
                className="w-full h-full rounded-xl shadow-xl"
                style={{ 
                  border: '3px solid #22c55e',
                  objectFit: 'cover',
                  minHeight: '400px'
                }}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Call Actions */}
      <div className="flex justify-center">
        {isCallAccepted ? (
          <button 
            onClick={endCall}
            className="px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
            style={{ 
              backgroundColor: '#ef4444',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.5)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626';
              e.target.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.5)';
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <FaPhoneSlash className="inline mr-3 text-xl" />
            <span className="relative z-10">🔚 End Call</span>
          </button>
        ) : (
          incominCallInfo?.isSomeoneCalling && (
            <div 
              className="w-full max-w-lg rounded-2xl shadow-2xl p-6 backdrop-blur-sm relative overflow-hidden animate-pulse"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '3px solid #22c55e',
                boxShadow: '0 24px 48px rgba(18, 52, 88, 0.2), 0 0 40px rgba(34, 197, 94, 0.3)'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-#22c55e via-#123458 to-#22c55e animate-pulse" />
              
              <div 
                className="text-center mb-6 p-4 rounded-xl relative overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(244, 247, 250, 0.8)', 
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  boxShadow: '0 8px 16px rgba(34, 197, 94, 0.1)'
                }}
              >
                <div className="text-4xl mb-3 animate-bounce">📞</div>
                <div style={{ color: '#123458', fontSize: '1.2rem', fontWeight: '700' }}>
                  <div className="mb-2">Incoming Call from:</div>
                  <div 
                    className="px-3 py-2 rounded-xl inline-block text-lg font-bold"
                    style={{ 
                      backgroundColor: '#22c55e', 
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    {incominCallInfo?.from}
                  </div>
                </div>
                <div className="mt-3 text-base font-semibold animate-pulse" style={{ color: '#123458' }}>
                  🎵 Ring... Ring... Ring...
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={answerCall}
                  className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden group"
                  style={{ 
                    backgroundColor: '#22c55e',
                    boxShadow: '0 6px 18px rgba(34, 197, 94, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <FaPhone className="inline mr-2" />
                  <span className="relative z-10">✅ Answer</span>
                </button>
                <button
                  onClick={() => setIncominCallInfo({})}
                  className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden group"
                  style={{ 
                    backgroundColor: '#ef4444',
                    boxShadow: '0 6px 18px rgba(239, 68, 68, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <FaPhoneSlash className="inline mr-2" />
                  <span className="relative z-10">❌ Decline</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default VideoCall;