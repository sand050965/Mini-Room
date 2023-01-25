const socket = io("/");
let myStream;
const peers = {};
let cnt = 1;
const myVideo = document.createElement("video");
myVideo.muted = true;
const videoContainer = document.querySelector("#videoContainer");
const audioBtn = document.querySelector("#audioBtn");
const audioBtnIcon = document.querySelector("#audioBtnIcon");
const videoBtn = document.querySelector("#videoBtn");
const videoBtnIcon = document.querySelector("#videoBtnIcon");
const shareBtn = document.querySelector("#shareBtn");
const infoBtn = document.querySelector("#infoBtn");
const participantsBtn = document.querySelector("#participantsBtn");
const chatBtn = document.querySelector("#chatBtn");
const btnsArray = [
  videoBtn,
  audioBtn,
  shareBtn,
  infoBtn,
  participantsBtn,
  chatBtn,
];

const peer = new Peer(USER_ID, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

const init = async () => {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const videoItem = document.createElement("div");
    addStream(myVideo, myStream, videoItem);
  } catch (e) {}
};

const videoGridStyle = (item, video) => {
  if (cnt === 1) {
    item.classList.add("item");
    item.classList.add("one-video-container");
    item.setAttribute("id", "firstVideoItem");
    video.classList.add("one-video");
    video.classList.add("video-rotate");
    video.setAttribute("id", "firstVideo");
  } else if (cnt === 2) {
    const firstVideoItem = document.querySelector("#firstVideoItem");
    const firstVideo = document.querySelector("#firstVideo");
    item.classList.add("item");
    firstVideoItem.classList.remove("one-video-container");
    firstVideoItem.classList.add("two-video-container");
    item.classList.add("one-video-container");
    item.setAttribute("id", "secondVideo");
    video.classList.add("one-video");
    video.classList.remove("one-video");
    video.classList.add("more-video");
  } else {
    const firstVideoItem = document.querySelector("#firstVideoItem");
    const secondVideoItem = document.querySelector("#secondVideoItem");
    firstVideoItem.classList.remove("two-video-container");
    secondVideoItem.classList.remove("one-video-container");
    item.classList.add("item");
    item.classList.add("more-video-grid");
    video.classList.add("more-video");
  }
};

const btnControl = (e) => {
  // Modal Display
  // if (!audioAuth) {
  //   modal.show();
  //   return;
  // } else if (!videoAuth) {
  //   modal.show();
  //   return;
  // }

  if (e.target.id.includes("audioBtn")) {
    muteUnmute();
  } else if (e.target.id.includes("videoBtn")) {
    playStopVideo();
  } else if (e.target.id.includes("shareBtn")) {
  } else if (e.target.id.includes("leaveBtn")) {
  } else if (e.target.id.includes("infoBtn")) {
  } else if (e.target.id.includes("participantsBtn")) {
  } else if (e.target.id.includes("chatBtn")) {
  }
};

// Mute and Unmute
const muteUnmute = () => {
  const enabled = myStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myStream.getAudioTracks()[0].enabled = false;
    mute();
  } else {
    myStream.getAudioTracks()[0].enabled = true;
    unmute();
  }
};

const unmute = () => {
  audioBtnIcon.classList.add("fa-microphone");
  audioBtnIcon.classList.remove("fa-microphone-slash");
  audioBtn.classList.remove("btn-disable");
  audioBtn.classList.add("btn-able");
};

const mute = () => {
  audioBtnIcon.classList.remove("fa-microphone");
  audioBtnIcon.classList.add("fa-microphone-slash");
  audioBtn.classList.remove("btn-able");
  audioBtn.classList.add("btn-disable");
};

// Play and Stop Video
const playStopVideo = () => {
  const enabled = myStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myStream.getVideoTracks()[0].enabled = false;
    stopVideo();
  } else {
    myStream.getVideoTracks()[0].enabled = true;
    playVideo();
  }
};

const playVideo = () => {
  videoContainer.classList.remove("none");
  // avatarContainer.classList.add("none");
  videoBtnIcon.classList.remove("fa-video-slash");
  videoBtnIcon.classList.add("fa-video");
  videoBtn.classList.remove("btn-disable");
  videoBtn.classList.add("btn-able");
};

const stopVideo = () => {
  videoContainer.classList.add("none");
  // avatarContainer.classList.remove("none");
  videoBtnIcon.classList.remove("fa-video");
  videoBtnIcon.classList.add("fa-video-slash");
  videoBtn.classList.remove("btn-able");
  videoBtn.classList.add("btn-disable");
};



// Socket IO & Peer JS
// Receive Other User's Stream (Listen to one we get call)
peer.on("call", (call) => {
  // Answer call
  call.answer(myStream);

  // Respond to stream that comes in
  const videoItem = document.createElement("div");
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addStream(video, userVideoStream, videoItem);
  });
});

// New user connected
socket.on("user-connected", (userId) => {
  cnt++;
  connectToNewUser(userId, myStream);
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) {
    peers[userId].close();
  }
});

const addStream = (video, stream, item) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  item.appendChild(video);
  item.classList.add("item");
  videoGridStyle(item, video);
  videoContainer.append(item);
};

// // Make Call
const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const videoItem = document.createElement("div");
  const video = document.createElement("video");

  // Receive Other User's Stream (Listen to someone try to call us)
  call.on("stream", (userVideoStream) => {
    addStream(video, userVideoStream, videoItem);
  });

  call.on("close", () => {
    video.remove();
  });

  // ********* peers need to go to db and refresh when someone comes in
  peers[userId] = call;
};

window.addEventListener("load", init);

for (const btn of btnsArray) {
  btn.addEventListener("click", btnControl);
}
