import React from 'react';
import styled from 'styled-components';
import {darken} from 'polished';
import { withTheme } from 'styled-components';

class ThemeToggle extends React.Component {
    
    render() {
        let themeName = this.props.theme.body === "white" ? "darkMode" : "lightMode";
        console.log(themeName)
        return (
            <Container>
                <ToggleIcon>☀️</ToggleIcon>
                <ToggleContainer themeName={themeName} onClick={() => this.props.onClick()}>
                    <ToggleButton themeName={themeName}/>
                </ToggleContainer>
                <ToggleIcon>🌙</ToggleIcon>
            </Container>
        )
    }
}

export default withTheme(ThemeToggle)

const ToggleIcon = styled.span`
    font-size: 10px;
    color: transparent;
    text-shadow: 0 0 0 ${props => props.themeName === "lightMode" ? props.theme.background : props.theme.body};
`;

const ToggleContainer = styled.div`
    width: 30px;
    height: 15px
    border-radius: 15px;
    background: ${props => props.themeName === "lightMode" ? props.theme.backgroundAlt : props.theme.primary};
    position: relative;
    margin: 0 8px;
    cursor: pointer;
    transition: background 1s;

    &:hover {
        background: ${props => props.themeName === "lightMode" ? darken(.1, props.theme.backgroundAlt) : darken(.1, props.theme.primary)};
    }
`;
const Container = styled.div`
    display: flex;
    align-items: center;
`;
const ToggleButton = styled.div`
    height: 13px;
    width: 13px;
    border-radius: 50%;
    position: absolute;
    background: ${props => props.theme.background};
    top: 1px;
    transition: left .3s .2s;
    left: ${props => props.themeName === "lightMode" ? "1px" : "16px"};
`;