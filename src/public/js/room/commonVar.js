let myStream = null;

let myScreenShareStream = null;

let cnt = 1;

let beforeCnt = 1;

let loadedCnt = 0;

let isLoseTrack = false;

let isOffcanvasOpen = false;

let isScreenSharing = false;

const socket = io("/");

const peer = new Peer(PARTICIPANT_ID);

const peers = {};

const offcanvasMap = new Map();

const screenShareMap = new Map();

const participantMap = new Map();

const inviteListArray = [];