import React from 'react';
import logo from './logo.svg';
import { Container } from 'react-bootstrap';
import { Heading } from '@chakra-ui/react';
import PageTemplate from './component/PageTemplate';

function App() {
  return (
    <PageTemplate>
      <Container>
        <Heading>Hello</Heading>
      </Container>
    </PageTemplate>
  );
}

export default App;
