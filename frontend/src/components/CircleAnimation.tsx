import React from 'react';
import styled  from '@emotion/styled';
import {keyframes} from "@emotion/react";
import RedPulse from '../assets/red-pulse.gif'

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  70% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
`;

const Circle = styled.div`
    min-width: 2000px;
    min-height: 2000px;
    top: auto;
    right: auto;
    bottom: auto;
    left: auto;
    position: absolute;
    border-radius: 50%;
    background-color: red;
    animation: ${pulse} 4s infinite;
    background-attachment: scroll,scroll;
    background-repeat: repeat, repeat;
    background-position: 0, 0, 50%,50%;
    background-size: auto 150px;
    background-image: radial-gradient(circle farthest-corner at 50% 50%, #000 38%, rgba(0, 81, 139, 0) 74%), url(${RedPulse});
    z-index: 2;
    transform-style: preserve-3d;
    will-change: transform;
    transform: translate3d(-10.5952vw, -24.047vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(24.9755deg) skew(0deg, 0deg);
}
`;

const CircleAnimation: React.FC = () => {
    return <Circle />;
};

export default CircleAnimation;
