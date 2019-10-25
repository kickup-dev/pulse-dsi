import React from 'react';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import CategoryList from './CategoryList.js/index.js.js';
import {titleCase, missingAttributes} from '../helpers/Helpers.js';
import {Label, Select} from './common.js';
import { transparentize } from 'polished';
import Ghost from './Ghost';

export default class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      selectedImage: null,
      selectedCategory: {name: "All"},
      sortOrder: "desc"
    }
  }

  componentDidMount() {
    this.fetchData()
  }
  fetchData() {
    fetch('api/images/')
      .then(res => res.json())
      .then(items => {
        this.setState({
          images: items
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
  displayImages() {
    if (!this.state.selectedCategory) return;
    const images = [...this.state.images];
    let result = [];
    let imagesList = [];
    let count = 0;
    console.log(this.state.selectedCategory);

    if (this.state.selectedCategory.name === "All") {
      images.forEach(item => {
        var imgURL = "public/images/" + item.id + (item.filetype ? item.filetype : ".png");
        imagesList.push(
          <Image
            item={item}
            style={{backgroundImage: `url(${imgURL})`}}
            selected={this.state.selectedImage === item.id}
            key={item.id}
            onClick={() => this.handleSelectImage(item.id)}
            missingAttributes={missingAttributes(item)}
            />
        )
      })
      return(
        <div>
          <CategoryHeader key={1}>{titleCase(this.state.selectedCategory.name) || "All"} ({images.length})  {this.sortToggle()}</CategoryHeader>
          <ImageListContainer>
            {this.state.sortOrder === "asc" ? imagesList : imagesList.reverse()}
          </ImageListContainer>
        </div>
      )
    } else {
        images.forEach(item => {
          if (this.state.selectedCategory._id === item.category._id) {
            var imgURL = "public/images/" + item.id + (item.filetype ? item.filetype : ".png");
            imagesList.push(
              <Image
                item={item}
                style={{backgroundImage: `url(${imgURL})`}}
                selected={this.state.selectedImage === item.id}
                key={item.id}
                onClick={() => this.handleSelectImage(item.id)}
                missingAttributes={missingAttributes(item)}
                />
            )
            count++;
          }
        })
        result.push(
          <div>
            <CategoryHeader key={count}>{this.state.selectedCategory.name} ({count}) {this.sortToggle()}</CategoryHeader>
            <ImageListContainer>
              {this.state.sortOrder === "asc" ? imagesList : imagesList.reverse()}
            </ImageListContainer>
          </div>
        )
    }

    return result;
  }
  handleSelectImage(id) {
    this.props.handleSelectImage(id)
    this.setState({
      selectedImage: id
    })
  }
  handleSelectCategory(category) {
    this.setState({selectedCategory: category})
  }
  handleGalleryClick(e) {
    if (e.target.id === "GalleryColumn") {
      this.handleSelectImage(null)
    }
  }
  sortToggle() {
    return (
      <div>
        <Label>Sort by:</Label>
        <Select style={{marginLeft: "8px"}} value={this.state.sortOrder} onChange={(e) => this.setState({sortOrder: e.target.value})}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>
      </div>
    )
  }

  render() {
    return (
      <Container>
        <CategoryList images={this.state.images} handleToggleTheme={() => this.props.handleToggleTheme()} handleSelectCategory={(cat) => this.handleSelectCategory(cat)}/>
        <GalleryColumn>
          {this.state.images.length > 0 ? this.displayImages() : <Ghost.Images length={10}/>}
        </GalleryColumn>
      </Container>
    )
  }
}

const Container = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  box-sizing: border-box;
  color: ${props => props.theme.body};
  `;
const GalleryColumn = styled.div`
  flex: 1;
  width: 60vw;
  height: 100%;
  overflow: scroll;
  padding: 0 56px 56px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  transition: background 1s;
  background: ${props => props.theme.backgroundAlt};
  `;
const ImageListContainer = styled.div`
  display: grid;
  grid-gap: 34px;
  grid-template-columns: auto auto auto auto;
  `;
const CategoryHeader = styled.h3`
  width: 100%;
  height: 50px;
  margin-top: 40px;
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 600;
`;

const Image = (props) => {
  return (
    <ImageContainer selected={props.selected} missingAttributes={props.missingAttributes} onClick={() => props.onClick(props.item.id)}>
      <ImageBlock {...props}/>
      <MetaData>
        <ImageName>{props.item.name}</ImageName>
        <ImageID>{props.item.id}</ImageID>
      </MetaData>
    </ImageContainer>
  )
}
const ImageBlock = styled.div`
  position: absolute;
  top: 5%;
  left: 5%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 90%;
  height: 90%;
  background-color: white;
  border-radius: 6px;

  &::after {
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition-duration: .1s;
    box-shadow: 0 20px 20px ${props => transparentize(.9, props.theme.body)};
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
  `;
const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
  border: ${props => props.selected ? `2px solid ${props.theme.primary};` : `2px solid transparent`};
  border-radius: 8px;
  background: white;

  &::before {
    content: "";
    display: inline-block;
    width: 0px;
    height: 0;
    padding-bottom: calc(100%);
  }

  ${props => {
      if (props.missingAttributes) {
        return `
        &::after {
          content: '';
          display: block;
          position: absolute;
          width: 20px;
          height: 20px;
          top: -10px;
          right: -10px;
          border-radius: 10px;
          border; 2px solid white;
          background: ${props.theme.primary};
        }
        `
      }}
    }
  `;
const MetaData = styled.div`
  position: absolute;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 100%;
  bottom: 0;
  left: 0;

  box-sizing: border-box;
  padding: 48px 16px 16px;
  opacity: 0;
  transition-duration: .2s;
  pointer-events: none;
  background: linear-gradient(transparent,white);

  ${ImageContainer}:hover & {
    opacity: 1;
  }
`;
const ImageID = styled.p`
  color: rgba(0,0,0,.5);
  font-size: 10px;
  word-break: break-all;
`;
const ImageName = styled.h3`
  color: black;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
`;