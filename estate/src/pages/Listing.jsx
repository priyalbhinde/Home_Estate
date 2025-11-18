import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { useSelector } from "react-redux";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules"
import "swiper/css/bundle";
import { FaBath, FaBed, FaCar, FaChair, FaCross, FaMapMarkerAlt, FaWindowClose } from "react-icons/fa";

export default function Listing() {
    const { currentUser } = useSelector((state) => state.user);
    const [contact, setContact] = useState(null);
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState(null)
    const params = useParams();
    let formattedPrice = '';
    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`)
            const data = await res.json();
            if (data.success === false) {
                console.log(data);
            }
            setListing(data);
        }
        fetchListing()
    }, [params.listingId])
    if (listing) {
        document.title = `${listing.title} for ${listing.listedFor} in ${listing.city}`
        document.description = `${listing.description}`
        const price = listing.price;
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
        } else if (price >= 100000 && price <= 999999) {
            const lac = Math.floor(price / 100000);
            const thousand = price % 100000;
            let formattedPrice = '';
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
    }
    const handleContact = async () => {
        const res = await fetch(`/api/user/${listing.user}`)
        const data = await res.json()
        if (data.success === false) {
            console.log(data)
        }
        else {
            setContact(data);
        }
    }
    return (
        <main>
            {listing && listing.images.length > 0 &&
                <>
                    <Swiper navigation autoplay="true" loop className="mt-4 pt-16">
                        {listing.images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img src={`../${image.file}`} className='h-[35vw] w-screen sm:mx-auto sm:w-[90vw]' alt={image.filename} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="p-3 max-w-4xl mx-auto">
                        <h5 className="font-semibold text-xl mb-7 text-center">{listing.title} for {listing.listedFor}</h5>
                        <div className="mx-3 my-3 flex items-center gap-7">
                            <p>Offer: Rs. <strong>{formattedPrice}</strong> {listing.listedFor == 'Rent' ? 'per month' : ''}</p>
                            <p>Brokerage: Rs. <strong>{listing.brokerage.toLocaleString()}</strong></p>
                            {!listing.available && <button className="bg-red-600 p-1 rounded text-white">Unavailable</button>}
                        </div>
                        <p className="mx-3 my-3">{listing.description}</p>
                        <p className="flex items-center mt-2 mx-5 gap-2 text-slate-600">
                            <FaMapMarkerAlt className="text-emerald-600" />
                            {listing.address}
                        </p>
                        <p className="flex items-center mx-3 mt-2 gap-2 text-slate-600">
                            {listing.city} {listing.state}
                        </p>
                        <p className="flex mx-3 mt-2 gap-7 text-slate-600">
                            <span className="flex items-center gap-2">
                                <FaBed className="text-emerald-600" />{listing.bedrooms} Beds
                            </span>
                            <span className="flex items-center gap-2">
                                <FaBath className="text-emerald-600" />{listing.bathrooms} Baths
                            </span>
                        </p>
                        <p className="flex items-center mx-3 mt-3 gap-2">
                            <button className="bg-slate-100 rounded-lg p-3 text-emerald-500">Property Type: {listing.type}</button>
                            <button className="bg-slate-100 rounded-lg p-3 text-emerald-500 flex items-center gap-2"><FaChair /> {listing.furnished}</button>
                            {listing.parking && <button className="bg-slate-100 rounded-lg p-3 text-emerald-500 flex items-center gap-2"><FaCar /> Parking</button>}
                        </p>
                        {
                            listing.user != currentUser._id && <button className="bg-emerald-800 hover:bg-emerald-600 rounded-lg w-full text-white uppercase p-2 my-4" onClick={handleContact}>Contact Details</button>
                        }

                    </div>
                    {contact && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen">
                                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                                    <div className="relative bg-emerald-600 text-white rounded-lg shadow">
                                        <div className="flex justify-end p-2">
                                            <button className="text-gray-400 bg-transparent hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={() => setContact(null)}>
                                                <FaWindowClose />
                                            </button>
                                        </div>
                                        <div className="p-6 pt-0 flex flex-col">
                                            <h6 className="mb-2 text-lg font-bold">Contact Details</h6>
                                            <p>Name: {contact.username}</p>
                                            <a href={`tel:${contact.phone}`} className="hover:font-semibold hover:underline">Phone: {contact.phone}</a>
                                            <a href={`mailto:${contact.email}`} className="hover:font-semibold hover:underline">Email: {contact.email}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            }
        </main >
    )
}