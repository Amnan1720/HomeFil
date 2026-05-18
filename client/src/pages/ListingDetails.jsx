import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const BASE_URL = 'https://homefil-backed.onrender.com';

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await API.get('/listings');
        const found = res.data.find(l => l._id === id);
        setListing(found);
      } catch (err) {
        console.error(err);
      }
    }
    fetchListing();
  }, [id]);

  function saveContact() {
    const contacts = JSON.parse(
      localStorage.getItem('savedContacts') || '[]'
    );
    if (!contacts.find(c => c._id === listing._id)) {
      contacts.push({
        _id: listing._id,
        productType: listing.productType,
        phone: listing.phone,
        whatsapp: listing.whatsapp,
        location: listing.location
      });
      localStorage.setItem('savedContacts', JSON.stringify(contacts));
    }
    setSaved(true);
    alert('Contact saved!');
  }

  if (!listing) return (
    <p style={{ padding: 20, textAlign: 'center' }}>Loading...</p>
  );

  return (
    <div>
      <button onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', cursor: 'pointer',
                 color: '#1a73e8', fontSize: 15, marginBottom: 12, padding: 0 }}>
        ← Back
      </button>

      <div className="card">

        {listing.image ? (
          <img
            src={`${BASE_URL}/uploads/${listing.image}`}
            alt={listing.productType}
            style={{
              width: '100%', height: 220,
              objectFit: 'cover', borderRadius: 8,
              marginBottom: 16
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: 160,
            background: listing.category === 'water'
              ? '#e3f2fd' : '#fff3e0',
            borderRadius: 8, marginBottom: 16,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 64
          }}>
            {listing.category === 'water' ? '💧' : '🔥'}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 20 }}>
            {listing.productType ||
              `${listing.category} ${listing.serviceType}`}
          </h2>
        </div>

        <span className={`badge badge-${listing.category === 'water'
          ? 'blue' : 'orange'}`}>
          {listing.category}
        </span>
        <span className="badge badge-gray">{listing.serviceType}</span>

        <div style={{ margin: '16px 0' }}>
          <p><strong>Price:</strong> KSh {listing.price.toLocaleString()}</p>
          <p><strong>Location:</strong> {listing.location}</p>
          <p><strong>Status:</strong> {listing.status === 'available'
            ? '✅ Available' : '❌ Out of stock'}</p>
          {listing.deliveryAvailable && (
            <p><strong>Delivery:</strong> ✅ {listing.deliveryTime}</p>
          )}
        </div>

        <div className="pay-tag">💵 Pay on Delivery</div>
        <div className="disclaimer" style={{ marginTop: 8 }}>
          HomeFil does not handle payments.
          You pay this supplier directly.
        </div>

        <a href={`tel:${listing.phone}`}
           className="btn btn-blue"
           style={{ display: 'block', textAlign: 'center' }}>
          📞 Call Supplier
        </a>

        {listing.whatsapp && (
          <a href={`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}`}
             target="_blank" rel="noreferrer"
             className="btn btn-green"
             style={{ display: 'block', textAlign: 'center' }}>
            💬 WhatsApp Supplier
          </a>
        )}

        <button className="btn btn-outline" onClick={saveContact}>
          {saved ? '✅ Contact saved' : '🔖 Save contact'}
        </button>
      </div>
    </div>
  );
}

export default ListingDetails;