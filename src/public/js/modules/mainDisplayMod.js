import StreamMod from "../modules/streamMod.js";
import OffcanvasMod from "../modules/offcanvasMod.js";
import ParticipantMod from "../modules/participantMod.js";
import { preload } from "../modules/commonMod.js";

class MainDisplayMod {
  constructor() {
    this.streamMod = new StreamMod();
    this.offcanvasMod = new OffcanvasMod();
    this.participantMod = new ParticipantMod();
  }

  addRoomStream = async (DOMElement) => {
    const stream = DOMElement.stream;
    const video = DOMElement.video;
    video.srcObject = stream;

    // avatar style
    const avatarDOMElement = await this.setRoomAvatarAttribute(DOMElement);
    await this.setRoomAvatarStyle(avatarDOMElement);

    // video grid style
    const videoDOMElement = await this.setRoomVideoAttribute(DOMElement);
    await this.setRoomVideoGridStyle(videoDOMElement);
    await this.listenOnVideoStream(DOMElement);
  };

  setRoomAvatarAttribute = (DOMElement) => {
    let avatarDOMElement = {
      otherAvatarContainers: [],
      otherAvatars: [],
    };
    const avatarContainer = DOMElement.avatarContainer;
    const avatarContent = DOMElement.avatarContent;
    const avatar = DOMElement.avatar;
    const avatarImg = DOMElement.avatarImg;
    const userId = DOMElement.userId;

    // append and add common style
    avatar.classList.add("center");
    avatarContainer.classList.add("center");
    avatar.appendChild(avatarImg);
    avatarContent.appendChild(avatar);
    avatarContent.classList.add("center");
    avatarContainer.appendChild(avatarContent);

    avatarImg.setAttribute(
      "src",
      "https://s3.amazonaws.com/www.miniroom.online/images/avatar.png"
    );

    // set DOM element id and name attributes
    if (userId === USER_ID) {
      avatarContainer.setAttribute("id", "selfAvatarContainer");
      avatarContent.setAttribute("id", "selfAvatarContent");
      avatar.setAttribute("id", "selfAvatar");
      avatarImg.setAttribute("id", "selfAvatarImg");
      avatarDOMElement.selfAvatarContainer = avatarContainer;
      avatarDOMElement.selfAvatarContent = avatarContent;
      avatarDOMElement.selfAvatar = avatar;
    } else {
      avatarContainer.setAttribute("id", `${userId}AvatarContainer`);
      avatarContent.setAttribute("id", `${userId}AvatarContent`);
      avatar.setAttribute("id", `${userId}Avatar`);
      avatarImg.setAttribute("id", `${userId}AvatarImg`);
      avatarDOMElement.otherAvatarContainers = [avatarContainer];
      avatarDOMElement.otherAvatars = [avatarContent];
    }
    return avatarDOMElement;
  };

  setRoomVideoAttribute = (DOMElement) => {
    const videoElement = {
      otherVideoItemContainers: [],
      otherVideoItems: [],
      otherVideos: [],
    };
    const videosContainer = document.querySelector("#videosContainer");
    const videoItemContainer = DOMElement.videoItemContainer;
    const videoItem = DOMElement.videoItem;
    const video = DOMElement.video;
    const avatarContainer = DOMElement.avatarContainer;
    const nameTag = DOMElement.nameTag;
    const userName = DOMElement.userName;
    const userId = DOMElement.userId;

    // append and add common class
    video.classList.add("none");
    videoItem.appendChild(video);
    videoItem.classList.add("center");
    nameTag.textContent = userName;
    nameTag.classList.add("name-tag");
    videoItem.appendChild(avatarContainer);
    videoItem.appendChild(nameTag);
    videoItemContainer.appendChild(videoItem);
    videoItemContainer.classList.add("center");
    videosContainer.append(videoItemContainer);

    // set DOM element id and name attributes
    if (userId === USER_ID) {
      videoItemContainer.setAttribute("id", "selfVideoItemContainer");
      videoItem.setAttribute("id", "selfVideoItem");
      video.setAttribute("id", "selfVideo");
      videoElement.selfVideoItemContainer = videoItemContainer;
      videoElement.selfVideoItem = videoItem;
      videoElement.selfVideo = video;
    } else {
      videoItemContainer.setAttribute("id", `${userId}VideoItemContainer`);
      videoItemContainer.setAttribute("name", "otherVideoItemContainer");
      videoItem.setAttribute("id", `${userId}VideoItem`);
      videoItem.setAttribute("name", "otherVideoItem");
      video.setAttribute("id", `${userId}Video`);
      video.setAttribute("name", "otherVideo");
      videoElement.otherVideoItemContainers = [videoItemContainer];
      videoElement.otherVideoItems = [videoItem];
      videoElement.otherVideos = [video];
    }
    return videoElement;
  };

  setRoomAvatarStyle = (DOMElement) => {
    // self avatart elements
    const selfAvatarContainer = DOMElement.selfAvatarContainer;
    const selfAvatarContent = DOMElement.selfAvatarContent;
    const selfAvatar = DOMElement.selfAvatar;

    // other avatar elements
    const otherAvatarContainers = DOMElement.otherAvatarContainers;
    const otherAvatars = DOMElement.otherAvatars;

    // reset style
    this.resetRoomAvatarStyle(DOMElement);

    if (cnt === 1) {
      // add slef avatar style
      selfAvatarContainer.classList.add("avatar-container");
      selfAvatarContent.classList.add("avatar-content");
      selfAvatar.classList.add("avatar");
    } else if (cnt === 2) {
      // add self avatar style
      selfAvatarContainer.classList.add("avatar-container");
      selfAvatarContent.classList.add("avatar-content");
      selfAvatar.classList.add("two-self-avatar");
    } else {
      // add self avatar style
      selfAvatarContainer.classList.add("avatar-container");
      selfAvatarContent.classList.add("avatar-content");
      selfAvatar.classList.add("avatar");
    }

    // add other avatar style
    for (const otherAvatarContainer of otherAvatarContainers) {
      otherAvatarContainer.classList.add("avatar-container");
    }

    for (const otherAvatar of otherAvatars) {
      otherAvatar.classList.add("avatar");
    }
  };

  setRoomVideoGridStyle = (DOMElement) => {
    const videosContainer = document.querySelector("#videosContainer");

    // self video elements
    const selfVideoItemContainer = DOMElement.selfVideoItemContainer;
    const selfVideoItem = DOMElement.selfVideoItem;
    const selfVideo = DOMElement.selfVideo;

    // other's video elements
    const otherVideoItemContainers = DOMElement.otherVideoItemContainers;
    const otherVideoItems = DOMElement.otherVideoItems;
    const otherVideos = DOMElement.otherVideos;

    // reset style
    this.resetVideoGrid(DOMElement);

    // check if any offcanvas open or anyone is sharing screen to adjust style
    this.mainContainerGrid();

    // sharing screen style
    if (isScreenSharing) {
      this.screenShareOpenVideoGrid();
      return;
    }

    if (cnt === 1) {
      // self video
      selfVideoItemContainer.classList.add("video-container");
      selfVideoItem.classList.add("one-self-item");
      selfVideo.classList.add("one-self-video");
      selfVideo.classList.add("video-rotate");
    } else if (cnt === 2) {
      selfVideoItemContainer.classList.add("two-self-video-container");
      selfVideoItem.classList.add("two-self-item");
      selfVideo.classList.add("video");

      // other's video
      for (const otherVideoItemContainer of otherVideoItemContainers) {
        otherVideoItemContainer.classList.add("video-container");
      }
      for (const otherVideoItem of otherVideoItems) {
        otherVideoItem.classList.add("two-other-item");
      }
      for (const otherVideo of otherVideos) {
        otherVideo.classList.add("video");
      }
    } else {
      let columns;
      if (parseInt(Math.sqrt(cnt)) === parseFloat(Math.sqrt(cnt))) {
        columns = Math.sqrt(cnt);
      } else {
        columns = parseInt(cnt / 2) + (cnt % 2);
      }

      // set common style
      videosContainer.classList.add("more-videos-grid");
      videosContainer.style.setProperty(
        "grid-template-columns",
        `repeat(${columns}, 1fr)`
      );

      // set self video style
      selfVideoItemContainer.classList.add("video-container");
      selfVideoItem.classList.add("more-item");
      selfVideo.classList.add("video");

      // set other's video style
      for (const otherVideoItem of otherVideoItems) {
        otherVideoItem.classList.add("more-item");
      }

      for (const otherVideo of otherVideos) {
        otherVideo.classList.add("video");
      }
    }
  };

  screenShareOpenVideoGrid = (DOMElement) => {
    const videosContainer = document.querySelector("#videosContainer");

    // self video elements
    const selfVideoItemContainer = document.querySelector(
      "#selfVideoItemContainer"
    );
    const selfVideoItem = document.querySelector("#selfVideoItem");
    const selfVideo = document.querySelector("#selfVideo");

    // other video elements
    const otherVideoItemContainers = document.querySelectorAll(
      '[name="otherVideoItemContainer"]'
    );
    const otherVideoItems = document.querySelectorAll(
      '[name="otherVideoItem"]'
    );
    const otherVideos = document.querySelectorAll('[name="otherVideo"]');

    const videoDOMElement = {
      selfVideoItemContainer: selfVideoItemContainer,
      selfVideoItem: selfVideoItem,
      selfVideo: selfVideo,
      otherVideoItemContainers: otherVideoItemContainers,
      otherVideoItems: otherVideoItems,
      otherVideos: otherVideos,
    };

    // reset all style
    this.resetVideoGrid(videoDOMElement);

    // add common style
    videosContainer.classList.add("more-videos-grid");

    // add self video style
    selfVideoItemContainer.classList.add("video-container");
    selfVideoItem.classList.add("more-item");
    selfVideo.classList.add("video");

    // add ther's video style
    for (const otherVideoItemContainer of otherVideoItemContainers) {
      otherVideoItemContainer.classList.remove("video-container");
    }

    for (const otherVideoItem of otherVideoItems) {
      otherVideoItem.classList.add("more-item");
    }

    for (const otherVideo of otherVideos) {
      otherVideo.classList.add("video");
    }
  };

  resetRoomAvatarStyle = (DOMElement) => {
    // self avatar elements
    const selfAvatar = DOMElement.selfAvatar;

    // remove self avatar style
    selfAvatar.classList.remove("avatar");
    selfAvatar.classList.remove("two-self-avatar");
    selfAvatar.classList.remove("more-video-avatar");
  };

  resetVideoGrid = (DOMElement) => {
    const videosContainer = document.querySelector("#videosContainer");

    // self video elements
    const selfVideoItemContainer = DOMElement.selfVideoItemContainer;
    const selfVideoItem = DOMElement.selfVideoItem;
    const selfVideo = DOMElement.selfVideo;

    // other's video elements
    const otherVideoItemContainers = DOMElement.otherVideoItemContainers;
    const otherVideoItems = DOMElement.otherVideoItems;
    const otherVideos = DOMElement.otherVideos;

    // remove common style
    videosContainer.classList.remove("more-videos-grid");
    videosContainer.style.removeProperty("grid-template-columns");

    // remove self video style
    selfVideoItemContainer.classList.remove("video-container");
    selfVideoItemContainer.classList.remove("two-self-video-container");
    selfVideoItem.classList.remove("one-self-item");
    selfVideoItem.classList.remove("two-self-item");
    selfVideoItem.classList.remove("more-item");
    selfVideo.classList.remove("video");
    selfVideo.classList.remove("one-self-video");

    // remove other's video style
    for (const otherVideoItemContainer of otherVideoItemContainers) {
      otherVideoItemContainer.classList.remove("video-container");
    }

    for (const otherVideoItem of otherVideoItems) {
      otherVideoItem.classList.remove("two-other-item");
      otherVideoItem.classList.remove("more-item");
    }

    for (const otherVideo of otherVideos) {
      otherVideo.classList.remove("video");
    }
  };

  mainContainerGrid = () => {
    if (isOffCanvasOpen) {
      this.offcanvasMod.offCanvasOpenGrid();
    } else {
      this.offcanvasMod.offCanvasCloseGrid();
    }
  };

  listenOnVideoStream = (DOMElement) => {
    const video = DOMElement.video;
    video.addEventListener("loadedmetadata", this.startPlayVideo);
  };

  startPlayVideo = async (e) => {
    await e.target.play();
    loadedCnt++;
    if (renderCnt === loadedCnt) {
      preload();
      socket.emit("finished-render");
    }
  };
}

export default MainDisplayMod;