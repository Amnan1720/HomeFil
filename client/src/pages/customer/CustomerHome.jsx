import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, Bell, Droplets, Flame, Phone,
  MessageCircle, MapPin, Truck, X, Navigation, ChevronDown
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import API from "../../api";
import CustomerNav from "../../components/CustomerNav";
import StatusBadge from "../../components/ui/StatusBadge";
import { ListingCardSkeleton } from "../../components/ui/Skeleton";
import { ErrorScreen, OfflineBanner, EmptyState } from "../../components/ui/ErrorState";
import { colors, radius, shadow, font, weight } from "../../theme/tokens";

var BASE = "https://homefil-backed.onrender.com";

var KENYA_COUNTIES = [
  "Nairobi","Mombasa","Kisumu","Nakuru","Eldoret",
  "Thika","Malindi","Kitale","Garissa","Nyeri",
  "Meru","Kakamega","Kericho","Embu","Machakos",
  "Nanyuki","Kilifi","Lamu","Bungoma","Kisii"
];

export default function CustomerHome() {
  var auth     = useAuth();
  var user     = auth.user;
  var isOnline = useOnlineStatus();

  var [listings,   setListings]   = useState([]);
  var [search,     setSearch]     = useState("");
  var [category,   setCategory]   = useState("");
  var [county,     setCounty]     = useState("");
  var [loading,    setLoading]    = useState(true);
  var [error,      setError]      = useState(null);
  var [showCounty, setShowCounty] = useState(false);
  var [geoLoading, setGeoLoading] = useState(false);
  var [userCoords, setUserCoords] = useState(null);

  useEffect(function() {
    loadListings("", "", "", null);
  }, []);

  function loadListings(cat, loc, cty, coords) {
    setLoading(true);
    setError(null);
    var url = "/listings?";
    if (cat)    url += "category=" + cat + "&";
    if (loc)    url += "location=" + encodeURIComponent(loc) + "&";
    if (cty)    url += "county="   + encodeURIComponent(cty) + "&";
    if (coords) {
      url += "lat="    + coords.lat + "&";
      url += "lng="    + coords.lng + "&";
      url += "radius=50&";
      url += "sort=distance&";
    }
    API.get(url)
      .then(function(res) {
        setListings(res.data);
        setLoading(false);
      })
      .catch(function(err) {
        var isOffline = !navigator.onLine;
        var isServer  = err.response && err.response.status >= 500;
        setError({
          type: isOffline ? "offline" : isServer ? "server" : "general",
          message: err.message
        });
        setLoading(false);
      });
  }

  function applyCategory(cat) {
    setCategory(cat);
    loadListings(cat, search, county, userCoords);
  }

  function applyCounty(cty) {
    setCounty(cty);
    setShowCounty(false);
    loadListings(category, search, cty, userCoords);
  }

  function handleSearch() {
    loadListings(category, search, county, userCoords);
  }

  function getNearby() {
    if (!navigator.geolocation) {
      alert("Your browser does not support location access.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        var coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setGeoLoading(false);
        loadListings(category, search, county, coords);
      },
      function() {
        setGeoLoading(false);
        alert("Could not get your location. Please allow location access.");
      },
      { timeout: 10000 }
    );
  }

  function clearAll() {
    setCategory("");
    setCounty("");
    setSearch("");
    setUserCoords(null);
    loadListings("", "", "", null);
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

  function getSectionTitle() {
    if (category === "water") return "Water Suppliers";
    if (category === "gas")   return "Gas Suppliers";
    if (county)               return county + " Suppliers";
    if (userCoords)           return "Nearby Suppliers";
    return "Featured Suppliers";
  }

  var hasFilters  = category || county || search || userCoords;
  var hasListings = listings.length > 0;
  var countText   = listings.length + " supplier" + (listings.length !== 1 ? "s" : "") + " found";

  function renderCard(l) {
    var isWater      = l.category === "water";
    var lColor       = isWater ? colors.primary      : colors.secondary;
    var lBg          = isWater ? colors.primaryLight  : colors.secondaryLight;
    var stockOk      = l.status === "available";
    var stockColor   = stockOk ? colors.success      : colors.danger;
    var stockBg      = stockOk ? colors.successLight  : colors.dangerLight;
    var stockLabel   = stockOk ? "In Stock"           : "Out of Stock";
    var supStatus    = l.supplierId && l.supplierId.supplierStatus ? l.supplierId.supplierStatus : "open";
    var hasDistance  = l.distance !== undefined && l.distance !== null;
    var hasWhatsapp  = l.whatsapp && l.whatsapp.length > 0;
    var waNumber     = hasWhatsapp ? l.whatsapp.replace(/\D/g, "") : "";
    var productTitle = l.productType ? l.productType : l.category + " " + l.serviceType;

    return React.createElement(
      Link,
      {
        to: "/listing/" + l._id,
        key: l._id,
        style: { textDecoration: "none", color: "inherit" }
      },
      React.createElement(
        "div",
        {
          style: {
            background: colors.white,
            borderRadius: radius.xl,
            overflow: "hidden",
            marginBottom: "14px",
            boxShadow: shadow.md
          }
        },

        l.image
          ? React.createElement(
              "div",
              { style: { position: "relative" } },
              React.createElement("img", {
                src: BASE + "/uploads/" + l.image,
                alt: productTitle,
                style: { width: "100%", height: "170px", objectFit: "cover" }
              }),
              React.createElement(
                "div",
                { style: { position: "absolute", top: "10px", left: "10px" } },
                React.createElement(StatusBadge, { status: supStatus, size: "sm" })
              ),
              React.createElement(
                "div",
                {
                  style: {
                    position: "absolute", top: "10px", right: "10px",
                    background: stockBg, color: stockColor,
                    fontSize: "11px", fontWeight: weight.bold,
                    padding: "4px 10px", borderRadius: radius.full
                  }
                },
                stockLabel
              )
            )
          : React.createElement(
              "div",
              {
                style: {
                  height: "120px",
                  background: lBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }
              },
              isWater
                ? React.createElement(Droplets, { size: 52, color: lColor, strokeWidth: 1.5 })
                : React.createElement(Flame, { size: 52, color: lColor, strokeWidth: 1.5 }),
              React.createElement(
                "div",
                { style: { position: "absolute", top: "10px", left: "10px" } },
                React.createElement(StatusBadge, { status: supStatus, size: "sm" })
              ),
              React.createElement(
                "div",
                {
                  style: {
                    position: "absolute", top: "10px", right: "10px",
                    background: stockBg, color: stockColor,
                    fontSize: "11px", fontWeight: weight.bold,
                    padding: "4px 10px", borderRadius: radius.full
                  }
                },
                stockLabel
              )
            ),

        React.createElement(
          "div",
          { style: { padding: "14px" } },

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "8px"
              }
            },
            React.createElement(
              "div",
              { style: { flex: 1, marginRight: "8px" } },
              React.createElement(
                "p",
                { style: { fontWeight: weight.bold, fontSize: font.base, color: colors.text, margin: "0 0 4px" } },
                productTitle
              ),
              React.createElement(
                "div",
                { style: { display: "flex", alignItems: "center", gap: "4px" } },
                React.createElement(MapPin, { size: 12, color: colors.textMuted }),
                React.createElement(
                  "p",
                  { style: { fontSize: "12px", color: colors.textMuted, margin: 0 } },
                  l.location,
                  hasDistance && React.createElement(
                    "span",
                    { style: { color: lColor, fontWeight: weight.semibold } },
                    " - " + l.distance + " km away"
                  )
                )
              )
            ),
            React.createElement(
              "p",
              { style: { fontSize: "18px", fontWeight: weight.bold, color: lColor, margin: 0, flexShrink: 0 } },
              "KSh " + (l.price ? l.price.toLocaleString() : "0")
            )
          ),

          React.createElement(
            "div",
            { style: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" } },
            React.createElement(
              "span",
              {
                style: {
                  background: lBg, color: lColor,
                  fontSize: "11px", fontWeight: weight.semibold,
                  padding: "3px 10px", borderRadius: radius.full,
                  display: "inline-flex", alignItems: "center", gap: "4px"
                }
              },
              isWater
                ? React.createElement(Droplets, { size: 11 })
                : React.createElement(Flame, { size: 11 }),
              l.category
            ),
            React.createElement(
              "span",
              {
                style: {
                  background: colors.bg, color: colors.textMuted,
                  fontSize: "11px", fontWeight: weight.medium,
                  padding: "3px 10px", borderRadius: radius.full
                }
              },
              l.serviceType
            ),
            l.deliveryAvailable && React.createElement(
              "span",
              {
                style: {
                  background: colors.successLight, color: colors.success,
                  fontSize: "11px", fontWeight: weight.medium,
                  padding: "3px 10px", borderRadius: radius.full,
                  display: "inline-flex", alignItems: "center", gap: "4px"
                }
              },
              React.createElement(Truck, { size: 11 }),
              l.deliveryTime ? l.deliveryTime : "Delivery"
            )
          ),

          React.createElement(
            "div",
            { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" } },
            React.createElement(
              "a",
              {
                href: "tel:" + l.phone,
                onClick: function(e) { e.stopPropagation(); },
                style: {
                  background: colors.primary, color: "white",
                  padding: "11px 0", borderRadius: radius.md,
                  textAlign: "center", fontSize: font.sm,
                  fontWeight: weight.bold, textDecoration: "none",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "6px"
                }
              },
              React.createElement(Phone, { size: 15 }),
              "Call"
            ),
            hasWhatsapp
              ? React.createElement(
                  "a",
                  {
                    href: "https://wa.me/" + waNumber,
                    target: "_blank",
                    rel: "noreferrer",
                    onClick: function(e) { e.stopPropagation(); },
                    style: {
                      background: colors.successLight, color: colors.success,
                      padding: "11px 0", borderRadius: radius.md,
                      textAlign: "center", fontSize: font.sm,
                      fontWeight: weight.bold, textDecoration: "none",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", gap: "6px"
                    }
                  },
                  React.createElement(MessageCircle, { size: 15 }),
                  "WhatsApp"
                )
              : React.createElement(
                  "div",
                  {
                    style: {
                      background: colors.bg, color: colors.textLight,
                      padding: "11px 0", borderRadius: radius.md,
                      textAlign: "center", fontSize: font.sm,
                      display: "flex", alignItems: "center",
                      justifyContent: "center", gap: "6px"
                    }
                  },
                  React.createElement(MessageCircle, { size: 15 }),
                  "WhatsApp"
                )
          )
        )
      )
    );
  }

  return (
    React.createElement(
      "div",
      { style: { background: colors.bg, minHeight: "100vh", paddingBottom: "90px" } },

      !isOnline && React.createElement(OfflineBanner, null),

      React.createElement(
        "div",
        {
          style: {
            background: "linear-gradient(135deg," + colors.primary + "," + colors.primaryDark + ")",
            padding: "20px 16px 28px"
          }
        },

        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" } },
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "10px" } },
            React.createElement(
              "div",
              {
                style: {
                  width: "36px", height: "36px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "10px", display: "flex",
                  alignItems: "center", justifyContent: "center"
                }
              },
              React.createElement(Droplets, { size: 18, color: "white" })
            ),
            React.createElement(
              "span",
              { style: { color: "white", fontWeight: weight.bold, fontSize: "18px" } },
              "Home",
              React.createElement("span", { style: { color: "#ffa726" } }, "Fil")
            )
          ),
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "10px" } },
            React.createElement(
              "button",
              {
                style: {
                  background: "rgba(255,255,255,0.15)", border: "none",
                  cursor: "pointer", width: "36px", height: "36px",
                  borderRadius: radius.md, display: "flex",
                  alignItems: "center", justifyContent: "center"
                }
              },
              React.createElement(Bell, { size: 18, color: "white" })
            ),
            React.createElement(
              Link,
              { to: "/customer/profile", style: { textDecoration: "none" } },
              React.createElement(
                "div",
                {
                  style: {
                    width: "36px", height: "36px", background: "#ffa726",
                    borderRadius: radius.full, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: weight.bold, fontSize: "13px"
                  }
                },
                getInitials(user ? user.name : "U")
              )
            )
          )
        ),

        React.createElement("p", { style: { color: "rgba(255,255,255,0.75)", fontSize: font.sm, margin: "0 0 2px" } }, getGreeting()),
        React.createElement("p", { style: { color: "white", fontSize: "20px", fontWeight: weight.bold, margin: "0 0 20px" } }, user ? user.name : "Welcome"),

        React.createElement(
          "div",
          {
            style: {
              background: "rgba(255,255,255,0.15)", borderRadius: radius.lg,
              padding: "0 14px", display: "flex", alignItems: "center",
              gap: "10px", height: "48px", border: "1px solid rgba(255,255,255,0.2)"
            }
          },
          React.createElement(Search, { size: 18, color: "rgba(255,255,255,0.7)" }),
          React.createElement("input", {
            placeholder: "Search water, gas suppliers...",
            value: search,
            onChange: function(e) { setSearch(e.target.value); },
            onKeyPress: function(e) { if (e.key === "Enter") handleSearch(); },
            style: {
              background: "none", border: "none", color: "white",
              fontSize: font.base, flex: 1, outline: "none",
              marginBottom: 0, padding: 0
            }
          }),
          search !== "" && React.createElement(
            "button",
            {
              onClick: function() { setSearch(""); loadListings(category, "", county, userCoords); },
              style: { background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex", padding: 0 }
            },
            React.createElement(X, { size: 16 })
          ),
          React.createElement(
            "button",
            {
              onClick: handleSearch,
              style: {
                background: "rgba(255,255,255,0.2)", border: "none", color: "white",
                padding: "6px 14px", borderRadius: radius.md, fontSize: font.sm,
                fontWeight: weight.semibold, cursor: "pointer", flexShrink: 0
              }
            },
            "Go"
          )
        )
      ),

      React.createElement(
        "div",
        { style: { padding: "16px" } },

        React.createElement(
          "div",
          { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" } },

          React.createElement(
            "div",
            {
              onClick: function() { applyCategory(category === "water" ? "" : "water"); },
              style: {
                background: category === "water" ? colors.primary : colors.primaryLight,
                borderRadius: radius.lg, padding: "14px 12px",
                display: "flex", alignItems: "center", gap: "12px",
                cursor: "pointer", boxShadow: category === "water" ? shadow.md : "none"
              }
            },
            React.createElement(
              "div",
              {
                style: {
                  width: "44px", height: "44px", borderRadius: radius.md,
                  background: category === "water" ? "rgba(255,255,255,0.25)" : colors.primary,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }
              },
              React.createElement(Droplets, { size: 22, color: "white" })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("p", { style: { fontSize: "11px", margin: 0, fontWeight: weight.medium, color: category === "water" ? "rgba(255,255,255,0.8)" : colors.primaryText } }, "Water"),
              React.createElement("p", { style: { fontSize: font.base, fontWeight: weight.bold, margin: 0, color: category === "water" ? "white" : colors.primary } }, "Refill")
            )
          ),

          React.createElement(
            "div",
            {
              onClick: function() { applyCategory(category === "gas" ? "" : "gas"); },
              style: {
                background: category === "gas" ? colors.secondary : colors.secondaryLight,
                borderRadius: radius.lg, padding: "14px 12px",
                display: "flex", alignItems: "center", gap: "12px",
                cursor: "pointer", boxShadow: category === "gas" ? shadow.md : "none"
              }
            },
            React.createElement(
              "div",
              {
                style: {
                  width: "44px", height: "44px", borderRadius: radius.md,
                  background: category === "gas" ? "rgba(255,255,255,0.25)" : colors.secondary,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }
              },
              React.createElement(Flame, { size: 22, color: "white" })
            ),
            React.createElement(
              "div",
              null,
              React.createElement("p", { style: { fontSize: "11px", margin: 0, fontWeight: weight.medium, color: category === "gas" ? "rgba(255,255,255,0.8)" : colors.secondaryText } }, "Gas"),
              React.createElement("p", { style: { fontSize: font.base, fontWeight: weight.bold, margin: 0, color: category === "gas" ? "white" : colors.secondary } }, "Cylinder")
            )
          )
        ),

        React.createElement(
          "div",
          { style: { display: "flex", gap: "8px", marginBottom: "14px", overflowX: "auto", paddingBottom: "4px" } },

          React.createElement(
            "button",
            {
              onClick: getNearby,
              disabled: geoLoading,
              style: {
                display: "flex", alignItems: "center", gap: "6px",
                background: userCoords ? colors.primary : colors.white,
                color: userCoords ? "white" : colors.textMuted,
                border: userCoords ? "none" : "1px solid " + colors.borderMid,
                borderRadius: radius.full, padding: "7px 14px",
                fontSize: font.sm, fontWeight: weight.medium,
                cursor: geoLoading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap", fontFamily: "inherit",
                flexShrink: 0, opacity: geoLoading ? 0.7 : 1
              }
            },
            React.createElement(Navigation, { size: 13 }),
            geoLoading ? "Locating..." : "Near me"
          ),

          React.createElement(
            "div",
            { style: { position: "relative", flexShrink: 0 } },
            React.createElement(
              "button",
              {
                onClick: function() { setShowCounty(!showCounty); },
                style: {
                  display: "flex", alignItems: "center", gap: "6px",
                  background: county ? colors.primary : colors.white,
                  color: county ? "white" : colors.textMuted,
                  border: county ? "none" : "1px solid " + colors.borderMid,
                  borderRadius: radius.full, padding: "7px 14px",
                  fontSize: font.sm, fontWeight: weight.medium,
                  cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit"
                }
              },
              React.createElement(MapPin, { size: 13 }),
              county ? county : "County",
              React.createElement(ChevronDown, { size: 12 })
            ),
            showCounty && React.createElement(
              "div",
              {
                style: {
                  position: "absolute", top: "40px", left: 0,
                  background: colors.white, borderRadius: radius.lg,
                  boxShadow: shadow.xl, zIndex: 50,
                  maxHeight: "220px", overflowY: "auto",
                  minWidth: "160px", border: "1px solid " + colors.border
                }
              },
              React.createElement(
                "div",
                {
                  onClick: function() { applyCounty(""); },
                  style: {
                    padding: "10px 14px", fontSize: font.sm,
                    cursor: "pointer", color: colors.textMuted,
                    borderBottom: "1px solid " + colors.border
                  }
                },
                "All counties"
              ),
              KENYA_COUNTIES.map(function(c) {
                return React.createElement(
                  "div",
                  {
                    key: c,
                    onClick: function() { applyCounty(c); },
                    style: {
                      padding: "10px 14px", fontSize: font.sm,
                      cursor: "pointer", color: colors.text,
                      background: county === c ? colors.primaryLight : "transparent",
                      fontWeight: county === c ? weight.semibold : weight.normal
                    }
                  },
                  c
                );
              })
            )
          ),

          hasFilters && React.createElement(
            "button",
            {
              onClick: clearAll,
              style: {
                display: "flex", alignItems: "center", gap: "4px",
                background: colors.dangerLight, color: colors.danger,
                border: "none", borderRadius: radius.full,
                padding: "7px 14px", fontSize: font.sm,
                fontWeight: weight.medium, cursor: "pointer",
                whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0
              }
            },
            React.createElement(X, { size: 12 }),
            "Clear"
          )
        ),

        React.createElement(
          "div",
          {
            style: {
              background: colors.warningLight,
              borderLeft: "3px solid " + colors.warning,
              borderRadius: "0 " + radius.md + " " + radius.md + " 0",
              padding: "10px 14px", marginBottom: "14px"
            }
          },
          React.createElement(
            "p",
            { style: { fontSize: "12px", color: "#5d4037", margin: 0 } },
            React.createElement("strong", null, "HomeFil"),
            " does not handle payments. Pay suppliers directly on delivery."
          )
        ),

        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" } },
          React.createElement(
            "div",
            null,
            React.createElement("p", { style: { fontSize: font.lg, fontWeight: weight.bold, color: colors.text, margin: 0 } }, getSectionTitle()),
            React.createElement("p", { style: { fontSize: font.sm, color: colors.textMuted, margin: "2px 0 0" } },
              !loading && !error ? countText : "",
              userCoords ? " - sorted by distance" : ""
            )
          )
        ),

        loading && React.createElement(
          "div",
          null,
          React.createElement(ListingCardSkeleton, null),
          React.createElement(ListingCardSkeleton, null),
          React.createElement(ListingCardSkeleton, null)
        ),

        !loading && error && React.createElement(ErrorScreen, {
          type: error.type,
          message: error.message,
          onRetry: function() { loadListings(category, search, county, userCoords); }
        }),

        !loading && !error && !hasListings && React.createElement(EmptyState, {
          icon: React.createElement(Search, { size: 28, color: colors.primary }),
          title: "No suppliers found",
          desc: "Try a different search term, county or category",
          btnLabel: "Clear all filters",
          onAction: clearAll
        }),

        !loading && !error && hasListings && listings.map(renderCard)
      ),

      React.createElement(CustomerNav, null)
    )
  );
}
