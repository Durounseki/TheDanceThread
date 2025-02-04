const TermsOfService = () => {
  const lastUpdated = import.meta.env.LAST_UPDATED;
  const websiteName = import.meta.env.VITE_WEBSITE_NAME;
  const companyName = import.meta.env.VITE_COMPANY_NAME;
  const yourCountryState = import.meta.env.VITE_COUNTRY_STATE;
  const yourEmailAddress = import.meta.env.VITE_EMAIL_ADDRESS;

  return (
    <section className="legal-document">
      <h1>Terms of Service</h1>

      <p>
        <strong>Last Updated:</strong> {lastUpdated}
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using {websiteName} (the &quot;Website&quot;), you
        (&quot;you&quot; or &quot;User&quot;) agree to be bound by these Terms
        of Service (&quot;Terms&quot;). If you do not agree to these Terms,
        please do not use the Website.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        {websiteName} is an online platform that allows registered users to
        create, share, and discover events. Users can create event listings that
        include the event name, venue name and location (via a Google Maps URL),
        a brief description, the date, and an image for the event flyer. Users
        can also indicate their interest in events by &quot;liking&quot; them
        and confirming their attendance. Additionally, users can be listed as
        artists or DJs for events.
      </p>
      <h2>3. User Accounts</h2>
      <ul>
        <li>
          <strong>Registration:</strong> To create an event, you must register
          for an account. We use Google Authentication for user registration and
          login. By using Google Authentication, you agree to be bound by
          Google&apos;s Terms of Service and Privacy Policy.
        </li>
        <li>
          <strong>Account Information:</strong> We collect your name and email
          address, which are provided by Google during the authentication
          process. We also collect your social network URL if you choose to
          provide it.
        </li>
        <li>
          <strong>Account Security:</strong> You are responsible for maintaining
          the confidentiality of your account credentials and for all activities
          that occur under your account. You agree to immediately notify us of
          any unauthorized use of your account or any other breach of security.
        </li>
      </ul>
      <h2>4. User Conduct</h2>
      <ul>
        <li>
          <strong>Lawful Use:</strong> You agree to use the Website only for
          lawful purposes and in a manner that does not infringe the rights of,
          restrict, or inhibit the use and enjoyment of the Website by any third
          party.
        </li>
        <li>
          <strong>Prohibited Content:</strong> You are prohibited from posting
          or transmitting any content that is unlawful, harmful, threatening,
          abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of
          another&apos;s privacy, hateful, or racially, ethnically, or otherwise
          objectionable.
        </li>
        <li>
          <strong>Accuracy of Information:</strong> You represent and warrant
          that all information you provide on the Website, including event
          details, is accurate and truthful to the best of your knowledge.
        </li>
        <li>
          <strong>Respect for Others:</strong> You agree to interact with other
          users respectfully and refrain from any behavior that could be
          considered harassment, bullying, or discrimination.
        </li>
      </ul>
      <h2>5. Intellectual Property</h2>
      <ul>
        <li>
          <strong>Ownership:</strong> {websiteName} and its original content,
          features, and functionality are and will remain the exclusive property
          of {companyName} and its licensors.
        </li>
        <li>
          <strong>User Content:</strong> By posting content to the Website, you
          grant {websiteName} a non-exclusive, worldwide, royalty-free,
          sublicensable, and transferable license to use, reproduce, distribute,
          prepare derivative works of, display, and perform the content in
          connection with the Website and {websiteName}&apos;s business.
        </li>
        <li>
          <strong>Copyright:</strong> If you believe that any content on the
          Website infringes your copyright, please notify us in writing with
          detailed information about the alleged infringement.
        </li>
      </ul>
      <h2>6. Privacy</h2>
      <ul>
        <li>
          <strong>Data Collection:</strong> We collect your name and email
          address, which are provided by Google during the authentication
          process, and your social network URL if you choose to provide it.
        </li>
        <li>
          <strong>Data Use:</strong> We use your information solely for the
          purpose of user authentication, authorization, communication related
          to your account and events on the Website, and to display your social
          network links on your profile if you have provided them. We do not
          sell or share your information with third parties, except as required
          by law.
        </li>
        <li>
          <strong>Cookies:</strong> We use only essential cookies that are
          strictly necessary for user authentication and authorization on the
          Website.
        </li>
        <li>
          <strong>Google Services:</strong> Please review Google&apos;s Privacy
          Policy to understand how Google collects and uses your data when you
          use Google Authentication and Google Maps.
        </li>
      </ul>
      <h2>7. Termination</h2>
      <p>
        We may terminate or suspend your account and access to the Website, with
        or without cause, at any time and without prior notice. Upon
        termination, your right to use the Website will immediately cease.
      </p>
      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The Website is provided on an &quot;as is&quot; and &quot;as
        available&quot; basis. We make no warranties, expressed or implied,
        regarding the Website, including but not limited to the accuracy,
        completeness, reliability, suitability, or availability of the Website
        or its content.
      </p>
      <h2>9. Limitation of Liability</h2>
      <p>
        In no event shall {websiteName}, its affiliates, directors, officers,
        employees, or agents be liable for any indirect, incidental, special,
        consequential, or punitive damages arising out of or relating to your
        use of the Website, even if we have been advised of the possibility of
        such damages.
      </p>
      <h2>10. Governing Law</h2>
      <p>
        These Terms shall be governed and construed in accordance with the laws
        of {yourCountryState}, without regard to its conflict of law provisions.
      </p>
      <h2>11. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. We will post the
        updated Terms on the Website and update the &quot;Last Updated&quot;
        date. Your continued use of the Website after any such changes
        constitutes your acceptance of the new Terms.
      </p>
      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        {yourEmailAddress}.
      </p>
    </section>
  );
};

export default TermsOfService;
