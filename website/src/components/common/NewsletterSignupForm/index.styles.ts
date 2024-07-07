import {darken, lighten} from 'polished';
import styled from 'styled-components';

import backgroundImage from '../../../images/background.png';

export const Wrapper = styled.div`
  display: flex;
  margin: 20px auto;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-family: 'Inter UI', serif;

  /* Fix weird input button styling on iOS */
  input {
    appearance: none;
  }
`;

export const Intro = styled.div`
  width: 90%;
  max-width: 472px;
  text-align: center;

  p:first-of-type {
    font-size: 28px;
    line-height: 1.2;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${({theme}) => theme.colors.green};

    @media (max-width: 600px) {
      font-size: 24px;
    }
  }

  p:nth-of-type(2) {
    font-size: 18px;
    line-height: 1.5;
    color: ${({theme}) => theme.colors.black};
  }
`;

export const Form = styled.form`
  width: 100%;
`;

export const HiddenBotInput = styled.input`
  position: absolute;
  left: -5000px;
`;

export const FormInput = styled.input`
  display: block;
  width: 100%;
  max-width: 360px;
  height: 52px;
  margin: 20px auto;
  padding: 10px;
  color: ${({theme}) => theme.colors.green};
  background-image: url(${backgroundImage});
  background-color: ${({theme}) => theme.colors.gray}40;
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
  font-size: 20px;
  text-align: center;

  &::placeholder {
    color: ${({theme}) => theme.colors.black};
    opacity: 0.5;
    transition: opacity 0.35s ease-in-out;
  }

  &:hover::placeholder {
    opacity: 0.75;
  }

  &:focus::placeholder {
    opacity: 0;
  }
`;

export const SubscribeButton = styled.button`
  display: block;
  width: 160px;
  height: 52px;
  margin: auto;
  cursor: pointer;
  font-size: 20px;
  font-family: 'Bungee';

  color: ${({theme}) => theme.colors.white};
  background-color: ${({theme}) => theme.colors.green};
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
  -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
  -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.green)};
  text-shadow: ${({theme}) => theme.colors.black} 2px 2px;

  &:hover {
    color: ${({theme}) => lighten(0.1, theme.colors.white)};
    background-color: ${({theme}) => lighten(0.2, theme.colors.green)};
  }
`;
