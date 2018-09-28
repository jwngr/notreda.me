import React, {Component} from 'react';

import {Wrapper, Intro, Form, FormInput, HiddenBotInput, SubscribeButton} from './index.styles';

class NewsletterSignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      firstName: '',
    };

    this.onEmailChange = this.onInputChange.bind(this, 'email');
    this.onFirstNameChange = this.onInputChange.bind(this, 'firstName');
  }

  onInputChange(name, event) {
    this.setState({
      [name]: event.target.value,
    });
  }

  render() {
    return (
      <Wrapper>
        <Intro>
          <p>Want more deep dives on Notre Dame football?</p>
          <p>Subscribe to a low-volume newsletter to get notified when new content is published.</p>
        </Intro>

        <Form
          method="post"
          action="//notreda.us15.list-manage.com/subscribe/post?u=d19fa80c86cc4e9017baf4f4b&amp;id=c7ca01e19c"
          name="mc-embedded-subscribe-form"
          target="_blank"
          rel="noopener"
          noValidate
        >
          <FormInput
            type="email"
            name="EMAIL"
            placeholder="Email"
            value={this.state.email}
            onChange={this.onEmailChange}
          />

          <FormInput
            type="text"
            name="FNAME"
            placeholder="First Name"
            value={this.state.firstName}
            onChange={this.onFirstNameChange}
          />

          {/* From MailChimp: do not remove this or risk form bot signups */}
          <HiddenBotInput
            type="text"
            name="b_d19fa80c86cc4e9017baf4f4b_c7ca01e19c"
            tabIndex="-1"
            value=""
          />

          <SubscribeButton>Subscribe</SubscribeButton>
        </Form>
      </Wrapper>
    );
  }
}

export default NewsletterSignupForm;
