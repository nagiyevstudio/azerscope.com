import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="legal-page page-wrap">
      <div className="legal-container glass">
        <h1>Privacy Policy</h1>
        <p><strong>Last Updated:</strong> November 09, 2026</p>

        <p>This Privacy Policy describes how <strong>Faig Naghiyev</strong> ("we," "us," or "our") collects, uses,
          and protects your information when you use the <strong>AzerScope</strong> mobile application for iOS and
          Android (the "App") and the website azerscope.com.</p>

        <p>In short: we collect only what the App needs to work and to improve it. We do not sell your data, we do
          not show ads, and we do not track you across other apps or websites.</p>

        <h2>1. Information We Collect</h2>

        <h3>1.1. Account Information</h3>
        <p>You can use most of the App as a guest. If you create an account, we collect:</p>
        <ul>
          <li><strong>Email address</strong> — to identify you, let you sign in and send account emails (for example,
            email confirmation or password reset).</li>
          <li><strong>Password</strong> — stored only as a secure hash, never in plain text.</li>
          <li><strong>Sign in with Apple or Google</strong> — if you choose it, we receive your email address and
            an account identifier from that provider. We do not receive your Apple or Google password.</li>
          <li><strong>Profile details you choose to add</strong> — your name and profile photo.</li>
        </ul>

        <h3>1.2. Location Data</h3>
        <p>AzerScope is an astronomy app and uses your precise or approximate location to:</p>
        <ul>
          <li>calculate the positions, rise and set times of the Sun, the Moon, planets and constellations for your
            viewpoint;</li>
          <li>show local weather, sky darkness (Bortle scale) and observing conditions.</li>
        </ul>
        <p>To get weather and astronomical data, the App sends coordinates to our servers. These requests are not
          linked to your account, and we may cache results by coordinates to make the App faster. We do not track
          your movement history.</p>
        <p>If you <strong>save an observing location</strong> (for example, for the observing forecast), it is stored
          in your account so you can see it on all your devices. You can remove saved locations at any time.</p>
        <p>Location access is optional: you can deny it and add a location manually.</p>

        <h3>1.3. Content You Create</h3>
        <ul>
          <li><strong>Observation journal</strong> — notes, dates, places and photos you add to your
            observations.</li>
          <li><strong>Event registrations</strong> — when you register for an astronomy event in the App.</li>
        </ul>

        <h3>1.4. Usage and Diagnostic Data</h3>
        <p>To understand which features are useful and to fix problems, the App sends us usage events: which screens
          are opened and for how long, actions such as selecting a forecast day, app version, platform, device model,
          operating system version, language, time zone and technical error reports. These events include a random
          identifier of the app installation and, if you are signed in, your account identifier.</p>
        <p>This analytics is our own and is stored on our servers. We do not use third-party analytics, advertising
          or tracking services.</p>

        <h3>1.5. Notifications</h3>
        <p>Reminders (for example, about astronomical events or good observing nights) are scheduled locally on your
          device. We do not collect a push notification token. You can turn notifications off at any time in your
          device settings.</p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide the App's features, including your account, saved locations and observations.</li>
          <li>To send account emails such as email confirmation and password reset.</li>
          <li>To keep the App stable and secure, prevent abuse and enforce device limits of an account.</li>
          <li>To understand how the App is used and improve it.</li>
          <li>To answer your questions and support requests.</li>
        </ul>
        <p>We do not sell your personal data and do not use it for advertising.</p>

        <h2>3. Where Your Data Is Stored</h2>
        <p>Your data is stored on servers we control (a private VPS running <strong>PocketBase</strong> and our own
          API hosting). All connections between the App and our servers are encrypted (HTTPS).</p>

        <h2>4. Service Providers</h2>
        <p>We do not share your personal data with third parties for their own purposes. To run the App, we rely on
          these providers, who process data only on our behalf:</p>
        <ul>
          <li><strong>Hosting providers</strong> of our servers.</li>
          <li><strong>Apple and Google</strong> — for Sign in with Apple / Google, only if you choose them.</li>
          <li><strong>Open-Meteo</strong> and public scientific data sources — we request weather and astronomical
            data from them on our server. Your account data is not sent to them.</li>
        </ul>

        <h2>5. Retention and Account Deletion</h2>
        <p>We keep your account data while your account exists.</p>
        <p>You can delete your account at any time in the App: <strong>Profile → Settings → Delete account</strong>. If you no
          longer have the App installed, see <Link to="/delete-account">azerscope.com/delete-account</Link> or email
          us from the address of your account.</p>
        <p>When an account is deleted:</p>
        <ul>
          <li>your account, profile, observations and saved locations are permanently deleted from our live
            databases;</li>
          <li>usage events may be kept for statistics but are no longer associated with an existing account;</li>
          <li>residual copies may remain in encrypted backups for up to <strong>30 days</strong> and are then
            overwritten.</li>
        </ul>

        <h2>6. Your Rights</h2>
        <p>You can access and correct your profile in the App, delete saved locations and observations, and delete
          your account. You can also contact us to request a copy of your data or ask any question about how it is
          processed.</p>

        <h2>7. Children’s Privacy</h2>
        <p>The App is not directed to children under 13. We do not knowingly collect personal information from
          children under 13 without parental consent. If we learn that such information has been provided to us, we
          will delete it.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. The current version is always available on this page
          with its update date.</p>

        <h2>9. Contact Us</h2>
        <div className="contact">
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p><strong>Email:</strong> <a href="mailto:info@azerscope.net">info@azerscope.net</a></p>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
