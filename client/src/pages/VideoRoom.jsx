import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, MonitorUp } from 'lucide-react';

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function VideoRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [peers, setPeers] = useState([]);
    const [stream, setStream] = useState();
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);

    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);

    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL);

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }

            socketRef.current.emit("join-room", roomId, socketRef.current.id);

            socketRef.current.on("user-connected", (userId) => {
                console.log("New user connected", userId);
                const peer = createPeer(userId, socketRef.current.id, currentStream);
                peersRef.current.push({
                    peerID: userId,
                    peer,
                });
                setPeers([...peersRef.current]);
            });

            socketRef.current.on("receive-call", (payload) => {
                const peer = addPeer(payload.signal, payload.from, currentStream);
                peersRef.current.push({
                    peerID: payload.from,
                    peer,
                });
                setPeers([...peersRef.current]);
            });

            socketRef.current.on("call-accepted", (signal) => {
                const item = peersRef.current.find((p) => p.peerID === signal.id);
                if (item && item.peer) {
                    // We normally signal back, handled by simple-peer internals if hooked up correctly
                }
            });

            socketRef.current.on("user-disconnected", userId => {
                const peerObj = peersRef.current.find(p => p.peerID === userId);
                if (peerObj) {
                    peerObj.peer.destroy();
                }
                const updatedPeers = peersRef.current.filter(p => p.peerID !== userId);
                peersRef.current = updatedPeers;
                setPeers(updatedPeers);
            });
        }).catch(err => {
            console.error("Failed to get local stream", err);
        });

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            socketRef.current.disconnect();
        };
    }, [roomId]);

    function createPeer(userToCall, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("call-user", {
                userToCall,
                callerID,
                signalData: signal,
            });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("answer-call", { signal, to: callerID });
        });

        peer.signal(incomingSignal);

        return peer;
    }

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setIsVideoMuted(!stream.getVideoTracks()[0].enabled);
        }
    };

    const toggleAudio = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setIsAudioMuted(!stream.getAudioTracks()[0].enabled);
        }
    };

    const leaveRoom = () => {
        navigate("/");
    };

    return (
        <div className="bg-[#F4F2F1] min-h-[calc(100vh-68px)] py-6">
            <div className="max-w-[1100px] mx-auto px-5">
                <div className="bg-white border border-[#E6E2E0] rounded-[20px] px-5 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2E2C2A] pulse-live" />
                        <h2 className="text-[15px] font-extrabold">Live Peer Room</h2>
                        <span className="text-[12px] font-mono text-[#9E9894] bg-[#F4F2F1] px-2.5 py-1 rounded-lg">{roomId}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-[#9E9894]">{peers.length + 1} connected</span>
                </div>

                <div className="grid gap-4 mt-5 grid-cols-1 md:grid-cols-2">
                    <motion.div
                        layoutId="local-video"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-[#2E2C2A] rounded-[20px] overflow-hidden border border-[#4F4945] aspect-video"
                    >
                        <video
                            autoPlay
                            muted
                            ref={userVideo}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoMuted ? 'opacity-0' : 'opacity-100'}`}
                        />
                        {isVideoMuted && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#4F4945]">
                                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">You</span>
                                </div>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg">
                            <span className="text-white text-[13px] font-bold">You</span>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {peers.map((peerObj, index) => {
                            return (
                                <PeerVideo key={peerObj.peerID} peer={peerObj.peer} id={peerObj.peerID} />
                            )
                        })}
                    </AnimatePresence>
                </div>

                <div className="flex justify-center mt-6">
                <div className="flex items-center gap-3 bg-white border border-[#E6E2E0] px-4 py-3 rounded-[20px]">
                    <button
                        onClick={toggleAudio}
                        className={`p-3.5 rounded-xl ${isAudioMuted ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#F4F2F1] hover:bg-[#E6E2E0]'}`}
                    >
                        {isAudioMuted ? <MicOff /> : <Mic />}
                    </button>
                    <button
                        onClick={toggleVideo}
                        className={`p-3.5 rounded-xl ${isVideoMuted ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#F4F2F1] hover:bg-[#E6E2E0]'}`}
                    >
                        {isVideoMuted ? <VideoOff /> : <VideoIcon />}
                    </button>
                    <button className="p-3.5 rounded-xl bg-[#F4F2F1]">
                        <MonitorUp className="text-[#4F4945]" />
                    </button>
                    <button
                        onClick={leaveRoom}
                        className="px-5 py-3.5 rounded-xl bg-[#2E2C2A] text-white font-bold text-[13.5px] flex items-center gap-2"
                    >
                        <PhoneOff className="w-5 h-5" />
                        Leave Session
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}

const PeerVideo = ({ peer, id }) => {
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <div
            className="relative bg-[#2E2C2A] rounded-[20px] overflow-hidden border border-[#4F4945] aspect-video"
        >
            <video playsInline autoPlay ref={ref} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg">
                <span className="text-white text-[13px] font-bold">Peer {id.substring(0, 4)}</span>
            </div>
        </div>
    );
}

