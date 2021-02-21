export const PAGES = {
  MAIN: "PAGE_MAIN",
  CANDY: "PAGE_CANDY",
  QUIZ: "PAGE_QUIZ",
  BIRD: "PAGE_BIRD",
  MIDAS: "PAGE_MIDAS",
  WIZLAB: "PAGE_WIZLAB",
};

export const SCREEN_SIZE = {
  HORI32: { ratio: { w: 3, h: 2 }, max: { w: 840, h: 560 } }, // 3:2
  VERT169: { ratio: { w: 9, h: 16 }, max: { w: 360, h: 640 } }, // 9:16
  FULL: { ratio: { w: 1, h: 1 }, max: { w: 1000, h: 1000 } }, // todo
};

export const getScreenRect = (stageWidth, stageHeight, currentPage) => {
  let scrSize = SCREEN_SIZE.HORI32;
  if (currentPage === PAGES.QUIZ) {
    scrSize = SCREEN_SIZE.VERT169;
  } else if (currentPage === PAGES.BIRD) {
    scrSize = SCREEN_SIZE.HORI32;
  } else if (currentPage === PAGES.MIDAS) {
    scrSize = SCREEN_SIZE.VERT169;
  } else if (currentPage === PAGES.WIZLAB) {
    scrSize = SCREEN_SIZE.HORI32;
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
