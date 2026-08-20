/*
 * This page allows administrators to edit an existing product.
 */

import { useParams } from "react-router-dom";

function AdminEditProduct() {

    const { id } = useParams();

    return (

        <div className="admin-product-page">

            <div className="admin-product-container">

                <h1>
                    Edit Product
                </h1>

                <p>
                    Editing product ID: {id}
                </p>

            </div>

        </div>

    );
}

export default AdminEditProduct;