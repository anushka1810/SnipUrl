import React from 'react';
import styled from 'styled-components';

const generateStars = (count) => {
  let shadow = '';
  for(let i=0; i<count; i++) {
    shadow += `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #fff${i < count - 1 ? ',' : ''}`;
  }
  return shadow;
};

const shadows1 = generateStars(700);
const shadows2 = generateStars(200);
const shadows3 = generateStars(100);

const BackgroundStars = () => {
  return (
    <StyledWrapper className="fixed inset-0 z-[-1] pointer-events-none">
      <div className="container">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;

  .container {
    height: 100%;
    width: 100%;
  }

  #stars {
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: ${shadows1};
    animation: animStar 50s linear infinite;
  }
  #stars:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: ${shadows1};
  }

  #stars2 {
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: ${shadows2};
    animation: animStar 100s linear infinite;
  }
  #stars2:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: ${shadows2};
  }

  #stars3 {
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: ${shadows3};
    animation: animStar 150s linear infinite;
  }
  #stars3:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: ${shadows3};
  }

  @keyframes animStar {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-2000px);
    }
  }
`;

export default BackgroundStars;
