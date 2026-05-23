import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const BASE_URL = "https://homefil-backed.onrender.com";

function Home() {
  const [listings, setListings] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(function() {
    loadListings("", "");
  }, []);

  function loadListings(cat, loc) {
    setLoading(true);
    var url = "/listings?";
    if (cat) url = url + "category=" + cat + "&";
    if (loc) url = url + "location=" + loc;
    API.get(url).then(function(res) {
      setListings(res.data);
      setLoading(false);
    }).catch(function(err) {
      console.error(err);
      setLoading(false);
    });
  }

  function applyFilter(filter) {
    setActiveFilter(filter);
    var cat = "";
    if (filter === "water") cat = "water";
    if (filter === "gas") cat = "gas";
    loadListings(cat, searchLocation);
  }

  function handleSearch() {
    var cat = "";
    if (activeFilter === "water") cat = "water";
    if (activeFilter === "gas") cat = "gas";
    loadListings(cat, searchLocation);
  }

  function getInitials(name) {
    if (!name) return "U";
    return name.split(" ").map(function(n) { return n[0]; }).join("").toUpperCase().slice(0, 2);
  }

  function getGreeting() {
    var h = new Date().getHours();
    if (h < 12) return "Good morning,";
    if (h < 17) return "Good afternoon,";
    return "Good evening,";
  }

  function renderListing(listing) {
    var imgSrc = listing.image ? BASE_URL + "/uploads/" + listing.image : null;
    var price = listing.price ? listing.price.toLocaleString() : "0";
    var title = listing.productType || listing.category + " " + listing.serviceType;
    var isWater = listing.category === "water";
    var waLink = listing.whatsapp ? "https://wa.me/" + listing.whatsapp.replace(/\D/g, "") : null;

    return (
      React.createElement(Link, {
        to: "/listing/" + listing._id,
        key: listing._id,
        style: { textDecoration: "none", color: "inherit" }
      },
        React.createElement("div", {
          style: {
            background: "white", borderRadius: 16,
            border: "0.5px solid #f0f0f0", overflow: "hidden",
            marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
          }
        },
          imgSrc
            ? React.createElement("img", {
                src: imgSrc, alt: title,
                style: { width: "100%", height: 160, objectFit: "cover" }
              })
            : React.createElement("div", {
                style: {
                  height: 120,
                  background: isWater
                    ? "linear-gradient(135deg,#e3f2fd,#bbdefb)"
                    : "linear-gradient(135deg,#fff3e0,#ffe0b2)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 48
                }
              }, isWater ? "??" : "??"),

          React.createElement("div", { style: { padding: 12 } },
            React.createElement("div", {
              style: { display: "flex", justifyContent: "space-between", marginBottom: 6 }
            },
              React.createElement("div", { style: { flex: 1 } },
                React.createElement("p", { style: { fontWeight: 500, fontSize: 15, color: "#1a1a2e", margin: 0 } }, title),
                React.createElement("p", { style: { fontSize: 12, color: "#888", margin: "2px 0 0" } }, "?? " + listing.location)
              ),
              React.createElement("p", {
                style: { fontSize: 16, fontWeight: 500, color: isWater ? "#1a73e8" : "#f57c00", margin: 0, marginLeft: 8 }
              }, "KSh " + price)
            ),

            React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" } },
              React.createElement("span", {
                style: {
                  background: isWater ? "#e3f2fd" : "#fff3e0",
                  color: isWater ? "#1565c0" : "#e65100",
                  fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20
                }
              }, listing.category),
              React.createElement("span", {
                style: { background: "#f5f5f5", color: "#666", fontSize: 11, padding: "2px 8px", borderRadius: 20 }
              }, listing.serviceType),
              listing.deliveryAvailable && React.createElement("span", {
                style: { fontSize: 11, color: "#2e7d32" }
              }, "? Delivery " + listing.deliveryTime)
            ),

            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
              React.createElement("a", {
                href: "tel:" + listing.phone,
                onClick: function(e) { e.stopPropagation(); },
                style: {
                  background: "#1a73e8", color: "white",
                  padding: "9px 0", borderRadius: 10,
                  textAlign: "center", fontSize: 13,
                  fontWeight: 500, textDecoration: "none", display: "block"
                }
              }, "?? Call"),

              waLink
                ? React.createElement("a", {
                    href: waLink,
                    target: "_blank", rel: "noreferrer",
                    onClick: function(e) { e.stopPropagation(); },
                    style: {
                      background: "#e8f5e9", color: "#2e7d32",
                      padding: "9px 0", borderRadius: 10,
                      textAlign: "center", fontSize: 13,
                      fontWeight: 500, textDecoration: "none", display: "block"
                    }
                  }, "?? WhatsApp")
                : React.createElement("div", {
                    style: {
                      background: "#f5f5f5", color: "#aaa",
                      padding: "9px 0", borderRadius: 10,
                      textAlign: "center", fontSize: 13
                    }
                  }, "?? WhatsApp")
            )
          )
        )
      )
    );
  }

  return (
    React.createElement("div", { style: { padding: 0, margin: "-16px" } },

      React.createElement("div", { style: { background: "#1a73e8", padding: "20px 16px 24px" } },
        React.createElement("div", {
          style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }
        },
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
            React.createElement("div", {
              style: { width: 34, height: 34, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }
            }, "??"),
            React.createElement("span", { style: { color: "white", fontWeight: 500, fontSize: 18 } },
              "Home",
              React.createElement("span", { style: { color: "#ffa726" } }, "Fil")
            )
          ),
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
            React.createElement("span", { style: { color: "white", fontSize: 22 } }, "??"),
            user && React.createElement(Link, { to: "/profile", style: { textDecoration: "none" } },
              React.createElement("div", {
                style: { width: 34, height: 34, background: "#ffa726", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 500, fontSize: 13 }
              }, getInitials(user.name))
            )
          )
        ),

        React.createElement("p", { style: { color: "rgba(255,255,255,0.85)", fontSize: 13, margin: "0 0 2px" } }, getGreeting()),
        React.createElement("p", { style: { color: "white", fontSize: 20, fontWeight: 500, margin: "0 0 20px" } }, user ? user.name : "Welcome"),

        React.createElement("div", {
          style: { background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }
        },
          React.createElement("span", { style: { fontSize: 18 } }, "??"),
          React.createElement("input", {
            placeholder: "Search water, gas near you...",
            value: searchLocation,
            onChange: function(e) { setSearchLocation(e.target.value); },
            style: { background: "none", border: "none", color: "white", fontSize: 14, flex: 1, outline: "none", marginBottom: 0, padding: 0 }
          }),
          React.createElement("button", {
            onClick: handleSearch,
            style: { background: "rgba(255,255,255,0.25)", border: "none", color: "white", padding: "4px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer", marginTop: 0, width: "auto" }
          }, "Go")
        )
      ),

      React.createElement("div", { style: { padding: 16 } },

        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 } },
          React.createElement("div", {
            onClick: function() { applyFilter(activeFilter === "water" ? "all" : "water"); },
            style: { background: activeFilter === "water" ? "#1a73e8" : "#e3f2fd", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }
          },
            React.createElement("div", { style: { width: 42, height: 42, borderRadius: 10, background: activeFilter === "water" ? "rgba(255,255,255,0.2)" : "#1a73e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 } }, "??"),
            React.createElement("div", null,
              React.createElement("p", { style: { fontSize: 11, margin: 0, color: activeFilter === "water" ? "rgba(255,255,255,0.8)" : "#1565c0" } }, "Water"),
              React.createElement("p", { style: { fontSize: 14, fontWeight: 500, margin: 0, color: activeFilter === "water" ? "white" : "#1565c0" } }, "Refill")
            )
          ),
          React.createElement("div", {
            onClick: function() { applyFilter(activeFilter === "gas" ? "all" : "gas"); },
            style: { background: activeFilter === "gas" ? "#f57c00" : "#fff3e0", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }
          },
            React.createElement("div", { style: { width: 42, height: 42, borderRadius: 10, background: activeFilter === "gas" ? "rgba(255,255,255,0.2)" : "#f57c00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 } }, "??"),
            React.createElement("div", null,
              React.createElement("p", { style: { fontSize: 11, margin: 0, color: activeFilter === "gas" ? "rgba(255,255,255,0.8)" : "#e65100" } }, "Gas"),
              React.createElement("p", { style: { fontSize: 14, fontWeight: 500, margin: 0, color: activeFilter === "gas" ? "white" : "#e65100" } }, "Cylinder")
            )
          )
        ),

        React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 } },
          [
            { key: "all", label: "All" },
            { key: "water", label: "?? Water" },
            { key: "gas", label: "?? Gas" },
            { key: "delivery", label: "?? Delivery" },
            { key: "near", label: "?? Near me" }
          ].map(function(f) {
            return React.createElement("div", {
              key: f.key,
              onClick: function() { applyFilter(f.key); },
              style: {
                background: activeFilter === f.key ? "#1a73e8" : "white",
                color: activeFilter === f.key ? "white" : "#555",
                padding: "6px 14px", borderRadius: 20, fontSize: 12,
                whiteSpace: "nowrap", cursor: "pointer",
                border: activeFilter === f.key ? "none" : "0.5px solid #e0e0e0",
                fontWeight: activeFilter === f.key ? 500 : 400
              }
            }, f.label);
          })
        ),

        React.createElement("div", {
          style: { background: "#fff8e1", borderLeft: "3px solid #f9a825", borderRadius: "0 8px 8px 0", padding: "10px 12px", marginBottom: 16 }
        },
          React.createElement("p", { style: { fontSize: 12, color: "#5d4037", margin: 0 } },
            React.createElement("strong", null, "HomeFil"),
            " does not handle payments. Pay suppliers directly on delivery."
          )
        ),

        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
          React.createElement("p", { style: { fontSize: 15, fontWeight: 500, color: "#1a1a2e", margin: 0 } }, "Featured suppliers"),
          React.createElement("span", { style: { fontSize: 13, color: "#1a73e8", cursor: "pointer" } }, "See all")
        ),

        loading
          ? React.createElement("div", { style: { textAlign: "center", padding: "40px 0" } },
              React.createElement("p", { style: { color: "#888", fontSize: 14 } }, "Loading listings...")
            )
          : listings.length === 0
            ? React.createElement("div", { style: { textAlign: "center", padding: "40px 0" } },
                React.createElement("p", { style: { fontSize: 32, marginBottom: 8 } }, "??"),
                React.createElement("p", { style: { color: "#888", fontSize: 14 } }, "No listings found.")
              )
            : React.createElement("div", null, listings.map(renderListing))
      ),

      React.createElement("div", {
        style: { position: "sticky", bottom: 0, background: "white", borderTop: "0.5px solid #f0f0f0", display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "10px 0" }
      },
        [
          { icon: "??", label: "Home",     active: true,  link: "/" },
          { icon: "??", label: "Search",   active: false, link: "/" },
          { icon: "??", label: "Requests", active: false, link: "/requests" },
          { icon: "??", label: "Profile",  active: false, link: "/profile" }
        ].map(function(item, i) {
          return React.createElement(Link, {
            key: i, to: item.link,
            style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textDecoration: "none" }
          },
            React.createElement("span", { style: { fontSize: 22 } }, item.icon),
            React.createElement("span", { style: { fontSize: 11, color: item.active ? "#1a73e8" : "#888", fontWeight: item.active ? 500 : 400 } }, item.label)
          );
        })
      )
    )
  );
}

export default Home;
