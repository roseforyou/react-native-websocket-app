import React, { Component } from "react";
import { Container, Header, Title, Content, Button, Icon, Left, Body, Text, Form, Item, Input, Label } from "native-base";
export default class HeaderTransparent extends Component {
  render() {
    return (
      <Container style={{backgroundColor: "#87cefa"}}>
        <Header transparent>
          <Body>
            <Title>React native websocket client</Title>
          </Body>
        </Header>
        <Content>
          <Text>
            Header with transparent prop1
          </Text>
          <Form>
              <Item stackedLabel>
                <Label>Token:</Label>
                <Input />
              </Item>
              <Item stackedLabel last>
                <Label>RoomID:</Label>
                <Input keyboardType="numeric"/>
              </Item>
              <Item>

              <Button light><Text> Light </Text></Button>

              <Button light><Text> Light </Text></Button>
              </Item>
            </Form>
        </Content>
      </Container>
    );
  }
}