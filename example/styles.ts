import { css } from '../src/css';

export const parentCss = css`
  * {
    font-family: sans-serif;
  }
`;

export const childCss = css`
  .parent {
    background: #eee;
    padding: 8px;
    margin-top: 8px;
  }

  button {
    background: #fff;
    border: 2px solid purple;
    color: purple;
    outline: none;
    padding: 6px 4px;
    border-radius: 4px;
    letter-spacing: 0.7px;
    transition: all 0.3s;
  }

  button:hover {
    cursor: pointer;
    background: purple;
    color: #fff;
  }

  .container {
    width: 200px;
    display: flex;
    justify-content: space-between;
  }
`;
