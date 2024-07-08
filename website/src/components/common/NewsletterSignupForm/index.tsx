import React, {useState} from 'react';

import {Form, FormInput, HiddenBotInput, Intro, SubscribeButton, Wrapper} from './index.styles';

export const NewsletterSignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

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
          value={email}
          onChange={handleEmailChange}
        />

        <FormInput
          type="text"
          name="FNAME"
          placeholder="First Name"
          value={firstName}
          onChange={handleFirstNameChange}
        />

        {/* From MailChimp: do not remove this or risk form bot signups */}
        <HiddenBotInput
          type="text"
          name="b_d19fa80c86cc4e9017baf4f4b_c7ca01e19c"
          tabIndex={-1}
          value=""
          onChange={() => {}}
        />

        <SubscribeButton>Subscribe</SubscribeButton>
      </Form>
    </Wrapper>
  );
};
