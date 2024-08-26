import React, { useState, useEffect } from "react";
import axios from "axios"; 

type ModalProps = {
  showModal: boolean;
  closeModal: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  product: {
    id: string;
    name: string;
    category: string;
    price: string;
    sold: string;
    profit: string;
    image?: File;
  };
};

const Modal = ({ showModal, closeModal, handleFileChange, product }: ModalProps) => {
  const [localState, setLocalState] = useState({
    name: "",
    category: "",
    price: "",
    sold: "",
    profit: "",
  });

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (showModal) {
      setLocalState({
        name: product?.name || "",
        category: product?.category || "",
        price: product?.price || "",
        sold: product?.sold || "",
        profit: product?.profit || "",
      });
      setFile(product?.image || null);
    }
  }, [showModal, product]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalState(prevState => ({ ...prevState, [name]: value }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleFileChange(e);
    }
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    const updateProduct = async () => {
      try {
        const formData = new FormData();
        formData.append('name', localState.name);
        formData.append('category', localState.category);
        formData.append('price', localState.price);
        formData.append('sold', localState.sold);
        formData.append('profit', localState.profit);

        if (file) {
          formData.append('image', file);
        }

        const response = await axios.put(`/api/products/${product.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        
        console.log('Product updated successfully:', response.data);
        closeModal();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    };

    updateProduct();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center mt-20 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg dark:bg-boxdark w-full  max-w-md"> 
        <div className="flex justify-between border-b border-stroke px-4 py-2 dark:border-strokedark">
          <button
            onClick={closeModal}
            className="text-black dark:text-white hover:text-primary"
            aria-label="Close Modal"
          >
            ×
          </button>
        </div>
        <div className="p-4"> 
          <form onSubmit={onFormSubmit}>
            <div className="flex flex-col gap-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white"> 
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={localState.name}
                  onChange={onChange}
                  placeholder="Product Name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white"> 
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={localState.category}
                  onChange={onChange}
                  placeholder="Category"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white"> 
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={localState.price}
                  onChange={onChange}
                  placeholder="Price"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white"> 
                  Sold
                </label>
                <input
                  type="number"
                  name="sold"
                  value={localState.sold}
                  onChange={onChange}
                  placeholder="Sold"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Profit
                </label>
                <input
                  type="number"
                  name="profit"
                  value={localState.profit}
                  onChange={onChange}
                  placeholder="Profit"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mx-2 mb-2 mt-2 block text-sm font-medium text-black dark:text-white"> {/* Reduced margin-bottom */}
                  Select File
                </label>
                <input
                  type="file"
                  onChange={onFileChange}
                  className="w-full rounded-md border border-stroke p-2 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
