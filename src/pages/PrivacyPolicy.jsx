import LegalLayout from "../LegalLayout";


export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        You, Because  respects your privacy. This policy explains how we
        collect and use your information.
      </p>

      <p>
        <strong>Information we collect:</strong> Name, email address, and the
        notes you create. Payment details are processed securely by Razorpay and
        are never stored by us.
      </p>

      <p>
        <strong>Usage:</strong> We use your information to provide our services,
        process payments, and improve the platform.
      </p>

      <p>
        <strong>Third-party services:</strong> Firebase (authentication &
        database) and Razorpay (payments).
      </p>

      <p>
        If you have questions, contact us at{" "}
        <strong>support@youbecause.in</strong>.
      </p>
    </LegalLayout>
  );
}
