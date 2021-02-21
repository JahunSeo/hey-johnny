import React, { Component } from "react";
import styles from "./index.module.css";
import { TransitionGroup } from "react-transition-group";
import {
  CSSTransitionWrapper,
  SlowCSSTransitionWrapper,
  QuoteCSSTransitionWrapper,
} from "../../Component/Transition";

export default class XOR extends Component {
  state = {
    sectionIndex: 0,
    sentenceIndex: -1,
  };

  sentences = [
    `화면 속 개체들은 세대를 거듭하며 XOR 문제를 풀고 있습니다.\nStanley의 2002년 논문을 바탕으로 구현했습니다.`,
    `단층 모형으로는 비선형 영역을 분리할 수 없으므로\n개체들은 새로운 node를 더하는 방향으로 진화해야 합니다.`,
    `각 개체 좌측 상단 첫 번째 줄은 종 번호,\n두 번째 줄은 문제 풀이 점수입니다.\n점수는 4점이 되어야 합니다.`,
    `진화는 2,000세대까지 이루어집니다.\n개체 수가 적어 넉넉하게 잡아보았습니다.`,
    `후속 논문들을 학습하며 계속 개선 중입니다.\n무척 즐겁게 작업하고 있습니다!`,
    `몇 번째 세대부터\n목표 점수가 등장하는지 확인해보세요!`,
  ];

  addSectionIndex = () => {
    let { sectionIndex, sentenceIndex } = this.state;
    if (sectionIndex >= 1 && sentenceIndex < this.sentences.length) {
      this.setState({
        sectionIndex: sectionIndex + 1,
        sentenceIndex: sentenceIndex + 1,
      });
    } else {
      this.setState({ sectionIndex: sectionIndex + 1 });
    }
  };
  subtractSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex - 1 }));
  };

  render() {
    let { sectionIndex, sentenceIndex } = this.state;
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
                <h2 className={styles.title}>XOR</h2>
              </CSSTransitionWrapper>
            )}
            {sectionIndex >= 1 && (
              <SlowCSSTransitionWrapper
                key={1}
                appear={true}
                onEntered={this.addSectionIndex}
                onExited={this.subtractSectionIndex}
                wrapClassName={styles.secDesc}
              >
                <p className={styles.desc}>
                  {`"Neuroevolution of augmenting topologies"`}
                </p>
              </SlowCSSTransitionWrapper>
            )}
            {sectionIndex >= 2 && !!sentence && (
              <QuoteCSSTransitionWrapper
                key={2}
                appear={true}
                onEntered={this.subtractSectionIndex}
                onExited={this.addSectionIndex}
                wrapClassName={styles.secDesc}
              >
                <p className={styles.desc}>{sentence}</p>
              </QuoteCSSTransitionWrapper>
            )}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}
