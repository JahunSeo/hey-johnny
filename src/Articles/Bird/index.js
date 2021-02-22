import React, { Component } from "react";
import styles from "./index.module.css";
import { TransitionGroup } from "react-transition-group";
import {
  CSSTransitionWrapper,
  QuoteCSSTransitionWrapper,
} from "../../Component/Transition";

export default class Bird extends Component {
  state = {
    sectionIndex: 0,
  };

  sentences = [
    // `저는 자바스크립트를 무척 좋아합니다!`,
    // `저는 상상을 구현하는 사람이 되고 싶습니다!`,
    `이 화면은 간단한 NEAT 알고리즘과\ntensorflow.js을 활용해 구현되었습니다.`,
    // `Fly with the eagles not the sparrows.`,
    `길은 스스로 찾아야 한다\n스스로 걸어야 한다\n모르는 곳으로\n먼 길이다\n\n- 울라브 하우게 -`,
    `어딘가에서 누군가가\n너를 향해 전속력으로 달려오고 있다\n믿을 수 없는 속도로\n낮과 밤을 여행해\n눈보라와 사막의 열기를 뚫고\n급류를 건너고\n좁은 길들을 지나\n\n- 존 애쉬베리 -`,
    `가장 훌륭한 시는 아직 씌여지지 않았다\n가장 아름다운 노래는 아직 불려지지 않았다\n최고의 날들은 아직 살지 않은 날들\n...\n어느 길로 가야 할지 더 이상 알 수 없을 때\n그때가 비로소 진정한 여행의 시작이다\n\n- 나짐 히크메트 -`,
    `넒은 원을 그리며 나는 살아가네\n그 원은 세상 속에서 점점 넓어져 가네\n나는 아마도 마지막 원을 완성하지 못할 것이지만\n그 일에 내 온 존재를 바친다네\n\n- 라이너 마리아 릴케 -`,
    `해답은 없다\n앞으로도 해답은 없을 것이고\n지금까지도 해답이 없었다\n이것이 인생의 유일한 해답이다\n\n- 거투르드 스타인 -`,
    `당신이 하는 일이 문제가 아니다\n당신이 하지 않고 남겨 두는 일이 문제다\n해 질 무렵\n당신의 마음을 아프게 하는 일이 그것이다\n잊어버린 부드러운 말\n쓰지 않은 편지\n보내지 않은 꽃\n밤에 당신을 따라다니는 환영들이 그것이다\n\n- 마거릿 생스터 -`,
    `철새 떼가, 남쪽에서\n날아오며\n도나우강을 건널 때면, 나는 기다린다\n뒤처진 새를\n그게 어떤 건지, 내가 안다\n남들과 발맞출 수 없다는 것\n어릴 적부터 내가 안다\n뒤처진 새가 머리 위로 날아 떠나면\n나는 그에게 내 힘을 보낸다\n\n- 라이너 쿤체 -`,
    `당신의 나이는 당신이 아니다\n당신이 입는 옷의 크기도\n몸무게와\n머리 색깔도 당신이 아니다\n\n당신은 아침의 잠긴 목소리이고\n당신이 미처 감추지 못한 미소이다\n당신은 당신의 웃음 속 사랑스러움이고\n당신이 흘린 모든 눈물이다\n\n- 에린 핸슨 -`,
    `모든 것은 지나간다\n일출의 장엄함이 아침 내내 계속되진 않으며\n비가 영원히 내리지도 않는다\n\n당신이 살아 있는 동안\n당신에게 일어나는 일들을 받아들이라\n모든 것은 지나가 버린다\n\n- 세실 프란시스 알렉산더 -`,
    `자기 인생의 의미를 볼 수 없다면\n지금 여기, 이 순간, 삶의 현재 위치로 오기까지\n많은 빗나간 길들을 걸어 왔음을 알아야 한다\n그리고 오랜 세월 동안\n자신의 영혼이 절벽을 올라왔음도 알아야 한다\n그 상처, 그 방황, 그 두려움을\n그 삶의 불모지를 잊지 말아야 한다\n\n- 마르타 스목 -`,
    `아무리 어둔 길이라도\n나 이전에\n누군가는 이 길을 지나갔을 것이고,\n아무리 가파른 길이라도\n나 이전에\n누군가는 이 길을 통과했을 것이다\n아무도 걸어가 본 적이 없는\n그런 길은 없다\n\n- 베드로시안 -`,
    `함께 있되 거리를 두라\n그래서 하늘 바람이 너희 사이에서 춤추게 하라\n\n- 칼릴 지브란 -`,
  ];

  addSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex + 1 }));
  };
  subtractSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex - 1 }));
  };

  render() {
    let { sectionIndex } = this.state;
    let sentenceIndex = Math.floor(Math.random() * this.sentences.length);
    let sentence = this.sentences[sentenceIndex];

    return (
      <div className={styles.body}>
        <div className={styles.inner}>
          <TransitionGroup component={null}>
            {sectionIndex >= 0 && (
              <CSSTransitionWrapper
                key={0}
                appear={true}
                onEntered={this.addSectionIndex}
                onExited={() => {}}
                wrapClassName={styles.secTitle}
              >
                <h2 className={styles.title}>
                  A JOURNEY TO<br></br> JAVASCRIPT
                </h2>
              </CSSTransitionWrapper>
            )}
            {sectionIndex >= 1 && (
              <QuoteCSSTransitionWrapper
                key={1}
                appear={true}
                onEntered={this.subtractSectionIndex}
                onExited={this.addSectionIndex}
                wrapClassName={styles.secDesc}
              >
                <p className={styles.sentence}>{sentence} </p>
              </QuoteCSSTransitionWrapper>
            )}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}
