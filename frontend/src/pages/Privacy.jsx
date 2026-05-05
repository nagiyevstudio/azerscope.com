import { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="legal-page page-wrap">
      <div className="legal-container glass">
        <h1>Privacy Policy</h1>
        <p><strong>Last Updated:</strong> February 09, 2026</p>

        <p>This Privacy Policy describes how <strong>Faig Naghiyev</strong> ("we," "us," or "our") collects, uses, and
            discloses your information when you use the <strong>Azerscope</strong> mobile application (the "App").</p>

        <h2>1. Information We Collect</h2>

        <h3>1.1. Account Information</h3>
        <p>When you create an account, we collect your:</p>
        <ul>
            <li><strong>Email Address:</strong> To verify your identity and allow you to log in.</li>
            <li><strong>Password:</strong> Encrypted and stored securely for authentication.</li>
        </ul>

        <h3>1.2. Location Data (Crucial for App Functionality)</h3>
        <p>Azerscope is an astronomy utility that requires your location to function. We collect and process your
            precise or
            approximate location data (GPS coordinates) solely to:</p>
        <ul>
            <li>Calculate celestial positions (stars, planets, satellites) relative to your viewpoint.</li>
            <li>Determine local sunrise, sunset, and weather conditions.</li>
            <li>Calculate light pollution levels and visibility.</li>
        </ul>
        <p><strong>Privacy of Location Data:</strong></p>
        <ul>
            <li>Your coordinates are used in real-time on your device.</li>
            <li>When coordinates are sent to our server (e.g., to fetch weather or astronomical data), they are
                processed
                <strong>anonymously</strong>.
            </li>
            <li>Our backend may cache calculation results based on coordinates to improve performance, but <strong>we do
                    not
                    link location data to your user profile or identity</strong> in our database. We do not track your
                movement history.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
            <li>Provide, maintain, and improve the App's features.</li>
            <li>Manage your account and authentication.</li>
            <li>Respond to your comments and questions (Customer Support).</li>
        </ul>

        <h2>3. Data Storage and Retention</h2>
        <p>Your personal data (account info) is stored on our secure private servers (VPS) using
            <strong>PocketBase</strong>.
        </p>
        <p><strong>Account Deletion:</strong> If you request to delete your account via the App settings or our website:
        </p>
        <ul>
            <li>Your active account data is permanently deleted from our live databases immediately.</li>
            <li>Residual copies may remain in our secure backup systems for up to <strong>30 days</strong> strictly for
                disaster recovery purposes, after which they are automatically overwritten.</li>
        </ul>

        <h2>4. Third-Party Services</h2>
        <p>We currently use the following third-party service providers:</p>
        <ul>
            <li><strong>PocketBase:</strong> An open-source backend solution hosted on our private infrastructure for
                data
                management.</li>
        </ul>
        <p>We do not currently use third-party analytics or crash reporting tools. If this changes in the future, we
            will
            update this policy.</p>

        <h2>5. Children’s Privacy</h2>
        <p>Our App is not intended for children under the age of 13. We do not knowingly collect personal information
            from
            children under 13. If we discover that a child under 13 has provided us with personal information, we will
            delete such information from our servers immediately.</p>

        <h2>6. Changes to This Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy
            Policy on this page.</p>

        <h2>7. Contact Us</h2>
        <div className="contact">
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p><strong>Email:</strong> <a href="mailto:info@azerscope.net">info@azerscope.net</a></p>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
