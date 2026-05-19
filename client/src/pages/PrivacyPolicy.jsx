import React from 'react';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      padding: '0 0 40px'
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a73e8, #f57c00)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none',
                   color: 'white', fontSize: 22,
                   cursor: 'pointer', padding: 0 }}>
          ←
        </button>
        <div>
          <h1 style={{ color: 'white', fontSize: 20,
                       fontWeight: 700, margin: 0 }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)',
                      fontSize: 12, margin: 0 }}>
            Last updated: May 2026
          </p>
        </div>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: 480,
                    margin: '0 auto' }}>

        {/* Introduction */}
        <div style={{ background: 'white', borderRadius: 12,
                      padding: 20, marginBottom: 16,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <p style={{ color: '#555', fontSize: 14,
                      lineHeight: 1.7, margin: 0 }}>
            At <strong>HomeFil</strong> we take your privacy seriously.
            This policy explains what information we collect, how we use
            it and how we protect it. We only collect what is necessary
            to provide our water and gas delivery connection service.
          </p>
        </div>

        {[
          {
            number: '1',
            icon: '📋',
            title: 'Information We Collect',
            items: [
              'Full name when you register',
              'Email address for your account',
              'Phone number to connect you with suppliers',
              'Location to show nearby suppliers',
              'Product listings posted by suppliers',
              'Urgent requests posted by customers'
            ]
          },
          {
            number: '2',
            icon: '🔍',
            title: 'How We Use Your Information',
            items: [
              'To create and manage your HomeFil account',
              'To show your listings to nearby customers',
              'To connect customers with suppliers',
              'To improve our app and services',
              'To send important account notifications',
              'To prevent fraud and fake accounts'
            ]
          },
          {
            number: '3',
            icon: '🔒',
            title: 'How We Protect Your Data',
            items: [
              'All passwords are encrypted and never stored as plain text',
              'We use secure HTTPS connections for all data',
              'Your data is stored on secure cloud servers',
              'Only you and admins can access your account details',
              'We do not sell your personal data to anyone',
              'Regular security checks are performed on our systems'
            ]
          },
          {
            number: '4',
            icon: '📤',
            title: 'Information We Share',
            items: [
              'Supplier phone numbers are shown to customers who view listings',
              'Customer location is shown when posting urgent requests',
              'We do not share your data with third party companies',
              'We may share data if required by Kenya law enforcement',
              'Aggregate anonymous data may be used for app improvement'
            ]
          },
          {
            number: '5',
            icon: '💳',
            title: 'Payment Information',
            items: [
              'HomeFil does NOT collect any payment information',
              'All payments happen directly between users',
              'We never ask for your bank or M-Pesa details',
              'Be careful of anyone claiming to be HomeFil asking for payment'
            ]
          },
          {
            number: '6',
            icon: '🍪',
            title: 'Cookies and Storage',
            items: [
              'We use browser storage to keep you logged in',
              'Your saved contacts are stored on your device only',
              'No tracking cookies are used on HomeFil',
              'Clearing your browser data will log you out'
            ]
          },
          {
            number: '7',
            icon: '👤',
            title: 'Your Rights',
            items: [
              'You can update your account information at any time',
              'You can delete your account by contacting support',
              'You can request a copy of your data from us',
              'You can opt out of notifications at any time',
              'Contact us at support@homefil.com for any requests'
            ]
          },
          {
            number: '8',
            icon: '👶',
            title: 'Children\'s Privacy',
            items: [
              'HomeFil is not intended for users under 18 years old',
              'We do not knowingly collect data from children',
              'Parents should monitor their children\'s app usage'
            ]
          }
        ].map((section) => (
          <div key={section.number}
            style={{ background: 'white', borderRadius: 12,
                     padding: 20, marginBottom: 16,
                     boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center',
                          gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #e3f2fd, #fff3e0)',
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0
              }}>
                {section.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700,
                           color: '#1a1a2e', margin: 0 }}>
                {section.title}
              </h3>
            </div>
            {section.items.map((item, i) => (
              <div key={i} style={{ display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 8, marginBottom: 8 }}>
                <span style={{ color: '#1a73e8', fontSize: 14,
                               flexShrink: 0, marginTop: 1 }}>•</span>
                <p style={{ color: '#555', fontSize: 14,
                            lineHeight: 1.6, margin: 0 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        ))}

        {/* Contact */}
        <div style={{ background: 'linear-gradient(135deg, #1a73e8, #f57c00)',
                      borderRadius: 12, padding: 20,
                      marginBottom: 16, textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: 14,
                      fontWeight: 600, margin: '0 0 4px' }}>
            Questions about your Privacy?
          </p>
          <p style={{ color: 'rgba(255,255,255,0.9)',
                      fontSize: 13, margin: 0 }}>
            Contact us at support@homefil.com
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            width: '100%', padding: 15,
            background: 'linear-gradient(135deg, #1a73e8, #f57c00)',
            color: 'white', border: 'none',
            borderRadius: 12, fontSize: 16,
            fontWeight: 700, cursor: 'pointer'
          }}>
          ← Back to Sign Up
        </button>
      </div>
    </div>
  );
}

export default PrivacyPolicy;