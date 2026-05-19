import React from 'react';
import { useNavigate } from 'react-router-dom';

function TermsAndConditions() {
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
            Terms & Conditions
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
            Welcome to <strong>HomeFil</strong>. By using our app you agree
            to these terms. Please read them carefully before using our
            services. HomeFil connects customers with water and gas
            suppliers in Kenya.
          </p>
        </div>

        {[
          {
            number: '1',
            title: 'Who Can Use HomeFil',
            items: [
              'You must be 18 years or older to use HomeFil',
              'You must provide accurate and truthful information when registering',
              'One person can only have one account',
              'You are responsible for keeping your password safe'
            ]
          },
          {
            number: '2',
            title: 'For Customers',
            items: [
              'You can browse and contact water and gas suppliers for free',
              'All payments are made directly to suppliers — HomeFil does not handle money',
              'HomeFil is not responsible for the quality of products delivered',
              'Always verify supplier details before making any payment',
              'Report any suspicious suppliers to our admin team'
            ]
          },
          {
            number: '3',
            title: 'For Suppliers',
            items: [
              'Suppliers must be approved by HomeFil admin before listing products',
              'All listings must be accurate and up to date',
              'Suppliers must honor the prices shown on their listings',
              'Fake or misleading listings will result in account suspension',
              'HomeFil reserves the right to remove any listing at any time',
              'Suppliers are responsible for delivery of their products'
            ]
          },
          {
            number: '4',
            title: 'Payments',
            items: [
              'HomeFil does NOT process any payments',
              'All transactions happen directly between customers and suppliers',
              'HomeFil is not liable for any payment disputes',
              'Always pay only after receiving and verifying your order',
              'Do not pay in advance to unknown suppliers'
            ]
          },
          {
            number: '5',
            title: 'Prohibited Activities',
            items: [
              'Creating fake accounts or impersonating others',
              'Posting false or misleading product listings',
              'Harassing or threatening other users',
              'Using HomeFil for any illegal activities',
              'Sharing your account with other people',
              'Spamming other users with messages'
            ]
          },
          {
            number: '6',
            title: 'Account Suspension',
            items: [
              'HomeFil can suspend or delete accounts that violate these terms',
              'Suppliers with fake listings will be permanently banned',
              'Customers who misuse the platform will be removed',
              'No refund of any kind will be issued for suspended accounts'
            ]
          },
          {
            number: '7',
            title: 'Changes to Terms',
            items: [
              'HomeFil may update these terms at any time',
              'Users will be notified of major changes',
              'Continued use of the app means you accept the new terms'
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
                width: 28, height: 28,
                background: 'linear-gradient(135deg, #1a73e8, #f57c00)',
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 13, fontWeight: 700,
                flexShrink: 0
              }}>
                {section.number}
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
                      borderRadius: 12, padding: 20, marginBottom: 16,
                      textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: 14,
                      fontWeight: 600, margin: '0 0 4px' }}>
            Questions about our Terms?
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

export default TermsAndConditions;