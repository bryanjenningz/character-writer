import React, { Component } from 'react';

const alphabet = 'abc';

class App extends Component {
  state = {
    points: [],
    mouseDown: false,
    animationIndex: null,
    characters: [],
    // All state below is for after the characters have been recorded.
    text: '',
    textIndex: null,
    textPointIndex: null
  };

  render() {
    const { points, mouseDown, animationIndex, characters } = this.state;
    if (characters.length < alphabet.length) {
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
          <div>Write "{alphabet[characters.length]}"</div>
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
                  <button
                    onClick={() => {
                      const { characters } = this.state;
                      characters.push(points);
                      this.setState({ characters, points: [] });
                    }}
                  >
                    Next
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

    const { text, textIndex, textPointIndex } = this.state;
    const asciiText = text.trim().toLowerCase().replace(/[^ a-z]/, '').replace(/ {2,}/, ' ');
    return (
      <div>
        <input
          onChange={e => this.setState({ text: e.target.value })}
          placeholder="Enter in some text"
          value={text}
        />
        <button
          onClick={() => {
            const iterate = () => {
              const { textIndex, textPointIndex } = this.state;
              if (textIndex < asciiText.length) {
                if (textPointIndex < characters[alphabet.indexOf(asciiText[textIndex])].length) {
                  this.setState({ textPointIndex: textPointIndex + 1 }, () => setTimeout(iterate, 10));
                } else {
                  if (textIndex === asciiText.length - 1) {
                    this.setState({ textIndex: textIndex + 1 });
                  } else {
                    this.setState({ textIndex: textIndex + 1, textPointIndex: 0 }, () => setTimeout(iterate, 10));
                  }
                }
              }
            };
            this.setState({ textIndex: 0, textPointIndex: 0 }, () => {
              setTimeout(iterate, 10);
            });
          }}
        >
          Show writing
        </button>
        <div style={{ display: 'flex' }}>
          {typeof textIndex === 'number'
            ? asciiText.split('').slice(0, textIndex + 1).map((character, i, asciiText) => {
                let charData = 
                  characters[alphabet.indexOf(character)]

                if (i === asciiText.length - 1) {
                  charData = charData.slice(0, textPointIndex + 1);
                }

                return (
                  <CharacterTile
                    key={i}
                    points={charData}
                    mouseDown={() => {}}
                    startDrawing={() => {}}
                    mouseUp={() => {}}
                    mouseMove={() => {}}
                    mouseLeave={() => {}}
                  />
                );
              })
            : null}
        </div>
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
