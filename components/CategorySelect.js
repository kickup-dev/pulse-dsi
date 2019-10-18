import React, {Component} from "react";
import styled from "styled-components";
import {Label, Input, Select, Button} from './common.js';

export default class CategorySelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            open: false
        }
    }

    onChange(e) {
      var obj = {};
      obj[e.target.name] = e.target.value;
  
      this.setState({
        data: Object.assign(this.state.data, obj)
      })
    }
    listCategories(parent, indent) {
        const {categories} = this.props;
        indent = indent ? indent : 0;
        parent = parent ? parent : "All";
        let sortedCategories = categories.sort((a,b) => a.name > b.name ? 1 : -1);
        let result = [];
        sortedCategories.forEach((category, i) => {
          if (category.parent === parent) {
            result.push(<option value={category.name} key={category.id}>{"--".repeat(indent)} {category.name}</option>)
            result.push(this.listCategories(category.name, indent + 1))
          }
        })
        return result
    }
    submitNewCategory() {
      this.setState({
        savingCategory: true
      })

      const {data} = this.state;
      const obj = {
        name: data.name,
        parent: data.parent || "All"
      }

      var that = this;
      fetch('http://localhost:8000/category/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      })
      .then(() => {
        that.setState({
          savingCategory: false
        })  
      })
    }
      
    render() {
      const {item} = this.props;
      const {data} = this.state;
        if (this.state.open) {
            return (
                <FormGroup outlined>
                    <h4 style={{marginTop: "0px"}}>New Category</h4>
                    <FormGroup>
                      <Label htmlFor="">Name {!item.name ? <Indicator type={"undefined"} /> : ""}</Label>
                      <Input type="text" onChange={(e) => this.onChange(e)} name="name" value={data.name || ""} placeholder="Category name" size="60"/>
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="">Parent?</Label>
                      <Select onChange={(e) => this.onChange(e)} name="parent" value={data.parent || ""}>
                          <option value="" >None</option>
                          {this.listCategories()}
                      </Select>
                    </FormGroup>
                    <FooterActions>
                      <Button outline onClick={() => this.setState({open: !this.state.open})}>Cancel</Button>
                      <Button primary style={{marginLeft: "8px"}} onClick={() => this.submitNewCategory()}>{this.state.savingCategory ? "Saving..." : "Save"}</Button>
                    </FooterActions>
                </FormGroup>
            )
        } else {
            return (
                <FormGroup>
                    <Label htmlFor="">Category {!item.category ? <Indicator type={"undefined"} /> : ""}</Label>
                    <SelectRow>
                      <Select style={{flex: "1"}} onChange={(e) => this.props.onChange(e)} name="category" value={item.category ? item.category : ""}>
                        <option value="" disabled>Select One</option>
                        {this.listCategories()}
                      </Select>
                      <Button outline style={{marginLeft: "8px"}} onClick={() => this.setState({open: !this.state.open})}>New +</Button>
                    </SelectRow>
                </FormGroup>
            )
        }
    }
}
const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: ${props => props.outlined ? "24px" : ""};
  border: ${props => props.outlined ? `1px solid ${props.theme.inputBorder}` : ""};
  border-radius: ${props => props.outlined ? `4px` : ""};
`;
const FooterActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;
const SelectRow = styled.div`
  display: flex;
  flex-direction: row;
`;
const Indicator = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  margin-left: 4px;
`;