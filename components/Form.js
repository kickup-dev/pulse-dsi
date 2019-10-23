import React from 'react';
import styled from 'styled-components';
import {transparentize} from 'polished';
import hotkeys from 'hotkeys-js';
import copy from 'copy-to-clipboard';

import {Label, Input, Select, TextArea, Button} from './common.js';
import CategorySelect from './CategorySelect.js';

export default class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        name: "",
        url: "",
        description: "",
        category: "",
        clientFacing: null
      }
    }
    this.imagePath = React.createRef();
  }

  componentDidMount() {
    var that = this;
    hotkeys('cmd+return, return', function(event, handler){
      if (document.activeElement.tagName === "TEXTAREA" && handler.key !== 'cmd+return') {
        // do nothing
      } else {
        event.preventDefault()
        that.handleSubmit()
      }
    });
    hotkeys.filter = function(event){
      var tagName = (event.target || event.srcElement).tagName;
      hotkeys.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
      return true;
    }
  }
  componentDidUpdate(prevProps) {
    if (!this.props.selectedID) return;
    if (this.props.selectedID !== prevProps.selectedID) {
      this.fetchData(this.props.selectedID)
    }
  }
  fetchData(id) {
    fetch('http://localhost:8000/images/'+id)
      .then(res => res.json())
      .then(item => {
        copy(item.url)
        this.fetchCategories(categories => {
          this.setState({
            data: {
              name: "",
              url: "",
              description: "",
              category: "",
              clientFacing: null,
              ...item
            },
            categories: categories,
          })
        })
      })
      .catch(err => {
        console.log(err);
      })
  }
  fetchCategories(callback) {
    fetch('http://localhost:8000/categories')
      .then(res => res.json())
      .then(categories => {
        callback(categories)
      })
      .catch(err => {
        console.log(err);
      })
  }
  onChange(e) {
    var obj = {};

    // Handle different inputs
    if (e.target.type === "checkbox") {
      obj[e.target.name] = e.target.checked;
    } else if (e.target.type === "radio")  {
      obj[e.target.name] = e.target.value === "true" ? true : false;
    } else {
      obj[e.target.name] = e.target.value;
    }

    this.setState({
      data: Object.assign(this.state.data, obj)
    })
  }
  handleSubmit() {
    this.setState({saving: true})

    // SET RECENT URL
    if (this.state.data.url) {
      var list = window.localStorage.getItem("url") ? JSON.parse(window.localStorage.getItem("url")) : [];
      if (list.indexOf(this.state.url) > -1) {
        list.splice(list.indexOf(this.state.url), 1)
      };
      
      // max the recent list at 3 items
      if (list.length >= 3) {
        list.shift();
      }
      list.push(this.state.data.url);
      window.localStorage.setItem("url", JSON.stringify(list))
    }

    var that = this;
    fetch('http://localhost:8000/edit/'+ this.props.selectedID, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.data)
    })
    .then(() => {
      setTimeout(function() {
        that.setState({saving: false})
      }, 500)
    })
  }
  handleDelete() {
    var confirm = window.confirm("Are you sure you want to delete this?")
    if (confirm) {
      var that = this;
      fetch('http://localhost:8000/delete/'+ this.props.selectedID, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        that.props.handleDeleteImage();
        that.setState({
          data: {}
        })
      })
    }
  }
  listRecentURLs() {
    var result = [];

    // get current list or set to blank array if doesn't exist
    var urls = window.localStorage.getItem("url");
    var list = urls ? JSON.parse(urls) : [];

    var dataCopy = Object.assign({}, this.state.data);
    list.reverse().forEach((item, i) => {
      dataCopy["url"] = item;
      result.push(<RecentURL key={i+1} onClick={()=> this.setState({data: dataCopy})}>{item}</RecentURL>)
    })
    return result;
  }
  listCategories() {
    var result = [];
    var sortedCategories = this.state.categories.sort((a,b) => a.name > b.name ? 1 : -1);
    sortedCategories.forEach((category, i) => {
      result.push(<option key={category.id} value={category.name}>{category.name}</option>)
    })
    return result
  }
  onChangeMultiSelect(e) {
    let select = e.target;

    var result = [];
    var options = select && select.options;
    var opt;

    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];

      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    
    let obj = {};
    obj[select.name] = result;
    
    this.setState({
      data: Object.assign(this.state.data, obj)
    })
  }

  render() {
    var item = this.state.data;

    const baseURL = "https://pulse-staging.kickup.co/";
    let url;
    if (item.url) {
      url = item.url.replace(baseURL,"") === "" ? "Home" : item.url.replace(baseURL,"");
    }

    if (item.id){
      return (
        <FormContainer >
          <a style={{width: "100%"}} target="_blank" rel="noopener noreferrer" href={"http://localhost:8000/" + item.id + (item.filetype ? item.filetype : ".png")}>
            <ImagePreviewContainer>
                <ImagePreview
                  src={"http://localhost:8000/" + item.id + (item.filetype ? item.filetype : ".png")}
                  width={item.dimensions.width / 2 > 600 ? "100%" : item.dimensions.width / 2}
                  alt=""/>
            </ImagePreviewContainer>
          </a>
          <Header>
            <div style={{flex: "1"}}>
              <Title>{item.name}</Title>
              <Link target="_blank" href={item.url}>{url}</Link>
            </div>
            <Button primary style={{marginLeft: "16px"}} onClick={() => this.handleSubmit()}>{this.state.saving ? "Saving..." : "Save"}</Button>
          </Header>
          <br/>
          <FormGroup>
            <Label htmlFor="">Name {!item.name ? <Indicator type={"undefined"} /> : ""}</Label>
            <Input type="text" onChange={(e) => this.onChange(e)} name="name" value={item.name} size="60"/>
          </FormGroup>
          <CategorySelect item={item} categories={this.state.categories} onChange={(e) => this.onChange(e)}/>
          <FormGroup>
            <Label htmlFor="">URL {!item.url ? <Indicator type={"undefined"} /> : ""}</Label>
            <Input type="text" onChange={(e) => this.onChange(e)} name="url" value={item.url ? item.url : ""} size="60"/>
            {this.listRecentURLs()}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="">Style Source {!item.styleSource ? <Indicator type={"undefined"} /> : ""}</Label>
            <Select style={{height: "unset", padding: "4px"}} multiple={true} onChange={(e) => this.onChangeMultiSelect(e)} name="styleSource" value={item.styleSource ? Array.isArray(item.styleSource) ? item.styleSource : [item.styleSource]: [""]}>
              <MultiSelectOption value="N/A">N/A</MultiSelectOption>
              <MultiSelectOption value="Styled Component"><span role="img" aria-label="nails">💅</span> Styled Component</MultiSelectOption>
              <MultiSelectOption value="Pulse UI">Pulse UI - browserModules.css</MultiSelectOption>
              <MultiSelectOption value="In-product Less">{"In-Product Less - {name}.css"}</MultiSelectOption>
              <MultiSelectOption value="Bootstrap">Bootstrap (bootstrap.css)</MultiSelectOption>
              <option inactive >---</option>
              <MultiSelectOption value="Plotly">Plotly</MultiSelectOption>
              <MultiSelectOption value="Summer Note">Summer Note</MultiSelectOption>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="">Description</Label>
            <TextArea type="text" onChange={(e) => this.onChange(e)} name="description" value={item.description} width="100%"/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="">Client-facing? {item.clientFacing === null ? <Indicator type={"undefined"} /> : ""}</Label>
            <div>
              <Label>Yes</Label>
              <input type="radio" name="clientFacing" checked={this.state.data.clientFacing === true ? true : false} value="true" onChange={(e) => this.onChange(e)}/>
            </div>
            <div>
              <Label>No</Label>
              <input type="radio" name="clientFacing" checked={this.state.data.clientFacing === false ? true : false}  value="false" onChange={(e) => this.onChange(e)}/>
            </div>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="">Key: {item.id}</Label>
            <SmallID readOnly ref={this.imagePath} value={"~/Desktop/design-system-inventory-database/images/" + item.id} onClick={() => this.imagePath.current.select()} />
          </FormGroup>
          <FooterActions>
            <Button warning onClick={() => this.handleDelete()} value="Delete">Delete</Button>
          </FooterActions>
        </FormContainer>
      )
    } else {
      return (<FormContainer></FormContainer>)
    }
  }
}

const FormContainer = styled.div`
  width: 30vw;
  height: 100vh;
  overflow: scroll;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  padding: 50px;
  box-sizing: border-box;

  background: ${props => props.theme.background};
  transition: background 1s;
  color: ${props => props.theme.body};
`;
const ImagePreviewContainer = styled.div`
  border: 1px solid ${props => props.theme.backgroundAlt};
  transition: border 1s;
  border-radius: 4px;
  padding: 24px;
  display: block;
  margin-bottom: 8px;
  width: 100%;
  box-sizing: border-box;
  background: white;
  position: relative;

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
    box-shadow: 0 10px 20px ${props => transparentize(.9, props.theme.body)};
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
`;
const ImagePreview = styled.img``;
const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const Title = styled.h2`
  margin: 16px 0 4px;
  font-size: 28px;
  font-weight: 700;
`;
const Link = styled.a`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
  color: ${props => props.theme.primary};
  text-decoration: none;
  word-break: break-all;
  transition: opacity .2s;
  &:hover {
    opacity: .75;
  }
`;
const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
`;
const SmallID = styled.input`
  margin-top: 8px;
  font-size: 11px;
  width: 100%;
  border: 1px solid ${props => props.theme.inputBorder};
  background: ${props => props.theme.background};
  color: ${props => props.theme.body};
  transition: background 1s, border 1s;
`;
const FooterActions = styled.div`
  margin-top: 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const RecentURL = styled.span`
  padding-left: 8px;
  margin: 8px 0 0;
  font-size: 11px;
  width: 100%;
  overflow: hidden;
  opacity: .5;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;
const MultiSelectOption = styled.option`
  padding: 4px;
  border-radius: 4px;
  color: ${props => props.disabled ? `rgba(255,255,255,.3)` : "unset"};
  margin-bottom: 2px;
`;
const Indicator = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  margin-left: 4px;
`;