import styled from 'styled-components';
import {darken} from 'polished';
import { withTheme } from 'styled-components';

const Label = withTheme(styled.label`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
`);
const Checkbox = withTheme(styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid ${props => props.theme.backgroundAlt};
  background: ${props => props.theme.background};
  color: ${props => props.theme.body};
`);
const Input = withTheme(styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid ${props => props.theme.inputBorder};
  background: ${props => props.theme.background};
  transition: background 1s, border 1s;
  color: ${props => props.theme.body};
`);
const Select = withTheme(styled.select`
  height: 35px;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid ${props => props.theme.inputBorder};
  background: ${props => props.theme.background};
  transition: background 1s, border 1s;
  color: ${props => props.theme.body};
`);
const Button = withTheme(styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  border: 1px solid ${props => props.theme.body};
  background: ${props => props.theme.body};
  color: ${props => props.theme.background};
  
  &:hover {
    background: ${props => darken(.15, props.theme.body)};
    border: 1px solid ${props => darken(.15, props.theme.body)};
    color: ${props => props.theme.background};
  }

  ${props => {
    if (props.primary) {
      return `
        border: 1px solid ${props.theme.primary};
        background: ${props.theme.primary};
        color: white;
        &:hover {
          background: ${darken(.15, props.theme.primary)};
          border: 1px solid ${darken(.15, props.theme.primary)};
        }
      `
    } else if (props.warning) {
      return `
        border: 1px solid rgb(230, 62, 52);
        background: transparent;
        color: rgb(230, 62, 52);
        &:hover {
          color: rgb(230, 62, 52);
          border: 1px solid rgb(230, 62, 52);
          background: rgba(230, 62, 52, .125);
        }
      `
    } else if (props.selected) {
      return `
        border: 1px solid ${props.theme.primary};
        background: ${props.theme.primary};
        color: white;
        &:hover {
          background: rgb(45, 88, 159);
        }

      `
    }
  }}
`);
const Radio = withTheme(styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  cursor: pointer;

  ${props => {
    if (props.checked) {
      return `
        border: 1px solid ${props => props.theme.primary};
        background: ${props => props.theme.primary};
        color: white;
        &:hover {
          background: rgb(45, 88, 159);
        }
        
      `
    }
  }}
`);
const TextArea = withTheme(styled.textarea`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  min-height: 4em;
  border: 1px solid ${props => props.theme.inputBorder};
  background: ${props => props.theme.background};
  transition: background 1s, border 1s;
  color: ${props => props.theme.body};
`);

export {
  Label,
  Checkbox,
  Input,
  Select,
  TextArea,
  Button,
  Radio
}