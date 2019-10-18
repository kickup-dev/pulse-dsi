
import App from 'next/app'
import React, {Fragment} from 'react'
import { ThemeProvider } from 'styled-components'
import { Reset } from 'styled-reset';
import {lightMode, darkMode} from '../theme';

export default class MyApp extends App {
  constructor(props) {
    super(props)
    this.state = {
      theme: darkMode
    }
  }

  toggleTheme() {
    this.setState({
      theme: this.state.theme === lightMode ? darkMode : lightMode
    })
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <Fragment>
        <Reset/>
        <style>{`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
              "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
              monospace;
          }
        `}</style>
        <ThemeProvider theme={this.state.theme}>
          <Component toggleTheme={() => this.toggleTheme()} {...pageProps} />
        </ThemeProvider>
      </Fragment>
    )
  }
}