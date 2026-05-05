import { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="legal-page page-wrap">
      <div className="legal-container glass">
        <h1>Terms of Use</h1>
        <p><strong>Last Updated:</strong> February 09, 2026</p>

        <p>Please read these Terms of Use ("Terms") carefully before using the <strong>Azerscope</strong> mobile
            application
            (the "App") operated by <strong>Faig Naghiyev</strong> ("we," "us," or "our").</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using the App, you agree to be bound by these Terms. If you disagree with any part of the
            terms,
            you may not access the App.</p>

        <h2>2. Use License</h2>
        <p>We grant you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the
            App
            strictly in accordance with these Terms for your personal, non-commercial purposes.</p>

        <h2>3. User Accounts</h2>
        <p>When you create an account with us, you must provide information that is accurate and complete. You are
            responsible for safeguarding the password that you use to access the App and for any activities or actions
            under
            your password.</p>

        <h2>4. Location Services & Safety</h2>
        <p>The App provides astronomical data based on your location. You acknowledge that:</p>
        <ul>
            <li>You use the App at your own risk.</li>
            <li>You should always be aware of your surroundings while using the App, especially at night.</li>
            <li>We are not responsible for any injury or damage that may occur while you are using the App outdoors.
            </li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>The App and its original content, features, and functionality are and will remain the exclusive property of
            Faig
            Naghiyev and its licensors. The App is protected by copyright and other laws of Azerbaijan and foreign
            countries.</p>

        <h2>6. Disclaimer</h2>
        <p>The App is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the astronomical
            calculations
            will be 100% accurate or free from errors, as they rely on complex algorithms and external data factors.</p>

        <h2>7. Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of <strong>Azerbaijan</strong>,
            without
            regard to its conflict of law provisions.</p>

        <h2>8. Changes</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to
            access or use our App after those revisions become effective, you agree to be bound by the revised terms.
        </p>

        <h2>9. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at <a
                href="mailto:info@azerscope.net">info@azerscope.net</a>.</p>
      </div>
    </section>
  );
};

export default Terms;
