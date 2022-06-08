import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DocumentData } from "../models/models";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

const Listing = () => {
  const [listing, setListing] = useState<DocumentData>();
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const params = useParams();
  const { listingId } = params;

  useEffect(() => {
    if (listingId) {
      const fetchListings = async () => {
        const docRef = doc(db, "listing", listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentData;
          setListing(data);
          setLoading(false);
        }
      };
      fetchListings();
    }
  }, [navigate, listingId]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      {/* Slider */}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        style={{ height: "300px" }}
      >
        {listing!.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url(${
                    listing!.imgUrls[index]
                  }) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

      {/* Listing div */}
      <div className="listingDetails">
        <p className="listingName">
          {listing!.name} - $
          {listing!.offer
            ? listing!.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing!.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing!.locationPositionStack}</p>
        <p className="listingType">
          For {listing!.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing!.offer && (
          <p className="discountPrice">
            ${listing!.regularPrice - listing!.discountedPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing!.bedrooms > 1
              ? `${listing!.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li>
            {listing!.bathrooms > 1
              ? `${listing!.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </li>
          <li>{listing!.parking && "Parking Spot"}</li>
          <li>{listing!.furnished && "Furnished"}</li>
        </ul>

        <p className="listingLocationTitle">Location</p>

        {/* Map */}
        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing!.geolocation.lat, listing!.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
            />

            <Marker
              position={[listing!.geolocation.lat, listing!.geolocation.lng]}
            >
              <Popup>{listing!.locationPositionStack}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing!.userRef && (
          <Link
            to={`/contact/${listing!.userRef}?listingName=${listing!.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
