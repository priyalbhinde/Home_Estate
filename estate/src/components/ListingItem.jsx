import { Link } from "react-router-dom"
import { MdLocationOn } from "react-icons/md"
export default function ListingItem({ listing }) {
    const price = listing.price;
    let formattedPrice = '';
    if (price >= 10000000) {
        const crore = price / 10000000
        const lac = Math.floor((price % 10000000) / 100000);
        const thousand = price % 100000;
        if (crore > 0) {
            formattedPrice += `${crore} Cr `;
        }
        if (lac > 0) {
            formattedPrice += `${lac} Lac `;
        }
        if (thousand > 0) {
            formattedPrice += `${thousand.toLocaleString()}`;
        }
        formattedPrice = formattedPrice.trim();
    } else if (price >= 100000 && price <= 9999999) {
        const lac = Math.floor(price / 100000);
        const thousand = price % 100000;
        if (lac > 0) {
            formattedPrice += `${lac} Lac `;
        }
        if (thousand > 0) {
            formattedPrice += `${thousand.toLocaleString()}`;
        }
        formattedPrice = formattedPrice.trim();
    } else {
        formattedPrice = price.toLocaleString();
    }
    return (
        <div className="bg-white w-full md:w-56 shadow-md hover:shadow-xl transition-shadow overflow-hidden rounded-lg">
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.images[0].file} alt="cover image" className="h-[30vh] w-full object-cover hover:scale-105 transition-scale duration-300" />
                <div className="p-3 flex flex-col gap-2 w-full">
                    <p className="text-lg truncate font-semibold text-slate-700">{listing.title}</p>
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-700" />
                        <p className="truncate w-full text-sm text-slate-700">{listing.address}</p>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{listing.description}</p>
                    <p className="text-gray-700 font-semibold items-center"> Rs. <strong>{formattedPrice}</strong> {listing.listedFor == 'Rent' ? '/ month' : ''}</p>
                    <div className="text-slate-700 flex gap-4">
                        <div className="font-bold text-xs">
                            {listing.type}
                        </div>
                        { listing.type!='Commercial'&&<div className="font-bold text-xs">
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                        </div>
                        }
                        <div className="font-bold text-xs">
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}