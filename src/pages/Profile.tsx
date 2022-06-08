import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/Listingitem";
import { ListingInterfaceData } from "../models/models";

const Profile: React.FC = () => {
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);
  const [listings, setListings] = useState<ListingInterfaceData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const check = auth.currentUser!.uid;

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listing");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser!.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      let listings: any = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [check, auth.currentUser]);

  const onLogOut = () => {
    auth.signOut();
    navigate("/");
  };
  const [formData, setformData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  });
  const { name, email } = formData;
  const onSubmit = async () => {
    try {
      if (auth.currentUser?.displayName !== name && auth.currentUser) {
        //Update displayname in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        //update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Could not update details");
    }
  };
  const onChange = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    setformData((prevState) => ({
      ...prevState,
      [target.id]: target.value,
    }));
  };
  const onDelete = async (listingId: string) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listing", listingId));
      const updatedListings = listings!.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Successfully deleted listing");
    }
  };

  const onEdit = (listingId: string) => {
    navigate(`/edit-listing/${listingId}`);
  };
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button onClick={onLogOut} type="button" className="logOut">
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              id="name"
              type="text"
              disabled={!changeDetails}
              value={name ? name : undefined}
              onChange={onChange}
              className={!changeDetails ? "profileName" : "profileNameActive"}
            />
            <input
              id="email"
              onChange={onChange}
              type="text"
              disabled={!changeDetails}
              value={email ? email : undefined}
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
            />
          </form>
        </div>
        <Link className="createListing" to="/create-listing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrowRight" />
        </Link>
        {!loading && listings!.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings!.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
