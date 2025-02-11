import {styled} from 'styled-components';

const StyledButton = styled.button`

  background-color: darkblue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: blue;
  }
  align-items: center;
  justify-content: center;
  text-align: center;

  @media screen and (max-width: 600px) {
    display: flex;
    width: 100%;
  }
`;

export default StyledButton;