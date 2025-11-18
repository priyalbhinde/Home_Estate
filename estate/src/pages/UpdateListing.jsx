import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function UpdateListing() {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user)
    const [error, setError] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);
    const params = useParams();
    const [formData, setFormData] = useState({
        images: [],
        title: '',
        description: '',
        address: '',
        city: '',
        state: '',
        price: 0,
        brokerage: 0,
        bedrooms: 1,
        bathrooms: 1,
        type: 'Apartment',
        listedFor: 'Rent',
        furnished: 'Unfurnished',
        parking: false,
    });
    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`)
            const data = await res.json();
            if (data.success === false) {
                console.log(data);
            }
            const imagesData = await Promise.all(
                data.images.map(async (image) => {
                    try {
                        const response = await fetch(`/${image.file}`, {
                            responseType: 'blob'
                        });
                        const blob = await response.blob()
                        return new File([blob], image.filename, { type: image.contentType });
                    }
                    catch (error) {
                        console.log(error);
                        return null;
                    }
                })
            )
            setFormData(data);
            setUploadedImages(imagesData);
        }
        fetchListing();
    }, [])
    const handleDeleteImage = (index) => {
        setUploadedImages(uploadedImages.filter((image, i) => i !== index));
    }
    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                listedFor: e.target.value
            });
        }
        if (e.target.id === 'Apartment' || e.target.id === 'House' || e.target.id === 'Commercial') {
            setFormData({
                ...formData,
                type: e.target.id
            });
        }
        if (e.target.id === 'parking') {
            setFormData({
                ...formData,
                parking: e.target.checked
            })
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea' || e.target.id === 'furnished') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
        if (e.target.type === 'file') {
            setUploadedImages([...uploadedImages, ...e.target.files]);
        }
        return;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'images') {
                    for (let i = 0; i < uploadedImages.length; i++) {
                        formDataToSend.append('images', uploadedImages[i]);
                    }
                } else {
                    formDataToSend.append(key, value);
                }
            });
            formDataToSend.append('user', currentUser._id);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                body: formDataToSend
            })
            const data = await res.json();
            if (data.success === false) {
                alert(data.message);
                return;
            }
            alert(data.message);

        }
        catch (error) {
            alert(error.message);
        }
    }
    return (
        <main className="max-w-4xl mx-auto p-3 pt-16">
            <h1 className="text-3xl font-semibold text-center my-7">Update Property</h1>
            <form className="flex flex-col sm:flex-row gap-8" encType="multipart/form-data">
                <div className="flex flex-col gap-4 flex-1">
                    <input onChange={handleChange} type="text" placeholder="Title" className="border p-3 rounded-lg" id="title" maxLength="60" minLength="10" required value={formData.title} />
                    <textarea onChange={handleChange} type="text" placeholder="Description" className="border p-3 rounded-lg resize-none" id="description" required rows="5" value={formData.description} />
                    <input onChange={handleChange} type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required value={formData.address} />
                    <span className="flex gap-4">
                        <input onChange={handleChange} type="text" placeholder="City" className="border w-full p-3 rounded-lg" id="city" required value={formData.city} />
                        <input onChange={handleChange} type="text" placeholder="State" className="border w-full p-3 rounded-lg" id="state" required value={formData.state} />
                    </span>
                    <span className="flex gap-4">
                        <input onChange={handleChange} type="number" placeholder="Price" className="border w-full p-3 rounded-lg" id="price" required min="100" max="10000000000" value={formData.price} />
                        <input onChange={handleChange} type="number" placeholder="Brokerage" className="border w-full p-3 rounded-lg" id="brokerage" min="100" max="10000000000" required value={formData.brokerage} />
                    </span>
                    <span className="flex gap-4 items-center">
                        <input onChange={handleChange} type="number" placeholder="Bathrooms" className="border w-full p-3 rounded-lg" id="bathrooms" min="1" max="10" required value={formData.bathrooms} />
                        <p>Baths</p>
                        <input onChange={handleChange} type="number" placeholder="Bedrooms" className="border w-full p-3 rounded-lg" id="bedrooms" min="1" max="15" required value={formData.bedrooms} />
                        <p>Beds</p>
                    </span>
                    <div className="flex gap-6 flex-row items-center">
                        <label htmlFor="furnished">Furniture: </label>
                        <select onChange={handleChange} className="border border-gray-500 rounded-lg max-w-80" id="furnished" value={formData.furnished}>
                            <option value="Unfurnished">Unfurnished</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                            <option value="Furnished">Furnished</option>
                        </select>
                        <label>Parking Space: </label>
                        <input onChange={handleChange} type="checkbox" className="border w-4 h-4" id="parking" required checked={formData.parking} />
                    </div>
                    <div className="flex gap-2 flex-row items-center">
                        <label htmlFor="type">Property Type: </label>
                        <span className="flex items-center gap-2">
                            <input onChange={handleChange} type="radio" className="border" id="Apartment" value="Apartment" name="type" required checked={formData.type === 'Apartment'} />
                            <label>Apartment</label>
                        </span>
                        <span className="flex items-center gap-2">
                            <input onChange={handleChange} type="radio" className="border" id="House" name="type" value="House" required checked={formData.type === 'House'} />
                            <label>House</label>
                        </span>
                        <span className="flex items-center gap-2">
                            <input onChange={handleChange} type="radio" className="border" id="Commercial" name="type" value="Commercial" required checked={formData.type === 'Commercial'} />
                            <label>Commercial</label>
                        </span>
                    </div>
                    <div className="flex gap-4 flex-row items-center">
                        <label htmlFor="listedFor">Property Listed For: </label>
                        <span className="flex items-center">
                            <input onChange={handleChange} type="radio" className="border" id="rent" value="Rent" name="listed" required checked={formData.listedFor === 'Rent'} />
                            <label className="ml-2">Rent</label>
                        </span>
                        <span className="flex items-center">
                            <input onChange={handleChange} type="radio" className="border" id="sale" name="listed" value="Sale" required checked={formData.listedFor === 'Sale'} />
                            <label className="ml-2">Sale</label>
                        </span>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images:
                        <span className="font-normal text-gray-600 ml-2">The first image will be cover (max 6)</span>
                    </p>

                    <div className="flex gap-4 ">
                        <input onChange={handleChange} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept='images/*' multiple />
                    </div>
                    <p className="text-red-600">{error}</p>
                    {
                        uploadedImages.map((file, index) => (
                            <div key={index} className="flex justify-between p-3 bg-slate-100 rounded-lg border items-center">
                                <img src={URL.createObjectURL(file)} alt="Image" className="w-32 h-20 object-cover rounded-lg" />
                                <p>{file.name}</p>
                                <button type="button" onClick={() => handleDeleteImage(index)} className="p-3 text-red-700 rounded-lg hover:text-red-400">Delete</button>
                            </div>
                        ))
                    }
                    <button onClick={handleSubmit} className="p-3 bg-green-600 rounded-lg text-white uppercase hover:opacity-90">Update Listing</button>
                </div>
            </form>
        </main>
    )
}