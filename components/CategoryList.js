import React from 'react';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import ThemeToggle from './ThemeToggle.js';
import {darken, transparentize} from 'polished';
import {missingAttributes} from '../helpers/Helpers.js';
import Ghost from './Ghost';

export default class CategoryList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      selected: {name: "All"}
    }
  }

  componentDidMount() {
    this.fetchCategories()
  }
  fetchCategories() {
    fetch('api/categories')
      .then(res => res.json())
      .then(categories => {
        this.setState({
          categories: categories
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
  handleClick(category) {
    this.setState({
      selected: category
    })
    this.props.handleSelectCategory(category)
  }
  listCategories() {
    const {categories} = this.state;
    const all = categories.filter(cat => cat.name === "All")[0];
    console.log("All is", all);
    let filteredCategories = categories.filter(cat => cat.name !== "All");

    if (!filteredCategories) return;
    let firstLevelCategories = filteredCategories.filter(category => {
      return (category !== all) && category.parent && (category.parent._id === all._id)
    }).sort((a,b) => a.name > b.name ? 1 : -1);

    let anyMissingAttributes = 0;
    this.props.images.forEach(image => {
      if (missingAttributes(image)) {
        anyMissingAttributes++;
      }
    })

    let result = [
      <CategoryButton key={"all"} selected={this.state.selected.name === "All"} onClick={()=> this.handleClick(all)} missingAttributes={anyMissingAttributes}>
        All
      </CategoryButton>
    ];

    firstLevelCategories.forEach((category, i) => {
      let count = 0;
      let anyMissingAttributes = 0;
      this.props.images.forEach(image => {
        if (image.category === category.name && missingAttributes(image)) {
          anyMissingAttributes++;
        }
        if (image.category === category.name) {
          count++;
        }
      })

      result.push(
        <CategoryButton
          disabled={count === 0}
          key={category._id}
          selected={this.state.selected._id === category._id}
          onClick={()=> this.handleClick(category)}
          missingAttributes={anyMissingAttributes}
          indent={category.parent.name === "All" ? 0 : 1}
        >
          {category.name}
        </CategoryButton>
      )
      result.push(this.listSubcategories(category, 1))

    })
    return result
  }
  listSubcategories(parent, indent) {
    const {categories} = this.state;
    let result = [];
    categories.forEach((category, i) => {
      if (category.parent && category.parent._id === parent._id) {

        let anyMissingAttributes = 0;
        this.props.images.forEach(image => {
          if (!image.category) {
            console.log(image)
            return; }
          else if (image.category._id === category._id && missingAttributes(image)) {
            anyMissingAttributes++;
          }
        })
        result.push(
          <CategoryButton
            key={category._id}
            selected={this.state.selected === category}
            onClick={()=> this.handleClick(category)}
            missingAttributes={anyMissingAttributes}
            indent={indent}
          >{category.name}
          </CategoryButton>)
        result.push(this.listSubcategories(category, indent + 1))
      }
    })
    return result
  }

  render() {
    return (
      <Container>
        <Header>
          <H3>KickUp Design System Inventory</H3>
          <ThemeToggle onClick={() => this.props.handleToggleTheme()} />
        </Header>
        {
          this.state.categories.length > 0  ?  this.listCategories() : <Ghost.Sidebar  length={6}/>
        }

      </Container>
    )
  }
}

const Header = styled.div`
  width: 200px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.backgroundAlt};
  margin-bottom: 16px;
  transition: border 1s;
`;
const H3 = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
`;
const Container = styled.div`
  height: 100%;
  overflow: scroll;
  padding: 24px 32px;
  box-sizing: border-box;
  background: ${props => props.theme.background};
  transition: background 1s;
`;
const CategoryButton = styled.a`
  display: block;
  position: relative;
  font-size: 14px;
  padding: 8px 8px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;

  &:hover {
    background: ${props => transparentize(.9, props.theme.body)};
  }

  ${props => {
    if (props.missingAttributes > 0) {
      return `
      &::after {
        content: '${props.missingAttributes}';
        display: inline-block;
        padding: 4px;
        // position: absolute;
        min-width: 12px;
        // height: 12px;
        margin-left: 8px;
        font-size: 10px;
        font-weight: 700;
        border-radius: 10px;
        border; 2px solid white;
        text-align: center;
        background: ${props.theme.primary};
        color: white;
      }
      `
    }
  }}
  ${props => {
    if (props.indent) {
      return `
        margin-left: ${props.indent * 16}px;
      `
    }
  }}
  ${props => {
    if (props.selected) {
      return `
        border: 1px solid ${props.theme.primary};
        background: ${props.theme.primary};
        color: white;
        &:hover {
          border: 1px solid ${darken(.1, props.theme.primary)};
          background: ${darken(.1, props.theme.primary)};
        }
        &::after {
          background: white;
          color: ${props.theme.primary};
        }
      `
    }
  }}
  ${props => {
    if (props.disabled) {
      return `
        opacity: .5;
      `
    }
  }}
`;
