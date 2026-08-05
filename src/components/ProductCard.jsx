/*
 * Reusable product card component.
 *
 * Displays product image, name, price,
 * description, and stock information.
 */

function ProductCard({ product }) {

    return (

        <div className="product-card">

            <div className="product-image-container">

                {product.imageUrl ? (

                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                    />

                ) : (

                    <div className="no-image">
                        No Image
                    </div>

                )}

            </div>


            <div className="product-card-content">

                <h3>
                    {product.name}
                </h3>


                <p className="product-description">

                    {product.description}

                </p>


                <p className="product-price">

                    ${product.price}

                </p>


                <p className="product-stock">

                    {product.stockQuantity > 0

                        ? `${product.stockQuantity} in stock`

                        : "Out of stock"

                    }

                </p>

            </div>

        </div>

    );

}

export default ProductCard;