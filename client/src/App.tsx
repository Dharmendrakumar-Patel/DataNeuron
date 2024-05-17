import { useEffect, useState } from 'react';
import Split from 'react-split';
import Navbar from './component/NavBar';
import { DataTable } from './component/ProductTable';
import './App.css';
import ProductForm, { IProduct } from './component/ProductForm';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, SquarePen, Trash2 } from 'lucide-react';
import { deleteProduct, getAllProduct } from './api/product';
import { toast } from 'sonner';

export interface ICount {
  _id: string;
  create: number;
  update: number;
  delete: number;
  __v?: number;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<IProduct | null>(null);
  const [data, setData] = useState<IProduct[]>([]);
  const [count, setCount] = useState<ICount | null>(null)

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // This will run whenever productData or data changes
    console.log("productData or data changed", productData, data);
  }, [productData, data]);

  const getData = async () => {
    setLoading(true);
    const resp = await getAllProduct();
    if (resp) {
      setData(resp.data);
      setCount(resp.count)
    }
    setLoading(false);
  };

  const deleteProductById = async (id: string) => {
    const resp = await deleteProduct(id);
    if (resp?.message) {
      getData();
      toast.success(resp?.message);
    } else {
      toast.error('Server Error');
    }
  };

  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <p className="ml-4 max-w-28 line-clamp-1 capitalize" title={row.original.name}>
          {row.original.name}
        </p>
      ),
    },
    {
      accessorKey: 'description',
      header: () => <div>Description</div>,
      cell: ({ row }) => (
        <p className="max-w-[55rem] line-clamp-2 capitalize" title={row.original.description}>
          {row.original.description}
        </p>
      ),
    },
    {
      accessorKey: 'image',
      header: () => <div>Image</div>,
      cell: ({ row }) => (
        <img
          src={
            row.original.image !== ''
              ? `${import.meta.env.VITE_DB_URL + "/" + row.original.image}`
              : `${row.original.image}`
          }
          className="h-10"
          alt={row.original.name}
        />
      ),
    },
    {
      accessorKey: 'quantity',
      header: () => <div>Quantity</div>,
      cell: ({ row }) => (
        <p className="max-w-[55rem] line-clamp-2 capitalize">
          {row.original.quantity}
        </p>
      ),
    },
    {
      accessorKey: 'published',
      header: () => <div>Published</div>,
      cell: ({ row }) => (
        <p className="max-w-[55rem] line-clamp-2 capitalize">
          {row.original.published ? 'Published' : 'Not Published'}
        </p>
      ),
    },
    {
      id: 'actions',
      header: () => <div>Actions</div>,
      cell: ({ row }) => (
        <div className="flex">
          <span
            className="cursor-pointer mr-2"
            onClick={() => setProductData(row.original)}
          >
            <SquarePen width={20} height={20} />
          </span>
          <span
            className="cursor-pointer"
            onClick={() => deleteProductById(row.original._id)}
          >
            <Trash2 width={20} height={20} />
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      {!loading && (
        <Split
          className="w-screen h-body"
          sizes={[50, 50]}
          minSize={100}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="vertical"
        >
          <div>
            <Split className="split h-full w-screen">
              <div className="p-3 h-full overflow-scroll">
                <div className='flex justify-between items-center'>
                  <h1 className="text-2xl font-semibold mb-1">Product Add Form</h1>
                  {
                    count && (
                      <p>Create: {count.create}</p>
                    )
                  }
                </div>
                <ProductForm action="add" fetchData={getData} close={() => setProductData(null)} />
              </div>
              <div className="p-3 h-full overflow-scroll">
                <div className='flex justify-between items-center'>
                  <h1 className="text-2xl font-semibold mb-1">Product Update Form</h1>
                  {
                    count && (
                      <p>Update: {count.update}</p>
                    )
                  }
                </div>
                
                {productData !== null ? (
                  <ProductForm data={productData} action="edit" fetchData={getData} close={() => setProductData(null)} />
                ) : (
                  <div className="w-full h-full flex justify-center items-center p-5">
                    <img
                      src="https://res.cloudinary.com/dvgp7oeov/image/upload/v1715915459/Images/form.png"
                      className="h-[75%] max-h-40"
                      alt="DataNeuron Logo"
                    />
                  </div>
                )}
              </div>
            </Split>
          </div>
          <div className="p-3 h-full overflow-scroll">
            <div className='flex justify-between items-center'>
              <h1 className="text-2xl font-semibold mb-1">Product Table</h1> 
              {
                count && (
                  <p>Delete: {count.delete}</p>
                )
              }
            </div>
            {data.length > 0 && <DataTable columns={columns} data={data} />}
          </div>
        </Split>
      )}
    </>
  );
}

export default App;
