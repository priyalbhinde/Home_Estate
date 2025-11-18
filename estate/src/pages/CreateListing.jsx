import { useState } from "react"
import { useSelector } from 'react-redux'

export default function CreateListing() {
    const { currentUser } = useSelector(state => state.user)
    const [error, setError] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);
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
        const files = document.getElementById('images').files;
        try {
            setError('');
            const formDataToSend = new FormData(); // Create FormData object
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'images') {
                    for (let i = 0; i < uploadedImages.length; i++) {
                        formDataToSend.append('images', uploadedImages[i]); // Append each file separately
                    }
                } else {
                    formDataToSend.append(key, value); // Append other form fields
                }
            });
            formDataToSend.append('user', currentUser._id);
            const res = await fetch('/api/listing/create', {
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
        <main className="max-w-4xl pt-16 mx-auto p-3 pt-16">
            <h1 className="text-3xl font-semibold text-center my-7">List a Property</h1>
            <form className="flex flex-col sm:flex-row gap-8" encType="multipart/form-data">
                <div className="flex flex-col gap-4 flex-1">
                    <input onChange={handleChange} type="text" placeholder="Title" className="border p-3 rounded-lg" id="title" maxLength="60" minLength="10" required value={formData.title} />
                    <textarea onChange={handleChange} type="text" placeholder="Description" className="border p-3 rounded-lg resize-none" id="description" required rows="5" />
                    <input onChange={handleChange} type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required />
                    <span className="flex gap-4">
                        <input onChange={handleChange} type="text" placeholder="City" className="border w-full p-3 rounded-lg" id="city" required />
                        <input onChange={handleChange} type="text" placeholder="State" className="border w-full p-3 rounded-lg" id="state" required />
                    </span>
                    <span className="flex gap-4">
                        <input onChange={handleChange} type="number" placeholder="Price" className="border w-full p-3 rounded-lg" id="price" required min="100" max="10000000000" />
                        <input onChange={handleChange} type="number" placeholder="Brokerage" className="border w-full p-3 rounded-lg" id="brokerage" min="100" max="10000000000" required />
                    </span>
                    <span className="flex gap-4 items-center">
                        <input onChange={handleChange} type="number" placeholder="Bathrooms" className="border w-full p-3 rounded-lg" id="bathrooms" min="0" max="10" defaultValue="1" required />
                        <p>Baths</p>
                        <input onChange={handleChange} type="number" placeholder="Bedrooms" className="border w-full p-3 rounded-lg" id="bedrooms" min="0" max="15" defaultValue="1" disabled={formData.type==='Commercial'} required />
                        <p>Beds</p>
                    </span>
                    <div className="flex gap-6 flex-row items-center">
                        <label htmlFor="furnished">Furniture: </label>
                        <select onChange={handleChange} className="border border-gray-500 rounded-lg max-w-80" id="furnished">
                            <option value="Unfurnished">Unfurnished</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                            <option value="Furnished">Furnished</option>
                        </select>
                        <label>Parking Space: </label>
                        <input onChange={handleChange} type="checkbox" className="border w-4 h-4" id="parking" required />
                    </div>
                    <div className="flex gap-2 flex-row items-center">
                        <label htmlFor="type">Property Type: </label>
                        <span className="flex items-center gap-2">
                            <input onChange={handleChange} type="radio" className="border" id="Apartment" value="Apartment" name="type" required />
                            <label>Apartment</label>
                        </span>
                        <span className="flex items-center gap-2">
                            <input onChange={handleChange} type="radio" className="border" id="House" name="type" value="House" required />
                            <label>House</label>
                        </span>
                        <span className="flex items-center gap-2">
                            <input onChange={handleChange} type="radio" className="border" id="Commercial" name="type" value="Commercial" required />
                            <label>Commercial</label>
                        </span>
                    </div>
                    <div className="flex gap-4 flex-row items-center">
                        <label htmlFor="listedFor">Property Listed For: </label>
                        <span className="flex items-center">
                            <input onChange={handleChange} type="radio" className="border" id="rent" value="Rent" name="listed" required />
                            <label className="ml-2">Rent</label>
                        </span>
                        <span className="flex items-center">
                            <input onChange={handleChange} type="radio" className="border" id="sale" name="listed" value="Sale" required />
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
                    <button onClick={handleSubmit} className="p-3 bg-green-600 rounded-lg text-white uppercase hover:opacity-90">Create Listing</button>
                </div>
            </form>
        </main>
    )
}