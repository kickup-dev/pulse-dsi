import React from 'react';
import styled from 'styled-components';
import ThemeToggle from './ThemeToggle.js';
import {darken, transparentize} from 'polished';
import {missingAttributes} from '../helpers/Helpers.js';

export default class CategoryList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      selected: "All"
    }
  }

  componentDidMount() {
    this.fetchCategories()
  }
  fetchCategories() {
    fetch('http://localhost:8000/categories')
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
    if (!categories) return;
    let firstLevelCategories = categories.filter(category => category.parent === "All").sort((a,b) => a.name > b.name ? 1 : -1);

    let anyMissingAttributes = 0;
    this.props.images.forEach(image => {
      if (missingAttributes(image)) {
        anyMissingAttributes++;
      }
    })

    let result = [
      <CategoryButton key={"all"} selected={this.state.selected === "All"} onClick={()=> this.handleClick("All")} missingAttributes={anyMissingAttributes}>
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
        <CategoryButton disabled={count === 0} key={category.id} selected={this.state.selected === category.name} onClick={()=> this.handleClick(category.name)} missingAttributes={anyMissingAttributes}  indent={category.parent === "All" ? 0 : 1}>
          {category.name}
        </CategoryButton>
      )
      result.push(this.listSubcategories(category.name, 1))

    })
    return result
  }
  listSubcategories(parent, indent) {
    const {categories} = this.state;
    let result = [];
    categories.forEach((category, i) => {
      if (category.parent === parent) {

        let anyMissingAttributes = 0;
        this.props.images.forEach(image => {
          if (image.category === category.name && missingAttributes(image)) {
            anyMissingAttributes++;
          }
        })
        result.push(
          <CategoryButton
            key={category.id}
            selected={this.state.selected === category.name}
            onClick={()=> this.handleClick(category.name)}
            missingAttributes={anyMissingAttributes}
            indent={indent}
          >{category.name}
          </CategoryButton>)
        result.push(this.listSubcategories(category.name, indent + 1))
      }
    })
    return result
  }

  render() {
    console.log()

    return (
      <Container>
        <Header>
          <H3>KickUp Design System Inventory</H3>
          <ThemeToggle onClick={() => this.props.handleToggleTheme()} />
        </Header>
        {this.listCategories()}
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
