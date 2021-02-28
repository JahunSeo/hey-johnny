export const PAGES = {
  MAIN: "main",
  CANDY: "candy",
  QUIZ: "quiz",
  XOR: "xor",
  BIRD: "bird",
  MIDAS: "midas",
  WIZLAB: "wizlab",
};

export const SCREEN_SIZE = {
  HORI32: { ratio: { w: 3, h: 2 }, max: { w: 840, h: 560 } }, // 3:2
  VERT169: { ratio: { w: 9, h: 16 }, max: { w: 360, h: 640 } }, // 9:16
  BIRD400: { max: { h: 400 } },
  FULL: {},
};

export const getScreenRect = (stageWidth, stageHeight, currentPage) => {
  // bird view
  if (currentPage === PAGES.BIRD) {
    let width = stageWidth * 1; // todo: apply birdBoardWidthRatio
    let height = SCREEN_SIZE.BIRD400.max.h;
    let left = (stageWidth - width) / 2;
    let top = (stageHeight - height) / 2;
    return { width, height, left, top };
  }
  // xor view, full screen
  if (currentPage === PAGES.XOR) {
    let width = stageWidth;
    let height = stageHeight;
    let left = (stageWidth - width) / 2;
    let top = (stageHeight - height) / 2;
    return { width, height, left, top };
  }
  // wizlab view, vertical
  if (currentPage === PAGES.WIZLAB) {
    let widthMax = 840;
    let width = Math.min(stageWidth, widthMax);
    let height = stageHeight;
    let left = (stageWidth - width) / 2;
    let top = (stageHeight - height) / 2;
    return { width, height, left, top };
  }
  // others
  let scrSize = SCREEN_SIZE.HORI32;
  if (currentPage === PAGES.QUIZ) {
    scrSize = SCREEN_SIZE.VERT169;
  } else if (currentPage === PAGES.MIDAS) {
    scrSize = SCREEN_SIZE.VERT169;
  }

  let ratio = scrSize.ratio;
  let height, width;
  if (stageWidth / stageHeight > ratio.w / ratio.h) {
    // by height
    height = stageHeight * 0.8;
    height = Math.min(height, scrSize.max.h);
    width = height * (ratio.w / ratio.h);
  } else {
    // by width
    width = stageWidth * 0.8;
    width = Math.min(width, scrSize.max.w);
    height = width * (ratio.h / ratio.w);
  }
  let left = (stageWidth - width) / 2;
  let top = (stageHeight - height) / 2;

  return { width, height, left, top };
};
