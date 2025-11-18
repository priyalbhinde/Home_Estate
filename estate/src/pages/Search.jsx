import { useEffect, useState } from "react"
import RangeSlider from "../components/RangeSlider.jsx"
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem.jsx";

export default function Search() {
    const navigate = useNavigate();
    const [listings, setListings] = useState();
    const [showMore, setShowMore] = useState(false);
    const [formData, setFormData] = useState({
        searchTerm: '',
        type: 'all',
        minPrice: 0,
        maxPrice: 1000,
        brokerage: false,
        furnished: 'all',
        parking: false,
        listedFor: '',
        beds: 0,
        city: '',
        sort: 'createdAt',
        order: 'desc'
    })
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const cityFromUrl = urlParams.get('city');
        const brokerageFromUrl = urlParams.get('brokerage');
        const furnishedFromUrl = urlParams.get('furnished');
        const parkingFromUrl = urlParams.get('parking');
        const listedForFromUrl = urlParams.get('listedFor');
        const bedsFromUrl = urlParams.get('beds');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            brokerageFromUrl ||
            furnishedFromUrl ||
            parkingFromUrl ||
            cityFromUrl ||
            listedForFromUrl ||
            bedsFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setFormData(
                {
                    searchTerm: searchTermFromUrl || '',
                    type: typeFromUrl || 'all',
                    brokerage: brokerageFromUrl === 'true',
                    furnished: furnishedFromUrl || 'all',
                    parking: parkingFromUrl === 'true',
                    city: cityFromUrl || '',
                    listedFor: listedForFromUrl || '',
                    beds: bedsFromUrl || 1,
                    sort: sortFromUrl || 'createdAt',
                    order: orderFromUrl || 'desc'
                }
            )
        }

        const fetchProperties = async () => {
            setShowMore(false)
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.success === 'false') {
                console.log(data.message)
            }
            else {
                if (data.length > 8)
                    setShowMore(true);
                else
                    setShowMore(false);
                setListings(data);
            }
        }

        fetchProperties();
    }, [location.search])
    const [type, setType] = useState('');
    const handleChange = (e) => {
        if (e.target.id === 'rent' || e.target.id === 'sale') {
            setType(e.target.value);
            setFormData({ ...formData, listedFor: e.target.value })
        }
        else if (e.target.id === 'parking' || e.target.id === 'brokerage') {
            setFormData({ ...formData, [e.target.id]: e.target.checked })
        }
        else if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'desc';
            setFormData({ ...formData, sort, order })
        }
        else {
            setFormData({ ...formData, [e.target.id]: e.target.value })
        }
    }
    const handlePriceChange = (min, max) => {

        if (type === 'Sale') {
            min = min * 100000;
            max = max * 100000;
        }
        else {
            min = (min > 100000) ? (min * 100000) : min;
            max = (max > 100000) ? (max * 100000) : max;
        }
        setFormData({ ...formData, minPrice: min, maxPrice: max })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        Object.entries(formData).forEach(([key, value]) => {
            urlParams.set(key, value);
        });
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`);
    }
    const showMoreClick = async () => {
        const startIndex = listings.lrngth
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/listings/get?${searchQuery}`);
        const data = await res.json()
        if (data.length < 9)
            setShowMore(false);
        setListings([...listings, ...data]);
    }
    return (
        <div className="flex flex-col bg-slate-100 md:flex-row pt-16">
            <div className="p-7 border-b-2 mt-7 md:border-r-2 bg-slate-100 md:fixed md:left-0 md:z-10">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center my-4 gap-3 ">
                        <label htmlFor="searchTerm" className="whitespace-nowrap">Search Term</label>
                        <input type="search" onChange={handleChange} id="searchTerm" value={formData.searchTerm} placeholder="search.." className="border rounded-lg p-3 w-full" />
                    </div>
                    <div className="flex gap-3 my-4 flex-col md:flex-row items-center">
                        <label htmlFor="furnished">Furniture: </label>
                        <select onChange={handleChange} className="border border-gray-500 rounded-lg max-w-80 mr-4 p-1" id="furnished" value={formData.furnished}>
                            <option value="all">Select</option>
                            <option value="Unfurnished">Unfurnished</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                            <option value="Furnished">Furnished</option>
                        </select>
                        <label>Parking Space: </label>
                        <input onChange={handleChange} type="checkbox" className="border w-4 h-4" id="parking" checked={formData.parking} />
                    </div>
                    <div className="flex gap-3 my-4 flex-col md:flex-row items-center">
                        <div>
                            <label htmlFor="type">Type: </label>
                            <select onChange={handleChange} className="border border-gray-500 mr-4 rounded-lg max-w-80 ml-7 w-36 p-1" id="type" value={formData.type}>
                                <option value="all">Select</option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                        <div>
                            <label>No Brokerage: </label>
                            <input onChange={handleChange} type="checkbox" className="border w-4 h-4" id="brokerage" checked={formData.brokerage} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-3 ">
                        <div>
                            <label htmlFor="beds" className="whitespace-nowrap mr-2">Bedroom:</label>
                            <input type="number" onChange={handleChange} id="beds" placeholder="beds" className="border border-black p-1 rounded-lg" min="0" max="10" value={formData.beds} />
                        </div>
                        <div className="flex gap-3 flex-row items-center">
                            <label htmlFor="listedFor">Requirement: </label>
                            <span className="flex items-center">
                                <input onChange={handleChange} type="radio" className="border" id="rent" value="Rent" name="listed" required checked={formData.listedFor == 'Rent'} />
                                <label className="ml-2">Rent</label>
                            </span>
                            <span className="flex items-center">
                                <input onChange={handleChange} type="radio" className="border" id="sale" name="listed" value="Sale" required checked={formData.listedFor == 'Sale'} />
                                <label className="ml-2">Sale</label>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-7 my-4 w-full">
                        <label htmlFor="price">Price Range: </label>
                        <RangeSlider type={type} onPriceChange={handlePriceChange} />
                    </div>
                    <div className="flex gap-3 my-5 flex-row items-center">
                        <div>
                            <label htmlFor="city" className="mr-3 whitespace-nowrap">City:</label>
                            <input type="text" onChange={handleChange} id="city" placeholder="city" className="border p-1 w-28 rounded-lg" value={formData.city||''} />
                        </div>
                        <label htmlFor="type">Sort by: </label>
                        <select onChange={handleChange} className="border border-gray-500 mr-4 rounded-lg max-w-80 p-1" id="sort_order" value={`${formData.sort}_${formData.order}`}>
                            <option value="price_desc">Price High to Low</option>
                            <option value="price_asc">Price Low to High</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className="w-full uppercase rounded-lg bg-emerald-600 hover:bg-emerald-500 p-2 mt-3 text-white">Search</button>
                </form>
            </div >
            <div className="mt-3 md:ml-[36vw] md:overflow-y-auto md:z-0">
                <h1 className="text-3xl font-semibold border-b p-3 text-slate-700">Search results</h1>
                <div className="p-7 flex flex-wrap gap-5">
                    {listings && listings.length === 0 && (
                        <p className="text-xl text-red-500 text-center">No Properties Found</p>
                    )}
                    {listings && listings.length > 0 && listings.map((listing) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))}
                    {showMore && (
                        <button onClick={showMoreClick} className="text-green-700 hover:underline p-7 text-center">Show More..</button>
                    )}
                </div>
            </div>
        </div >
    )
}