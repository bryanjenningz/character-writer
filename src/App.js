import React, { Component } from 'react';

class App extends Component {
  state = { points: [], mouseDown: false, animationIndex: null };

  render() {
    const { points, mouseDown, animationIndex } = this.state;
    return (
      <div>
        <CharacterTile
          points={points}
          mouseDown={mouseDown}
          startDrawing={e => {
            const points = [{ x: e.clientX, y: e.clientY }];
            this.setState({ points, mouseDown: true, animationIndex: null });
          }}
          mouseUp={() => this.setState({ mouseDown: false })}
          mouseMove={e => {
            if (mouseDown) {
              points.push({ x: e.clientX, y: e.clientY });
              this.setState({ points });
            }
          }}
          mouseLeave={() => this.setState({ mouseDown: false })}
        />
        <div>
          {!mouseDown && points.length > 0
            ? <div>
                <button
                  onClick={() => {
                    this.setState({ animationIndex: 0 }, () => {
                      const iterateAnimation = () => {
                        const { animationIndex } = this.state;
                        if (animationIndex < points.length) {
                          this.setState({ animationIndex: animationIndex + 1 }, () => {
                            setTimeout(iterateAnimation, 10);
                          });
                        }
                      };
                      iterateAnimation();
                    });
                  }}
                >
                  Show
                </button>
                <button
                  onClick={() => {
                    this.setState({ points: [], mouseDown: false, animationIndex: null });
                  }}
                >
                  Clear
                </button>
              </div>
            : null}
        </div>
        {typeof animationIndex === 'number'
          ? <CharacterTile
              points={points.slice(0, (animationIndex || -1) + 1)}
              mouseDown={() => {}}
              startDrawing={() => {}}
              mouseUp={() => {}}
              mouseMove={() => {}}
              mouseLeave={() => {}}
            />
          : null}
      </div>
    );
  }
}

const CharacterTile = ({ points, mouseDown, startDrawing, mouseUp, mouseMove, mouseLeave }) => (
  <div
    style={{ position: 'relative', width: 100, height: 100, border: '1px solid black' }}
    onMouseDown={startDrawing}
    onMouseUp={mouseUp}
    onMouseMove={mouseMove}
    onMouseLeave={mouseLeave}
  >
    {points.map(({ x, y }, i) => (
      <div
        key={i}
        style={{
          width: 10,
          height: 10,
          background: 'black',
          position: 'absolute',
          borderRadius: '100%',
          left: x + 'px',
          top: y + 'px'
        }}
      />
    ))}
  </div>
);

export default App;
