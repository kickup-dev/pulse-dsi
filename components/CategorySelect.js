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

      console.log("value is . . . ", e.target.value);

      this.setState({
        data: Object.assign(this.state.data, obj)
      })
    }
    listCategories(parent, indent) {
      // console.log("ITEM: ", this.props.item);
        const {categories} = this.props;
        indent = indent ? indent : 0;
        const all = categories.filter(cat => cat.name === "All")[0];
        parent = parent ? parent : all;
        let sortedCategories = categories.sort((a,b) => a.name > b.name ? 1 : -1);
        let result = [];
        sortedCategories.forEach((category, i) => {
          if (category.parent && category.parent._id === parent._id) {
            result.push(<option value={category._id} key={category._id + category.name + i}>{"--".repeat(indent)} {category.name}</option>)
            result.push(this.listCategories(category, indent + 1))
          }
        })
        return result
    }
    submitNewCategory() {
      this.setState({
        savingCategory: true
      })
      const all = this.props.categories.filter(cat => cat.name === "All")[0];
      const {data} = this.state;
      const obj = {
        name: data.name,
        parent: data.parent|| all._id
      }

      var that = this;
      fetch('api/category/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      })
      .then((id) => {
        that.setState({
          savingCategory: false,
        })
      })
    }

    tempOnChange(e){
      console.log("value is . . . ", e.target.value);
      this.props.onChange(e);
    }

    render() {
      const {item} = this.props;
      const {data} = this.state;
        if (this.state.open) {
            return (
                <FormGroup outlined>
                    <Header style={{marginTop: "0px"}}>New Category</Header>
                    <FormGroup>
                      <Label htmlFor="">Name {!item.name ? <Indicator type={"undefined"} /> : ""}</Label>
                      <Input type="text" onChange={(e) => this.onChange(e)} name="name" value={data.name || ""} placeholder="Category name" size="60"/>
                    </FormGroup>
                    <FormGroup>
                    <Label htmlFor="">Parent?</Label>
                      <Select onChange={(e) => this.onChange(e)} name="parent" value={data.parent ?  data.parent : ""}>
                          <option value="" >None</option>
                          {this.listCategories()}
                      </Select>
                    </FormGroup>
                    <FooterActions>
                      <Button ghost onClick={() => this.setState({open: !this.state.open})}>Cancel</Button>
                      <Button primary style={{marginLeft: "8px"}} onClick={() => this.submitNewCategory()}>{this.state.savingCategory ? "Saving..." : "Save"}</Button>
                    </FooterActions>
                </FormGroup>
            )
        } else {
            return (
                <FormGroup>
                    <Label htmlFor="">Category {!item.category ? <Indicator type={"undefined"} /> : ""}</Label>
                    <SelectRow>
                      <Select style={{flex: "1"}} onChange={(e) => this.tempOnChange(e)} name="category" value={item.category ? item.category : ""}>
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
const Header = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 30px;
`;