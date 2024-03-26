import { useState } from "react";
import * as React from "react";
import {
  Button,
  Container,
  ContentLayout,
  Input,
  Header,
  Form,
  FormField,
  SpaceBetween
} from '@cloudscape-design/components';
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import logo from './llmicon.png';
import axios from 'axios';

const CenteredContent = ({ children } : { children : any }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    {children}
  </div>
);

export default () => {
  const [trainJobName, setTrainJobName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [visible, setVisible] = useState(false);

  const handleSubmitButton = async (event: any) => {
    event.preventDefault();
  
    const prefix = 'execution';
    const randomSuffix = Math.random().toString(36).substring(7);
    const executionName = `${prefix}-${randomSuffix}`;

    const payload = {
      "trainingName": trainJobName,
      "email": email
    }

    console.log(payload)

    // const payload1 = {
    //   "input": JSON.stringify(payload),
    //   "name": executionName,
    //   "stateMachineArn": "arn:aws:states:us-east-1:755215164008:stateMachine:project-lol-state-machine"
    // };

    const payload1 = {
      "input": JSON.stringify(payload),
      "name": executionName,
      "stateMachineArn": "arn:aws:states:us-east-1:306561931270:stateMachine:lol-state-machine-one"
    };

    try {
      const response = await axios.post('https://nmlglvmunl.execute-api.us-east-1.amazonaws.com/dev/submit-job', payload1, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      setTrainJobName("");
      setEmail("");
      setVisible(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOkButton = async (event: any) => {
    setVisible(false);
  }

  return (
    <ContentLayout
      header={
        <Header variant="h1">
          <CenteredContent>
            <img width={'70px'} src={logo} alt="Logo" />
            <span style={{ marginLeft: '15px' }}>League Of LLMs</span>
          </CenteredContent>
        </Header>
      }
    >
    <form onSubmit={e => e.preventDefault()}>
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleSubmitButton} variant="primary">Submit</Button>
          </SpaceBetween>}>
        <Container
          header={
            <Header variant="h2" description="Enter your email and training job name to receive the JSON output.">
              Input Configuration
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="l">
            <FormField label="Training Job Name">
            <Input placeholder="Training Job Name" value={trainJobName} onChange={(event: { detail: { value: any }; }) => {
              if (trainJobName) {
                setTrainJobName("");
                }
                setTrainJobName(event.detail.value);
              }}
            />
            </FormField>
            <FormField label="Email">
            <Input placeholder="Email" value={email} onChange={(event: { detail: { value: any }; }) => {
              if (email) {
                setEmail("");
                }
                setEmail(event.detail.value);
              }}
            />
            </FormField>
          </SpaceBetween>
        </Container>
      </Form>
    </form>
    <Modal onDismiss={() => setVisible(false)} visible={visible} footer={<Box float="right"><SpaceBetween direction="horizontal" size="xs"><Button onClick={handleOkButton} variant="primary">Ok</Button></SpaceBetween></Box>}header={<React.Fragment>Success!</React.Fragment>}>The output json file will be sent to your email within the next 10 to 15 minutes.{" "}</Modal>
    </ContentLayout>
  );
}