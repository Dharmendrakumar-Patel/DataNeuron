import { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'sonner';
import { createProduct, updateProduct } from '../api/product';

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    image: string | File;
    quantity: number;
    published: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

interface ProductFormProps {
    data?: IProduct;
    action?: string;
    fetchData: () => void;
    close: () => void
}

function ProductForm({ data, action = 'edit', fetchData, close }: ProductFormProps) {
    const initialState: IProduct = {
        _id: data?._id || '',
        name: data?.name || '',
        description: data?.description || '',
        image: data?.image || '',
        quantity: data?.quantity || 0,
        published: data?.published || false,
    };

    const [formData, setFormData] = useState<IProduct>(initialState);
    const [imgPreview, setImagePreview] = useState<string | null>(
        data?.image ? `${import.meta.env.VITE_DB_URL}/${data.image}` : null
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleToggle = () => {
        setFormData((prevState) => ({
            ...prevState,
            published: !prevState.published,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const productData = new FormData(e.currentTarget);
        productData.append("published", formData.published ? "true" : "false")

        const resp = action !== "edit" ? await createProduct(productData) : await updateProduct(formData._id, productData);

        if (resp?.message) {
            setFormData(initialState);
            setImagePreview("");
            fetchData();
            close()
            toast.success(resp.message);
        } else {
            toast.error(resp?.error);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev: IProduct) => ({
                ...prev,
                image: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form method="post" onSubmit={handleSubmit} className='p-5'>
            <div className='grid lg:grid-cols-2 gap-4'>
                <div className="mb-5 col-span-12">
                    <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Image:
                    </label>
                    <div className='flex flex-col justify-center items-center mt-2'>
                        {imgPreview && <img src={imgPreview} alt="Preview image" height={100} width={100} className='mb-4' />}
                        <input
                            id="image"
                            name="image"
                            type="file"
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className="mb-5 col-span-12 md:col-span-6">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Name:
                    </label>
                    <input
                        type='text'
                        id="name"
                        name="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-5 col-span-12 md:col-span-6">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className='block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        placeholder="Type your description here."
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-5 col-span-12 md:col-span-6">
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Quantity:
                    </label>
                    <input
                        type='number'
                        id="quantity"
                        name="quantity"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Type your quantity here."
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-5 col-span-12 md:col-span-6">
                    <label htmlFor='published' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Published:
                    </label>
                    <input
                        id='published'
                        type="checkbox"
                        checked={formData.published}
                        className="sr-only peer"
                    />
                    <div
                        onClick={handleToggle}
                        className="cursor-pointer relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                </div>
            </div>
            <div className='w-full mt-2 flex justify-end'>
                <button type='submit' className="py-2.5 px-5 me-1 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    {action !== "edit" ? "Submit" : "Update"}
                </button>
            </div>
        </form>
    );
}

export default ProductForm;
