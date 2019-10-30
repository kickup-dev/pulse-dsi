import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Form from '../components/Form.js';
import Gallery from '../components/Gallery.js';

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedImage: null,
    }
  }

  handleSelectImage(id) {
    this.setState({
      selectedImage: id
    })
  }
  handleDeleteImage() {
    this.setState({
      selected: null
    })
  }

  render() {
    return (
      <AppContainer>
        <Head>
          <title>Pulse Design System Inventory</title>
        </Head>
        <Main>
          <Gallery selected={this.state.selectedImage} handleToggleTheme={()=>this.props.toggleTheme()} handleSelectImage={(id) => this.handleSelectImage(id)}/>
          <Form selectedID={this.state.selectedImage} handleDeleteImage={() => this.handleDeleteImage()}></Form>
        </Main>
      </AppContainer>
    );
  }
}

export default Index;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Main = styled.div`
  display: flex;
  flex-direction: row;
`;

