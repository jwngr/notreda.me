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
    font-size: 32px;
    line-height: 1.2;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${(props) => props.theme.colors.green};

    @media (max-width: 600px) {
      font-size: 28px;
    }
  }

  p:nth-of-type(2) {
    font-size: 20px;
    line-height: 1.5;
    color: ${(props) => props.theme.colors.black};
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
  height: 60px;
  margin: 20px auto;
  padding: 10px;
  color: ${(props) => props.theme.colors.green};
  background-image: url(${backgroundImage});
  background-color: ${(props) => props.theme.colors.gray}40;
  border: solid 3px ${(props) => darken(0.2, props.theme.colors.green)};
  font-size: 24px;
  text-align: center;

  &::placeholder {
    color: ${(props) => props.theme.colors.black};
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
  width: 200px;
  height: 60px;
  margin: auto;
  cursor: pointer;
  font-size: 24px;
  font-family: 'Bungee';

  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.green};
  border: solid 3px ${(props) => darken(0.2, props.theme.colors.green)};
  -webkit-text-stroke: 1px; /* TODO: cross-browser solution */
  -webkit-text-stroke-color: ${(props) => darken(0.2, props.theme.colors.green)};
  text-shadow: ${(props) => props.theme.colors.black} 2px 2px;

  &:hover {
    color: ${(props) => lighten(0.1, props.theme.colors.white)};
    background-color: ${(props) => lighten(0.2, props.theme.colors.green)};
  }
`;
