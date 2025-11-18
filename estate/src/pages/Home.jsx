import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from 'swiper/modules'
import ListingItem from '../components/ListingItem';

export default function Home() {
    document.title = "Home Estate | Buy - Rent - Sell - Houses - Apartments"
    const [cityProperties, setCityProperties] = useState([])
    const [rentProperties, setRentProperties] = useState([])
    const [saleProperties, setSaleProperties] = useState([])
    SwiperCore.use([Navigation])
    useEffect(() => {
        const fetchCityProperties = async () => {
            try {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        const { latitude, longitude } = position.coords;
                        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                        fetch(url).then(res => res.json()).then(async (data) => {
                            let city = data.address.state_district.split(' ')[0] || 'None';
                            const response = await fetch(`/api/listing/get?city=${city}&limit=4`);
                            const propertyData = await response.json();
                            setCityProperties(propertyData);
                        })
                        fetchRentProperties()
                    }, function (error) {
                        if (error.code == error.PERMISSION_DENIED)
                            alert("Location access denied")
                    });
                }
                else {
                    const response = await fetch(`/api/listing/get?brokerage=true&limit=4`);
                    const propertyData = await response.json();
                    setCityProperties(propertyData);
                }

            }
            catch (error) {
                console.log(error);
            }
        }

        const fetchRentProperties = async () => {
            try {
                const res = await fetch(`/api/listing/get?listedFor=Rent&limit=4`);
                const data = await res.json();
                setRentProperties(data);
                fetchSaleProperties();
            } catch (error) {
                console.log(error)
            }
        }

        const fetchSaleProperties = async () => {
            try {
                const res = await fetch(`/api/listing/get?listedFor=Sale&limit=4`);
                const data = await res.json();
                setSaleProperties(data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchCityProperties();
    }, [])
    return (
        <div className='pt-10'>
            <div className=' flex flex-col gap-6 p-16 px-3 max-w-6xl mx-auto'>
                <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Ek Ghar Dhundhe?</h1>
                <h1 className='text-slate-700 font-bold text-2xl lg:text-4xl'>Find your next <span className='text-slate-500'>perfect</span>
                    <br />place with ease</h1>
                <div className='text-gray-400 text-xs sm:text-sm'>
                    Home Estate is the best place to find your next perfect place to live.
                    <br />
                    We have a wide range of properties for you to choose from.
                </div>
                <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
                    Search property...
                </Link>
            </div>
            <Swiper navigation loop>
                {cityProperties && cityProperties.length > 0 && cityProperties.map((listing) => (
                    <SwiperSlide key={listing._id}>
                        <img src={listing.images[0].file} className='w-full h-[75vh]' />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className='max-w-6xl mx-auto p-3 gap-8 flex flex-col my-7 '>
                {
                    cityProperties && cityProperties.length > 0 && (
                        <div>
                            <div className='mb-5'>
                                <h2 className='text-2xl text-slate-600 font-semibold'>Properties for you</h2>
                            </div>
                            <div className='flex flex-wrap gap-8 mx-auto'>
                                {
                                    cityProperties.map((listing) => (
                                        <ListingItem listing={listing} key={listing._id} />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                {
                    rentProperties && rentProperties.length > 0 && (
                        <div>
                            <div className='mb-5'>
                                <h2 className='text-2xl text-slate-600 font-semibold'>Properties for Rent</h2>
                            </div>
                            <div className='flex flex-wrap gap-8 mx-auto'>
                                {
                                    rentProperties.map((listing) => (
                                        <ListingItem listing={listing} key={listing._id} />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                {
                    saleProperties && saleProperties.length > 0 && (
                        <div>
                            <div className='mb-5'>
                                <h2 className='text-2xl text-slate-600 font-semibold'>Properties for Sale</h2>
                            </div>
                            <div className='flex flex-wrap gap-8'>
                                {
                                    saleProperties.map((listing) => (
                                        <ListingItem listing={listing} key={listing._id} />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
    );
}