const PrivacyPolicy = () => {
  const lastUpdated = import.meta.env.LAST_UPDATED;
  const companyName = import.meta.env.VITE_COMPANY_NAME;
  const websiteName = import.meta.env.VITE_WEBSITE_NAME;
  const yourEmailAddress = import.meta.env.VITE_EMAIL_ADDRESS;

  return (
    <section className="legal-document">
      <h1>Privacy Policy</h1>

      <p>
        <strong>Last Updated:</strong> {lastUpdated}
      </p>

      <h2>1. Introduction</h2>
      <p>
        {companyName} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is
        committed to protecting the privacy of our users (&quot;you&quot; or
        &quot;User&quot;). This Privacy Policy explains how we collect, use,
        disclose, and safeguard your information when you visit our website{" "}
        {websiteName} (the &quot;Website&quot;). Please read this Privacy Policy
        carefully. If you do not agree with the terms of this Privacy Policy,
        please do not access the Website.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We collect as little information as possible to provide our services.
        The only personal information we collect is:
      </p>
      <ul>
        <li>
          <strong>Name:</strong> Your name, as provided by Google during the
          Google Authentication process.
        </li>
        <li>
          <strong>Email Address:</strong> Your email address, as provided by
          Google during the Google Authentication process.
        </li>
        <li>
          <strong>Social Network Information:</strong> If you choose to provide
          it, we collect your social network URLs (e.g., Facebook, Twitter,
          Instagram). This information is optional.
        </li>
      </ul>
      <p>
        We do not collect any other personal information, such as your address,
        phone number, or any other sensitive data.
      </p>

      <h2>3. How We Collect Information</h2>
      <p>
        User authentication on our Website is handled through Google
        Authentication. When you register or log in using Google, Google
        provides us with your name and email address. Additionally, you have the
        option to provide your social network URLs on your profile. We do not
        collect information through any other means.
      </p>
      <h2>4. How We Use Your Information</h2>
      <p>
        We use the information we collect solely for the following purposes:
      </p>
      <ul>
        <li>
          <strong>User Authentication and Authorization:</strong> To verify your
          identity and allow you to access your account and use the
          Website&apos;s features.
        </li>
        <li>
          <strong>Account Management:</strong> To manage your account and
          provide you with customer support.
        </li>
        <li>
          <strong>Communication:</strong> To communicate with you about your
          account, events you have created or expressed interest in, and updates
          to our Terms of Service or Privacy Policy. We do not use your
          information for marketing purposes.
        </li>
        <li>
          <strong>Social Network Display:</strong> If provided, to display your
          social network links on your profile, allowing other users to connect
          with you.
        </li>
      </ul>
      <h2>5. Disclosure of Your Information</h2>
      <p>
        We do not sell, trade, or rent your personal information to third
        parties. We may disclose your information only in the following limited
        circumstances:
      </p>
      <ul>
        <li>
          <strong>Legal Requirements:</strong> We may disclose your information
          if required to do so by law or in response to valid requests by public
          authorities (e.g., a court or government agency).
        </li>
        <li>
          <strong>Protection of Rights:</strong> We may disclose your
          information to protect the rights, property, or safety of{" "}
          {companyName}, our users, or others.
        </li>
      </ul>
      <h2>6. Data Security</h2>
      <p>
        We are committed to protecting your data and follow industry best
        practices to prevent unauthorized access, use, or disclosure. However,
        no method of transmission over the internet or method of electronic
        storage is completely secure. While we strive to use commercially
        acceptable means to protect your personal information, we cannot
        guarantee its absolute security. By using the Website, you acknowledge
        and accept that data breaches are a possibility, despite our best
        efforts.
      </p>
      <h2>7. Cookies</h2>
      <p>
        We use only essential cookies that are strictly necessary for the
        operation of the Website. These cookies are used solely for user
        authentication and authorization. We do not use tracking cookies,
        advertising cookies, or any other type of cookies that collect personal
        information for non-essential purposes.
      </p>
      <h2>8. Third-Party Websites</h2>
      <p>
        Our Website may contain links to third-party websites, including Google
        Maps. We are not responsible for the privacy practices or content of
        these third-party websites. We encourage you to review the privacy
        policies of those websites before providing any personal information.
      </p>
      <h2>9. Children&apos;s Privacy</h2>
      <p>
        Our Website is not intended for children under the age of 13. We do not
        knowingly collect personal information from children under 13. If we
        become aware that we have collected personal information from a child
        under 13, we will take steps to delete such information from our
        records.
      </p>
      <h2>10. Your Rights</h2>
      <p>
        Depending on your location, you may have certain rights regarding your
        personal information, including the right to access, correct, or delete
        your information. If you have any questions about your rights or would
        like to exercise them, please contact us. Since all user authentication
        is handled by google, users must refer to Google&apos;s Privacy Policy
        to understand how Google collects and uses your data when you use Google
        Authentication and Google Maps.
      </p>
      <h2>11. Changes to This Privacy Policy</h2>
      <p>
        We reserve the right to modify this Privacy Policy at any time. We will
        post the updated Privacy Policy on the Website and update the &quot;Last
        Updated&quot; date. Your continued use of the Website after any such
        changes constitutes your acceptance of the new Privacy Policy.
      </p>
      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at {yourEmailAddress}.
      </p>
    </section>
  );
};

export default PrivacyPolicy;
