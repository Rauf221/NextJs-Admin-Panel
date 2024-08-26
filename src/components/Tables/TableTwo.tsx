'use client';
import React, { useState } from 'react';
import Image from "next/image";
import { Product } from "@/types/product";
import axios from "axios";
import useSWR from "swr";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Modal from '../Modal/modal'; 
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const token = getCookie('token', ctx);

    if (!token) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Table = () => {
  const router = useRouter();
  const { data: products, error, mutate } = useSWR<Product[]>(`${process.env.NEXT_PUBLIC_API_URL}/Product`, fetcher);

  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null); // State to manage the current product being edited

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Product/${id}`);
      mutate(); // Revalidate the data after deleting
    } catch (err) {
      console.error("Failed to delete the product", err);
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Product/${currentProduct.id}`, currentProduct);
        mutate(); 
        closeModal();
      } catch (err) {
        console.error("Failed to edit the product", err);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentProduct) {
      setCurrentProduct({
        ...(currentProduct as Product), 
        id: currentProduct.id || '',
        [e.target.name]: e.target.value,
      } as Product);
    } else {
      setCurrentProduct({
        id: '',
        [e.target.name]: e.target.value,
        image: '',
        name: '',
        category: '',
        price: 0,
        sold: 0,
        profit: 0,
      }); 
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentProduct && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
    
      setCurrentProduct({
        ...currentProduct,
        image: URL.createObjectURL(file), 
      });
    }
  };

  if (error) return <p>Failed to load products</p>;
  if (!products) return <p>Loading...</p>;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Top Products
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke px-3 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Product Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Price</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Sold</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Profit</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {products.map((product) => (
        <div
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={product.id}
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                <Image
                  src={product.image}
                  width={60}
                  height={50}
                  alt="Product"
                />
              </div>
              <p className="text-sm text-black dark:text-white">
                {product.name}
              </p>
            </div>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {product.category}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              ${product.price}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{product.sold}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-meta-3">${product.profit}</p>
          </div>
          <div className="flex items-center space-x-3.5">
            <button className="hover:text-primary" onClick={() => handleEditClick(product)}>
              <FaRegEdit /> 
            </button>
            <button onClick={() => deleteProduct(product.id)} className="hover:text-primary">
           
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
             
                <path
                  d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.70664 16.2563 5.26602 15.8156 5.23789 15.25L4.79727 6.16815H13.1754L12.7348 15.25C12.7066 15.7875 12.266 16.2563 11.7285 16.2563Z"
                  fill=""
                />
                <path
                  d="M8.05664 7.18127C7.80352 7.18127 7.58789 7.3969 7.58789 7.65V14.1906C7.58789 14.4438 7.80352 14.6594 8.05664 14.6594C8.30977 14.6594 8.52539 14.4438 8.52539 14.1906V7.65C8.52539 7.3969 8.30977 7.18127 8.05664 7.18127Z"
                  fill=""
                />
                <path
                  d="M10.916 7.18127C10.6629 7.18127 10.4473 7.3969 10.4473 7.65V14.1906C10.4473 14.4438 10.6629 14.6594 10.916 14.6594C11.1691 14.6594 11.3848 14.4438 11.3848 14.1906V7.65C11.3848 7.3969 11.1691 7.18127 10.916 7.18127Z"
                  fill=""
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

    
      {showModal && currentProduct && (
        <Modal
          showModal={showModal}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          product={currentProduct}
        />
      )}
    </div>
  );
};

export default Table;
