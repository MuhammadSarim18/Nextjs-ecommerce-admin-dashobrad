import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

const { default: Layout } = require("@/components/Layout")

export default function DeleteproductPage() {
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id=' + id).then(response => {
            setProductInfo(response.data);
        })
    }, [id]);
    function goback() {
        router.push('/products');
    }
    async function deleteProduct(){
       await axios.delete('/api/products?id=' + id);
       goback();
    }
    return (
        <Layout>
            <h1 className="text-center">Do u want to delete
                &nbsp;"{productInfo?.title}"?
            </h1>
            <div className="flex gap-2 justify-center">
                <button onClick={deleteProduct} className="btn-red">Yes</button>
                <button className="btn-default" onClick={goback}>No</button>
            </div>
        </Layout>
    )
}