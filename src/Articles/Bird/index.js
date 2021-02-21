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
    `저는 자바스크립트를 무척 좋아합니다!`,
    `저는 상상을 구현하는 사람이 되고 싶습니다!`,
    `이 화면은 간단한 NEAT 알고리즘과\ntensorflow.js을 활용해 구현되었습니다.`,
    // `Fly with the eagles not the sparrows.`,
    `길은 스스로 찾아야 한다\n스스로 걸어야 한다\n모르는 곳으로\n먼 길이다\n\n- 울라브 하우게 -`,
    `어딘가에서 누군가가\n너를 향해 전속력으로 달려오고 있다\n믿을 수 없는 속도로\n낮과 밤을 여행해\n눈보라와 사막의 열기를 뚫고\n급류를 건너고\n좁은 길들을 지나\n\n- 존 애쉬베리 -`,
    `가장 훌륭한 시는 아직 씌여지지 않았다\n가장 아름다운 노래는 아직 불려지지 않았다\n최고의 날들은 아직 살지 않은 날들\n...\n어느 길로 가야 할지 더 이상 알 수 없을 때\n그때가 비로소 진정한 여행의 시작이다\n\n- 나짐 히크메트 -`,
    `넒은 원을 그리며 나는 살아가네\n그 원은 세상 속에서 점점 넓어져 가네\n나는 아마도 마지막 원을 완성하지 못할 것이지만\n그 일에 내 온 존재를 바친다네\n\n- 라이너 마리아 릴케 -`,
    `해답은 없다\n앞으로도 해답은 없을 것이고\n지금까지도 해답이 없었다\n이것이 인생의 유일한 해답이다\n\n- 거투르드 스타인 -`,
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
