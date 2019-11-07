import React, {Fragment} from 'react';
import styled, { keyframes } from 'styled-components'
import { transparentize } from 'polished';


const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: .5; }
  100% { opacity: 1; }
`;

const GhostCategory = styled.div`
  background: ${({theme}) => theme.body};
  height: 20px;
  width: 100%;
  margin-bottom: ${({theme})=> theme.space[3]}px;
  animation: ${pulse} 1s linear ${({offset}) => (offset) * .2 }s infinite;
  border-radius: 4px;`
;

const ImageRow = styled.div`
  display: grid;
  grid-gap: 34px;
  grid-template-columns: auto auto auto auto;
  animation: ${pulse} 1s linear ${({offset}) => (offset) * .2 }s infinite;
`

const ImageBlock = styled.div`
  position: absolute;
  top: 5%;
  left: 5%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 90%;
  height: 90%;
  border-radius: 6px;
  background: ${({theme}) => theme.body};
`;
const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
  border:  2px solid transparent;
  border-radius: 8px;
  background-color: ${({theme}) => theme.body };
  margin-bottom: 34px;

  &::before {
    content: "";
    display: inline-block;
    width: 0px;
    height: 0;
    padding-bottom: calc(100%);
  }
`

const ImagesList = styled.div`
  margin-top: 100px;
`

const Sidebar = ({length} = 5) => {
  let chunks = [];
  for(var i = 0; i < length; i++) {
    chunks.push(
       <Fragment>
        <GhostCategory offset={0} key={1 + i}/>
        <GhostCategory offset={1} key={2 + i}/>
        <GhostCategory offset={2} key={3 + i}/>
        <GhostCategory offset={3} key={4 + i}/>
      </Fragment>
    )
  }
  return (
    <Fragment>
      {chunks}
    </Fragment>
  )
};

const Images = ({length = 5}) => {
  let imagesList = [];
  for(var i = 0; i < length; i++) {
    imagesList.push(
      <ImageRow offset={i}>
        <ImageContainer>
          <ImageBlock/>
        </ImageContainer>
        <ImageContainer>
          <ImageBlock/>
        </ImageContainer>
        <ImageContainer>
          <ImageBlock/>
        </ImageContainer>
        <ImageContainer >
          <ImageBlock/>
        </ImageContainer>
      </ImageRow>
    );
  };

  return (
    <ImagesList >
      {imagesList}
    </ImagesList>
  )
}

const Ghost = { Sidebar, Images }

export default Ghost;