import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import { ListingInterface } from "../models/models";

interface ListingItemInterface {
  listing: ListingInterface;
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, name: string) => void;
}

const ListingItem: React.FC<ListingItemInterface> = ({
  listing,
  id,
  onEdit,
  onDelete,
}) => {
  return (
    <li className="categoryListing">
      <Link
        className="categoryListingLink"
        to={`/category/${listing.type}/${id}`}
      >
        {listing.imgUrls ? (
          <img
            className="categoryListingImg"
            alt={listing.name}
            src={listing.imgUrls[0] ? listing.imgUrls[0] : listing.imageUrls[0]}
          />
        ) : (
          <img
            className="categoryListingImg"
            alt={listing.name}
            src={listing.imageUrls[0]}
          />
        )}

        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.location}</p>
          <p className="categoryListingName">{listing.name}</p>
          <p className="categoryListingPrice">
            {listing.offer && listing.discountedPrice
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
            {listing.type === "rent" && " /Month"}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </p>
            <img src={bathtubIcon} alt="bath" />
            <p className="categoryListingInfoText">
              {listing.bathroom > 1
                ? `${listing.bathroom} Bathrooms`
                : "1 Bathroom"}
            </p>
          </div>
        </div>
      </Link>

      {onDelete && (
        <DeleteIcon
          onClick={() => onDelete(id, listing.name)}
          className="removeIcon"
          fill="rgb(231, 76,60)"
        />
      )}

      {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
    </li>
  );
};

export default ListingItem;
