import "./PrivacyPolicyPage.scss";

function PrivacyPolicyPage() {
  return (
    <div className="privacy__flex-container">
      <div className="privacy__content-container">
        <h2 className="privacy__title">Privacy Policy</h2>

        <section>
          <p>
            Welcome to The BIGmini Crossword. This privacy policy outlines how
            we collect, use, and protect your personal information when you use
            our services.
          </p>
          <p>
            <ul className="privacy__list">
              <li className="privacy__item">
                Authentication with this application is voluntary and is done
                through third parties. Authentication is used and necessary only
                for tracking game statistics.
              </li>
              <li className="privacy__item">
                Your game statistics, if you choose to have them tracked, are
                stored in our database based on your authentication identity and email
                relayed to us via third-party authentication.
              </li>
              <li className="privacy__item">
                No personal data shared with us will be provided to any third
                party.
              </li>
              <li className="privacy__item">
                We do not engage in ad targeting, data mining, or other
                activities that may compromise your privacy, and we do not
                affiliate ourselves with any third parties that do so.
              </li>
            </ul>
          </p>
        </section>

        <section>
          <h3 className="privacy__subtitle">Contact Us</h3>
          <p>
            If you have any questions about this privacy policy, please contact
            us at thebigminicrossword@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
